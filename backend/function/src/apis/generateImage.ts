import { Request } from 'express';
import { API, defaultImageGenerationModel } from '@utils';
import { APIs } from 'typings';

export default async (req: Request<any, any, APIs.GenerateImageRequest, any>): Promise<APIs.GenerateImageResponse> => {
  const model = req.body.model || defaultImageGenerationModel;
  return await API[model.type].generateImage(model, req.params);
};
