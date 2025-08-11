import type { ItemsSlice } from 'typings';
import { apply } from '../utils';

export const createItemsSlice = (set: any) =>
  ({
    assistants: [],
    setAssistants: (v: any) => set((s: ItemsSlice) => ({ assistants: apply(s.assistants, v) })),
    collections: [],
    setCollections: (v: any) => set((s: ItemsSlice) => ({ collections: apply(s.collections, v) })),
    chats: [],
    setChats: (v: any) => set((s: ItemsSlice) => ({ chats: apply(s.chats, v) })),
    files: [],
    setFiles: (v: any) => set((s: ItemsSlice) => ({ files: apply(s.files, v) })),
    folders: [],
    setFolders: (v: any) => set((s: ItemsSlice) => ({ folders: apply(s.folders, v) })),
    models: [],
    setModels: (v: any) => set((s: ItemsSlice) => ({ models: apply(s.models, v) })),
    presets: [],
    setPresets: (v: any) => set((s: ItemsSlice) => ({ presets: apply(s.presets, v) })),
    prompts: [],
    setPrompts: (v: any) => set((s: ItemsSlice) => ({ prompts: apply(s.prompts, v) })),
    tools: [],
    setTools: (v: any) => set((s: ItemsSlice) => ({ tools: apply(s.tools, v) })),
    workspaces: [],
    setWorkspaces: (v: any) => set((s: ItemsSlice) => ({ workspaces: apply(s.workspaces, v) })),
  }) as ItemsSlice;
