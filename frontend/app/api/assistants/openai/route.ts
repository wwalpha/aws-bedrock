const base = process.env.BACKEND_URL
import { ServerRuntime } from "next"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import OpenAI from "openai/index.mjs"

export const runtime: ServerRuntime = "nodejs"

export async function GET(request: Request) {
  try {
    if (!base) throw new Error("BACKEND_URL not configured")
    const profile = await api.get(API.backend.profile.me, {
      headers: { cookie: request.headers.get("cookie") || "" }
    })
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
