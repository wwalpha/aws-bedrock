import type { RetrievalSlice } from 'typings';
import { apply } from '../utils';

export const createRetrievalSlice = (set: any) =>
  ({
    useRetrieval: false,
    setUseRetrieval: (v: any) => set((s: RetrievalSlice) => ({ useRetrieval: apply(s.useRetrieval, v) })),
    sourceCount: 0,
    setSourceCount: (v: any) => set((s: RetrievalSlice) => ({ sourceCount: apply(s.sourceCount, v) })),
  }) as RetrievalSlice;
