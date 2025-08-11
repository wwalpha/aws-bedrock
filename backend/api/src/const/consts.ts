export const Environment = {
  // Prefer AWS_REGION, fallback to AWS_DEFAULT_REGION, then default
  AWS_REGION:
    process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1',
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  USER_TABLE_NAME: process.env.USER_TABLE_NAME,
  CHAT_HISTORY_TABLE_NAME: process.env.CHAT_HISTORY_TABLE_NAME,
  PROJECT_NAME: process.env.PROJECT_NAME,
};
