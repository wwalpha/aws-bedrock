/**
 * ToolsSlice
 * - Manages selected tools and the current tool-in-use status for chat.
 */
import { Dispatch, SetStateAction } from "react"
import { Tables } from "@/types/db"
import { apply } from "../utils"
import type { ToolsSlice } from "@/typings/slices.types"

/**
 * Factory to create the tools slice.
 */
export const createToolsSlice = (set: any) =>
  ({
    selectedTools: [],
    setSelectedTools: (v: SetStateAction<Tables<"tools">[]>) =>
      set((s: ToolsSlice) => ({ selectedTools: apply(s.selectedTools, v) })),
    toolInUse: "none",
    setToolInUse: (v: SetStateAction<string>) =>
      set((s: ToolsSlice) => ({ toolInUse: apply(s.toolInUse, v) }))
  }) satisfies ToolsSlice as any
