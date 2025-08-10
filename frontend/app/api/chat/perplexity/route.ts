const base = process.env.BACKEND_URL || ""
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai/index.mjs"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await api.get(API.backend.profile.me, {
      headers: { cookie: request.headers.get("cookie") || "" }
    })
    if (!profile.perplexity_api_key)
      return new Response("Perplexity API Key not found", { status: 400 })

    // Perplexity is compatible the OpenAI SDK
    const perplexity = new OpenAI({
      apiKey: profile.perplexity_api_key || "",
      baseURL: "https://api.perplexity.ai/"
    })

    const response = await perplexity.chat.completions.create({
      model: chatSettings.model,
      messages,
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Perplexity API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Perplexity API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
