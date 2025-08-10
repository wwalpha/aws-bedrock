import { NextResponse } from "next/server"
import { api } from "@/lib/api/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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

  let data: any = null
  let status = 500
  try {
    data = await api.post("/auth/login", { username: email, password })
    status = 200
  } catch (e: any) {
    // Best effort to extract status/message from api client error
    data = { error: e.message }
    status = 401
  }
  const nextRes = NextResponse.json(data ?? {}, { status })

  // Set auth cookies if available
  if (status >= 200 && status < 300 && data) {
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
