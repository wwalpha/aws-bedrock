const base =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ""

async function request(path: string, init?: RequestInit) {
  if (!base) throw new Error("BACKEND_URL not configured")
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {})
    },
    credentials: "include"
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `${res.status}`)
  }
  const ct = res.headers.get("content-type") || ""
  return ct.includes("application/json") ? res.json() : res.text()
}

export const api = {
  get: (p: string) => request(p),
  post: (p: string, body?: any) =>
    request(p, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined
    }),
  put: (p: string, body?: any) =>
    request(p, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined
    }),
  patch: (p: string, body?: any) =>
    request(p, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined
    }),
  delete: (p: string) => request(p, { method: "DELETE" })
}
