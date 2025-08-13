import type { StateCreator } from 'zustand';
import type { Chat, ChatSlice, ChatbotState, ChatMessage } from 'typings';
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

export const createChatSlice: StateCreator<ChatbotState, [], [], ChatSlice> = (
  set: SliceSet<ChatbotState>,
  get: () => ChatbotState
) => {
  // --- Chat API 共通ラッパ ---
  // withChatApi: chatsLoading/chatsErrorを自動制御
  // 例: fetchChats: withChatApi(async () => {...})
  const withChatApi = withLoadingErrorCurried(set, 'chatsLoading', 'chatsError');

  // --- Chat Slice: チャット一覧・作成・更新・削除 ---
  return {
    chatsLoading: false,
    chatsError: null,
    chats: [],
    // chatMessagesMap: (B 方針) 現状未使用。PassiveChatSlice.chatMessages を唯一のソースとするため保持のみ。
    chatMessagesMap: {},
    activeChatId: null,

    setActiveChatId: (id: string | null) => set(() => ({ activeChatId: id })),

    // (B 方針) マルチチャットマップを使わず、選択中チャットのみ PassiveChatSlice.chatMessages に追加
    appendChatMessage: (chatId: string, message: ChatMessage) => {
      const st = get();
      if (st.activeChatId !== chatId) return;
      st.setChatMessages?.((prev) => [...prev, message]);
    },

    // 一覧取得: chatsに必ず保管
    fetchChats: withChatApi(async () => {
      const res = await apiClient.get<ChatListResponse>(API_ENDPOINTS.CHATS);
      const items = res?.data?.items ?? [];
      set(() => ({ chats: items }));
    }),

    // 作成: ChatSlice型 (引数なし) に合わせてラップ
    createChat: withChatApi(async () => {
      // ChatCreateRequest: idのみ
      const chatReq: ChatCreateRequest = { id: uuidv4() };
      await apiClient.post<ChatCreateResponse, ChatCreateRequest>(API_ENDPOINTS.CHATS, chatReq);
    }),

    // 更新: ChatSlice型 (id, title) に合わせてラップ
    updateChat: withChatApi(async (id: string, title: string) => {
      const req: ChatUpdateRequest = { id, title };
      await apiClient.put<ChatUpdateResponse, ChatUpdateRequest>(`${API_ENDPOINTS.CHATS}/${id}`, req);
    }),

    // 削除: ChatDeleteResponse型、status 200のみslice更新
    deleteChat: withChatApi(async (id: string) => {
      await apiClient.delete<ChatDeleteResponse>(`${API_ENDPOINTS.CHATS}/${id}`);
    }),

    // メッセージ送信: 成功時のみ chatMessagesByChatId に追加
    sendMessage: withChatApi(async (content: string) => {
      const chatId = get().activeChatId;
      if (!chatId) return; // アクティブなしなら何もしない
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
  };
};
