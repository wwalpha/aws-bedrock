import type { ToolsSlice } from 'typings';
import { apply } from '../utils';

export const createToolsSlice = (set: any) =>
  ({
    selectedTools: [],
    setSelectedTools: (v: any) => set((s: ToolsSlice) => ({ selectedTools: apply(s.selectedTools, v) })),
    toolInUse: '',
    setToolInUse: (v: any) => set((s: ToolsSlice) => ({ toolInUse: apply(s.toolInUse, v) })),
  }) as ToolsSlice;
