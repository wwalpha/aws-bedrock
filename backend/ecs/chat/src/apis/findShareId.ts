import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.FindShareIdParams, any, APIs.FindShareIdRequest, any>
): Promise<APIs.FindShareIdResponse> => {
  const userId: string = req.headers['username'] as string;
  const { chatId } = req.params;

  const chat = await ChatService.findChatById(userId, chatId);

  if (chat === null) {
    return null;
  }

  return chat;
};
