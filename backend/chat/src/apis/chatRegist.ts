import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (req: Request<any, any, APIs.ChatRegistRequest, any>): Promise<APIs.ChatRegistResponse> => {
  const userId: string = req.headers['username'] as string;

  return await ChatService.registChat(userId);
};