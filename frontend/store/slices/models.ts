/**
 * ModelsSlice
 * - envKeyMap indicates which providers are backed by environment keys on the server.
 * - available*Models arrays power pickers for hosted/local/OpenRouter catalogs.
 * - Setters accept values or updater functions via `apply`.
 */
import { Dispatch, SetStateAction } from "react"
import { LLM, OpenRouterLLM } from "@/types"
import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { apply } from "../utils"
import type { ModelsSlice } from "@/typings/index"

/**
 * Factory to create the models slice.
 */
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
