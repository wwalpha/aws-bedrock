"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamingChunk = void 0;
// JSONL 形式
const streamingChunk = (chunk) => {
    return JSON.stringify(chunk) + '\n';
};
exports.streamingChunk = streamingChunk;
