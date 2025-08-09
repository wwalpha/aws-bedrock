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
