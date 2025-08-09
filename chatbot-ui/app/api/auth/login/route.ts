import { NextResponse } from "next/server"

const backendBase = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ""

export async function POST(req: Request) {
  const body = await req.text()
  const url = `${backendBase}/v1/auth/login`
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": req.headers.get("content-type") || "application/json" },
    body,
    redirect: "manual"
  })

  const text = await res.text()
  const nextRes = new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json"
    }
  })

  // Forward Set-Cookie headers
  const setCookie = res.headers.get("set-cookie")
  if (setCookie) {
    nextRes.headers.append("set-cookie", setCookie)
    // Also expose to browser if needed
    nextRes.headers.append("access-control-expose-headers", "set-cookie")
  }

  return nextRes
}
