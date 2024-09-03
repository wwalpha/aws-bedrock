import { StreamingChunk } from 'typings';

// JSONL 形式
export const streamingChunk = (chunk: StreamingChunk): string => {
  return JSON.stringify(chunk) + '\n';
};
