import type { AttachmentsSlice, ChatFile, ChatImage } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// ファイル / 画像 添付に関する状態を保持
// - 既存メッセージに紐づく添付一覧 (chatFiles / chatImages)
// - 送信前の新規添付 (newMessageFiles / newMessageImages)
// - ビュー表示切替フラグ (showFilesDisplay)
type SliceSet = (fn: (state: AttachmentsSlice) => Partial<AttachmentsSlice>) => void;

export const createAttachmentsSlice: StateCreator<AttachmentsSlice, [], [], AttachmentsSlice> = (set: SliceSet) => ({
  // チャット全体に紐づくファイル（非画像）
  chatFiles: [] as ChatFile[],
  setChatFiles: (v: SetStateAction<ChatFile[]>) => set((s) => ({ chatFiles: apply(s.chatFiles, v) })),

  // チャット全体に紐づく画像
  chatImages: [] as ChatImage[],
  setChatImages: (v: SetStateAction<ChatImage[]>) => set((s) => ({ chatImages: apply(s.chatImages, v) })),

  // 送信前のドラフト中ファイル
  newMessageFiles: [] as ChatFile[],
  setNewMessageFiles: (v: SetStateAction<ChatFile[]>) => set((s) => ({ newMessageFiles: apply(s.newMessageFiles, v) })),

  // 送信前のドラフト中画像
  newMessageImages: [] as ChatImage[],
  setNewMessageImages: (v: SetStateAction<ChatImage[]>) =>
    set((s) => ({ newMessageImages: apply(s.newMessageImages, v) })),

  // 添付パネル表示フラグ
  showFilesDisplay: false,
  setShowFilesDisplay: (v: SetStateAction<boolean>) => set((s) => ({ showFilesDisplay: apply(s.showFilesDisplay, v) })),
});
