/**
 * ItemsSlice
 * - Aggregates lists of primary entities used throughout the app (assistants, chats, files, etc.).
 * - Each setter supports React.SetStateAction via `apply`, enabling functional updates.
 */
import { Dispatch, SetStateAction } from "react"
import { Tables } from "@/types/db"
import { apply } from "../utils"

export interface ItemsSlice {
  // Assistants
  assistants: Tables<"assistants">[]
  setAssistants: Dispatch<SetStateAction<Tables<"assistants">[]>>
  // Collections
  collections: Tables<"collections">[]
  setCollections: Dispatch<SetStateAction<Tables<"collections">[]>>
  // Chats
  chats: Tables<"chats">[]
  setChats: Dispatch<SetStateAction<Tables<"chats">[]>>
  // Files and folders
  files: Tables<"files">[]
  setFiles: Dispatch<SetStateAction<Tables<"files">[]>>
  folders: Tables<"folders">[]
  setFolders: Dispatch<SetStateAction<Tables<"folders">[]>>
  // Models/presets/prompts/tools
  models: Tables<"models">[]
  setModels: Dispatch<SetStateAction<Tables<"models">[]>>
  presets: Tables<"presets">[]
  setPresets: Dispatch<SetStateAction<Tables<"presets">[]>>
  prompts: Tables<"prompts">[]
  setPrompts: Dispatch<SetStateAction<Tables<"prompts">[]>>
  tools: Tables<"tools">[]
  setTools: Dispatch<SetStateAction<Tables<"tools">[]>>
  // Workspaces
  workspaces: Tables<"workspaces">[]
  setWorkspaces: Dispatch<SetStateAction<Tables<"workspaces">[]>>
}

/**
 * Factory to create the items slice.
 */
export const createItemsSlice = (set: any) =>
  ({
    assistants: [],
    setAssistants: (v: SetStateAction<Tables<"assistants">[]>) =>
      set((s: ItemsSlice) => ({ assistants: apply(s.assistants, v) })),
    collections: [],
    setCollections: (v: SetStateAction<Tables<"collections">[]>) =>
      set((s: ItemsSlice) => ({ collections: apply(s.collections, v) })),
    chats: [],
    setChats: (v: SetStateAction<Tables<"chats">[]>) =>
      set((s: ItemsSlice) => ({ chats: apply(s.chats, v) })),
    files: [],
    setFiles: (v: SetStateAction<Tables<"files">[]>) =>
      set((s: ItemsSlice) => ({ files: apply(s.files, v) })),
    folders: [],
    setFolders: (v: SetStateAction<Tables<"folders">[]>) =>
      set((s: ItemsSlice) => ({ folders: apply(s.folders, v) })),
    models: [],
    setModels: (v: SetStateAction<Tables<"models">[]>) =>
      set((s: ItemsSlice) => ({ models: apply(s.models, v) })),
    presets: [],
    setPresets: (v: SetStateAction<Tables<"presets">[]>) =>
      set((s: ItemsSlice) => ({ presets: apply(s.presets, v) })),
    prompts: [],
    setPrompts: (v: SetStateAction<Tables<"prompts">[]>) =>
      set((s: ItemsSlice) => ({ prompts: apply(s.prompts, v) })),
    tools: [],
    setTools: (v: SetStateAction<Tables<"tools">[]>) =>
      set((s: ItemsSlice) => ({ tools: apply(s.tools, v) })),
    workspaces: [],
    setWorkspaces: (v: SetStateAction<Tables<"workspaces">[]>) =>
      set((s: ItemsSlice) => ({ workspaces: apply(s.workspaces, v) }))
  }) satisfies ItemsSlice as any
