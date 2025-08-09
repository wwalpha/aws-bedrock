import { generateLocalEmbedding } from "@/lib/generate-local-embedding"
import {
  processCSV,
  processJSON,
  processMarkdown,
  processPdf,
  processTxt
} from "@/lib/retrieval/processing"
import { NextResponse } from "next/server"
import OpenAI from "openai/index.mjs"

const base =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ""
import { FileItemChunk } from "@/types"

export async function POST(req: Request) {
  try {
    if (!base) {
      return new NextResponse("BACKEND_URL not configured", { status: 500 })
    }
    const profileRes = await fetch(`${base}/v1/profile/me`, {
      credentials: "include",
      headers: { cookie: req.headers.get("cookie") || "" }
    })
    if (!profileRes.ok) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const profile = await profileRes.json()

    const formData = await req.formData()

    const file_id = formData.get("file_id") as string
    const embeddingsProvider = formData.get("embeddingsProvider") as string

    const metaRes = await fetch(
      `${base}/v1/files/${encodeURIComponent(file_id)}`,
      {
        credentials: "include",
        headers: { cookie: req.headers.get("cookie") || "" }
      }
    )
    if (!metaRes.ok) throw new Error("Failed to load file metadata")
    const fileMetadata = await metaRes.json()

    if (fileMetadata.user_id !== profile.user_id) {
      throw new Error("Unauthorized")
    }

    // Fetch signed URL from backend, then download the file
    const signedRes = await fetch(
      `${base}/v1/upload/signed-url?scope=files&path=${encodeURIComponent(
        fileMetadata.file_path
      )}&ttl=300`,
      {
        credentials: "include",
        headers: { cookie: req.headers.get("cookie") || "" }
      }
    )
    if (!signedRes.ok) throw new Error("Failed to retrieve signed url")
    const signed = await signedRes.json()
    const fileRes = await fetch(signed.url)
    if (!fileRes.ok) throw new Error("Failed to retrieve file from storage")

    const blob = await fileRes.blob()
    const fileExtension = fileMetadata.name.split(".").pop()?.toLowerCase()

    if (embeddingsProvider === "openai") {
      if (profile.use_azure_openai && !profile.azure_openai_api_key)
        throw new Error(
          "Azure OpenAI API Key not found, or use local embeddings"
        )
      if (!profile.use_azure_openai && !profile.openai_api_key)
        throw new Error("OpenAI API Key not found, or use local embeddings")
    }

    let chunks: FileItemChunk[] = []

    switch (fileExtension) {
      case "csv":
        chunks = await processCSV(blob)
        break
      case "json":
        chunks = await processJSON(blob)
        break
      case "md":
        chunks = await processMarkdown(blob)
        break
      case "pdf":
        chunks = await processPdf(blob)
        break
      case "txt":
        chunks = await processTxt(blob)
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
      file_id,
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

    await fetch(`${base}/v1/files/${encodeURIComponent(file_id)}`, {
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
    console.log(`Error in retrieval/process: ${error.stack}`)
    const errorMessage = error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
