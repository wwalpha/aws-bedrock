import { NextResponse } from "next/server"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import type { SignupRequest } from "@/types/api"

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as {
    email?: string
    password?: string
  }
  // Only password is required; email is optional
  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    )
  }

  try {
    const body: SignupRequest = email
      ? { password, email }
      : { password }
    const data = await api.post(API.auth.signup, body)
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
