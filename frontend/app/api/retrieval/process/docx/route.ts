import { generateLocalEmbedding } from "@/lib/generate-local-embedding"
import { processDocX } from "@/lib/retrieval/processing"
import { FileItemChunk } from "@/types"
import { NextResponse } from "next/server"
import OpenAI from "openai/index.mjs"

const base =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ""

export async function POST(req: Request) {
  if (!base) {
    return new NextResponse("BACKEND_URL not configured", { status: 500 })
  }
  const json = await req.json()
  const { text, fileId, embeddingsProvider, fileExtension } = json as {
    text: string
    fileId: string
    embeddingsProvider: "openai" | "local"
    fileExtension: string
  }

  try {
    const profileRes = await fetch(`${base}/v1/profile/me`, {
      credentials: "include",
      headers: { cookie: req.headers.get("cookie") || "" }
    })
    if (!profileRes.ok) return new NextResponse("Unauthorized", { status: 401 })
    const profile = await profileRes.json()

    if (embeddingsProvider === "openai") {
      if (profile.use_azure_openai && !profile.azure_openai_api_key)
        throw new Error("Azure OpenAI API Key not found")
      if (!profile.use_azure_openai && !profile.openai_api_key)
        throw new Error("OpenAI API Key not found")
    }

    let chunks: FileItemChunk[] = []

    switch (fileExtension) {
      case "docx":
        chunks = await processDocX(text)
        break
      default:
        return new NextResponse("Unsupported file type", {
          status: 400
        })
    }

    let embeddings: any = []

    let openai
    if (profile.use_azure_openai) {
      openai = new OpenAI({
        apiKey: profile.azure_openai_api_key || "",
        baseURL: `${profile.azure_openai_endpoint}/openai/deployments/${profile.azure_openai_embeddings_id}`,
        defaultQuery: { "api-version": "2023-12-01-preview" },
        defaultHeaders: { "api-key": profile.azure_openai_api_key }
      })
    } else {
      openai = new OpenAI({
        apiKey: profile.openai_api_key || "",
        organization: profile.openai_organization_id
      })
    }

    if (embeddingsProvider === "openai") {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks.map(chunk => chunk.content)
      })

      embeddings = response.data.map((item: any) => {
        return item.embedding
      })
    } else if (embeddingsProvider === "local") {
      const embeddingPromises = chunks.map(async chunk => {
        try {
          return await generateLocalEmbedding(chunk.content)
        } catch (error) {
          console.error(`Error generating embedding for chunk: ${chunk}`, error)
          return null
        }
      })

      embeddings = await Promise.all(embeddingPromises)
    }

    const file_items = chunks.map((chunk, index) => ({
      file_id: fileId,
      user_id: profile.user_id,
      content: chunk.content,
      tokens: chunk.tokens,
      openai_embedding:
        embeddingsProvider === "openai"
          ? ((embeddings[index] || null) as any)
          : null,
      local_embedding:
        embeddingsProvider === "local"
          ? ((embeddings[index] || null) as any)
          : null
    }))

    await fetch(`${base}/v1/file_items/bulk`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        cookie: req.headers.get("cookie") || ""
      },
      body: JSON.stringify({ items: file_items })
    })

    const totalTokens = file_items.reduce((acc, item) => acc + item.tokens, 0)

    await fetch(`${base}/v1/files/${encodeURIComponent(fileId)}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        cookie: req.headers.get("cookie") || ""
      },
      body: JSON.stringify({ tokens: totalTokens })
    })

    return new NextResponse("Embed Successful", {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
