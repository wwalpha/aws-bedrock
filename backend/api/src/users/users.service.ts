import { Injectable, NotFoundException } from '@nestjs/common';
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
} from './users.interfaces';

// 簡易実装: 実データストア未連携のため、インメモリで擬似データを扱う
@Injectable()
export class UsersService {
  private readonly ddbDoc: DynamoDBDocumentClient;
  private readonly userTable: string;
  private readonly chatTable: string;

  constructor() {
    const ddb = new DynamoDBClient({ region: Environment.AWS_REGION });
    this.ddbDoc = DynamoDBDocumentClient.from(ddb, {
      marshallOptions: { removeUndefinedValues: true },
    });
    // Expect table names from env. Fallback to Terraform naming convention if present.
    this.userTable = Environment.TABLE_NAME_USER;
    this.chatTable = Environment.TABLE_NAME_CHAT_HISTORY;
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
