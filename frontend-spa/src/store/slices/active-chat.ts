import type { ActiveChatSlice } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// アクティブな生成処理 (ストリーミング中など) に関する一時状態を保持する Slice
// - abortController: 実行中リクエストを中断するための AbortController
// - firstTokenReceived: 最初のトークンを受信したか (UI のローディング表示制御)
// - isGenerating: モデル応答中フラグ
type SliceSet = (fn: (state: ActiveChatSlice) => Partial<ActiveChatSlice>) => void;

export const createActiveChatSlice: StateCreator<ActiveChatSlice, [], [], ActiveChatSlice> = (set: SliceSet) => ({
  // 現在進行中のフェッチを手動でキャンセルするためのコントローラ
  abortController: null,
  setAbortController: (v: SetStateAction<AbortController | null>) =>
    set((s) => ({ abortController: apply(s.abortController, v) })),

  // 最初のトークンを受信したかどうか
  firstTokenReceived: false,
  setFirstTokenReceived: (v: SetStateAction<boolean>) =>
    set((s) => ({ firstTokenReceived: apply(s.firstTokenReceived, v) })),

  // モデルが応答生成中か
  isGenerating: false,
  setIsGenerating: (v: SetStateAction<boolean>) => set((s) => ({ isGenerating: apply(s.isGenerating, v) })),
});
