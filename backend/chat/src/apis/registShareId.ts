import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.RegistShareIdParams, any, APIs.RegistShareIdRequest, any>
): Promise<APIs.RegistShareIdResponse> => {
  const userId: string = req.headers['username'] as string;
  const { chatId } = req.params;

  const share = await ChatService.registShareId(userId, chatId);

  return share;
};
