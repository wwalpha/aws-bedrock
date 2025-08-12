import type { RetrievalSlice } from 'typings';
import type { SliceSet } from 'typings/slice';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// RAG (Retrieval Augmented Generation) 関連のオン / オフと取得ソース件数
export const createRetrievalSlice: StateCreator<RetrievalSlice, [], [], RetrievalSlice> = (set: SliceSet<RetrievalSlice>) => ({
  // 検索拡張を利用するか
  useRetrieval: false,
  setUseRetrieval: (v: SetStateAction<boolean>) => set((s) => ({ useRetrieval: apply(s.useRetrieval, v) })),

  // 取得したソース件数（UI 表示 / デバッグ用）
  sourceCount: 0,
  setSourceCount: (v: SetStateAction<number>) => set((s) => ({ sourceCount: apply(s.sourceCount, v) })),
});
