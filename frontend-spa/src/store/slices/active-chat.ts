import type { ActiveChatSlice } from 'typings';
import { apply } from '../utils';

export const createActiveChatSlice = (set: any) =>
  ({
    abortController: null,
    setAbortController: (v: any) => set((s: ActiveChatSlice) => ({ abortController: apply(s.abortController, v) })),
    firstTokenReceived: false,
    setFirstTokenReceived: (v: any) =>
      set((s: ActiveChatSlice) => ({ firstTokenReceived: apply(s.firstTokenReceived, v) })),
    isGenerating: false,
    setIsGenerating: (v: any) => set((s: ActiveChatSlice) => ({ isGenerating: apply(s.isGenerating, v) })),
  }) as ActiveChatSlice;
