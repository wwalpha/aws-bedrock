import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.DeleteShareIdParams, any, APIs.DeleteShareIdRequest, any>
): Promise<APIs.DeleteShareIdResponse> => {
  const { shareId } = req.params;

  await ChatService.deleteShareId(shareId);
};
