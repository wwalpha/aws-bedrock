
import axios, { AxiosInstance } from "axios"

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
  get: async (p: string) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      const res = await client.get(p)
      return res.data
    } catch (e) {
      handleError(e)
    }
  },
  post: async (p: string, body?: any) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      const res = await client.post(p, body)
      return res.data
    } catch (e) {
      handleError(e)
    }
  },
  put: async (p: string, body?: any) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      const res = await client.put(p, body)
      return res.data
    } catch (e) {
      handleError(e)
    }
  },
  patch: async (p: string, body?: any) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      const res = await client.patch(p, body)
      return res.data
    } catch (e) {
      handleError(e)
    }
  },
  delete: async (p: string) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      const res = await client.delete(p)
      return res.data
    } catch (e) {
      handleError(e)
    }
  }
}
