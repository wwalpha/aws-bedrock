import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useChatStore } from '@/store';
import type { Chat, Preset, Workspace, Assistant, Prompt, Collection, Tool, ModelRef, ChatMessage } from 'typings';

export type ApiRequestConfig<T = unknown> = AxiosRequestConfig<T>;

// Generic API result envelope (adjust if backend differs)
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

// Domain-specific payload shapes
export interface CreateChatPayload {
  name: string;
}
export interface UpdateChatPayload {
  name?: string;
}
export interface CreatePresetPayload {
  name: string;
  model?: string;
}
export interface UpdatePresetPayload {
  name?: string;
  model?: string;
}
export interface CreateWorkspacePayload {
  name: string;
}
export interface UpdateWorkspacePayload {
  name?: string;
}
export interface CreatePromptPayload {
  name: string;
  content: string;
}
export interface UpdatePromptPayload {
  name?: string;
  content?: string;
}

// Utility to run a request and normalize error handling
async function run<T>(op: () => Promise<AxiosResponse<T>>): ApiResult<T> {
  try {
    const res = await op();
    return { data: res.data };
  } catch (e: any) {
    const status = e?.response?.status;
    const msg = e?.response?.data?.error || e?.message || 'Request failed';
    return { error: msg, status };
  }
}

export class ApiClient {
  private axios: AxiosInstance;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || '') {
    this.axios = axios.create({
      baseURL,
      headers: {
        'content-type': 'application/json',
      },
      withCredentials: false,
    });

    // Inject Authorization header if token exists
    this.axios.interceptors.request.use((config) => {
      const { idToken, accessToken } = useChatStore.getState();
      const token = idToken || accessToken;
      if (token) {
        // Ensure headers exists and set Authorization via set() to satisfy types
        if ((config.headers as any)?.set) {
          (config.headers as any).set('Authorization', `Bearer ${token}`);
        } else {
          config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` } as any;
        }
      }
      return config;
    });

    // Basic 401 handling: clear tokens
    this.axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error?.response?.status === 401) {
          try {
            useChatStore.getState().logout();
          } catch {}
        }
        return Promise.reject(error);
      }
    );
  }

  request<T = unknown, D = unknown>(config: ApiRequestConfig<D>) {
    return this.axios.request<T, AxiosResponse<T>, D>(config);
  }

  get<T = unknown>(url: string, config?: ApiRequestConfig) {
    return this.axios.get<T>(url, config);
  }

  post<T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) {
    return this.axios.post<T, AxiosResponse<T>, D>(url, data, config);
  }

  put<T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) {
    return this.axios.put<T, AxiosResponse<T>, D>(url, data, config);
  }

  delete<T = unknown>(url: string, config?: ApiRequestConfig) {
    return this.axios.delete<T>(url, config);
  }

  // High-level typed resource helpers (REST style)

  // Chats
  listChats(): ApiResult<Chat[]> {
    return run(() => this.get<Chat[]>('/chats'));
  }
  getChat(id: string): ApiResult<Chat> {
    return run(() => this.get<Chat>(`/chats/${id}`));
  }
  createChat(payload: CreateChatPayload): ApiResult<Chat> {
    return run(() => this.post<Chat, CreateChatPayload>('/chats', payload));
  }
  updateChat(id: string, payload: UpdateChatPayload): ApiResult<Chat> {
    return run(() => this.put<Chat, UpdateChatPayload>(`/chats/${id}`, payload));
  }
  deleteChat(id: string): ApiResult<{ id: string }> {
    return run(() => this.delete<{ id: string }>(`/chats/${id}`));
  }

  listChatMessages(chatId: string): ApiResult<ChatMessage[]> {
    return run(() => this.get<ChatMessage[]>(`/chats/${chatId}/messages`));
  }

  // Presets
  listPresets(): ApiResult<Preset[]> {
    return run(() => this.get<Preset[]>('/presets'));
  }
  createPreset(p: CreatePresetPayload): ApiResult<Preset> {
    return run(() => this.post<Preset, CreatePresetPayload>('/presets', p));
  }
  updatePreset(id: string, p: UpdatePresetPayload): ApiResult<Preset> {
    return run(() => this.put<Preset, UpdatePresetPayload>(`/presets/${id}`, p));
  }
  deletePreset(id: string): ApiResult<{ id: string }> {
    return run(() => this.delete<{ id: string }>(`/presets/${id}`));
  }

  // Workspaces
  listWorkspaces(): ApiResult<Workspace[]> {
    return run(() => this.get<Workspace[]>('/workspaces'));
  }
  createWorkspace(p: CreateWorkspacePayload): ApiResult<Workspace> {
    return run(() => this.post<Workspace, CreateWorkspacePayload>('/workspaces', p));
  }
  updateWorkspace(id: string, p: UpdateWorkspacePayload): ApiResult<Workspace> {
    return run(() => this.put<Workspace, UpdateWorkspacePayload>(`/workspaces/${id}`, p));
  }
  deleteWorkspace(id: string): ApiResult<{ id: string }> {
    return run(() => this.delete<{ id: string }>(`/workspaces/${id}`));
  }

  // Assistants
  listAssistants(): ApiResult<Assistant[]> {
    return run(() => this.get<Assistant[]>('/assistants'));
  }

  // Collections
  listCollections(): ApiResult<Collection[]> {
    return run(() => this.get<Collection[]>('/collections'));
  }

  // Prompts
  listPrompts(): ApiResult<Prompt[]> {
    return run(() => this.get<Prompt[]>('/prompts'));
  }
  createPrompt(p: CreatePromptPayload): ApiResult<Prompt> {
    return run(() => this.post<Prompt, CreatePromptPayload>('/prompts', p));
  }
  updatePrompt(id: string, p: UpdatePromptPayload): ApiResult<Prompt> {
    return run(() => this.put<Prompt, UpdatePromptPayload>(`/prompts/${id}`, p));
  }
  deletePrompt(id: string): ApiResult<{ id: string }> {
    return run(() => this.delete<{ id: string }>(`/prompts/${id}`));
  }

  // Tools
  listTools(): ApiResult<Tool[]> {
    return run(() => this.get<Tool[]>('/tools'));
  }

  // Models
  listModels(): ApiResult<ModelRef[]> {
    return run(() => this.get<ModelRef[]>('/models'));
  }
}

// Export a default singleton instance
export const apiClient = new ApiClient();
