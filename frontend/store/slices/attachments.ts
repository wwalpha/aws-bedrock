/**
 * AttachmentsSlice
 * - Tracks files/images attached to the chat and new message buffers.
 * - Includes a UI toggle for file display.
 */
import { Dispatch, SetStateAction } from "react"
import { ChatFile, MessageImage } from "@/types"
import { apply } from "../utils"
import type { AttachmentsSlice } from "@/typings/index"

/**
 * Factory to create the attachments slice.
 */
export const createAttachmentsSlice = (set: any) =>
  ({
    chatFiles: [],
    setChatFiles: (v: SetStateAction<ChatFile[]>) =>
      set((s: AttachmentsSlice) => ({ chatFiles: apply(s.chatFiles, v) })),
    chatImages: [],
    setChatImages: (v: SetStateAction<MessageImage[]>) =>
      set((s: AttachmentsSlice) => ({ chatImages: apply(s.chatImages, v) })),
    newMessageFiles: [],
    setNewMessageFiles: (v: SetStateAction<ChatFile[]>) =>
      set((s: AttachmentsSlice) => ({
        newMessageFiles: apply(s.newMessageFiles, v)
      })),
    newMessageImages: [],
    setNewMessageImages: (v: SetStateAction<MessageImage[]>) =>
      set((s: AttachmentsSlice) => ({
        newMessageImages: apply(s.newMessageImages, v)
      })),
    showFilesDisplay: false,
    setShowFilesDisplay: (v: SetStateAction<boolean>) =>
      set((s: AttachmentsSlice) => ({
        showFilesDisplay: apply(s.showFilesDisplay, v)
      }))
  }) satisfies AttachmentsSlice as any
