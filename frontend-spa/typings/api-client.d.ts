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

// チャット関連
export interface CreateChatPayload {
  name: string;
}
export interface UpdateChatPayload {
  name?: string;
}
export interface ChatListResponse {
  items: Chat[]; // if backend returns plain array, adjust slice mapping
}
export interface ChatCreateResponse extends Chat {}
export interface ChatUpdateResponse extends Chat {}
export interface ChatDeleteResponse {
  id: string;
}

// プリセット
export interface CreatePresetPayload {
  name: string;
  model?: string;
}
export interface UpdatePresetPayload {
  name?: string;
  model?: string;
}

// ワークスペース
export interface CreateWorkspacePayload {
  name: string;
}
export interface UpdateWorkspacePayload {
  name?: string;
}

// プロンプト
export interface CreatePromptPayload {
  name: string;
  content: string;
}
export interface UpdatePromptPayload {
  name?: string;
  content?: string;
}
