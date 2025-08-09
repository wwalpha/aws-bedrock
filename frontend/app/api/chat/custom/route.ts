import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai/index.mjs"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages, customModelId } = json as {
    chatSettings: ChatSettings
    messages: any[]
    customModelId: string
  }

  try {
    const base =
      process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ""
    if (!base) throw new Error("BACKEND_URL not configured")
    const res = await fetch(
      `${base}/v1/models/${encodeURIComponent(customModelId)}`,
      {
        credentials: "include",
        headers: { cookie: request.headers.get("cookie") || "" }
      }
    )
    if (!res.ok) throw new Error("Custom model not found")
    const customModel = await res.json()

    const custom = new OpenAI({
      apiKey: customModel.api_key || "",
      baseURL: customModel.base_url
    })

    const response = await custom.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Custom API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "Custom API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
