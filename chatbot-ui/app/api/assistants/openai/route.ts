const base =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ""
import { ServerRuntime } from "next"
import OpenAI from "openai"

export const runtime: ServerRuntime = "edge"

export async function GET() {
  try {
    if (!base) throw new Error("BACKEND_URL not configured")
    const res = await fetch(`${base}/v1/profile/me`, { credentials: "include" })
    if (!res.ok) return new Response("Unauthorized", { status: 401 })
    const profile = await res.json()
    if (!profile.openai_api_key)
      return new Response("OpenAI API Key not found", { status: 400 })

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const myAssistants = await openai.beta.assistants.list({
      limit: 100
    })

    return new Response(JSON.stringify({ assistants: myAssistants.data }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
