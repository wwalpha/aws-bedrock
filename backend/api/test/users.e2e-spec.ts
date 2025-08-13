import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

// Mock DynamoDB DocumentClient commands
const ddbDocMock = mockClient(DynamoDBDocumentClient);

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Reset mocks for isolation
    ddbDocMock.reset();
    // Mock GetCommand for user profile fetch
    ddbDocMock.on(GetCommand).resolves({
      Item: {
        user_id: 'user1',
        email: 'user1@example.test',
        name: 'User One',
        avatarUrl: 'https://example.test/a.png',
      },
    });
    // Mock QueryCommand for listing sessions (conversation_id schema)
    ddbDocMock.on(QueryCommand).resolves({
      Items: [
        { conversation_id: 'conv2', timestamp: 1733740002 },
        { conversation_id: 'conv1', timestamp: 1733740001 },
      ],
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /users/:id should return user profile (from mocked DynamoDB)', async () => {
    const res = await request(app.getHttpServer()).get('/users/user1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 'user1',
      email: 'user1@example.test',
      name: 'User One',
      avatarUrl: 'https://example.test/a.png',
    });
  });

  it('PATCH /users/:id should update in-memory profile stub', async () => {
    const res = await request(app.getHttpServer()).patch('/users/user1').send({
      name: 'Renamed User',
      avatarUrl: 'https://example.test/new.png',
    });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 'user1',
      name: 'Renamed User',
      avatarUrl: 'https://example.test/new.png',
    });
  });

  it('GET /users/:id/sessions should return session summaries (mocked)', async () => {
    const res = await request(app.getHttpServer()).get('/users/user1/sessions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('startedAt');
  });

  it('DELETE /users/:id should delete in-memory user then 404 on second delete', async () => {
    const first = await request(app.getHttpServer()).delete('/users/user1');
    expect(first.status).toBe(200);
    expect(first.body).toHaveProperty('message');

    const second = await request(app.getHttpServer()).delete('/users/user1');
    expect(second.status).toBe(404);
  });
});
