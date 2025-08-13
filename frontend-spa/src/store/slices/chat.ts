import type { StateCreator } from 'zustand';
import type { Chat, ChatOpsSlice } from 'typings';
import type { SliceSet } from 'typings/slice';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Chat 専用の CRUD + 状態 Slice
export const createChatSlice: StateCreator<ChatOpsSlice, [], [], ChatOpsSlice> = (
  set: SliceSet<ChatOpsSlice>,
  get: any
) => ({
  chatsLoading: false,
  chatsError: null,

  // 一覧取得: /chats GET
  fetchChats: async () => {
    set((s) => ({ ...s, chatsLoading: true, chatsError: null }));
    const { apiClient } = await import('@/lib/api/client');
    const res = await apiClient.get<Chat[]>(API_ENDPOINTS.CHATS);
    if (res.data) {
      (get().setChats as any)(res.data);
      set((s) => ({ ...s, chatsLoading: false }));
      return { data: res.data } as any; // normalize to ApiResult style
    }
    set((s) => ({ ...s, chatsLoading: false, chatsError: 'Failed to load chats' }));
    return { error: 'Failed to load chats' } as any;
  },

  // 作成: /chats POST
  createChat: async (name: string) => {
    const { apiClient } = await import('@/lib/api/client');
    try {
      const res = await apiClient.post<Chat, { name: string }>(API_ENDPOINTS.CHATS, { name });
      (get().setChats as any)((prev: Chat[]) => [res.data, ...prev]);
      return { data: res.data } as any;
    } catch (e: any) {
      return { error: e?.message || 'createChat failed' } as any;
    }
  },

  // 更新: /chats/:id PUT (部分更新想定で name だけ送る)
  updateChat: async (id: string, patch: { name?: string }) => {
    const { apiClient } = await import('@/lib/api/client');
    try {
      const res = await apiClient.put<Chat, { name?: string }>(`${API_ENDPOINTS.CHATS}/${id}`, patch);
      (get().setChats as any)((prev: Chat[]) => prev.map((c) => (c.id === id ? { ...c, ...res.data } : c)));
      return { data: res.data } as any;
    } catch (e: any) {
      return { error: e?.message || 'updateChat failed' } as any;
    }
  },

  // 削除: /chats/:id DELETE
  deleteChat: async (id: string) => {
    const { apiClient } = await import('@/lib/api/client');
    try {
      await apiClient.delete(`${API_ENDPOINTS.CHATS}/${id}`);
      (get().setChats as any)((prev: Chat[]) => prev.filter((c) => c.id !== id));
      return { data: { id } } as any;
    } catch (e: any) {
      return { error: e?.message || 'deleteChat failed' } as any;
    }
  },
});
