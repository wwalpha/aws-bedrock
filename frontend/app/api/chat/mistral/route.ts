import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai/index.mjs"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const base = process.env.BACKEND_URL || ""
    if (!base) throw new Error("BACKEND_URL not configured")
    const res = await fetch(`${base}/v1/profile/me`, { credentials: "include" })
    if (!res.ok) return new Response("Unauthorized", { status: 401 })
    const profile = await res.json()
    if (!profile.mistral_api_key)
      return new Response("Mistral API Key not found", { status: 400 })

    // Mistral is compatible the OpenAI SDK
    const mistral = new OpenAI({
      apiKey: profile.mistral_api_key || "",
      baseURL: "https://api.mistral.ai/v1"
    })

    const response = await mistral.chat.completions.create({
      model: chatSettings.model,
      messages,
      max_tokens:
        CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
      stream: true
    })

    // Convert the response into a friendly text-stream.
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Mistral API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Mistral API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
