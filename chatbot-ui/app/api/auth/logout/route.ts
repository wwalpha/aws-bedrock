import { NextResponse } from "next/server"

const backendBase = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ""

export async function POST() {
  const res = await fetch(`${backendBase}/v1/auth/logout`, { method: "POST", credentials: "include" })
  const text = await res.text()
  const nextRes = new NextResponse(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" }
  })
  const setCookie = res.headers.get("set-cookie")
  if (setCookie) nextRes.headers.append("set-cookie", setCookie)
  return nextRes
}
