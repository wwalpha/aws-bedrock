import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (req: Request<any, any, APIs.RegistChatRequest, any>): Promise<APIs.RegistChatResponse> => {
  const userId: string = req.headers['username'] as string;

  const chat = await ChatService.registChat(userId);

  return {
    chat,
  };
};
