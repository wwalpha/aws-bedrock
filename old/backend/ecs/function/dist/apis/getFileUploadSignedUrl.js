"use strict";
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
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
exports.default = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { mediaFormat, filename } = req.body;
    const uuid = (0, uuid_1.v4)();
    // Create an S3 client service object
    const client = new client_s3_1.S3Client({});
    // Create the command
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${uuid}/${filename}`,
        ContentType: mediaFormat,
    });
    // Send the command
    yield client.send(command);
    // Create the signed URL
    const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn: 3600 });
    return signedUrl;
});
