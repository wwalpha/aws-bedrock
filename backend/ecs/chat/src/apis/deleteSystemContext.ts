import { Request } from 'express';
import { SystemContextsService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.DeleteSystemContextParams, any, APIs.DeleteSystemContextRequest, any>
): Promise<APIs.DeleteSystemContextResponse> => {
  const userId: string = req.headers['username'] as string;
  const { systemContextId } = req.params;

  await SystemContextsService.deleteSystemContext(userId, systemContextId);
};
