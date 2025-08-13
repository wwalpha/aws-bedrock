import { NextResponse } from "next/server"
import { api } from "@/lib/api/client"
import type { LoginRequest, LoginResponse } from "@/types/api"
import { API } from "@/lib/api/endpoints"

const backendBase = process.env.BACKEND_URL || ""

export async function POST(req: Request) {
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

  let data: LoginResponse | { error?: string } | null = null
  let status = 500
  try {
    data = await api.post<LoginResponse>(API.auth.login, {
      username: email,
      password
    } satisfies LoginRequest)
    status = 200
  } catch (e: any) {
    // Best effort to extract status/message from api client error
    data = { error: e.message }
    status = 401
  }
  const nextRes = NextResponse.json(data ?? {}, { status })

  // Set auth cookies if available
  if (status >= 200 && status < 300 && data && !("error" in data)) {
    const tokens = data as LoginResponse
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: true,
      path: "/"
    }
    if (tokens.idToken)
      nextRes.cookies.set("idToken", tokens.idToken, cookieOpts)
    if (tokens.accessToken)
      nextRes.cookies.set("accessToken", tokens.accessToken, cookieOpts)
    if (tokens.refreshToken)
      nextRes.cookies.set("refreshToken", tokens.refreshToken, cookieOpts)
  }

  return nextRes
}
