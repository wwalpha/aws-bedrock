import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useChatStore } from '@/store';

export type ApiRequestConfig<T = any> = AxiosRequestConfig<T>;

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

  request<T = any, D = any>(config: ApiRequestConfig<D>) {
    return this.axios.request<T, AxiosResponse<T>, D>(config);
  }

  get<T = any>(url: string, config?: ApiRequestConfig) {
    return this.axios.get<T>(url, config);
  }

  post<T = any, D = any>(url: string, data?: D, config?: ApiRequestConfig<D>) {
    return this.axios.post<T, AxiosResponse<T>, D>(url, data, config);
  }

  put<T = any, D = any>(url: string, data?: D, config?: ApiRequestConfig<D>) {
    return this.axios.put<T, AxiosResponse<T>, D>(url, data, config);
  }

  delete<T = any>(url: string, config?: ApiRequestConfig) {
    return this.axios.delete<T>(url, config);
  }
}

// Export a default singleton instance
export const apiClient = new ApiClient();
