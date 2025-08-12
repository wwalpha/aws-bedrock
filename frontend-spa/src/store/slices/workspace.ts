import type { WorkspaceSlice, Workspace } from 'typings';
import { apply } from '../utils';

// ワークスペース（組織 / プロジェクト）選択と関連アセット
export const createWorkspaceSlice = (set: any) =>
  ({
    // 現在選択中ワークスペース
    selectedWorkspace: null as Workspace | null,
    setSelectedWorkspace: (v: any) =>
      set((s: WorkspaceSlice) => ({ selectedWorkspace: apply(s.selectedWorkspace, v) })),

    // ワークスペースに紐づく画像 (ロゴなど)
    workspaceImages: [],
    setWorkspaceImages: (v: any) => set((s: WorkspaceSlice) => ({ workspaceImages: apply(s.workspaceImages, v) })),
  }) as WorkspaceSlice;
