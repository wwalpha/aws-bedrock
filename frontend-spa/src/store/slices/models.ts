import type { ModelsSlice } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// モデル可用性 / 分類ごとの一覧を保持
export const createModelsSlice: StateCreator<ModelsSlice, [], [], ModelsSlice> = (set: SliceSet<ModelsSlice>) => ({
  // 環境変数キーとユーザ入力キーのマッピングなどに利用
  envKeyMap: {},
  setEnvKeyMap: (v: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) =>
    set((s) => ({ envKeyMap: typeof v === 'function' ? (v as any)(s.envKeyMap) : v })),

  // ホスティングされている（サーバー側提供）モデル一覧
  availableHostedModels: [],
  setAvailableHostedModels: (v: any[] | ((prev: any[]) => any[])) =>
    set((s) => ({ availableHostedModels: typeof v === 'function' ? (v as any)(s.availableHostedModels) : v })),

  // ローカル (WebGPU / wasm 等) 実行用モデル一覧
  availableLocalModels: [],
  setAvailableLocalModels: (v: any[] | ((prev: any[]) => any[])) =>
    set((s) => ({ availableLocalModels: typeof v === 'function' ? (v as any)(s.availableLocalModels) : v })),

  // OpenRouter 等外部ルーター経由モデル一覧
  availableOpenRouterModels: [],
  setAvailableOpenRouterModels: (v: any[] | ((prev: any[]) => any[])) =>
    set((s) => ({ availableOpenRouterModels: typeof v === 'function' ? (v as any)(s.availableOpenRouterModels) : v })),
});
