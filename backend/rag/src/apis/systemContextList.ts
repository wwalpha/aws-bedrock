import { Request } from 'express';
import { SystemContextsService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<any, any, APIs.SystemContextListRequest, any>
): Promise<APIs.SystemContextListResponse> => {
  const userId: string = req.headers['username'] as string;

  return await SystemContextsService.listSystemContexts(userId);
};
