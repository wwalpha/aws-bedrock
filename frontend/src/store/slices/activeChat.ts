import type { StateCreator } from 'zustand';
import type { ChatbotState, ChatMessage, ActiveChatSlice } from 'typings';
import type { SliceSet } from 'typings/slice';

import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { apiClient } from '@/lib/api/client';
import type {
  ChatListResponse,
  ChatCreateRequest,
  ChatCreateResponse,
  ChatUpdateRequest,
  ChatUpdateResponse,
  ChatDeleteResponse,
  ChatMessageRequest,
  ChatMessageResponse,
} from 'typings/api-client';

import { withLoadingErrorCurried } from '@/store/utils';
import { uuidv4 } from '@/lib/uuid';

// --- Active Chat Composite Slice ---
// Chat 一覧/CRUD + 生成中状態 (abortController, firstTokenReceived, isGenerating) を統合
export const createActiveChatSlice: StateCreator<ChatbotState, [], [], ActiveChatSlice> = (
  set: SliceSet<ChatbotState>,
  get: () => ChatbotState
) => {
  // --- Chat API 共通ラッパ ---
  const withChatApi = withLoadingErrorCurried(set, 'chatsLoading', 'chatsError');

  return {
    // --- Chat Entity State ---
    chatsLoading: false,
    chatsError: null,
    chats: [],
    activeChatId: null,

    // --- Select / Append ---
    setActiveChatId: (id: string | null) => set(() => ({ activeChatId: id })),

    appendChatMessage: (chatId: string, message: ChatMessage) => {
      const st = get();
      if (st.activeChatId === chatId) {
        st.setChatMessages?.((prev) => [...prev, message]);
      }
    },

    // --- CRUD ---
    fetchChats: withChatApi(async () => {
      const res = await apiClient.get<ChatListResponse>(API_ENDPOINTS.CHATS);
      const items = res?.data?.items ?? [];
      set(() => ({ chats: items }));
    }),

    createChat: withChatApi(async () => {
      const chatReq: ChatCreateRequest = { id: uuidv4() };
      await apiClient.post<ChatCreateResponse, ChatCreateRequest>(API_ENDPOINTS.CHATS, chatReq);
    }),

    updateChat: withChatApi(async (id: string, title: string) => {
      const req: ChatUpdateRequest = { id, title };
      await apiClient.put<ChatUpdateResponse, ChatUpdateRequest>(`${API_ENDPOINTS.CHATS}/${id}`, req);
    }),

    deleteChat: withChatApi(async (id: string) => {
      await apiClient.delete<ChatDeleteResponse>(`${API_ENDPOINTS.CHATS}/${id}`);
      // ローカル state から除去 & activeChatId の再計算
      set((s: any) => {
        const remaining = (s.chats || []).filter((c: any) => c.id !== id);
        const wasActive = s.activeChatId === id;
        return {
          chats: remaining,
          activeChatId: wasActive ? (remaining.length ? remaining[0].id : null) : s.activeChatId,
        };
      });
    }),

    // --- Messaging ---
    sendMessage: withChatApi(async (content: string) => {
      const chatId = get().activeChatId;
      if (!chatId) return;

      const req: ChatMessageRequest = { chatId, content };
      const res = await apiClient.post<ChatMessageResponse, ChatMessageRequest>(
        `${API_ENDPOINTS.CHATS}/${chatId}/messages`,
        req
      );
      const data = res?.data;
      if (!data) return;

      const appended: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        chatId: data.chatId,
        role: 'assistant',
        content: data.content,
        createdAt: new Date().toISOString(),
      };
      const st = get();
      if (st.activeChatId === chatId) {
        st.setChatMessages?.((prev) => [...prev, appended]);
      }
    }),

    // --- Generation State ---
    abortGenerate: null,
    setAbortGenerate: (v: AbortController | null | ((prev: AbortController | null) => AbortController | null)) =>
      set((s) => ({ abortGenerate: typeof v === 'function' ? (v as any)(s.abortGenerate) : v })),

    firstTokenReceived: false,
    setFirstTokenReceived: (v: boolean | ((prev: boolean) => boolean)) =>
      set((s) => ({ firstTokenReceived: typeof v === 'function' ? (v as any)(s.firstTokenReceived) : v })),

    isGenerating: false,
    setIsGenerating: (v: boolean | ((prev: boolean) => boolean)) =>
      set((s) => ({ isGenerating: typeof v === 'function' ? (v as any)(s.isGenerating) : v })),
  };
};
