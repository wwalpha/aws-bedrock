import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

const base = process.env.BACKEND_URL || ""

const client: AxiosInstance = axios.create({
  baseURL: base || undefined,
  withCredentials: true,
  headers: {
    "content-type": "application/json"
  }
})

function handleError(error: any): never {
  if (error?.response) {
    const status = error.response.status
    const data = error.response.data
    const text = typeof data === "string" ? data : JSON.stringify(data)
    throw new Error(text || `${status}`)
  }
  // Network/other errors
  throw error
}

export const api = {
  get: async <T = any>(p: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const res: AxiosResponse<T> = await client.get(p, config)
      return res.data as T
    } catch (e) {
      handleError(e)
    }
  },
  post: async <T = any>(
    p: string,
    body?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const res: AxiosResponse<T> = await client.post(p, body, config)
      return res.data as T
    } catch (e) {
      handleError(e)
    }
  },
  put: async <T = any>(
    p: string,
    body?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const res: AxiosResponse<T> = await client.put(p, body, config)
      return res.data as T
    } catch (e) {
      handleError(e)
    }
  },
  patch: async <T = any>(
    p: string,
    body?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const res: AxiosResponse<T> = await client.patch(p, body, config)
      return res.data as T
    } catch (e) {
      handleError(e)
    }
  },
  delete: async <T = any>(
    p: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const res: AxiosResponse<T> = await client.delete(p, config)
      return res.data as T
    } catch (e) {
      handleError(e)
    }
  }
}
