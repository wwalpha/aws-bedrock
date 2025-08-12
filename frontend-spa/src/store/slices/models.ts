import type { ModelsSlice } from 'typings';
import { apply } from '../utils';

// モデル可用性 / 分類ごとの一覧を保持
export const createModelsSlice = (set: any) =>
  ({
    // 環境変数キーとユーザ入力キーのマッピングなどに利用
    envKeyMap: {},
    setEnvKeyMap: (v: any) => set((s: ModelsSlice) => ({ envKeyMap: apply(s.envKeyMap, v) })),

    // ホスティングされている（サーバー側提供）モデル一覧
    availableHostedModels: [],
    setAvailableHostedModels: (v: any) =>
      set((s: ModelsSlice) => ({ availableHostedModels: apply(s.availableHostedModels, v) })),

    // ローカル (WebGPU / wasm 等) 実行用モデル一覧
    availableLocalModels: [],
    setAvailableLocalModels: (v: any) =>
      set((s: ModelsSlice) => ({ availableLocalModels: apply(s.availableLocalModels, v) })),

    // OpenRouter 等外部ルーター経由モデル一覧
    availableOpenRouterModels: [],
    setAvailableOpenRouterModels: (v: any) =>
      set((s: ModelsSlice) => ({ availableOpenRouterModels: apply(s.availableOpenRouterModels, v) })),
  }) as ModelsSlice;
