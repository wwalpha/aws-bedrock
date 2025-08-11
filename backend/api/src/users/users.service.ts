import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

// 簡易実装: 実データストア未連携のため、インメモリで擬似データを扱う
export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  private readonly ddbDoc: DynamoDBDocumentClient;
  private readonly userTable: string;
  private readonly chatTable: string;

  constructor() {
    const region =
      process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
    const ddb = new DynamoDBClient({ region });
    this.ddbDoc = DynamoDBDocumentClient.from(ddb, {
      marshallOptions: { removeUndefinedValues: true },
    });
    // Expect table names from env. Fallback to Terraform naming convention if present.
    this.userTable =
      process.env.USER_TABLE_NAME ||
      `${process.env.PROJECT_NAME || 'app'}_user`;
    this.chatTable =
      process.env.CHAT_HISTORY_TABLE_NAME ||
      `${process.env.PROJECT_NAME || 'app'}_chat_history`;
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
  updateUser(id: string, dto: Partial<UserProfile>): UserProfile {
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

  async listSessions(id: string) {
    // session_id is the partition key, timestamp is sort key in chat_history table.
    const res = await this.ddbDoc.send(
      new QueryCommand({
        TableName: this.chatTable,
        KeyConditionExpression: 'session_id = :sid',
        ExpressionAttributeValues: { ':sid': id },
        ProjectionExpression: 'session_id, timestamp',
        ScanIndexForward: false,
        Limit: 50,
      }),
    );
    const items = res.Items || [];
    return items.map((it: any) => ({
      id: it.session_id,
      startedAt: String(it.timestamp),
    }));
  }
}
