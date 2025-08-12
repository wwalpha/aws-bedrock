import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { Chat, Preset, Workspace, Assistant, Prompt, Collection, Tool, ModelRef, ChatMessage } from 'typings';
import type {
  ApiResult,
  ApiRequestConfig,
  CreateChatPayload,
  UpdateChatPayload,
  CreatePresetPayload,
  UpdatePresetPayload,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  CreatePromptPayload,
  UpdatePromptPayload,
} from 'typings/api-client';

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

// We avoid importing the Zustand store here to prevent a circular import with slices
// (app slice imports api client -> store -> app slice). Instead we allow the store
// to register an accessor after creation.
type StoreAccessor = () => { idToken: string | null; accessToken: string | null; logout: () => void } | undefined;
let storeAccessor: StoreAccessor | null = null;

export function attachStoreAccessor(accessor: StoreAccessor) {
  storeAccessor = accessor;
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
      try {
        const state = storeAccessor?.();
        if (state) {
          const { idToken, accessToken } = state;
          const token = idToken || accessToken;
          if (token) {
            if ((config.headers as any)?.set) {
              (config.headers as any).set('Authorization', `Bearer ${token}`);
            } else {
              config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` } as any;
            }
          }
        }
      } catch {}
      return config;
    });

    // Basic 401 handling: clear tokens
    this.axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error?.response?.status === 401) {
          try {
            const state = storeAccessor?.();
            state?.logout();
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

  // (Auth related convenience helpers removed: implement in zustand slice via post())
}

// Export a default singleton instance
export const apiClient = new ApiClient();
