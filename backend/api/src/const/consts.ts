export const Environment = {
  AWS_REGION:
    process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1',
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID as string,
  TABLE_NAME_USER: process.env.TABLE_NAME_USER as string,
  TABLE_NAME_CHAT_HISTORY: process.env.TABLE_NAME_CHAT_HISTORY as string,
  TABLE_NAME_CONVERSATIONS: process.env.TABLE_NAME_CONVERSATIONS as string,
  TABLE_NAME_KNOWLEDGE: process.env.TABLE_NAME_KNOWLEDGE as string,
  KNOWLEDGE_BUCKET_NAME: process.env.KNOWLEDGE_BUCKET_NAME as string,
  GLOBAL_GPT5_SECRET_NAME:
    process.env.GLOBAL_GPT5_SECRET_NAME || 'global-gpt5-api-key',
};
