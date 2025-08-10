/**
 * ChatInputSlice
 * - UI state for pickers (prompt/file/tool/assistant), slash/hashtag/at commands, and focus flags.
 */
import { Dispatch, SetStateAction } from "react"
import { apply } from "../utils"

export interface ChatInputSlice {
  isPromptPickerOpen: boolean
  setIsPromptPickerOpen: Dispatch<SetStateAction<boolean>>
  slashCommand: string
  setSlashCommand: Dispatch<SetStateAction<string>>
  isFilePickerOpen: boolean
  setIsFilePickerOpen: Dispatch<SetStateAction<boolean>>
  hashtagCommand: string
  setHashtagCommand: Dispatch<SetStateAction<string>>
  isToolPickerOpen: boolean
  setIsToolPickerOpen: Dispatch<SetStateAction<boolean>>
  toolCommand: string
  setToolCommand: Dispatch<SetStateAction<string>>
  focusPrompt: boolean
  setFocusPrompt: Dispatch<SetStateAction<boolean>>
  focusFile: boolean
  setFocusFile: Dispatch<SetStateAction<boolean>>
  focusTool: boolean
  setFocusTool: Dispatch<SetStateAction<boolean>>
  focusAssistant: boolean
  setFocusAssistant: Dispatch<SetStateAction<boolean>>
  atCommand: string
  setAtCommand: Dispatch<SetStateAction<string>>
  isAssistantPickerOpen: boolean
  setIsAssistantPickerOpen: Dispatch<SetStateAction<boolean>>
}

/**
 * Factory to create the chat-input slice.
 */
export const createChatInputSlice = (set: any) =>
  ({
    isPromptPickerOpen: false,
    setIsPromptPickerOpen: (v: SetStateAction<boolean>) =>
      set((s: ChatInputSlice) => ({
        isPromptPickerOpen: apply(s.isPromptPickerOpen, v)
      })),
    slashCommand: "",
    setSlashCommand: (v: SetStateAction<string>) =>
      set((s: ChatInputSlice) => ({ slashCommand: apply(s.slashCommand, v) })),
    isFilePickerOpen: false,
    setIsFilePickerOpen: (v: SetStateAction<boolean>) =>
      set((s: ChatInputSlice) => ({
        isFilePickerOpen: apply(s.isFilePickerOpen, v)
      })),
    hashtagCommand: "",
    setHashtagCommand: (v: SetStateAction<string>) =>
      set((s: ChatInputSlice) => ({
        hashtagCommand: apply(s.hashtagCommand, v)
      })),
    isToolPickerOpen: false,
    setIsToolPickerOpen: (v: SetStateAction<boolean>) =>
      set((s: ChatInputSlice) => ({
        isToolPickerOpen: apply(s.isToolPickerOpen, v)
      })),
    toolCommand: "",
    setToolCommand: (v: SetStateAction<string>) =>
      set((s: ChatInputSlice) => ({ toolCommand: apply(s.toolCommand, v) })),
    focusPrompt: false,
    setFocusPrompt: (v: SetStateAction<boolean>) =>
      set((s: ChatInputSlice) => ({ focusPrompt: apply(s.focusPrompt, v) })),
    focusFile: false,
    setFocusFile: (v: SetStateAction<boolean>) =>
      set((s: ChatInputSlice) => ({ focusFile: apply(s.focusFile, v) })),
    focusTool: false,
    setFocusTool: (v: SetStateAction<boolean>) =>
      set((s: ChatInputSlice) => ({ focusTool: apply(s.focusTool, v) })),
    focusAssistant: false,
    setFocusAssistant: (v: SetStateAction<boolean>) =>
      set((s: ChatInputSlice) => ({
        focusAssistant: apply(s.focusAssistant, v)
      })),
    atCommand: "",
    setAtCommand: (v: SetStateAction<string>) =>
      set((s: ChatInputSlice) => ({ atCommand: apply(s.atCommand, v) })),
    isAssistantPickerOpen: false,
    setIsAssistantPickerOpen: (v: SetStateAction<boolean>) =>
      set((s: ChatInputSlice) => ({
        isAssistantPickerOpen: apply(s.isAssistantPickerOpen, v)
      }))
  }) satisfies ChatInputSlice as any
