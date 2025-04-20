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
exports.deleteSystemContext = exports.updateSystemContextTitle = exports.registSystemContext = exports.listSystemContexts = exports.findSystemContextById = void 0;
const crypto = __importStar(require("crypto"));
const Queries = __importStar(require("./queries"));
const _utils_1 = require("../../utils/index");
const findSystemContextById = (_userId, _systemContextId) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = `systemContext#${_userId}`;
    const systemContextId = `systemContext#${_systemContextId}`;
    const res = yield (0, _utils_1.DBHelper)().query(Queries.findSystemContextById(userId, systemContextId));
    if (!res.Items || res.Items.length === 0) {
        return null;
    }
    else {
        return res.Items[0];
    }
});
exports.findSystemContextById = findSystemContextById;
const listSystemContexts = (_userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = `systemContext#${_userId}`;
    const res = yield (0, _utils_1.DBHelper)().query(Queries.listSystemContexts(userId));
    return res.Items;
});
exports.listSystemContexts = listSystemContexts;
const registSystemContext = (_userId, title, systemContext) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = `systemContext#${_userId}`;
    const systemContextId = `systemContext#${crypto.randomUUID()}`;
    const item = {
        id: userId,
        createdDate: `${Date.now()}`,
        systemContextId: systemContextId,
        systemContext: systemContext,
        systemContextTitle: title,
    };
    yield (0, _utils_1.DBHelper)().put(Queries.put(item));
    return item;
});
exports.registSystemContext = registSystemContext;
const updateSystemContextTitle = (_userId, _systemContextId, title) => __awaiter(void 0, void 0, void 0, function* () {
    const systemContext = yield (0, exports.findSystemContextById)(_userId, _systemContextId);
    const res = yield (0, _utils_1.DBHelper)().update(Queries.updateSystemContextTitle(systemContext, title));
    return res.Attributes;
});
exports.updateSystemContextTitle = updateSystemContextTitle;
const deleteSystemContext = (_userId, _systemContextId) => __awaiter(void 0, void 0, void 0, function* () {
    // System Context の削除
    const systemContext = yield (0, exports.findSystemContextById)(_userId, _systemContextId);
    yield (0, _utils_1.DBHelper)().delete(Queries.del(systemContext));
});
exports.deleteSystemContext = deleteSystemContext;
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
