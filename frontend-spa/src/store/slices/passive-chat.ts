import type { PassiveChatSlice, Chat, ChatMessage, ChatSettings, ChatFileItem } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// 受動的（非生成中）チャットのベース状態
// - userInput: 現在の入力テキスト (送信後にクリア)
// - chatMessages: 対象チャットのメッセージ一覧
// - chatSettings: チャット単位の設定（モデル・温度など）
// - selectedChat: 現在選択中チャット
// - chatFileItems: メッセージごとの添付関連メタ情報
type SliceSet = (fn: (state: PassiveChatSlice) => Partial<PassiveChatSlice>) => void;

export const createPassiveChatSlice: StateCreator<PassiveChatSlice, [], [], PassiveChatSlice> = (set: SliceSet) => ({
  userInput: '',
  setUserInput: (v: SetStateAction<string>) => set((s) => ({ userInput: apply(s.userInput, v) })),

  chatMessages: [] as ChatMessage[],
  setChatMessages: (v: SetStateAction<ChatMessage[]>) => set((s) => ({ chatMessages: apply(s.chatMessages, v) })),

  chatSettings: {} as ChatSettings,
  setChatSettings: (v: SetStateAction<ChatSettings>) => set((s) => ({ chatSettings: apply(s.chatSettings, v) })),

  selectedChat: null as Chat | null,
  setSelectedChat: (v: SetStateAction<Chat | null>) => set((s) => ({ selectedChat: apply(s.selectedChat, v) })),

  chatFileItems: [] as ChatFileItem[],
  setChatFileItems: (v: SetStateAction<ChatFileItem[]>) => set((s) => ({ chatFileItems: apply(s.chatFileItems, v) })),
});
