import type { ChatInputSlice } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// チャット入力欄の補助 UI 状態や入力中コマンド解析用の値を保持
type SliceSet = (fn: (state: ChatInputSlice) => Partial<ChatInputSlice>) => void;

export const createChatInputSlice: StateCreator<ChatInputSlice, [], [], ChatInputSlice> = (set: SliceSet) => ({
  // プロンプトテンプレートピッカー表示フラグ
  isPromptPickerOpen: false,
  setIsPromptPickerOpen: (v: SetStateAction<boolean>) =>
    set((s) => ({ isPromptPickerOpen: apply(s.isPromptPickerOpen, v) })),

  // 直近で入力されたスラッシュコマンド文字列 (/imagine など)
  slashCommand: '',
  setSlashCommand: (v: SetStateAction<string>) => set((s) => ({ slashCommand: apply(s.slashCommand, v) })),

  // ファイルピッカー表示フラグ
  isFilePickerOpen: false,
  setIsFilePickerOpen: (v: SetStateAction<boolean>) => set((s) => ({ isFilePickerOpen: apply(s.isFilePickerOpen, v) })),

  // ハッシュタグ ( #datasource など ) 入力検出用
  hashtagCommand: '',
  setHashtagCommand: (v: SetStateAction<string>) => set((s) => ({ hashtagCommand: apply(s.hashtagCommand, v) })),

  // ツールピッカー表示フラグ
  isToolPickerOpen: false,
  setIsToolPickerOpen: (v: SetStateAction<boolean>) => set((s) => ({ isToolPickerOpen: apply(s.isToolPickerOpen, v) })),

  // 現在入力中のツールコマンド文字列
  toolCommand: '',
  setToolCommand: (v: SetStateAction<string>) => set((s) => ({ toolCommand: apply(s.toolCommand, v) })),

  // 以下 focus* 系は UI の自動フォーカス制御トリガー
  focusPrompt: false,
  setFocusPrompt: (v: SetStateAction<boolean>) => set((s) => ({ focusPrompt: apply(s.focusPrompt, v) })),
  focusFile: false,
  setFocusFile: (v: SetStateAction<boolean>) => set((s) => ({ focusFile: apply(s.focusFile, v) })),
  focusTool: false,
  setFocusTool: (v: SetStateAction<boolean>) => set((s) => ({ focusTool: apply(s.focusTool, v) })),
  focusAssistant: false,
  setFocusAssistant: (v: SetStateAction<boolean>) => set((s) => ({ focusAssistant: apply(s.focusAssistant, v) })),

  // メンション (@assistant など) 入力検出用
  atCommand: '',
  setAtCommand: (v: SetStateAction<string>) => set((s) => ({ atCommand: apply(s.atCommand, v) })),

  // アシスタントピッカー表示フラグ
  isAssistantPickerOpen: false,
  setIsAssistantPickerOpen: (v: SetStateAction<boolean>) =>
    set((s) => ({ isAssistantPickerOpen: apply(s.isAssistantPickerOpen, v) })),
});
