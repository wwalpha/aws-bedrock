import type { ChatInputSlice } from 'typings';
import { apply } from '../utils';

export const createChatInputSlice = (set: any) =>
  ({
    isPromptPickerOpen: false,
    setIsPromptPickerOpen: (v: any) =>
      set((s: ChatInputSlice) => ({ isPromptPickerOpen: apply(s.isPromptPickerOpen, v) })),
    slashCommand: '',
    setSlashCommand: (v: any) => set((s: ChatInputSlice) => ({ slashCommand: apply(s.slashCommand, v) })),
    isFilePickerOpen: false,
    setIsFilePickerOpen: (v: any) => set((s: ChatInputSlice) => ({ isFilePickerOpen: apply(s.isFilePickerOpen, v) })),
    hashtagCommand: '',
    setHashtagCommand: (v: any) => set((s: ChatInputSlice) => ({ hashtagCommand: apply(s.hashtagCommand, v) })),
    isToolPickerOpen: false,
    setIsToolPickerOpen: (v: any) => set((s: ChatInputSlice) => ({ isToolPickerOpen: apply(s.isToolPickerOpen, v) })),
    toolCommand: '',
    setToolCommand: (v: any) => set((s: ChatInputSlice) => ({ toolCommand: apply(s.toolCommand, v) })),
    focusPrompt: false,
    setFocusPrompt: (v: any) => set((s: ChatInputSlice) => ({ focusPrompt: apply(s.focusPrompt, v) })),
    focusFile: false,
    setFocusFile: (v: any) => set((s: ChatInputSlice) => ({ focusFile: apply(s.focusFile, v) })),
    focusTool: false,
    setFocusTool: (v: any) => set((s: ChatInputSlice) => ({ focusTool: apply(s.focusTool, v) })),
    focusAssistant: false,
    setFocusAssistant: (v: any) => set((s: ChatInputSlice) => ({ focusAssistant: apply(s.focusAssistant, v) })),
    atCommand: '',
    setAtCommand: (v: any) => set((s: ChatInputSlice) => ({ atCommand: apply(s.atCommand, v) })),
    isAssistantPickerOpen: false,
    setIsAssistantPickerOpen: (v: any) =>
      set((s: ChatInputSlice) => ({ isAssistantPickerOpen: apply(s.isAssistantPickerOpen, v) })),
  }) as ChatInputSlice;
