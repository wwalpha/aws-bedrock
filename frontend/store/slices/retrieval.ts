/**
 * RetrievalSlice
 * - Feature flags and parameters for RAG retrieval (toggle + number of sources).
 */
import { Dispatch, SetStateAction } from "react"
import { apply } from "../utils"
import type { RetrievalSlice } from "@/typings/slices.types"

/**
 * Factory to create the retrieval slice.
 */
export const createRetrievalSlice = (set: any) =>
  ({
    useRetrieval: true,
    setUseRetrieval: (v: SetStateAction<boolean>) =>
      set((s: RetrievalSlice) => ({ useRetrieval: apply(s.useRetrieval, v) })),
    sourceCount: 4,
    setSourceCount: (v: SetStateAction<number>) =>
      set((s: RetrievalSlice) => ({ sourceCount: apply(s.sourceCount, v) }))
  }) satisfies RetrievalSlice as any
