// axios error型
import type { AxiosError } from 'axios';

export type ErrorLike = Error | AxiosError | unknown;
import type { AxiosRequestConfig } from 'axios';
import type { Chat } from '.';

// 共通 API 型定義
export type ApiRequestConfig<T = unknown> = AxiosRequestConfig<T>;

export interface ApiSuccess<T> {
  data: T;
  error?: undefined;
}
export interface ApiFailure {
  data?: undefined;
  error: string;
  status?: number;
}
export type ApiResult<T> = Promise<ApiSuccess<T> | ApiFailure>;

// Chat 関連
export interface ChatCreateRequest {
  id: string;
}
export interface ChatCreateResponse {}

export interface ChatUpdateRequest {
  id: string;
  title: string;
}
export interface ChatUpdateResponse {}

export interface ChatListRequest {}
export interface ChatListResponse {
  items: Chat[];
}
export interface ChatDeleteResquest {}
export interface ChatDeleteResponse {}

// Chat メッセージ送信
export interface ChatMessageRequest {
  chatId: string;
  content: string;
}
export interface ChatMessageResponse {
  chatId: string;
  content: string;
}

// プリセット
export interface CreatePresetRequest {
  name: string;
  model?: string;
}
export interface UpdatePresetRequest {
  name?: string;
  model?: string;
}

// ワークスペース
export interface CreateWorkspaceRequest {
  name: string;
}
export interface UpdateWorkspaceRequest {
  name?: string;
}

// プロンプト
export interface CreatePromptRequest {
  name: string;
  content: string;
}
export interface UpdatePromptRequest {
  name?: string;
  content?: string;
}
