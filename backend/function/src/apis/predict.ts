import { Request } from 'express';
import { defaultModel, API } from '@utils';
import { APIs } from 'typings';

export default async (req: Request<any, any, APIs.PredictRequest, any>): Promise<APIs.PredictResponse> => {
  const { id, messages } = req.body;
  const model = req.body.model || defaultModel;

  return await API[model.type].invoke?.(model, messages, id);
};
