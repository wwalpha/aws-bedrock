import * as crypto from 'crypto';
import { BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import * as Queries from './queries';
import { DataNotfoundError, DBHelper } from '@utils';
import { Chat, RecordedMessage, ToBeRecordedMessage } from 'typings';

export const registChat = async (_userId: string): Promise<Chat> => {
  const userId = `user#${_userId}`;
  const chatId = `chat#${crypto.randomUUID()}`;

  const item: Chat = { id: userId, createdDate: `${Date.now()}`, chatId, usecase: '', title: '', updatedDate: '' };

  await DBHelper().put(Queries.put(item));

  return item;
};

export const findChatById = async (_userId: string, _chatId: string): Promise<Chat | null> => {
  const userId = `user#${_userId}`;
  const chatId = `chat#${_chatId}`;

  const res = await DBHelper().query<Chat>(Queries.findChatById(userId, chatId));

  if (!res.Items || res.Items.length === 0) {
    return null;
  }

  return res.Items[0];
};

export const listChats = async (_userId: string): Promise<Chat[]> => {
  const userId = `user#${_userId}`;

  const res = await DBHelper().query<Chat>(Queries.listChats(userId));

  return res.Items;
};

export const deleteChat = async (userId: string, chatId: string): Promise<void> => {
  const chatItem = await findChatById(userId, chatId);

  if (chatItem === null) {
    throw new DataNotfoundError('Chat not found');
  }

  await DBHelper().delete(
    Queries.del({
      id: chatItem.id,
      createdDate: chatItem.createdDate,
    })
  );
};

export const updateFeedback = async (
  _chatId: string,
  createdDate: string,
  feedback: string
): Promise<RecordedMessage> => {
  const chatId = `chat#${_chatId}`;

  const res = await DBHelper().update(Queries.feedback(chatId, createdDate, feedback));

  return res.Attributes as RecordedMessage;
};

export const listMessages = async (_chatId: string): Promise<RecordedMessage[]> => {
  const chatId = `chat#${_chatId}`;

  const res = await DBHelper().query<RecordedMessage>(Queries.listMessages(chatId));

  return res.Items;
};

// export const findSystemContextById = async (
//   _userId: string,
//   _systemContextId: string
// ): Promise<SystemContext | null> => {
//   const userId = `systemContext#${_userId}`;
//   const systemContextId = `systemContext#${_systemContextId}`;
//   const res = await dynamoDbDocument.send(
//     new QueryCommand({
//       TableName: TABLE_NAME,
//       KeyConditionExpression: '#id = :id',
//       FilterExpression: '#systemContextId = :systemContextId',
//       ExpressionAttributeNames: {
//         '#id': 'id',
//         '#systemContextId': 'systemContextId',
//       },
//       ExpressionAttributeValues: {
//         ':id': userId,
//         ':systemContextId': systemContextId,
//       },
//     })
//   );

//   if (!res.Items || res.Items.length === 0) {
//     return null;
//   } else {
//     return res.Items[0] as SystemContext;
//   }
// };

// export const listSystemContexts = async (_userId: string): Promise<SystemContext[]> => {
//   const userId = `systemContext#${_userId}`;
//   const res = await dynamoDbDocument.send(
//     new QueryCommand({
//       TableName: TABLE_NAME,
//       KeyConditionExpression: '#id = :id',
//       ExpressionAttributeNames: {
//         '#id': 'id',
//       },
//       ExpressionAttributeValues: {
//         ':id': userId,
//       },
//       ScanIndexForward: false,
//     })
//   );
//   return res.Items as SystemContext[];
// };

// export const createSystemContext = async (
//   _userId: string,
//   title: string,
//   systemContext: string
// ): Promise<SystemContext> => {
//   const userId = `systemContext#${_userId}`;
//   const systemContextId = `systemContext#${crypto.randomUUID()}`;
//   const item = {
//     id: userId,
//     createdDate: `${Date.now()}`,
//     systemContextId: systemContextId,
//     systemContext: systemContext,
//     systemContextTitle: title,
//   };

//   await dynamoDbDocument.send(
//     new PutCommand({
//       TableName: TABLE_NAME,
//       Item: item,
//     })
//   );

//   return item;
// };

export const batchCreateMessages = async (
  messages: ToBeRecordedMessage[],
  _userId: string,
  _chatId: string
): Promise<RecordedMessage[]> => {
  const userId = `user#${_userId}`;
  const chatId = `chat#${_chatId}`;
  const createdDate = Date.now();
  const feedback = 'none';

  const items: RecordedMessage[] = messages.map((m: ToBeRecordedMessage, i: number) => {
    return {
      id: chatId,
      createdDate: m.createdDate ?? `${createdDate + i}#0`,
      messageId: m.messageId,
      role: m.role,
      content: m.content,
      extraData: m.extraData,
      userId,
      feedback,
      usecase: m.usecase,
      llmType: m.llmType ?? '',
    };
  });

  await DBHelper().getDocumentClient().send(Queries.batchCreateMessages(items));

  return items;
};

export const setChatTitle = async (id: string, createdDate: string, title: string): Promise<Chat> => {
  const res = await DBHelper().update(Queries.setChatTitle(id, createdDate, title));

  return res.Attributes as Chat;
};

//   // // Message の削除
//   const messageItems = await listMessages(_chatId);
//   await dynamoDbDocument.send(
//     new BatchWriteCommand({
//       RequestItems: {
//         [TABLE_NAME]: messageItems.map((m) => {
//           return {
//             DeleteRequest: {
//               Key: {
//                 id: m.id,
//                 createdDate: m.createdDate,
//               },
//             },
//           };
//         }),
//       },
//     })
//   );
// };

// export const updateSystemContextTitle = async (
//   _userId: string,
//   _systemContextId: string,
//   title: string
// ): Promise<SystemContext> => {
//   const systemContext = await findSystemContextById(_userId, _systemContextId);
//   const res = await dynamoDbDocument.send(
//     new UpdateCommand({
//       TableName: TABLE_NAME,
//       Key: {
//         id: systemContext?.id,
//         createdDate: systemContext?.createdDate,
//       },
//       UpdateExpression: 'set systemContextTitle = :systemContextTitle',
//       ExpressionAttributeValues: {
//         ':systemContextTitle': title,
//       },
//       ReturnValues: 'ALL_NEW',
//     })
//   );

//   return res.Attributes as SystemContext;
// };

// export const deleteSystemContext = async (_userId: string, _systemContextId: string): Promise<void> => {
//   // System Context の削除
//   const systemContext = await findSystemContextById(_userId, _systemContextId);
//   await dynamoDbDocument.send(
//     new DeleteCommand({
//       TableName: TABLE_NAME,
//       Key: {
//         id: systemContext?.id,
//         createdDate: systemContext?.createdDate,
//       },
//     })
//   );
// };

// export const createShareId = async (
//   _userId: string,
//   _chatId: string
// ): Promise<{
//   shareId: ShareId;
//   userIdAndChatId: UserIdAndChatId;
// }> => {
//   const userId = `user#${_userId}`;
//   const chatId = `chat#${_chatId}`;
//   const createdDate = `${Date.now()}`;
//   const shareId = `share#${crypto.randomUUID()}`;

//   const itemShareId = {
//     id: `${userId}_${chatId}`,
//     createdDate,
//     shareId,
//   };

//   const itemUserIdAndChatId = {
//     id: shareId,
//     createdDate,
//     userId,
//     chatId,
//   };

//   await dynamoDbDocument.send(
//     new TransactWriteCommand({
//       TransactItems: [
//         {
//           Put: {
//             TableName: TABLE_NAME,
//             Item: itemShareId,
//           },
//         },
//         {
//           Put: {
//             TableName: TABLE_NAME,
//             Item: itemUserIdAndChatId,
//           },
//         },
//       ],
//     })
//   );

//   return {
//     shareId: itemShareId,
//     userIdAndChatId: itemUserIdAndChatId,
//   };
// };

// export const findUserIdAndChatId = async (_shareId: string): Promise<UserIdAndChatId | null> => {
//   const shareId = `share#${_shareId}`;
//   const res = await dynamoDbDocument.send(
//     new QueryCommand({
//       TableName: TABLE_NAME,
//       KeyConditionExpression: '#id = :id',
//       ExpressionAttributeNames: {
//         '#id': 'id',
//       },
//       ExpressionAttributeValues: {
//         ':id': shareId,
//       },
//     })
//   );

//   if (!res.Items || res.Items.length === 0) {
//     return null;
//   } else {
//     return res.Items[0] as UserIdAndChatId;
//   }
// };

// export const findShareId = async (_userId: string, _chatId: string): Promise<ShareId | null> => {
//   const userId = `user#${_userId}`;
//   const chatId = `chat#${_chatId}`;
//   const res = await dynamoDbDocument.send(
//     new QueryCommand({
//       TableName: TABLE_NAME,
//       KeyConditionExpression: '#id = :id',
//       ExpressionAttributeNames: {
//         '#id': 'id',
//       },
//       ExpressionAttributeValues: {
//         ':id': `${userId}_${chatId}`,
//       },
//     })
//   );

//   if (!res.Items || res.Items.length === 0) {
//     return null;
//   } else {
//     return res.Items[0] as ShareId;
//   }
// };

// export const deleteShareId = async (_shareId: string): Promise<void> => {
//   const userIdAndChatId = await findUserIdAndChatId(_shareId);
//   const share = await findShareId(
//     // SAML 認証だと userId に # が含まれるため
//     // 例: user#EntraID_hogehoge.com#EXT#@hogehoge.onmicrosoft.com
//     userIdAndChatId!.userId.split('#').slice(1).join('#'),
//     userIdAndChatId!.chatId.split('#')[1]
//   );

//   await dynamoDbDocument.send(
//     new TransactWriteCommand({
//       TransactItems: [
//         {
//           Delete: {
//             TableName: TABLE_NAME,
//             Key: {
//               id: share!.id,
//               createdDate: share!.createdDate,
//             },
//           },
//         },
//         {
//           Delete: {
//             TableName: TABLE_NAME,
//             Key: {
//               id: userIdAndChatId!.id,
//               createdDate: userIdAndChatId!.createdDate,
//             },
//           },
//         },
//       ],
//     })
//   );
// };
