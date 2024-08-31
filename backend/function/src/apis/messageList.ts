import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';
import { ForbiddenError } from '@utils';

export default async (
  req: Request<APIs.MessageListParams, any, APIs.MessageListRequest, any>
): Promise<APIs.MessageListResponse> => {
  const userId: string = req.headers['username'] as string;
  const { chatId } = req.params;

  const chat = await ChatService.findChatById(userId, chatId);

  if (chat === null) {
    throw new ForbiddenError('Forbidden');
  }

  const messages = await ChatService.listMessages(chatId);

  return {
    messages: messages,
  };
};
