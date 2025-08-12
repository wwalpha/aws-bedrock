import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChatbotState } from 'typings';
import { createAppSlice } from './slices/app';
import { createProfileSlice } from './slices/profile';
import { createItemsSlice } from './slices/items';
import { createModelsSlice } from './slices/models';
import { createWorkspaceSlice } from './slices/workspace';
import { createPresetSlice } from './slices/preset';
import { createAssistantSlice } from './slices/assistant';
import { createPassiveChatSlice } from './slices/passive-chat';
import { createActiveChatSlice } from './slices/active-chat';
import { createChatInputSlice } from './slices/chat-input';
import { createAttachmentsSlice } from './slices/attachments';
import { createRetrievalSlice } from './slices/retrieval';
import { createToolsSlice } from './slices/tools';

export const useChatStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      ...createProfileSlice(set),
      ...createItemsSlice(set),
      ...createModelsSlice(set),
      ...createWorkspaceSlice(set),
      ...createPresetSlice(set),
      ...createAssistantSlice(set),
      ...createPassiveChatSlice(set),
      ...createActiveChatSlice(set),
      ...createChatInputSlice(set),
      ...createAttachmentsSlice(set),
      ...createRetrievalSlice(set),
      ...createToolsSlice(set),
      ...createAppSlice(set),
    }),
    {
      name: 'chatbot-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chats: state.chats,
        selectedChat: state.selectedChat,
        presets: state.presets,
        selectedPreset: state.selectedPreset,
        profile: state.profile,
      }),
      migrate: (persisted, version) => {
        return persisted as ChatbotState;
      },
    }
  )
);
