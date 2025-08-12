import type { ToolsSlice, Tool } from 'typings';
import { apply } from '../utils';

// チャットセッションで使用する外部ツール選択状態
export const createToolsSlice = (set: any) =>
  ({
    // 選択済みツール一覧
    selectedTools: [] as Tool[],
    setSelectedTools: (v: any) => set((s: ToolsSlice) => ({ selectedTools: apply(s.selectedTools, v) })),

    // 現在実行中のツール ID (空文字で未使用)
    toolInUse: '',
    setToolInUse: (v: any) => set((s: ToolsSlice) => ({ toolInUse: apply(s.toolInUse, v) })),
  }) as ToolsSlice;
