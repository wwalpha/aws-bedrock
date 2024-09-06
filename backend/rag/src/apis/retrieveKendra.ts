import { Request } from 'express';
import { AttributeFilter, RetrieveCommand } from '@aws-sdk/client-kendra';
import { ClientHelper } from '@utils';
import { ENVs } from '@consts';
import { APIs } from 'typings';

export default async (
  req: Request<any, any, APIs.RetrieveKendraRequest, any>
): Promise<APIs.RetrieveKendraResponse> => {
  const { query } = req.body;

  // デフォルト言語が英語なので、言語設定は必ず行う
  const attributeFilter: AttributeFilter = {
    AndAllFilters: [
      {
        EqualsTo: {
          Key: '_language_code',
          Value: {
            StringValue: 'ja',
          },
        },
      },
    ],
  };

  const command = new RetrieveCommand({
    IndexId: ENVs.KENDRA_INDEX_ID,
    QueryText: query,
    AttributeFilter: attributeFilter,
  });

  const res = await ClientHelper.kendra().send(command);

  return res;
};
