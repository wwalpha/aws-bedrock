import { Request } from 'express';
import { SystemContextsService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<any, any, APIs.ListSystemContextRequest, any>
): Promise<APIs.ListSystemContextResponse> => {
  const userId: string = req.headers['username'] as string;

  return await SystemContextsService.listSystemContexts(userId);
};
