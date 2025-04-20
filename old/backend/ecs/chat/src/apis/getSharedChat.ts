import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.GetSharedChatParams, any, APIs.GetSharedChatRequest, any>
): Promise<APIs.GetSharedChatResponse> => {
  const { shareId } = req.params;

  const res = await ChatService.findUserIdAndChatId(shareId);

  if (res === null) {
    return {
      chat: null,
      messages: [],
    };
  }

  const userId = res.userId;
  const chatId = res.chatId;

  const chat = await ChatService.findChatById(
    // SAML 認証だと userId に # が含まれるため
    // 例: user#EntraID_hogehoge.com#EXT#@hogehoge.onmicrosoft.com
    userId.split('#').slice(1).join('#'),
    chatId.split('#')[1]
  );

  const messages = await ChatService.listMessages(chatId.split('#')[1]);

  return {
    chat,
    messages,
  };
};
