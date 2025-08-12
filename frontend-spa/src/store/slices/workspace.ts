import type { WorkspaceSlice, Workspace } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// ワークスペース（組織 / プロジェクト）選択と関連アセット
export const createWorkspaceSlice: StateCreator<WorkspaceSlice, [], [], WorkspaceSlice> = (
  set: SliceSet<WorkspaceSlice>
) => ({
  // 現在選択中ワークスペース
  selectedWorkspace: null as Workspace | null,
  setSelectedWorkspace: (v: Workspace | null | ((prev: Workspace | null) => Workspace | null)) =>
    set((s) => ({ selectedWorkspace: typeof v === 'function' ? (v as any)(s.selectedWorkspace) : v })),

  // ワークスペースに紐づく画像 (ロゴなど)
  workspaceImages: [],
  setWorkspaceImages: (v: any[] | ((prev: any[]) => any[])) =>
    set((s) => ({ workspaceImages: typeof v === 'function' ? (v as any)(s.workspaceImages) : v })),
});
