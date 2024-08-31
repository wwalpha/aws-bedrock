import { Request, Response } from 'express';
import { ForbiddenError, Logger, ValidationError } from '@utils';
import { APIs } from 'typings';

export default async (req: Request, res: Response, callback: APIs.Callback) => {
  // イベントログ;
  try {
    // 認証
    // await validate(event);
    // 本処理
    const result = await callback(req);

    // 本処理結果
    Logger.info(result);

    res.status(200).send(result);
  } catch (error) {
    // エラーログ
    Logger.error('Error', error);

    if ((error as Error).name === 'ValidationError') {
      const vError = error as ValidationError;

      res.status(400).send(vError.message);
    } else if ((error as Error).name === 'ForbiddenError') {
      const vError = error as ForbiddenError;

      res.status(403).send(vError.message);
    } else {
      res.status(500).send((error as any).message);
    }
  }
};
