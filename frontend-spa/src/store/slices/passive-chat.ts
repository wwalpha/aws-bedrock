import type { PassiveChatSlice, Chat } from 'typings';
import { apply } from '../utils';

export const createPassiveChatSlice = (set: any) =>
  ({
    userInput: '',
    setUserInput: (v: any) => set((s: PassiveChatSlice) => ({ userInput: apply(s.userInput, v) })),
    chatMessages: [],
    setChatMessages: (v: any) => set((s: PassiveChatSlice) => ({ chatMessages: apply(s.chatMessages, v) })),
    chatSettings: {},
    setChatSettings: (v: any) => set((s: PassiveChatSlice) => ({ chatSettings: apply(s.chatSettings, v) })),
    selectedChat: null as Chat | null,
    setSelectedChat: (v: any) => set((s: PassiveChatSlice) => ({ selectedChat: apply(s.selectedChat, v) })),
    chatFileItems: [],
    setChatFileItems: (v: any) => set((s: PassiveChatSlice) => ({ chatFileItems: apply(s.chatFileItems, v) })),
  }) as PassiveChatSlice;
