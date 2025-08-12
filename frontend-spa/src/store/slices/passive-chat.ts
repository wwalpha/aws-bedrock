import type { PassiveChatSlice, Chat, ChatMessage, ChatSettings, ChatFileItem } from 'typings';
import { apply } from '../utils';

// 受動的（非生成中）チャットのベース状態
// - userInput: 現在の入力テキスト (送信後にクリア)
// - chatMessages: 対象チャットのメッセージ一覧
// - chatSettings: チャット単位の設定（モデル・温度など）
// - selectedChat: 現在選択中チャット
// - chatFileItems: メッセージごとの添付関連メタ情報
export const createPassiveChatSlice = (set: any) =>
  ({
    userInput: '',
    setUserInput: (v: any) => set((s: PassiveChatSlice) => ({ userInput: apply(s.userInput, v) })),

    chatMessages: [] as ChatMessage[],
    setChatMessages: (v: any) => set((s: PassiveChatSlice) => ({ chatMessages: apply(s.chatMessages, v) })),

    chatSettings: {} as ChatSettings,
    setChatSettings: (v: any) => set((s: PassiveChatSlice) => ({ chatSettings: apply(s.chatSettings, v) })),

    selectedChat: null as Chat | null,
    setSelectedChat: (v: any) => set((s: PassiveChatSlice) => ({ selectedChat: apply(s.selectedChat, v) })),

    chatFileItems: [] as ChatFileItem[],
    setChatFileItems: (v: any) => set((s: PassiveChatSlice) => ({ chatFileItems: apply(s.chatFileItems, v) })),
  }) as PassiveChatSlice;
