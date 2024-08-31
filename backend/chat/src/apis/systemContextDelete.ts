import { Request } from 'express';
import { SystemContextsService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.SystemContextDeleteParams, any, APIs.SystemContextDeleteRequest, any>
): Promise<APIs.SystemContextDeleteResponse> => {
  const userId: string = req.headers['username'] as string;
  const { systemContextId } = req.params;

  await SystemContextsService.deleteSystemContext(userId, systemContextId);
};
