import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { Preset, Workspace, Assistant, Prompt, Collection, Tool, ModelRef, ChatMessage } from 'typings';
import type {
  ApiResult,
  ApiRequestConfig,
  CreatePresetRequest,
  UpdatePresetRequest,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  CreatePromptRequest,
  UpdatePromptRequest,
} from 'typings/api-client';
import { API_ENDPOINTS } from './endpoints';

// Utility to run a request and normalize error handling
async function run<T>(op: () => Promise<AxiosResponse<T>>): ApiResult<T> {
  try {
    const res = await op();
    return { data: res.data };
  } catch (e: unknown) {
    let status: number | undefined = undefined;
    let msg = 'Request failed';
    if (axios.isAxiosError(e)) {
      status = e.response?.status;
      msg = (e.response?.data as { error?: string })?.error || e.message || msg;
    } else if (e instanceof Error) {
      msg = e.message;
    }
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
            if (config.headers && typeof (config.headers as any).set === 'function') {
              (config.headers as { set: (k: string, v: string) => void }).set('Authorization', `Bearer ${token}`);
            } else {
              config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` } as any;
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

  // NOTE: onError を渡した場合は swallow (例外で UI 制御しない方針)。onError 未指定時は従来通り throw。
  async get<T = unknown>(url: string, onError?: (err: Error | AxiosError) => void) {
    try {
      return await this.axios.get<T>(url);
    } catch (e) {
      if (onError) {
        onError(e as Error | AxiosError);
      }
      return { data: undefined } as AxiosResponse<T>;
    }
  }

  async post<T = unknown, D = unknown>(url: string, data?: D, onError?: (err: Error | AxiosError) => void) {
    try {
      return await this.axios.post<T, AxiosResponse<T>, D>(url, data);
    } catch (e) {
      if (onError) {
        onError(e as Error | AxiosError);
      }
      return { data: undefined } as AxiosResponse<T>;
    }
  }

  async put<T = unknown, D = unknown>(url: string, data?: D, onError?: (err: Error | AxiosError) => void) {
    try {
      return await this.axios.put<T, AxiosResponse<T>, D>(url, data);
    } catch (e) {
      if (onError) {
        onError(e as Error | AxiosError);
      }
      return { data: undefined } as AxiosResponse<T>;
    }
  }

  async delete<T = unknown>(url: string, onError?: (err: Error | AxiosError) => void) {
    try {
      return await this.axios.delete<T>(url);
    } catch (e) {
      if (onError) {
        onError(e as Error | AxiosError);
      }
      return { data: undefined } as AxiosResponse<T>;
    }
  }

  // High-level typed resource helpers (REST style)

  // (Chat helpers moved into chat slice; keep only low-level request methods here)
  listChatMessages(chatId: string): ApiResult<ChatMessage[]> {
    return run(() => this.get<ChatMessage[]>(`${API_ENDPOINTS.CHATS}/${chatId}/messages`));
  }

  // Presets
  listPresets(): ApiResult<Preset[]> {
    return run(() => this.get<Preset[]>(API_ENDPOINTS.PRESETS));
  }
  createPreset(p: CreatePresetRequest): ApiResult<Preset> {
    return run(() => this.post<Preset, CreatePresetRequest>(API_ENDPOINTS.PRESETS, p));
  }
  updatePreset(id: string, p: UpdatePresetRequest): ApiResult<Preset> {
    return run(() => this.put<Preset, UpdatePresetRequest>(`${API_ENDPOINTS.PRESETS}/${id}`, p));
  }
  deletePreset(id: string): ApiResult<{ id: string }> {
    return run(() => this.delete<{ id: string }>(`${API_ENDPOINTS.PRESETS}/${id}`));
  }

  // Workspaces
  listWorkspaces(): ApiResult<Workspace[]> {
    return run(() => this.get<Workspace[]>(API_ENDPOINTS.WORKSPACES));
  }
  createWorkspace(p: CreateWorkspaceRequest): ApiResult<Workspace> {
    return run(() => this.post<Workspace, CreateWorkspaceRequest>(API_ENDPOINTS.WORKSPACES, p));
  }
  updateWorkspace(id: string, p: UpdateWorkspaceRequest): ApiResult<Workspace> {
    return run(() => this.put<Workspace, UpdateWorkspaceRequest>(`${API_ENDPOINTS.WORKSPACES}/${id}`, p));
  }
  deleteWorkspace(id: string): ApiResult<{ id: string }> {
    return run(() => this.delete<{ id: string }>(`${API_ENDPOINTS.WORKSPACES}/${id}`));
  }

  // Assistants
  listAssistants(): ApiResult<Assistant[]> {
    return run(() => this.get<Assistant[]>(API_ENDPOINTS.ASSISTANTS));
  }

  // Collections
  listCollections(): ApiResult<Collection[]> {
    return run(() => this.get<Collection[]>(API_ENDPOINTS.COLLECTIONS));
  }

  // Prompts
  listPrompts(): ApiResult<Prompt[]> {
    return run(() => this.get<Prompt[]>(API_ENDPOINTS.PROMPTS));
  }
  createPrompt(p: CreatePromptRequest): ApiResult<Prompt> {
    return run(() => this.post<Prompt, CreatePromptRequest>(API_ENDPOINTS.PROMPTS, p));
  }
  updatePrompt(id: string, p: UpdatePromptRequest): ApiResult<Prompt> {
    return run(() => this.put<Prompt, UpdatePromptRequest>(`${API_ENDPOINTS.PROMPTS}/${id}`, p));
  }
  deletePrompt(id: string): ApiResult<{ id: string }> {
    return run(() => this.delete<{ id: string }>(`${API_ENDPOINTS.PROMPTS}/${id}`));
  }

  // Tools
  listTools(): ApiResult<Tool[]> {
    return run(() => this.get<Tool[]>(API_ENDPOINTS.TOOLS));
  }

  // Models
  listModels(): ApiResult<ModelRef[]> {
    return run(() => this.get<ModelRef[]>(API_ENDPOINTS.MODELS));
  }

  // (Auth related convenience helpers removed: implement in zustand slice via post())
}

// Export a default singleton instance
export const apiClient = new ApiClient();
