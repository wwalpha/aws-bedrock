import axios, { AxiosInstance } from "axios"

const base = process.env.BACKEND_URL || ""

const client: AxiosInstance = axios.create({
  // Don't hard-fail at import time if base is missing; handlers will validate
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
      if (
        typeof XMLHttpRequest === "undefined" &&
        typeof window === "undefined"
      ) {
        // Likely Edge runtime (no XHR). Use fetch fallback.
        const res = await fetch(`${base}${p}`, {
          credentials: "include",
          headers: { "content-type": "application/json" }
        })
        if (!res.ok) throw new Error((await res.text()) || `${res.status}`)
        const ct = res.headers.get("content-type") || ""
        return ct.includes("application/json") ? res.json() : res.text()
      }
      const res = await client.get(p)
      return res.data
    } catch (e) {
      handleError(e)
    }
  },
  post: async (p: string, body?: any) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      if (
        typeof XMLHttpRequest === "undefined" &&
        typeof window === "undefined"
      ) {
        const res = await fetch(`${base}${p}`, {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: body ? JSON.stringify(body) : undefined
        })
        if (!res.ok) throw new Error((await res.text()) || `${res.status}`)
        const ct = res.headers.get("content-type") || ""
        return ct.includes("application/json") ? res.json() : res.text()
      }
      const res = await client.post(p, body)
      return res.data
    } catch (e) {
      handleError(e)
    }
  },
  put: async (p: string, body?: any) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      if (
        typeof XMLHttpRequest === "undefined" &&
        typeof window === "undefined"
      ) {
        const res = await fetch(`${base}${p}`, {
          method: "PUT",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: body ? JSON.stringify(body) : undefined
        })
        if (!res.ok) throw new Error((await res.text()) || `${res.status}`)
        const ct = res.headers.get("content-type") || ""
        return ct.includes("application/json") ? res.json() : res.text()
      }
      const res = await client.put(p, body)
      return res.data
    } catch (e) {
      handleError(e)
    }
  },
  patch: async (p: string, body?: any) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      if (
        typeof XMLHttpRequest === "undefined" &&
        typeof window === "undefined"
      ) {
        const res = await fetch(`${base}${p}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: body ? JSON.stringify(body) : undefined
        })
        if (!res.ok) throw new Error((await res.text()) || `${res.status}`)
        const ct = res.headers.get("content-type") || ""
        return ct.includes("application/json") ? res.json() : res.text()
      }
      const res = await client.patch(p, body)
      return res.data
    } catch (e) {
      handleError(e)
    }
  },
  delete: async (p: string) => {
    try {
      if (!base) throw new Error("BACKEND_URL not configured")
      if (
        typeof XMLHttpRequest === "undefined" &&
        typeof window === "undefined"
      ) {
        const res = await fetch(`${base}${p}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "content-type": "application/json" }
        })
        if (!res.ok) throw new Error((await res.text()) || `${res.status}`)
        const ct = res.headers.get("content-type") || ""
        return ct.includes("application/json") ? res.json() : res.text()
      }
      const res = await client.delete(p)
      return res.data
    } catch (e) {
      handleError(e)
    }
  }
}
