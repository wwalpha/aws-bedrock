import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.ChatGetParams, any, APIs.ChatGetRequest, any>
): Promise<APIs.ChatGetResponse> => {
  const userId: string = req.headers['username'] as string;
  const { chatId } = req.params;

  return await ChatService.findChatById(userId, chatId);
};
