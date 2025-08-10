import { Dispatch, SetStateAction } from "react"
import { ChatFile, MessageImage } from "@/types"
import { apply } from "../utils"

export interface AttachmentsSlice {
  chatFiles: ChatFile[]
  setChatFiles: Dispatch<SetStateAction<ChatFile[]>>
  chatImages: MessageImage[]
  setChatImages: Dispatch<SetStateAction<MessageImage[]>>
  newMessageFiles: ChatFile[]
  setNewMessageFiles: Dispatch<SetStateAction<ChatFile[]>>
  newMessageImages: MessageImage[]
  setNewMessageImages: Dispatch<SetStateAction<MessageImage[]>>
  showFilesDisplay: boolean
  setShowFilesDisplay: Dispatch<SetStateAction<boolean>>
}

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
