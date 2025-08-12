import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChatbotState } from 'typings';
import { createAppSlice } from './slices/app';
import { attachStoreAccessor } from '@/lib/api/client';
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

export const store = create<ChatbotState>()(
  persist(
    (set, get, api) => ({
      ...createProfileSlice(set, get, api),
      ...createItemsSlice(set, get, api),
      ...createModelsSlice(set, get, api),
      ...createWorkspaceSlice(set, get, api),
      ...createPresetSlice(set, get, api),
      ...createAssistantSlice(set, get, api),
      ...createPassiveChatSlice(set, get, api),
      ...createActiveChatSlice(set, get, api),
      ...createChatInputSlice(set, get, api),
      ...createAttachmentsSlice(set, get, api),
      ...createRetrievalSlice(set, get, api),
      ...createToolsSlice(set, get, api),
      ...createAppSlice(set, get, api),
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
        workspaces: state.workspaces,
        selectedWorkspace: state.selectedWorkspace,
      }),
      migrate: (persisted, version) => {
        return persisted as ChatbotState;
      },
    }
  )
);

// Register lightweight accessor for api client (avoid direct import of store inside client file)
attachStoreAccessor(() => {
  try {
    const { idToken, accessToken, logout } = store.getState();
    return { idToken, accessToken, logout };
  } catch {
    return undefined;
  }
});
