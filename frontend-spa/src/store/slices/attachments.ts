import type { AttachmentsSlice, ChatFile, ChatImage } from 'typings';
import { apply } from '../utils';

// ファイル / 画像 添付に関する状態を保持
// - 既存メッセージに紐づく添付一覧 (chatFiles / chatImages)
// - 送信前の新規添付 (newMessageFiles / newMessageImages)
// - ビュー表示切替フラグ (showFilesDisplay)
export const createAttachmentsSlice = (set: any) =>
  ({
    // チャット全体に紐づくファイル（非画像）
    chatFiles: [] as ChatFile[],
    setChatFiles: (v: any) => set((s: AttachmentsSlice) => ({ chatFiles: apply(s.chatFiles, v) })),

    // チャット全体に紐づく画像
    chatImages: [] as ChatImage[],
    setChatImages: (v: any) => set((s: AttachmentsSlice) => ({ chatImages: apply(s.chatImages, v) })),

    // 送信前のドラフト中ファイル
    newMessageFiles: [] as ChatFile[],
    setNewMessageFiles: (v: any) => set((s: AttachmentsSlice) => ({ newMessageFiles: apply(s.newMessageFiles, v) })),

    // 送信前のドラフト中画像
    newMessageImages: [] as ChatImage[],
    setNewMessageImages: (v: any) => set((s: AttachmentsSlice) => ({ newMessageImages: apply(s.newMessageImages, v) })),

    // 添付パネル表示フラグ
    showFilesDisplay: false,
    setShowFilesDisplay: (v: any) => set((s: AttachmentsSlice) => ({ showFilesDisplay: apply(s.showFilesDisplay, v) })),
  }) as AttachmentsSlice;
