import type { ActiveChatSlice } from 'typings';
import { apply } from '../utils';

// アクティブな生成処理 (ストリーミング中など) に関する一時状態を保持する Slice
// - abortController: 実行中リクエストを中断するための AbortController
// - firstTokenReceived: 最初のトークンを受信したか (UI のローディング表示制御)
// - isGenerating: モデル応答中フラグ
export const createActiveChatSlice = (set: any) =>
  ({
    // 現在進行中のフェッチを手動でキャンセルするためのコントローラ
    abortController: null,
    setAbortController: (v: any) => set((s: ActiveChatSlice) => ({ abortController: apply(s.abortController, v) })),

    // 最初のトークンを受信したかどうか
    firstTokenReceived: false,
    setFirstTokenReceived: (v: any) =>
      set((s: ActiveChatSlice) => ({ firstTokenReceived: apply(s.firstTokenReceived, v) })),

    // モデルが応答生成中か
    isGenerating: false,
    setIsGenerating: (v: any) => set((s: ActiveChatSlice) => ({ isGenerating: apply(s.isGenerating, v) })),
  }) as ActiveChatSlice;
