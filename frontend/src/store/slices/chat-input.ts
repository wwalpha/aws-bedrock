import type { ChatInputSlice } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// チャット入力欄の補助 UI 状態や入力中コマンド解析用の値を保持
export const createChatInputSlice: StateCreator<ChatInputSlice, [], [], ChatInputSlice> = (
  set: SliceSet<ChatInputSlice>
) => ({
  // プロンプトテンプレートピッカー表示フラグ
  isPromptPickerOpen: false,
  setIsPromptPickerOpen: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ isPromptPickerOpen: typeof v === 'function' ? (v as any)(s.isPromptPickerOpen) : v })),

  // 直近で入力されたスラッシュコマンド文字列 (/imagine など)
  slashCommand: '',
  setSlashCommand: (v: string | ((prev: string) => string)) =>
    set((s) => ({ slashCommand: typeof v === 'function' ? (v as any)(s.slashCommand) : v })),

  // ファイルピッカー表示フラグ
  isFilePickerOpen: false,
  setIsFilePickerOpen: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ isFilePickerOpen: typeof v === 'function' ? (v as any)(s.isFilePickerOpen) : v })),

  // ハッシュタグ ( #datasource など ) 入力検出用
  hashtagCommand: '',
  setHashtagCommand: (v: string | ((prev: string) => string)) =>
    set((s) => ({ hashtagCommand: typeof v === 'function' ? (v as any)(s.hashtagCommand) : v })),

  // ツールピッカー表示フラグ
  isToolPickerOpen: false,
  setIsToolPickerOpen: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ isToolPickerOpen: typeof v === 'function' ? (v as any)(s.isToolPickerOpen) : v })),

  // 現在入力中のツールコマンド文字列
  toolCommand: '',
  setToolCommand: (v: string | ((prev: string) => string)) =>
    set((s) => ({ toolCommand: typeof v === 'function' ? (v as any)(s.toolCommand) : v })),

  // 以下 focus* 系は UI の自動フォーカス制御トリガー
  focusPrompt: false,
  setFocusPrompt: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ focusPrompt: typeof v === 'function' ? (v as any)(s.focusPrompt) : v })),
  focusFile: false,
  setFocusFile: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ focusFile: typeof v === 'function' ? (v as any)(s.focusFile) : v })),
  focusTool: false,
  setFocusTool: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ focusTool: typeof v === 'function' ? (v as any)(s.focusTool) : v })),
  focusAssistant: false,
  setFocusAssistant: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ focusAssistant: typeof v === 'function' ? (v as any)(s.focusAssistant) : v })),

  // メンション (@assistant など) 入力検出用
  atCommand: '',
  setAtCommand: (v: string | ((prev: string) => string)) =>
    set((s) => ({ atCommand: typeof v === 'function' ? (v as any)(s.atCommand) : v })),

  // アシスタントピッカー表示フラグ
  isAssistantPickerOpen: false,
  setIsAssistantPickerOpen: (v: boolean | ((prev: boolean) => boolean)) =>
    set((s) => ({ isAssistantPickerOpen: typeof v === 'function' ? (v as any)(s.isAssistantPickerOpen) : v })),
});
