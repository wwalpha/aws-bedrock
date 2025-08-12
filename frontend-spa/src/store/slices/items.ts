import type {
  ItemsSlice,
  Chat,
  Preset,
  Assistant,
  Collection,
  FileAsset,
  Folder,
  ModelRef,
  Prompt,
  Tool,
  Workspace,
} from 'typings';
import { apply } from '../utils';

// 各種エンティティ（一覧データ）を集約管理する Slice
// 取得後のキャッシュや UI 再描画トリガー用
export const createItemsSlice = (set: any) =>
  ({
    assistants: [] as Assistant[],
    setAssistants: (v: any) => set((s: ItemsSlice) => ({ assistants: apply(s.assistants, v) })),

    collections: [] as Collection[],
    setCollections: (v: any) => set((s: ItemsSlice) => ({ collections: apply(s.collections, v) })),

    chats: [] as Chat[],
    setChats: (v: any) => set((s: ItemsSlice) => ({ chats: apply(s.chats, v) })),

    files: [] as FileAsset[],
    setFiles: (v: any) => set((s: ItemsSlice) => ({ files: apply(s.files, v) })),

    folders: [] as Folder[],
    setFolders: (v: any) => set((s: ItemsSlice) => ({ folders: apply(s.folders, v) })),

    models: [] as ModelRef[],
    setModels: (v: any) => set((s: ItemsSlice) => ({ models: apply(s.models, v) })),

    presets: [] as Preset[],
    setPresets: (v: any) => set((s: ItemsSlice) => ({ presets: apply(s.presets, v) })),

    prompts: [] as Prompt[],
    setPrompts: (v: any) => set((s: ItemsSlice) => ({ prompts: apply(s.prompts, v) })),

    tools: [] as Tool[],
    setTools: (v: any) => set((s: ItemsSlice) => ({ tools: apply(s.tools, v) })),

    workspaces: [] as Workspace[],
    setWorkspaces: (v: any) => set((s: ItemsSlice) => ({ workspaces: apply(s.workspaces, v) })),
  }) as ItemsSlice;
