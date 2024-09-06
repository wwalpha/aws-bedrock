import { Request } from 'express';
import { defaultModel, API } from '@utils';
import { APIs, UnrecordedMessage } from 'typings';

export default async (req: Request<any, any, APIs.PredictTitleRequest, any>): Promise<APIs.PredictTitleResponse> => {
  const { chat, id, prompt } = req.body;

  // model.type が bedrockAgent の場合は title が生成できないため bedrock のデフォルトモデルを使う
  const model = req.body.model.type === 'bedrockAgent' ? defaultModel : req.body.model || defaultModel;

  // タイトル設定用の質問を追加
  const messages: UnrecordedMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  // 新規モデル追加時は、デフォルトで Claude の prompter が利用されるため
  // 出力が <output></output> で囲まれる可能性がある
  // 以下の処理ではそれに対応するため、<output></output> を含む xml タグを削除している
  const title = (await API[model.type].invoke?.(model, messages, id))?.replace(/<([^>]+)>([\s\S]*?)<\/\1>/, '$2') ?? '';

  // TODO: タイトルを更新する場合は以下の処理を追加する
  // await setChatTitle(chat.id, chat.createdDate, title);

  return title;
};
