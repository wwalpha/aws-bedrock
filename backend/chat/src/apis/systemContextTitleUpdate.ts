import { Request } from 'express';
import { SystemContextsService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.SystemContextTitleUpdateParams, any, APIs.SystemContextTitleUpdateRequest, any>
): Promise<APIs.SystemContextTitleUpdateResponse> => {
  const userId: string = req.headers['username'] as string;
  const { systemContextId } = req.params;
  const { title } = req.body;

  const contexts = await SystemContextsService.updateSystemContextTitle(userId, systemContextId, title);

  return {
    systemContext: contexts,
  };
};
