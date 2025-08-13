import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('ChatsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    ddbMock.reset();
    // createChat meta insert
    ddbMock.on(PutCommand).resolves({});
    // listChatsByUser meta items
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          conversation_id: 'conv1',
          timestamp: Date.now(),
          type: 'meta',
          title: 'First Chat',
          createdAt: Date.now(),
        },
      ],
    });
    // Update / Delete succeed silently
    ddbMock.on(UpdateCommand).resolves({});
    ddbMock.on(DeleteCommand).resolves({});

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('POST /chats should create a chat meta', async () => {
    const res = await request(app.getHttpServer())
      .post('/chats')
      .send({ title: 'New Chat', userId: 'user1' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('New Chat');
  });

  it('GET /chats/user?userId=user1 should return chats', async () => {
    const res = await request(app.getHttpServer()).get(
      '/chats/user?userId=user1',
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ title: 'First Chat' });
  });
});
