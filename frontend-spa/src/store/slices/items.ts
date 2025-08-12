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
import type { SliceSet } from 'typings/slice';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// 各種エンティティ（一覧データ）を集約管理する Slice
// 取得後のキャッシュや UI 再描画トリガー用
export const createItemsSlice: StateCreator<ItemsSlice, [], [], ItemsSlice> = (set: SliceSet<ItemsSlice>) => ({
  assistants: [] as Assistant[],
  setAssistants: (v: SetStateAction<Assistant[]>) => set((s) => ({ assistants: apply(s.assistants, v) })),

  collections: [] as Collection[],
  setCollections: (v: SetStateAction<Collection[]>) => set((s) => ({ collections: apply(s.collections, v) })),

  chats: [] as Chat[],
  setChats: (v: SetStateAction<Chat[]>) => set((s) => ({ chats: apply(s.chats, v) })),

  files: [] as FileAsset[],
  setFiles: (v: SetStateAction<FileAsset[]>) => set((s) => ({ files: apply(s.files, v) })),

  folders: [] as Folder[],
  setFolders: (v: SetStateAction<Folder[]>) => set((s) => ({ folders: apply(s.folders, v) })),

  models: [] as ModelRef[],
  setModels: (v: SetStateAction<ModelRef[]>) => set((s) => ({ models: apply(s.models, v) })),

  presets: [] as Preset[],
  setPresets: (v: SetStateAction<Preset[]>) => set((s) => ({ presets: apply(s.presets, v) })),

  prompts: [] as Prompt[],
  setPrompts: (v: SetStateAction<Prompt[]>) => set((s) => ({ prompts: apply(s.prompts, v) })),

  tools: [] as Tool[],
  setTools: (v: SetStateAction<Tool[]>) => set((s) => ({ tools: apply(s.tools, v) })),

  workspaces: [] as Workspace[],
  setWorkspaces: (v: SetStateAction<Workspace[]>) => set((s) => ({ workspaces: apply(s.workspaces, v) })),
});
