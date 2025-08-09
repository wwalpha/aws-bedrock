import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const backendBase =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ""

export async function POST() {
  if (!backendBase) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 500 }
    )
  }
  const res = await fetch(`${backendBase}/v1/auth/logout`, {
    method: "POST",
    credentials: "include"
  })
  const text = await res.text()
  const nextRes = new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json"
    }
  })
  const setCookie = res.headers.get("set-cookie")
  if (setCookie) nextRes.headers.append("set-cookie", setCookie)
  return nextRes
}
