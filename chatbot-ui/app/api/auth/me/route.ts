import { NextResponse } from "next/server"

const backendBase = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ""

export async function GET() {
  const res = await fetch(`${backendBase}/v1/auth/me`, {
    method: "GET",
    // In Next.js Route Handlers, cookies from the incoming request are available
    // automatically on server-side fetch. We simply forward the call.
  })
  const text = await res.text()
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" }
  })
}
