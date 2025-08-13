import type { PassiveChatSlice, ChatMessage, ChatSettings, ChatFileItem } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// --- Passive Chat Slice ---
// 軽量チャット UI 状態 (生成/ストリーミング以外) を保持
// selectedChat は廃止 → activeChatId (別 slice) に統一
export const createPassiveChatSlice: StateCreator<PassiveChatSlice, [], [], PassiveChatSlice> = (
  set: SliceSet<PassiveChatSlice>,
  _get: () => PassiveChatSlice
) => ({
  userInput: '',
  setUserInput: (v: string | ((prev: string) => string)) =>
    set((s) => ({ userInput: typeof v === 'function' ? (v as (p: string) => string)(s.userInput) : v })),

  chatMessages: [] as ChatMessage[],
  setChatMessages: (v: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) =>
    set((s) => ({
      chatMessages: typeof v === 'function' ? (v as (p: ChatMessage[]) => ChatMessage[])(s.chatMessages) : v,
    })),

  chatSettings: {} as ChatSettings,
  setChatSettings: (v: ChatSettings | ((prev: ChatSettings) => ChatSettings)) =>
    set((s) => ({
      chatSettings: typeof v === 'function' ? (v as (p: ChatSettings) => ChatSettings)(s.chatSettings) : v,
    })),

  chatFileItems: [] as ChatFileItem[],
  setChatFileItems: (v: ChatFileItem[] | ((prev: ChatFileItem[]) => ChatFileItem[])) =>
    set((s) => ({
      chatFileItems: typeof v === 'function' ? (v as (p: ChatFileItem[]) => ChatFileItem[])(s.chatFileItems) : v,
    })),
});
