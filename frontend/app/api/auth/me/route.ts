import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const backendBase = process.env.BACKEND_URL || ""

export async function GET() {
  const jar = await cookies()
  const idToken = jar?.get("idToken")?.value
  const accessToken = jar?.get("accessToken")?.value

  // Fallback: if tokens exist, consider user as logged-in minimally
  if (idToken || accessToken) {
    return NextResponse.json({ ok: true })
  }

  // If backend implements an identity/me endpoint later, call it here.
  // For now, decode idToken (JWT) to return a minimal identity when available.
  if (idToken) {
    try {
      const [, payload] = idToken.split(".")
      const json = JSON.parse(
        Buffer.from(
          payload.replace(/-/g, "+").replace(/_/g, "/"),
          "base64"
        ).toString("utf8")
      ) as { sub?: string; email?: string }
      return NextResponse.json({ id: json.sub, email: json.email, ok: true })
    } catch {}
  }
  if (accessToken) return NextResponse.json({ ok: true })
  return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
}
