import type { AttachmentsSlice, ChatFile, ChatImage } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// ファイル / 画像 添付に関する状態を保持
// - 既存メッセージに紐づく添付一覧 (chatFiles / chatImages)
// - 送信前の新規添付 (newMessageFiles / newMessageImages)
// - ビュー表示切替フラグ (showFilesDisplay)
export const createAttachmentsSlice: StateCreator<AttachmentsSlice, [], [], AttachmentsSlice> = (
  set: SliceSet<AttachmentsSlice>
) => ({
  // チャット全体に紐づくファイル（非画像）
  chatFiles: [] as ChatFile[],
  setChatFiles: (v: ChatFile[] | ((prev: ChatFile[]) => ChatFile[])) =>
    set((s) => ({ chatFiles: typeof v === 'function' ? (v as any)(s.chatFiles) : v })),

  // チャット全体に紐づく画像
  chatImages: [] as ChatImage[],
  setChatImages: (v: ChatImage[] | ((prev: ChatImage[]) => ChatImage[])) =>
    set((s) => ({ chatImages: typeof v === 'function' ? (v as any)(s.chatImages) : v })),

  // 送信前のドラフト中ファイル
  newMessageFiles: [] as ChatFile[],
  setNewMessageFiles: (v: ChatFile[] | ((prev: ChatFile[]) => ChatFile[])) =>
    set((s) => ({ newMessageFiles: typeof v === 'function' ? (v as any)(s.newMessageFiles) : v })),

  // 送信前のドラフト中画像
  newMessageImages: [] as ChatImage[],
  setNewMessageImages: (v: ChatImage[] | ((prev: ChatImage[]) => ChatImage[])) =>
    set((s) => ({ newMessageImages: typeof v === 'function' ? (v as any)(s.newMessageImages) : v })),

  // 添付パネル表示フラグ
  showFilesDisplay: false,
  setShowFilesDisplay: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ showFilesDisplay: typeof v === 'function' ? (v as any)(s.showFilesDisplay) : v })),
});
