import type { AxiosRequestConfig } from 'axios';
import type { Conversation } from '.';

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

// 会話(Conversation)関連
export interface CreateConversationPayload {
  name: string;
}
export interface UpdateConversationPayload {
  name?: string;
}
export interface ConversationListResponse {
  items: Conversation[]; // if backend returns plain array, adjust slice mapping
}
export interface ConversationCreateResponse extends Conversation {}
export interface ConversationUpdateResponse extends Conversation {}
export interface ConversationDeleteResponse {
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
