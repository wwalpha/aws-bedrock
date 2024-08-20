import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.MessageRegistParams, any, APIs.MessageRegistRequest, any>
): Promise<APIs.MessageRegistResponse> => {
  const userId: string = req.headers['username'] as string;
  const { chatId } = req.params;
  const { messages } = req.body;

  const res = await ChatService.batchCreateMessages(messages, userId, chatId);

  return {
    messages: res,
  };
};
