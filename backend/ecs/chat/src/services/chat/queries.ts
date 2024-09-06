import { DeleteItemInput, PutItemInput, QueryInput, UpdateInput } from '@alphax/dynamodb';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { Chat, PrimaryKey, RecordedMessage } from 'typings';

const TABLE_NAME = process.env.TABLE_NAME as string;

export const put = (item: Chat): PutItemInput<Chat> => ({
  TableName: TABLE_NAME,
  Item: item,
});

export const del = (key: PrimaryKey): DeleteItemInput => ({
  TableName: TABLE_NAME,
  Key: key,
});

export const findChatById = (userId: string, chatId: string): QueryInput => {
  const query: QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: '#id = :id',
    FilterExpression: '#chatId = :chatId',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#chatId': 'chatId',
    },
    ExpressionAttributeValues: {
      ':id': userId,
      ':chatId': chatId,
    },
  };

  return query;
};

export const listChats = (userId: string): QueryInput => {
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

export const listMessages = (chatId: string): QueryInput => {
  const query: QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': chatId,
    },
  };

  return query;
};

export const feedback = (chatId: string, createdDate: string, feedback: string): UpdateInput => {
  const update: UpdateInput = {
    TableName: TABLE_NAME,
    Key: {
      id: chatId,
      createdDate,
    },
    UpdateExpression: 'set feedback = :feedback',
    ExpressionAttributeValues: {
      ':feedback': feedback,
    },
    ReturnValues: 'ALL_NEW',
  };

  return update;
};

export const setChatTitle = (id: string, createdDate: string, title: string): UpdateInput => {
  const update: UpdateInput = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
      createdDate: createdDate,
    },
    UpdateExpression: 'set title = :title',
    ExpressionAttributeValues: {
      ':title': title,
    },
    ReturnValues: 'ALL_NEW',
  };

  return update;
};

export const batchCreateMessages = (messages: RecordedMessage[]): BatchWriteCommand => {
  return new BatchWriteCommand({
    RequestItems: {
      [TABLE_NAME]: messages.map((message) => ({
        PutRequest: {
          Item: message,
        },
      })),
    },
  });
};

export const findShareId = (userId: string, chatId: string): QueryInput => {
  const query: QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': `${userId}_${chatId}`,
    },
  };

  return query;
};

export const findUserIdAndChatId = (shareId: string): QueryInput => {
  const query: QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': shareId,
    },
  };

  return query;
};
