import { NextResponse } from "next/server"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import type { SignupRequest, SignupResponse } from "@/types/api"

// Core signup logic takes email/password directly as parameters
async function signup(email: string, password: string) {
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  try {
    const data = await api.post<SignupResponse>(API.auth.signup, {
      email,
      password
    } satisfies SignupRequest)
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

// Overloads to support testing/direct invocation with params, and Next.js runtime with Request
export async function POST(
  email: string,
  password: string
): Promise<NextResponse>
export async function POST(req: Request): Promise<NextResponse>
export async function POST(a: any, b?: any): Promise<NextResponse> {
  if (typeof a === "string") {
    // Called as POST(email, password)
    return signup(a, b ?? "")
  }
  const { email, password } = (await a.json().catch(() => ({}))) as {
    email?: string
    password?: string
  }
  return signup(email || "", password || "")
}
