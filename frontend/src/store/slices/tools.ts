import type { ToolsSlice, Tool } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// チャットセッションで使用する外部ツール選択状態
export const createToolsSlice: StateCreator<ToolsSlice, [], [], ToolsSlice> = (set: SliceSet<ToolsSlice>) => ({
  // 選択済みツール一覧
  selectedTools: [] as Tool[],
  setSelectedTools: (v: Tool[] | ((prev: Tool[]) => Tool[])) =>
    set((s) => ({ selectedTools: typeof v === 'function' ? (v as any)(s.selectedTools) : v })),

  // 現在実行中のツール ID (空文字で未使用)
  toolInUse: '',
  setToolInUse: (v: string | ((prev: string) => string)) =>
    set((s) => ({ toolInUse: typeof v === 'function' ? (v as any)(s.toolInUse) : v })),
});
