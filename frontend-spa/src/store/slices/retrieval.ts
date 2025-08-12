import type { RetrievalSlice } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// RAG (Retrieval Augmented Generation) 関連のオン / オフと取得ソース件数
export const createRetrievalSlice: StateCreator<RetrievalSlice, [], [], RetrievalSlice> = (
  set: SliceSet<RetrievalSlice>
) => ({
  // 検索拡張を利用するか
  useRetrieval: false,
  setUseRetrieval: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ useRetrieval: typeof v === 'function' ? (v as any)(s.useRetrieval) : v })),

  // 取得したソース件数（UI 表示 / デバッグ用）
  sourceCount: 0,
  setSourceCount: (v: number | ((prev: number) => number)) =>
    set((s) => ({ sourceCount: typeof v === 'function' ? (v as any)(s.sourceCount) : v })),
});
