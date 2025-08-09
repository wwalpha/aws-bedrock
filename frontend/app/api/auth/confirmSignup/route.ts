import { BACKEND_URL } from "@/lib/consts"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const backendBase = BACKEND_URL

export async function POST(req: Request) {
  const { username, confirmationCode } = await req.json().catch(() => ({}))
  if (!username || !confirmationCode) {
    return NextResponse.json(
      { error: "Username and confirmation code are required" },
      { status: 400 }
    )
  }

  const res = await fetch(`${backendBase}/auth/confirmSignup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, confirmationCode })
  })
  return NextResponse.json(await res.json().catch(() => ({})), {
    status: res.status
  })
}
