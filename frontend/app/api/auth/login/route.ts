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

  // Map incoming { email, password } to backend's { username, password }
  let email = ""
  let password = ""
  try {
    const json = await req.json()
    email = json?.email || json?.username || ""
    password = json?.password || ""
  } catch {}
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  const url = `${backendBase}/auth/login`
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: email, password })
  })

  const data = await res.json().catch(() => null)
  const nextRes = NextResponse.json(data ?? {}, { status: res.status })

  // Set auth cookies if available
  if (res.ok && data) {
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: true,
      path: "/"
    }
    if (data.idToken) nextRes.cookies.set("idToken", data.idToken, cookieOpts)
    if (data.accessToken)
      nextRes.cookies.set("accessToken", data.accessToken, cookieOpts)
    if (data.refreshToken)
      nextRes.cookies.set("refreshToken", data.refreshToken, cookieOpts)
  }

  return nextRes
}
