import type { AttachmentsSlice, ChatFile, ChatImage } from 'typings';
import { apply } from '../utils';

export const createAttachmentsSlice = (set: any) =>
  ({
    chatFiles: [] as ChatFile[],
    setChatFiles: (v: any) => set((s: AttachmentsSlice) => ({ chatFiles: apply(s.chatFiles, v) })),
    chatImages: [] as ChatImage[],
    setChatImages: (v: any) => set((s: AttachmentsSlice) => ({ chatImages: apply(s.chatImages, v) })),
    newMessageFiles: [] as ChatFile[],
    setNewMessageFiles: (v: any) => set((s: AttachmentsSlice) => ({ newMessageFiles: apply(s.newMessageFiles, v) })),
    newMessageImages: [] as ChatImage[],
    setNewMessageImages: (v: any) => set((s: AttachmentsSlice) => ({ newMessageImages: apply(s.newMessageImages, v) })),
    showFilesDisplay: false,
    setShowFilesDisplay: (v: any) => set((s: AttachmentsSlice) => ({ showFilesDisplay: apply(s.showFilesDisplay, v) })),
  }) as AttachmentsSlice;
