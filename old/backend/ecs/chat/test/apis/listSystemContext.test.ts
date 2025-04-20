import request from 'supertest';
import server from '@src/app';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { HEADER_AUTH } from 'test/commons';
import * as Datas from 'test/datas/listSystemContext';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('listSystemContext', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('getAll', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: Datas.ListSystemContext_001_Mock,
    });

    const apiPath = '/systemcontexts';
    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(Datas.ListSystemContext_001_Expect);
  });

  test('getNothing', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [],
    });

    const apiPath = '/systemcontexts';
    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(Datas.ListSystemContext_002_Expect);
  });
});
