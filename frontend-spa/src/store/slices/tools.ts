import type { ToolsSlice, Tool } from 'typings';
import type { SliceSet } from 'typings/slice';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// チャットセッションで使用する外部ツール選択状態
export const createToolsSlice: StateCreator<ToolsSlice, [], [], ToolsSlice> = (set: SliceSet<ToolsSlice>) => ({
  // 選択済みツール一覧
  selectedTools: [] as Tool[],
  setSelectedTools: (v: SetStateAction<Tool[]>) => set((s) => ({ selectedTools: apply(s.selectedTools, v) })),

  // 現在実行中のツール ID (空文字で未使用)
  toolInUse: '',
  setToolInUse: (v: SetStateAction<string>) => set((s) => ({ toolInUse: apply(s.toolInUse, v) })),
});
