import type {
  ItemsSlice,
  Conversation,
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
import type { StateCreator } from 'zustand';

// 各種エンティティ（一覧データ）を集約管理する Slice
// 取得後のキャッシュや UI 再描画トリガー用
export const createItemsSlice: StateCreator<ItemsSlice, [], [], ItemsSlice> = (set: SliceSet<ItemsSlice>) => ({
  assistants: [] as Assistant[],
  setAssistants: (v: Assistant[] | ((prev: Assistant[]) => Assistant[])) =>
    set((s) => ({ assistants: typeof v === 'function' ? (v as any)(s.assistants) : v })),

  collections: [] as Collection[],
  setCollections: (v: Collection[] | ((prev: Collection[]) => Collection[])) =>
    set((s) => ({ collections: typeof v === 'function' ? (v as any)(s.collections) : v })),

  chats: [] as Conversation[],
  setChats: (v: Conversation[] | ((prev: Conversation[]) => Conversation[])) =>
    set((s) => ({ chats: typeof v === 'function' ? (v as any)(s.chats) : v })),

  files: [] as FileAsset[],
  setFiles: (v: FileAsset[] | ((prev: FileAsset[]) => FileAsset[])) =>
    set((s) => ({ files: typeof v === 'function' ? (v as any)(s.files) : v })),

  folders: [] as Folder[],
  setFolders: (v: Folder[] | ((prev: Folder[]) => Folder[])) =>
    set((s) => ({ folders: typeof v === 'function' ? (v as any)(s.folders) : v })),

  models: [] as ModelRef[],
  setModels: (v: ModelRef[] | ((prev: ModelRef[]) => ModelRef[])) =>
    set((s) => ({ models: typeof v === 'function' ? (v as any)(s.models) : v })),

  presets: [] as Preset[],
  setPresets: (v: Preset[] | ((prev: Preset[]) => Preset[])) =>
    set((s) => ({ presets: typeof v === 'function' ? (v as any)(s.presets) : v })),

  prompts: [] as Prompt[],
  setPrompts: (v: Prompt[] | ((prev: Prompt[]) => Prompt[])) =>
    set((s) => ({ prompts: typeof v === 'function' ? (v as any)(s.prompts) : v })),

  tools: [] as Tool[],
  setTools: (v: Tool[] | ((prev: Tool[]) => Tool[])) =>
    set((s) => ({ tools: typeof v === 'function' ? (v as any)(s.tools) : v })),

  workspaces: [] as Workspace[],
  setWorkspaces: (v: Workspace[] | ((prev: Workspace[]) => Workspace[])) =>
    set((s) => ({ workspaces: typeof v === 'function' ? (v as any)(s.workspaces) : v })),
});
