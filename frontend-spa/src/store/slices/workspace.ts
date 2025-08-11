import type { WorkspaceSlice } from 'typings';
import { apply } from '../utils';

export const createWorkspaceSlice = (set: any) =>
  ({
    selectedWorkspace: null,
    setSelectedWorkspace: (v: any) =>
      set((s: WorkspaceSlice) => ({ selectedWorkspace: apply(s.selectedWorkspace, v) })),
    workspaceImages: [],
    setWorkspaceImages: (v: any) => set((s: WorkspaceSlice) => ({ workspaceImages: apply(s.workspaceImages, v) })),
  }) as WorkspaceSlice;
