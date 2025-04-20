"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb_1 = require("@alphax/dynamodb");
let helper;
exports.default = () => {
    if (helper)
        return helper;
    helper = new dynamodb_1.DynamodbHelper({
        options: {
            region: process.env['AWS_DEFAULT_REGION'],
            endpoint: process.env['AWS_ENDPOINT_DYNAMODB'],
            tls: false,
        },
    });
    return helper;
};
