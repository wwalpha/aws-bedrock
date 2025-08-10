import { NextResponse } from "next/server"
import { api } from "@/lib/api/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const backendBase = process.env.BACKEND_URL || ""

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  try {
    const data = await api.post("/auth/signup", { email, password })
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
