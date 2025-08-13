import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Environment } from '../const/consts';
import {
  CreateKnowledgeRequest,
  KnowledgeItem,
  KnowledgeStats,
  ListKnowledgeResponse,
  QueryKnowledgeRequest,
  UpdateKnowledgeRequest,
} from './knowledge.interfaces';

// Data model (DynamoDB):
// Table: Environment.TABLE_NAME_KNOWLEDGE
//  - PK: user_id (S)
//  - SK: knowledge_id (S) => format `kb#<id>`
// Attributes: name, description, created_at (N), updated_at (N), doc_count (N)
// GSI (optional future): For global listing or stats aggregation if needed.

// S3 bucket for documents: Environment.KNOWLEDGE_BUCKET_NAME

@Injectable()
export class KnowledgeService {
  private readonly ddbDoc: DynamoDBDocumentClient;

  constructor() {
    const ddb = new DynamoDBClient({ region: Environment.AWS_REGION });
    this.ddbDoc = DynamoDBDocumentClient.from(ddb);
  }

  async list(userId: string): Promise<ListKnowledgeResponse> {
    const tableName = Environment.TABLE_NAME_KNOWLEDGE!;
    const res = await this.ddbDoc.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'user_id = :uid',
        ExpressionAttributeValues: { ':uid': userId },
      }),
    );
    const items: KnowledgeItem[] = (res.Items || []).map((it) => ({
      id: String(it.knowledge_id),
      userId: String(it.user_id),
      name: String(it.name),
      description: it.description as string | undefined,
      createdAt: Number(it.created_at),
      updatedAt: Number(it.updated_at),
      docCount: it.doc_count ? Number(it.doc_count) : undefined,
    }));
    return { items };
  }

  async create(req: CreateKnowledgeRequest): Promise<KnowledgeItem> {
    const now = Date.now();
    const id = `kb_${now}`; // simple unique id; can swap to uuid later
    const item = {
      user_id: req.userId,
      knowledge_id: id,
      name: req.name,
      description: req.description,
      created_at: now,
      updated_at: now,
      doc_count: 0,
    };
    await this.ddbDoc.send(
      new PutCommand({
        TableName: Environment.TABLE_NAME_KNOWLEDGE!,
        Item: item,
        ConditionExpression:
          'attribute_not_exists(user_id) AND attribute_not_exists(knowledge_id)',
      }),
    );
    return {
      id,
      userId: req.userId,
      name: req.name,
      description: req.description,
      createdAt: now,
      updatedAt: now,
      docCount: 0,
    };
  }

  async update(
    userId: string,
    id: string,
    req: UpdateKnowledgeRequest,
  ): Promise<KnowledgeItem> {
    const now = Date.now();
    const updates: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = { ':now': now };
    if (req.name !== undefined) {
      updates.push('#n = :name');
      names['#n'] = 'name';
      values[':name'] = req.name;
    }
    if (req.description !== undefined) {
      updates.push('#d = :desc');
      names['#d'] = 'description';
      values[':desc'] = req.description;
    }
    updates.push('updated_at = :now');

    const res = await this.ddbDoc.send(
      new UpdateCommand({
        TableName: Environment.TABLE_NAME_KNOWLEDGE!,
        Key: { user_id: userId, knowledge_id: id },
        UpdateExpression: 'SET ' + updates.join(', '),
        ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
        ExpressionAttributeValues: values,
        ConditionExpression:
          'attribute_exists(user_id) AND attribute_exists(knowledge_id)',
        ReturnValues: 'ALL_NEW',
      }),
    );

    const it = res.Attributes!;
    return {
      id: String(it.knowledge_id),
      userId: String(it.user_id),
      name: String(it.name),
      description: it.description as string | undefined,
      createdAt: Number(it.created_at),
      updatedAt: Number(it.updated_at),
      docCount: it.doc_count ? Number(it.doc_count) : undefined,
    };
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.ddbDoc.send(
      new DeleteCommand({
        TableName: Environment.TABLE_NAME_KNOWLEDGE!,
        Key: { user_id: userId, knowledge_id: id },
        ConditionExpression:
          'attribute_exists(user_id) AND attribute_exists(knowledge_id)',
      }),
    );
  }

  async uploadDocument(req: {
    userId: string;
    knowledgeId: string;
    filename: string;
    contentType?: string;
  }): Promise<{ uploadUrl: string; key: string }> {
    // Generate a pre-signed PUT URL for the knowledge S3 bucket
    const bucket = Environment.KNOWLEDGE_BUCKET_NAME!;
    const key = `${req.userId}/${req.knowledgeId}/${Date.now()}_${req.filename}`;
    const s3 = new S3Client({ region: Environment.AWS_REGION });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: req.contentType || 'application/octet-stream',
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 }); // 15 min
    return { uploadUrl, key };
  }

  async stats(userId: string, id: string): Promise<KnowledgeStats> {
    // For now, stats are derived from the item; can be extended to maintain a separate stats entity.
    const list = await this.ddbDoc.send(
      new QueryCommand({
        TableName: Environment.TABLE_NAME_KNOWLEDGE!,
        KeyConditionExpression: 'user_id = :uid AND knowledge_id = :kid',
        ExpressionAttributeValues: { ':uid': userId, ':kid': id },
      }),
    );
    const it = (list.Items || [])[0];
    if (!it) {
      return { id, userId, docCount: 0 };
    }
    return {
      id: String(it.knowledge_id),
      userId: String(it.user_id),
      docCount: it.doc_count ? Number(it.doc_count) : 0,
      lastIngestAt: it.updated_at ? Number(it.updated_at) : undefined,
    };
  }

  async query(req: QueryKnowledgeRequest): Promise<{
    results: Array<{ text: string; score: number }>;
    model: string;
  }> {
    // Placeholder: integrate with Bedrock Retrieval or Knowledge Base API in future.
    // For now, echo a mock result.
    return {
      model: 'bedrock:knowledge-retrieval',
      results: [
        {
          text: `Noop search against KB ${req.knowledgeId} for: ${req.query}`,
          score: 0.0,
        },
      ],
    };
  }
}
