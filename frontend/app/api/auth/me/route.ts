import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const backendBase =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ""

export async function GET() {
  if (!backendBase) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 401 }
    )
  }
  const res = await fetch(`${backendBase}/v1/auth/me`, {
    method: "GET"
    // In Next.js Route Handlers, cookies from the incoming request are available
    // automatically on server-side fetch. We simply forward the call.
  })
  const text = await res.text()
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json"
    }
  })
}
