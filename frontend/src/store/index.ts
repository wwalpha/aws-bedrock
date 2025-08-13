import { create } from 'zustand';
import { useStore } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import type { ChatbotState } from 'typings';
import { attachStoreAccessor } from '@/lib/api/client';
import { createAppSlice } from './slices/app';
import { createProfileSlice } from './slices/profile';
import { createItemsSlice } from './slices/items';
import { createModelsSlice } from './slices/models';
import { createWorkspaceSlice } from './slices/workspace';
import { createPresetSlice } from './slices/preset';
import { createAssistantSlice } from './slices/assistant';
import { createPassiveChatSlice } from './slices/passiveChat';
import { createActiveChatSlice } from './slices/activeChat';
import { createChatInputSlice } from './slices/chat-input';
import { createAttachmentsSlice } from './slices/attachments';
import { createRetrievalSlice } from './slices/retrieval';
import { createToolsSlice } from './slices/tools';

// State creator (全 slice 結合) — devtools/persist の middleware 連鎖前提
const createRootState = (set: any, get: any, api: any): ChatbotState => ({
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
});

// persist -> devtools の順で wrap (rehydrate も action として検知可能)
const enhanced = devtools(
  persist<ChatbotState>(createRootState as any, {
    name: 'chatbot-store',
    version: 1,
    storage: createJSONStorage(() => localStorage),
    partialize: (state: ChatbotState) =>
      ({
        chats: state.chats,
        presets: state.presets,
        selectedPreset: state.selectedPreset,
        profile: state.profile,
        workspaces: state.workspaces,
        selectedWorkspace: state.selectedWorkspace,
        activeChatId: state.activeChatId,
      }) as any,
    migrate: (persisted, _version) => persisted as ChatbotState,
  }) as any,
  { name: 'chatbot-store', enabled: import.meta.env.DEV }
);

export const store = create<ChatbotState>()(enhanced as any);

// Register lightweight accessor for api client (avoid direct import of store inside client file)
attachStoreAccessor(() => {
  try {
    const { idToken, accessToken, logout } = store.getState();
    return { idToken, accessToken, logout };
  } catch {
    return undefined;
  }
});

// Convenience hook (型補完用): component から store を使う
export const useChatStore = <T>(selector: (s: ChatbotState) => T): T => useStore(store, selector);
