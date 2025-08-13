import type { StateCreator } from 'zustand';
import type { Chat, ChatSlice, ChatbotState } from 'typings';
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

    // 一覧取得: chatsに必ず保管
    fetchChats: withChatApi(async () => {
      const res = await apiClient.get<ChatListResponse>(API_ENDPOINTS.CHATS);
      const items = res?.data?.items ?? [];
      set(() => ({ chats: items }));
      return;
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
  };
};
