import { KendraClient, KendraClientConfig } from '@aws-sdk/client-kendra';

let kendraClient: KendraClient;

/** Kendra Client初期化 */
export const kendra = (options?: KendraClientConfig): KendraClient => {
  // 初期化済み
  if (kendraClient) return kendraClient;

  // 初期化設定あり
  if (options) return new KendraClient(options);

  kendraClient = new KendraClient({});

  return kendraClient;
};
