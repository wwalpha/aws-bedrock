import type { RetrievalSlice } from 'typings';
import { apply } from '../utils';

// RAG (Retrieval Augmented Generation) 関連のオン / オフと取得ソース件数
export const createRetrievalSlice = (set: any) =>
  ({
    // 検索拡張を利用するか
    useRetrieval: false,
    setUseRetrieval: (v: any) => set((s: RetrievalSlice) => ({ useRetrieval: apply(s.useRetrieval, v) })),

    // 取得したソース件数（UI 表示 / デバッグ用）
    sourceCount: 0,
    setSourceCount: (v: any) => set((s: RetrievalSlice) => ({ sourceCount: apply(s.sourceCount, v) })),
  }) as RetrievalSlice;
