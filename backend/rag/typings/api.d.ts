import { Request } from 'express';
import { QueryCommandOutput, RetrieveCommandOutput } from '@aws-sdk/client-kendra';
import { Chat, SystemContext } from '../../types/index';

export namespace APIs {
  type Callback = (req: Request<any>) => Promise<any>;

  // ------------------------------------------------------------
  // Query Kendra
  // ------------------------------------------------------------
  type QueryKendraRequest = {
    query: string;
  };
  type QueryKendraResponse = QueryCommandOutput;

  // ------------------------------------------------------------
  // Retrieve Kendra
  // ------------------------------------------------------------
  type RetrieveKendraRequest = {
    query: string;
  };
  type RetrieveKendraResponse = RetrieveCommandOutput;
}
