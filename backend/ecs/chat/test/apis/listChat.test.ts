import request from 'supertest';
import server from '@src/app';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { HEADER_AUTH } from 'test/commons';
import * as Datas from 'test/datas/listChat';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('listChat', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('getAll', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: Datas.ListChat_001_Mock,
    });

    const apiPath = '/chats';
    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(Datas.ListChat_001_Expect);
  });

  test('getNothing', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [],
    });

    const apiPath = '/chats';
    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(Datas.ListChat_002_Expect);
  });
});
