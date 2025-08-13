import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Environment } from '../const/consts';
import {
  UserProfile,
  UserSessionSummary,
  UpdateUserRequest,
  UpdateUserModelRequest,
} from './users.interfaces';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

// 簡易実装: 実データストア未連携のため、インメモリで擬似データを扱う
@Injectable()
export class UsersService {
  private readonly ddbDoc: DynamoDBDocumentClient;
  private readonly userTable: string;
  private readonly chatTable: string;
  private readonly secrets: SecretsManagerClient;

  constructor() {
    const ddb = new DynamoDBClient({ region: Environment.AWS_REGION });
    this.ddbDoc = DynamoDBDocumentClient.from(ddb, {
      marshallOptions: { removeUndefinedValues: true },
    });
    // Expect table names from env. Fallback to Terraform naming convention if present.
    this.userTable = Environment.TABLE_NAME_USER;
    this.chatTable = Environment.TABLE_NAME_CHAT_HISTORY;
    this.secrets = new SecretsManagerClient({ region: Environment.AWS_REGION });
  }

  async getUser(id: string): Promise<UserProfile> {
    const res = await this.ddbDoc.send(
      new GetCommand({
        TableName: this.userTable,
        Key: { user_id: id },
      }),
    );
    const item = res.Item as any;
    if (!item) throw new NotFoundException('User not found');
    return {
      id: item.user_id,
      email: item.email,
      name: item.name,
      avatarUrl: item.avatarUrl,
      modelId: item.modelId,
      // no per-user key now
    };
  }

  // For now, still keep a simple in-memory update stub until write permissions and schema are defined
  private users = new Map<string, UserProfile>();
  updateUser(id: string, dto: UpdateUserRequest): UserProfile {
    const current = this.users.get(id) || { id };
    const next = { ...current, ...dto };
    this.users.set(id, next);
    return next;
  }

  async updateSelectedModel(req: UpdateUserModelRequest) {
    if (!req?.userId || !req?.modelId) {
      throw new BadRequestException('userId and modelId are required');
    }
    // Persist modelId only (API keys are global now)
    const updateExpressions: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};
    updateExpressions.push('#m = :m');
    names['#m'] = 'modelId';
    values[':m'] = req.modelId;
    // No per-user secret creation
    const UpdateExpression = 'SET ' + updateExpressions.join(', ');
    await this.ddbDoc.send(
      new UpdateCommand({
        TableName: this.userTable,
        Key: { user_id: req.userId },
        UpdateExpression,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      }),
    );
    return { userId: req.userId, modelId: req.modelId };
  }

  deleteUser(id: string): { message: string } {
    const existed = this.users.delete(id);
    if (!existed) throw new NotFoundException('User not found');
    return { message: 'User deleted' };
  }

  async listSessions(id: string): Promise<UserSessionSummary[]> {
    // conversation_id is the partition key in chat_history; timestamp is sort key.
    const res = await this.ddbDoc.send(
      new QueryCommand({
        TableName: this.chatTable,
        KeyConditionExpression: 'conversation_id = :cid',
        ExpressionAttributeValues: { ':cid': id },
        ProjectionExpression: 'conversation_id, timestamp',
        ScanIndexForward: false,
        Limit: 50,
      }),
    );
    const items = res.Items || [];
    return items.map((it: any) => ({
      id: it.conversation_id,
      startedAt: String(it.timestamp),
    }));
  }
}
