import type { StateCreator } from 'zustand';
import type { Conversation, ChatSlice, ChatbotState } from 'typings';
import type { SliceSet } from 'typings/slice';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { apiClient } from '@/lib/api/client';
import type {
  ConversationListResponse,
  CreateConversationPayload,
  UpdateConversationPayload,
} from 'typings/api-client';

// Chat Slice: チャットグループ CRUD とローディング/エラーフラグ (copilot-instructions 準拠)
// NOTE: エンティティ型は既存命名で Conversation を使用 (サーバー/他 Slice との整合性のため)
export const createChatSlice: StateCreator<ChatbotState, [], [], ChatSlice> = (
  set: SliceSet<ChatbotState>,
  get: () => ChatbotState
) => ({
  chatsLoading: false,
  chatsError: null,

  // 一覧取得: /chats GET
  fetchChats: async () => {
    set(() => ({ chatsLoading: true, chatsError: null }));
    try {
      const res = await apiClient.get<ConversationListResponse>(API_ENDPOINTS.CHATS);
      const data = res.data.items;
      set(() => ({ chats: data }) as Partial<ChatbotState>);
    } catch (e: any) {
      const msg = e?.message || 'Failed to load chats';
      set(() => ({ chatsError: msg }));
    } finally {
      set(() => ({ chatsLoading: false }));
    }
  },

  // 作成: /chats POST
  createChat: async (payload: CreateConversationPayload) => {
    set(() => ({ chatsLoading: true }));
    try {
      const res = await apiClient.post<Conversation, CreateConversationPayload>(API_ENDPOINTS.CHATS, payload);
      set((s) => ({ chats: [res.data, ...((s as any).chats || [])] }) as Partial<ChatbotState>);
    } catch (e: any) {
      set(() => ({ chatsError: e?.message || 'createChat failed' }));
    } finally {
      set(() => ({ chatsLoading: false }));
    }
  },

  // 更新: /chats/:id PUT (部分更新想定で name だけ送る)
  updateChat: async (id: string, payload: UpdateConversationPayload) => {
    set(() => ({ chatsLoading: true }));
    try {
      const res = await apiClient.put<Conversation, UpdateConversationPayload>(`${API_ENDPOINTS.CHATS}/${id}`, payload);
      set(
        (s) =>
          ({
            chats: ((s as any).chats as Conversation[]).map((c: Conversation) =>
              c.id === id ? { ...c, ...res.data } : c
            ),
          }) as Partial<ChatbotState>
      );
    } catch (e: any) {
      set(() => ({ chatsError: e?.message || 'updateChat failed' }));
    } finally {
      set(() => ({ chatsLoading: false }));
    }
  },

  // 削除: /chats/:id DELETE
  deleteChat: async (id: string) => {
    set(() => ({ chatsLoading: true }));
    try {
      await apiClient.delete(`${API_ENDPOINTS.CHATS}/${id}`);
      set(
        (s) =>
          ({
            chats: ((s as any).chats as Conversation[]).filter((c: Conversation) => c.id !== id),
          }) as Partial<ChatbotState>
      );
    } catch (e: any) {
      set(() => ({ chatsError: e?.message || 'deleteChat failed' }));
    } finally {
      set(() => ({ chatsLoading: false }));
    }
  },
});
