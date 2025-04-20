"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSystemContextTitle = exports.findSystemContextById = exports.listSystemContexts = exports.del = exports.put = void 0;
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
const listSystemContexts = (userId) => {
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
exports.listSystemContexts = listSystemContexts;
const findSystemContextById = (userId, systemContextId) => {
    const query = {
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
exports.findSystemContextById = findSystemContextById;
const updateSystemContextTitle = (systemContext, title) => {
    const update = {
        TableName: TABLE_NAME,
        Key: {
            id: systemContext === null || systemContext === void 0 ? void 0 : systemContext.id,
            createdDate: systemContext === null || systemContext === void 0 ? void 0 : systemContext.createdDate,
        },
        UpdateExpression: 'set systemContextTitle = :systemContextTitle',
        ExpressionAttributeValues: {
            ':systemContextTitle': title,
        },
        ReturnValues: 'ALL_NEW',
    };
    return update;
};
exports.updateSystemContextTitle = updateSystemContextTitle;
