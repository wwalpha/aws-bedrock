"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setChatTitle = exports.batchCreateMessages = exports.listMessages = exports.updateFeedback = exports.deleteChat = exports.listChats = exports.findChatById = exports.registChat = void 0;
const crypto = __importStar(require("crypto"));
const Queries = __importStar(require("./queries"));
const _utils_1 = require("../../utils/index");
const registChat = (_userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = `user#${_userId}`;
    const chatId = `chat#${crypto.randomUUID()}`;
    const item = { id: userId, createdDate: `${Date.now()}`, chatId, usecase: '', title: '', updatedDate: '' };
    yield (0, _utils_1.DBHelper)().put(Queries.put(item));
    return item;
});
exports.registChat = registChat;
const findChatById = (_userId, _chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = `user#${_userId}`;
    const chatId = `chat#${_chatId}`;
    const res = yield (0, _utils_1.DBHelper)().query(Queries.findChatById(userId, chatId));
    if (!res.Items || res.Items.length === 0) {
        return null;
    }
    return res.Items[0];
});
exports.findChatById = findChatById;
const listChats = (_userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = `user#${_userId}`;
    const res = yield (0, _utils_1.DBHelper)().query(Queries.listChats(userId));
    return res.Items;
});
exports.listChats = listChats;
const deleteChat = (userId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatItem = yield (0, exports.findChatById)(userId, chatId);
    if (chatItem === null) {
        throw new _utils_1.DataNotfoundError('Chat not found');
    }
    yield (0, _utils_1.DBHelper)().delete(Queries.del({
        id: chatItem.id,
        createdDate: chatItem.createdDate,
    }));
});
exports.deleteChat = deleteChat;
const updateFeedback = (_chatId, createdDate, feedback) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = `chat#${_chatId}`;
    const res = yield (0, _utils_1.DBHelper)().update(Queries.feedback(chatId, createdDate, feedback));
    return res.Attributes;
});
exports.updateFeedback = updateFeedback;
const listMessages = (_chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = `chat#${_chatId}`;
    const res = yield (0, _utils_1.DBHelper)().query(Queries.listMessages(chatId));
    return res.Items;
});
exports.listMessages = listMessages;
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
const batchCreateMessages = (messages, _userId, _chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = `user#${_userId}`;
    const chatId = `chat#${_chatId}`;
    const createdDate = Date.now();
    const feedback = 'none';
    const items = messages.map((m, i) => {
        var _a, _b;
        return {
            id: chatId,
            createdDate: (_a = m.createdDate) !== null && _a !== void 0 ? _a : `${createdDate + i}#0`,
            messageId: m.messageId,
            role: m.role,
            content: m.content,
            extraData: m.extraData,
            userId,
            feedback,
            usecase: m.usecase,
            llmType: (_b = m.llmType) !== null && _b !== void 0 ? _b : '',
        };
    });
    yield (0, _utils_1.DBHelper)().getDocumentClient().send(Queries.batchCreateMessages(items));
    return items;
});
exports.batchCreateMessages = batchCreateMessages;
const setChatTitle = (id, createdDate, title) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, _utils_1.DBHelper)().update(Queries.setChatTitle(id, createdDate, title));
    return res.Attributes;
});
exports.setChatTitle = setChatTitle;
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
