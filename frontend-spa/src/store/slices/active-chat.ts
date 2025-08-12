import type { ActiveChatSlice } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// アクティブな生成処理 (ストリーミング中など) に関する一時状態を保持する Slice
// - abortController: 実行中リクエストを中断するための AbortController
// - firstTokenReceived: 最初のトークンを受信したか (UI のローディング表示制御)
// - isGenerating: モデル応答中フラグ
export const createActiveChatSlice: StateCreator<ActiveChatSlice, [], [], ActiveChatSlice> = (
  set: SliceSet<ActiveChatSlice>
) => ({
  // 現在進行中のフェッチを手動でキャンセルするためのコントローラ
  abortController: null,
  setAbortController: (v: AbortController | null | ((prev: AbortController | null) => AbortController | null)) =>
    set((s) => ({ abortController: typeof v === 'function' ? (v as any)(s.abortController) : v })),

  // 最初のトークンを受信したかどうか
  firstTokenReceived: false,
  setFirstTokenReceived: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ firstTokenReceived: typeof v === 'function' ? (v as any)(s.firstTokenReceived) : v })),

  // モデルが応答生成中か
  isGenerating: false,
  setIsGenerating: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ isGenerating: typeof v === 'function' ? (v as any)(s.isGenerating) : v })),
});
