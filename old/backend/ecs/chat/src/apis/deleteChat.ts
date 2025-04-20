import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.DeleteChatParams, any, APIs.DeleteChatRequest, any>
): Promise<APIs.ChatDeleteResponse> => {
  const userId: string = req.headers['username'] as string;
  const { chatId } = req.params;

  await ChatService.deleteChat(userId, chatId);

  const shareId = await ChatService.findShareId(userId, chatId);

  if (shareId) {
    await ChatService.deleteShareId(shareId.shareId.split('#')[1]);
  }
};
