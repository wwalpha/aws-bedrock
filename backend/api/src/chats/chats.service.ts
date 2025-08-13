import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Environment } from '../const/consts';
import {
  AddMessageRequest,
  ChatListItem,
  ChatMessageItem,
  ChatMeta,
  CreateChatRequest,
  UpdateTitleRequest,
} from './chats.interfaces';

@Injectable()
export class ChatsService {
  private readonly ddb: DynamoDBDocumentClient;
  private readonly chatTable: string;

  constructor() {
    const client = new DynamoDBClient({ region: Environment.AWS_REGION });
    this.ddb = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
    this.chatTable = Environment.TABLE_NAME_CHAT_HISTORY;
  }

  // Create a new chat (stores a metadata record with the first message timestamp)
  async createChat(body: CreateChatRequest = {}): Promise<ChatMeta> {
    const id = body.id || crypto.randomUUID();
    const now = Date.now();

    // Put metadata row
    await this.ddb.send(
      new PutCommand({
        TableName: this.chatTable,
        Item: {
          chat_id: id,
          timestamp: now,
          type: 'meta',
          title: body.title,
          createdAt: now,
          user_id: body.userId,
        },
        ConditionExpression:
          'attribute_not_exists(chat_id) AND attribute_not_exists(timestamp)',
      }),
    );

    return { id, title: body.title, createdAt: now };
  }

  // Global listing without a user-scoped index isn't supported; use listChatsByUser instead
  async listChats(_limit = 50): Promise<ChatListItem[]> {
    return [];
  }

  // List chats for a specific user using GSI (user_id, timestamp)
  async listChatsByUser(userId: string, limit = 50): Promise<ChatListItem[]> {
    const res = await this.ddb.send(
      new QueryCommand({
        TableName: this.chatTable,
        IndexName: 'gsi_user_timestamp',
        KeyConditionExpression: 'user_id = :uid',
        ExpressionAttributeValues: { ':uid': userId },
        ScanIndexForward: false,
        Limit: limit,
      }),
    );
    const items = res.Items || [];
    return items
      .filter((it: any) => it.type === 'meta')
      .map((it: any) => ({
        id: it.chat_id,
        title: it.title,
        createdAt: it.createdAt || it.timestamp,
      }));
  }

  async getChat(chatId: string): Promise<ChatMeta> {
    // Fetch latest meta by querying with type='meta' and the latest timestamp
    const res = await this.ddb.send(
      new QueryCommand({
        TableName: this.chatTable,
        KeyConditionExpression: 'chat_id = :cid',
        ExpressionAttributeValues: { ':cid': chatId },
        FilterExpression: '#t = :meta',
        ExpressionAttributeNames: { '#t': 'type' },
        ScanIndexForward: false,
        Limit: 1,
      }),
    );
    const item = res.Items && res.Items[0];
    if (!item) throw new NotFoundException('Chat not found');
    return {
      id: chatId,
      title: item.title,
      createdAt: item.createdAt || item.timestamp,
    };
  }

  async deleteChat(chatId: string): Promise<{ message: string }> {
    // Delete latest meta record; full cleanup of all messages is skipped here
    const meta = await this.ddb.send(
      new QueryCommand({
        TableName: this.chatTable,
        KeyConditionExpression: 'chat_id = :cid',
        ExpressionAttributeValues: { ':cid': chatId },
        FilterExpression: '#t = :meta',
        ExpressionAttributeNames: { '#t': 'type' },
        ScanIndexForward: false,
        Limit: 1,
      }),
    );
    const item = meta.Items && meta.Items[0];
    if (!item) throw new NotFoundException('Chat not found');
    await this.ddb.send(
      new DeleteCommand({
        TableName: this.chatTable,
        Key: { chat_id: chatId, timestamp: item.timestamp },
      }),
    );
    return { message: 'Chat deleted' };
  }

  async updateTitle(
    chatId: string,
    body: UpdateTitleRequest,
  ): Promise<{ id: string; title: string }> {
    if (!body?.title) throw new BadRequestException('title is required');
    // Update latest meta record title
    const meta = await this.ddb.send(
      new QueryCommand({
        TableName: this.chatTable,
        KeyConditionExpression: 'chat_id = :cid',
        ExpressionAttributeValues: { ':cid': chatId },
        FilterExpression: '#t = :meta',
        ExpressionAttributeNames: { '#t': 'type' },
        ScanIndexForward: false,
        Limit: 1,
      }),
    );
    const item = meta.Items && meta.Items[0];
    if (!item) throw new NotFoundException('Chat not found');
    await this.ddb.send(
      new UpdateCommand({
        TableName: this.chatTable,
        Key: { chat_id: chatId, timestamp: item.timestamp },
        UpdateExpression: 'SET #title = :title',
        ExpressionAttributeNames: { '#title': 'title' },
        ExpressionAttributeValues: { ':title': body.title },
      }),
    );
    return { id: chatId, title: body.title };
  }

  async listMessages(chatId: string, limit = 100): Promise<ChatMessageItem[]> {
    const res = await this.ddb.send(
      new QueryCommand({
        TableName: this.chatTable,
        KeyConditionExpression: 'chat_id = :cid',
        ExpressionAttributeValues: { ':cid': chatId },
        ScanIndexForward: true,
        Limit: limit,
      }),
    );
    const items = res.Items || [];
    return items
      .filter((it: any) => it.type !== 'meta')
      .map((it: any) => ({
        id: `${it.chat_id}:${it.timestamp}`,
        chatId: it.chat_id,
        timestamp: it.timestamp,
        role: (it.role || 'user') as any,
        content: it.content || '',
      }));
  }

  async addMessage(
    chatId: string,
    body: AddMessageRequest,
  ): Promise<ChatMessageItem> {
    if (!body?.content) throw new BadRequestException('content is required');
    const now = Date.now();
    const item = {
      chat_id: chatId,
      timestamp: now,
      type: 'message',
      role: body.role || 'user',
      content: body.content,
      user_id: body.userId,
    };
    // Ensure chat exists by checking a meta record (best-effort)
    const check = await this.ddb.send(
      new QueryCommand({
        TableName: this.chatTable,
        KeyConditionExpression: 'chat_id = :cid',
        ExpressionAttributeValues: { ':cid': chatId },
        Limit: 1,
      }),
    );
    if (!check.Items || check.Items.length === 0) {
      throw new NotFoundException('Chat not found');
    }

    await this.ddb.send(
      new PutCommand({ TableName: this.chatTable, Item: item }),
    );

    return {
      id: `${chatId}:${now}`,
      chatId,
      timestamp: now,
      role: item.role,
      content: item.content,
    };
  }
}
