import * as crypto from 'crypto';
import * as Queries from './queries';
import { DBHelper } from '@utils';
import { SystemContext } from 'typings';

export const findSystemContextById = async (
  _userId: string,
  _systemContextId: string
): Promise<SystemContext | null> => {
  const userId = `systemContext#${_userId}`;
  const systemContextId = `systemContext#${_systemContextId}`;

  const res = await DBHelper().query<SystemContext>(Queries.findSystemContextById(userId, systemContextId));

  if (!res.Items || res.Items.length === 0) {
    return null;
  } else {
    return res.Items[0] as SystemContext;
  }
};

export const listSystemContexts = async (_userId: string): Promise<SystemContext[]> => {
  const userId = `systemContext#${_userId}`;

  const res = await DBHelper().query<SystemContext>(Queries.listSystemContexts(userId));

  return res.Items;
};

export const registSystemContext = async (
  _userId: string,
  title: string,
  systemContext: string
): Promise<SystemContext> => {
  const userId = `systemContext#${_userId}`;
  const systemContextId = `systemContext#${crypto.randomUUID()}`;
  const item = {
    id: userId,
    createdDate: `${Date.now()}`,
    systemContextId: systemContextId,
    systemContext: systemContext,
    systemContextTitle: title,
  };

  await DBHelper().put(Queries.put(item));

  return item;
};

export const updateSystemContextTitle = async (
  _userId: string,
  _systemContextId: string,
  title: string
): Promise<SystemContext> => {
  const systemContext = await findSystemContextById(_userId, _systemContextId);

  const res = await DBHelper().update(Queries.updateSystemContextTitle(systemContext, title));

  return res.Attributes as SystemContext;
};

export const deleteSystemContext = async (_userId: string, _systemContextId: string): Promise<void> => {
  // System Context の削除
  const systemContext = await findSystemContextById(_userId, _systemContextId);

  await DBHelper().delete(Queries.del(systemContext!));
};

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
