import { Dispatch, SetStateAction } from "react"
import { LLM, OpenRouterLLM } from "@/types"
import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { apply } from "../utils"

export interface ModelsSlice {
  envKeyMap: Record<string, VALID_ENV_KEYS>
  setEnvKeyMap: Dispatch<SetStateAction<Record<string, VALID_ENV_KEYS>>>
  availableHostedModels: LLM[]
  setAvailableHostedModels: Dispatch<SetStateAction<LLM[]>>
  availableLocalModels: LLM[]
  setAvailableLocalModels: Dispatch<SetStateAction<LLM[]>>
  availableOpenRouterModels: OpenRouterLLM[]
  setAvailableOpenRouterModels: Dispatch<SetStateAction<OpenRouterLLM[]>>
}

export const createModelsSlice = (set: any) =>
  ({
    envKeyMap: {},
    setEnvKeyMap: (v: SetStateAction<Record<string, VALID_ENV_KEYS>>) =>
      set((s: ModelsSlice) => ({ envKeyMap: apply(s.envKeyMap, v) })),
    availableHostedModels: [],
    setAvailableHostedModels: (v: SetStateAction<LLM[]>) =>
      set((s: ModelsSlice) => ({
        availableHostedModels: apply(s.availableHostedModels, v)
      })),
    availableLocalModels: [],
    setAvailableLocalModels: (v: SetStateAction<LLM[]>) =>
      set((s: ModelsSlice) => ({
        availableLocalModels: apply(s.availableLocalModels, v)
      })),
    availableOpenRouterModels: [],
    setAvailableOpenRouterModels: (v: SetStateAction<OpenRouterLLM[]>) =>
      set((s: ModelsSlice) => ({
        availableOpenRouterModels: apply(s.availableOpenRouterModels, v)
      }))
  }) satisfies ModelsSlice as any
