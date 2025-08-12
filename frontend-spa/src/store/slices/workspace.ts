import type { WorkspaceSlice, Workspace } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// ワークスペース（組織 / プロジェクト）選択と関連アセット
type SliceSet = (fn: (state: WorkspaceSlice) => Partial<WorkspaceSlice>) => void;

export const createWorkspaceSlice: StateCreator<WorkspaceSlice, [], [], WorkspaceSlice> = (set: SliceSet) => ({
  // 現在選択中ワークスペース
  selectedWorkspace: null as Workspace | null,
  setSelectedWorkspace: (v: SetStateAction<Workspace | null>) =>
    set((s) => ({ selectedWorkspace: apply(s.selectedWorkspace, v) })),

  // ワークスペースに紐づく画像 (ロゴなど)
  workspaceImages: [],
  setWorkspaceImages: (v: SetStateAction<any[]>) => set((s) => ({ workspaceImages: apply(s.workspaceImages, v) })),
});
