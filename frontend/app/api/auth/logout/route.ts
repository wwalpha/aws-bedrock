import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const backendBase =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ""

export async function POST(req: Request) {
  if (!backendBase) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 500 }
    )
  }

  const jar = await cookies()
  const accessToken = jar?.get("accessToken")?.value
  let bodyToken: string | undefined
  try {
    const b = await req.json()
    bodyToken = b?.accessToken
  } catch {}

  const res = await fetch(`${backendBase}/auth/logout`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ accessToken: bodyToken || accessToken })
  })

  // Clear cookies on frontend regardless of backend response
  const nextRes = NextResponse.json(await res.json().catch(() => ({})), {
    status: res.status
  })
  nextRes.cookies.set("idToken", "", { path: "/", maxAge: 0 })
  nextRes.cookies.set("accessToken", "", { path: "/", maxAge: 0 })
  nextRes.cookies.set("refreshToken", "", { path: "/", maxAge: 0 })
  return nextRes
}
