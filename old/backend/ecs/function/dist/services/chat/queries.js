"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchCreateMessages = exports.setChatTitle = exports.feedback = exports.listMessages = exports.listChats = exports.findChatById = exports.del = exports.put = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const TABLE_NAME = process.env.TABLE_NAME;
const put = (item) => ({
    TableName: TABLE_NAME,
    Item: item,
});
exports.put = put;
const del = (key) => ({
    TableName: TABLE_NAME,
    Key: key,
});
exports.del = del;
const findChatById = (userId, chatId) => {
    const query = {
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
exports.findChatById = findChatById;
const listChats = (userId) => {
    const query = {
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
exports.listChats = listChats;
const listMessages = (chatId) => {
    const query = {
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
exports.listMessages = listMessages;
const feedback = (chatId, createdDate, feedback) => {
    const update = {
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
exports.feedback = feedback;
const setChatTitle = (id, createdDate, title) => {
    const update = {
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
exports.setChatTitle = setChatTitle;
const batchCreateMessages = (messages) => {
    return new lib_dynamodb_1.BatchWriteCommand({
        RequestItems: {
            [TABLE_NAME]: messages.map((message) => ({
                PutRequest: {
                    Item: message,
                },
            })),
        },
    });
};
exports.batchCreateMessages = batchCreateMessages;
