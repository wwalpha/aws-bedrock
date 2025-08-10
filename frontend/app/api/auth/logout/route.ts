import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { api } from "@/lib/api/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const backendBase = process.env.BACKEND_URL || ""

export async function POST(req: Request) {
  const jar = await cookies()
  const accessToken = jar?.get("accessToken")?.value
  let bodyToken: string | undefined
  try {
    const b = await req.json()
    bodyToken = b?.accessToken
  } catch {}

  let data: any = {}
  let status = 200
  try {
    data = await api.post("/auth/logout", {
      accessToken: bodyToken || accessToken
    })
    status = 200
  } catch (e: any) {
    data = { error: e.message }
    status = 401
  }

  // Clear cookies on frontend regardless of backend response
  const nextRes = NextResponse.json(data, { status })
  nextRes.cookies.set("idToken", "", { path: "/", maxAge: 0 })
  nextRes.cookies.set("accessToken", "", { path: "/", maxAge: 0 })
  nextRes.cookies.set("refreshToken", "", { path: "/", maxAge: 0 })
  return nextRes
}
