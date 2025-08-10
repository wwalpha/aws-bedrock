import { NextResponse } from "next/server"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"

export async function POST(req: Request) {
  const { username, confirmationCode } = await req.json().catch(() => ({}))
  if (!username || !confirmationCode) {
    return NextResponse.json(
      { error: "Username and confirmation code are required" },
      { status: 400 }
    )
  }

  try {
    const data = await api.post(API.auth.confirmSignup, {
      username,
      confirmationCode
    })
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
