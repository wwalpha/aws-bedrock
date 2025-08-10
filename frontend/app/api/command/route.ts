import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import OpenAI from "openai/index.mjs"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const json = await request.json()
  const { input } = json as {
    input: string
  }

  try {
    const base = process.env.BACKEND_URL || ""

    const profile = await api.get(API.backend.profile.me, {
      headers: { cookie: request.headers.get("cookie") || "" }
    })
    if (!profile.openai_api_key)
      return new Response("OpenAI API Key not found", { status: 400 })

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "Respond to the user."
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0,
      max_tokens:
        CHAT_SETTING_LIMITS["gpt-4-turbo-preview"].MAX_TOKEN_OUTPUT_LENGTH
      //   response_format: { type: "json_object" }
      //   stream: true
    })

    const content = response.choices[0].message.content

    return new Response(JSON.stringify({ content }), {
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
