import { DeleteItemInput, PutItemInput, QueryInput, UpdateInput } from '@alphax/dynamodb';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { PrimaryKey, RecordedMessage, SystemContext } from 'typings';

const TABLE_NAME = process.env.TABLE_NAME as string;

export const put = (item: SystemContext): PutItemInput<SystemContext> => ({
  TableName: TABLE_NAME,
  Item: item,
});

export const del = (key: PrimaryKey): DeleteItemInput => ({
  TableName: TABLE_NAME,
  Key: key,
});

export const listSystemContexts = (userId: string): QueryInput => {
  const query: QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': userId,
    },
    ScanIndexForward: false,
  };

  return query;
};

export const findSystemContextById = (userId: string, systemContextId: string): QueryInput => {
  const query: QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: '#id = :id',
    FilterExpression: '#systemContextId = :systemContextId',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#systemContextId': 'systemContextId',
    },
    ExpressionAttributeValues: {
      ':id': userId,
      ':systemContextId': systemContextId,
    },
  };

  return query;
};

export const updateSystemContextTitle = (systemContext: SystemContext | null, title: string): UpdateInput => {
  const update: UpdateInput = {
    TableName: TABLE_NAME,
    Key: {
      id: systemContext?.id,
      createdDate: systemContext?.createdDate,
    },
    UpdateExpression: 'set systemContextTitle = :systemContextTitle',
    ExpressionAttributeValues: {
      ':systemContextTitle': title,
    },
    ReturnValues: 'ALL_NEW',
  };

  return update;
};
