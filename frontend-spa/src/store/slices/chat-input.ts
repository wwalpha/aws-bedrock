import type { ChatInputSlice } from 'typings';
import { apply } from '../utils';

// チャット入力欄の補助 UI 状態や入力中コマンド解析用の値を保持
export const createChatInputSlice = (set: any) =>
  ({
    // プロンプトテンプレートピッカー表示フラグ
    isPromptPickerOpen: false,
    setIsPromptPickerOpen: (v: any) =>
      set((s: ChatInputSlice) => ({ isPromptPickerOpen: apply(s.isPromptPickerOpen, v) })),

    // 直近で入力されたスラッシュコマンド文字列 (/imagine など)
    slashCommand: '',
    setSlashCommand: (v: any) => set((s: ChatInputSlice) => ({ slashCommand: apply(s.slashCommand, v) })),

    // ファイルピッカー表示フラグ
    isFilePickerOpen: false,
    setIsFilePickerOpen: (v: any) => set((s: ChatInputSlice) => ({ isFilePickerOpen: apply(s.isFilePickerOpen, v) })),

    // ハッシュタグ ( #datasource など ) 入力検出用
    hashtagCommand: '',
    setHashtagCommand: (v: any) => set((s: ChatInputSlice) => ({ hashtagCommand: apply(s.hashtagCommand, v) })),

    // ツールピッカー表示フラグ
    isToolPickerOpen: false,
    setIsToolPickerOpen: (v: any) => set((s: ChatInputSlice) => ({ isToolPickerOpen: apply(s.isToolPickerOpen, v) })),

    // 現在入力中のツールコマンド文字列
    toolCommand: '',
    setToolCommand: (v: any) => set((s: ChatInputSlice) => ({ toolCommand: apply(s.toolCommand, v) })),

    // 以下 focus* 系は UI の自動フォーカス制御トリガー
    focusPrompt: false,
    setFocusPrompt: (v: any) => set((s: ChatInputSlice) => ({ focusPrompt: apply(s.focusPrompt, v) })),
    focusFile: false,
    setFocusFile: (v: any) => set((s: ChatInputSlice) => ({ focusFile: apply(s.focusFile, v) })),
    focusTool: false,
    setFocusTool: (v: any) => set((s: ChatInputSlice) => ({ focusTool: apply(s.focusTool, v) })),
    focusAssistant: false,
    setFocusAssistant: (v: any) => set((s: ChatInputSlice) => ({ focusAssistant: apply(s.focusAssistant, v) })),

    // メンション (@assistant など) 入力検出用
    atCommand: '',
    setAtCommand: (v: any) => set((s: ChatInputSlice) => ({ atCommand: apply(s.atCommand, v) })),

    // アシスタントピッカー表示フラグ
    isAssistantPickerOpen: false,
    setIsAssistantPickerOpen: (v: any) =>
      set((s: ChatInputSlice) => ({ isAssistantPickerOpen: apply(s.isAssistantPickerOpen, v) })),
  }) as ChatInputSlice;
