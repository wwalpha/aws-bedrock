import type { PostConfirmationTriggerEvent, Context } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

// 環境変数からテーブル名を取得（未設定ならダミー動作）
const TABLE_NAME = process.env.USER_TABLE_NAME || '';
const ddb = new DynamoDBClient({});

export const handler = async (event: PostConfirmationTriggerEvent, _context: Context) => {
  console.log('Received event:', JSON.stringify(event));

  // ユーザー情報を抽出
  const userSub = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;

  // DynamoDB へ保存（テーブル名が無い場合はスキップ）
  if (TABLE_NAME && userSub) {
    try {
      await ddb.send(new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          user_id: { S: userSub },
          email: { S: email || '' },
          created_at: { S: new Date().toISOString() },
        },
        ConditionExpression: 'attribute_not_exists(user_id)'
      }));
      console.log('User stored into DynamoDB:', userSub);
    } catch (err) {
      console.error('Failed to store user:', err);
      // PostConfirmation はイベント継続のためエラーは投げない
    }
  } else {
    console.log('TABLE_NAME is empty or userSub missing. Skipped writing to DynamoDB.');
  }

  // イベントをそのまま返す（Cognito要件）
  return event;
};
