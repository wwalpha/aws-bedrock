import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (req: Request<APIs.ChatDeleteParams, any, APIs.ChatDeleteRequest, any>): Promise<APIs.ChatDeleteResponse> => {
  const userId: string = req.headers['username'] as string;
  const {chatId} = req.params;

  await ChatService.deleteChat(userId,chatId);

  // TODO: shareIdの削除処理を追加
  // const shareId = await findShareId(userId, chatId);

  // if (shareId) {
  //   await deleteShareId(shareId.shareId.split('#')[1]);
  // }
};

