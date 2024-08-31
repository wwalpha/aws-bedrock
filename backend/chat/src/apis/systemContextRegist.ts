import { Request } from 'express';
import { SystemContextsService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<any, any, APIs.SystemContextRegistRequest, any>
): Promise<APIs.SystemContextRegistResponse> => {
  const userId: string = req.headers['username'] as string;
  const { systemContextTitle, systemContext } = req.body;

  const contexts = await SystemContextsService.registSystemContext(userId, systemContextTitle, systemContext);

  return contexts;
};
