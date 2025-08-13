/**
 * ActiveChatSlice
 * - Streaming chat state: AbortController, first-token flag, and generation flag.
 * - Useful for controlling in-flight requests and UI spinners.
 */
import { Dispatch, SetStateAction } from "react"
import { apply } from "../utils"
import type { ActiveChatSlice } from "@/typings/index"

/**
 * Factory to create the active chat slice.
 */
export const createActiveChatSlice = (set: any) =>
  ({
    abortController: null,
    setAbortController: (v: SetStateAction<AbortController | null>) =>
      set((s: ActiveChatSlice) => ({
        abortController: apply(s.abortController, v)
      })),
    firstTokenReceived: false,
    setFirstTokenReceived: (v: SetStateAction<boolean>) =>
      set((s: ActiveChatSlice) => ({
        firstTokenReceived: apply(s.firstTokenReceived, v)
      })),
    isGenerating: false,
    setIsGenerating: (v: SetStateAction<boolean>) =>
      set((s: ActiveChatSlice) => ({ isGenerating: apply(s.isGenerating, v) }))
  }) satisfies ActiveChatSlice as any
