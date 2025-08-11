import type { ModelsSlice } from 'typings';
import { apply } from '../utils';

export const createModelsSlice = (set: any) =>
  ({
    envKeyMap: {},
    setEnvKeyMap: (v: any) => set((s: ModelsSlice) => ({ envKeyMap: apply(s.envKeyMap, v) })),
    availableHostedModels: [],
    setAvailableHostedModels: (v: any) =>
      set((s: ModelsSlice) => ({ availableHostedModels: apply(s.availableHostedModels, v) })),
    availableLocalModels: [],
    setAvailableLocalModels: (v: any) =>
      set((s: ModelsSlice) => ({ availableLocalModels: apply(s.availableLocalModels, v) })),
    availableOpenRouterModels: [],
    setAvailableOpenRouterModels: (v: any) =>
      set((s: ModelsSlice) => ({ availableOpenRouterModels: apply(s.availableOpenRouterModels, v) })),
  }) as ModelsSlice;
