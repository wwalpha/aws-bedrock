import { NextResponse } from "next/server"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import type { SignupRequest } from "@/types/api"

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as {
    email?: string
    password?: string
  }

  // Enforce username is email; thus email is required along with password
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  try {
    const body: SignupRequest = { password, email, username: email }
    const data = await api.post(API.auth.signup, body)
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
