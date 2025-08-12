import type { ToolsSlice, Tool } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// チャットセッションで使用する外部ツール選択状態
type SliceSet = (fn: (state: ToolsSlice) => Partial<ToolsSlice>) => void;

export const createToolsSlice: StateCreator<ToolsSlice, [], [], ToolsSlice> = (set: SliceSet) => ({
  // 選択済みツール一覧
  selectedTools: [] as Tool[],
  setSelectedTools: (v: SetStateAction<Tool[]>) => set((s) => ({ selectedTools: apply(s.selectedTools, v) })),

  // 現在実行中のツール ID (空文字で未使用)
  toolInUse: '',
  setToolInUse: (v: SetStateAction<string>) => set((s) => ({ toolInUse: apply(s.toolInUse, v) })),
});
