import request from 'supertest';
import server from '@src/app';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { HEADER_AUTH } from 'test/commons';
import * as Datas from 'test/datas/getChat';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('getChat', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('findChatById', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: Datas.GetChat_001_Mock,
    });

    const apiPath = '/chats/chat01';
    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(Datas.GetChat_001_Expect);
  });
});
