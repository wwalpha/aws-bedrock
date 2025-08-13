import type { PassiveChatSlice, Chat, ChatMessage, ChatSettings, ChatFileItem } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// 受動的（非生成中）チャットのベース状態
// - userInput: 現在の入力テキスト (送信後にクリア)
// - chatMessages: 対象チャットのメッセージ一覧
// - chatSettings: チャット単位の設定（モデル・温度など）
// - selectedChat: 現在選択中チャット
// - chatFileItems: メッセージごとの添付関連メタ情報
export const createPassiveChatSlice: StateCreator<PassiveChatSlice, [], [], PassiveChatSlice> = (
  set: SliceSet<PassiveChatSlice>
) => ({
  userInput: '',
  setUserInput: (v: string | ((prev: string) => string)) =>
    set((s) => ({ userInput: typeof v === 'function' ? (v as any)(s.userInput) : v })),

  chatMessages: [] as ChatMessage[],
  setChatMessages: (v: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) =>
    set((s) => ({ chatMessages: typeof v === 'function' ? (v as any)(s.chatMessages) : v })),

  chatSettings: {} as ChatSettings,
  setChatSettings: (v: ChatSettings | ((prev: ChatSettings) => ChatSettings)) =>
    set((s) => ({ chatSettings: typeof v === 'function' ? (v as any)(s.chatSettings) : v })),

  selectedChat: null as Chat | null,
  setSelectedChat: (v: Chat | null | ((prev: Chat | null) => Chat | null)) =>
    set((s) => ({ selectedChat: typeof v === 'function' ? (v as any)(s.selectedChat) : v })),

  chatFileItems: [] as ChatFileItem[],
  setChatFileItems: (v: ChatFileItem[] | ((prev: ChatFileItem[]) => ChatFileItem[])) =>
    set((s) => ({ chatFileItems: typeof v === 'function' ? (v as any)(s.chatFileItems) : v })),
});
