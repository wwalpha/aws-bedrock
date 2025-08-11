import type { AttachmentsSlice } from 'typings';
import { apply } from '../utils';

export const createAttachmentsSlice = (set: any) =>
  ({
    chatFiles: [],
    setChatFiles: (v: any) => set((s: AttachmentsSlice) => ({ chatFiles: apply(s.chatFiles, v) })),
    chatImages: [],
    setChatImages: (v: any) => set((s: AttachmentsSlice) => ({ chatImages: apply(s.chatImages, v) })),
    newMessageFiles: [],
    setNewMessageFiles: (v: any) => set((s: AttachmentsSlice) => ({ newMessageFiles: apply(s.newMessageFiles, v) })),
    newMessageImages: [],
    setNewMessageImages: (v: any) => set((s: AttachmentsSlice) => ({ newMessageImages: apply(s.newMessageImages, v) })),
    showFilesDisplay: false,
    setShowFilesDisplay: (v: any) => set((s: AttachmentsSlice) => ({ showFilesDisplay: apply(s.showFilesDisplay, v) })),
  }) as AttachmentsSlice;
