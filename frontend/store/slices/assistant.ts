/**
 * AssistantSlice
 * - Manages the currently selected assistant, cached images, and remote OpenAI Assistants list.
 * - Setters leverage `apply` for value or functional updates.
 */
import { Dispatch, SetStateAction } from "react"
import { Tables } from "@/types/db"
import { AssistantImage } from "@/types/images/assistant-image"
import type { AssistantSlice } from "@/typings/index"
import { apply } from "../utils"

// types moved to typings/slices.types.d.ts

/**
 * Factory to create the assistant slice.
 */
export const createAssistantSlice = (set: any) =>
  ({
    selectedAssistant: null,
    setSelectedAssistant: (v: SetStateAction<Tables<"assistants"> | null>) =>
      set((s: AssistantSlice) => ({
        selectedAssistant: apply(s.selectedAssistant, v)
      })),
    assistantImages: [],
    setAssistantImages: (v: SetStateAction<AssistantImage[]>) =>
      set((s: AssistantSlice) => ({
        assistantImages: apply(s.assistantImages, v)
      })),
    openaiAssistants: [],
    setOpenaiAssistants: (v: SetStateAction<any[]>) =>
      set((s: AssistantSlice) => ({
        openaiAssistants: apply(s.openaiAssistants, v)
      }))
  }) satisfies AssistantSlice as any
