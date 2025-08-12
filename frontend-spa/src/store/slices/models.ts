import type { ModelsSlice } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// モデル可用性 / 分類ごとの一覧を保持
type SliceSet = (fn: (state: ModelsSlice) => Partial<ModelsSlice>) => void;

export const createModelsSlice: StateCreator<ModelsSlice, [], [], ModelsSlice> = (set: SliceSet) => ({
  // 環境変数キーとユーザ入力キーのマッピングなどに利用
  envKeyMap: {},
  setEnvKeyMap: (v: SetStateAction<Record<string, string>>) => set((s) => ({ envKeyMap: apply(s.envKeyMap, v) })),

  // ホスティングされている（サーバー側提供）モデル一覧
  availableHostedModels: [],
  setAvailableHostedModels: (v: SetStateAction<any[]>) =>
    set((s) => ({ availableHostedModels: apply(s.availableHostedModels, v) })),

  // ローカル (WebGPU / wasm 等) 実行用モデル一覧
  availableLocalModels: [],
  setAvailableLocalModels: (v: SetStateAction<any[]>) =>
    set((s) => ({ availableLocalModels: apply(s.availableLocalModels, v) })),

  // OpenRouter 等外部ルーター経由モデル一覧
  availableOpenRouterModels: [],
  setAvailableOpenRouterModels: (v: SetStateAction<any[]>) =>
    set((s) => ({ availableOpenRouterModels: apply(s.availableOpenRouterModels, v) })),
});
