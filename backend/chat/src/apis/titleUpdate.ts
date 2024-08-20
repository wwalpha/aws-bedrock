import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';
import { DataNotfoundError } from '@utils';

export default async (
  req: Request<APIs.TitleUpdateParams, any, APIs.TitleUpdateRequest, any>
): Promise<APIs.TitleUpdateResponse> => {
  const userId: string = req.headers['username'] as string;
  const { chatId } = req.params;
  const { title } = req.body;

  const chat = await ChatService.findChatById(userId, chatId);

  if (chat === null) {
    throw new DataNotfoundError('Forbidden');
  }

  const res = await ChatService.setChatTitle(chat.chatId, chat.createdDate, title);

  return {
    chat: res,
  };
};
