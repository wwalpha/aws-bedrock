import { generateLocalEmbedding } from "@/lib/generate-local-embedding"
const base =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ""
import OpenAI from "openai"

export async function POST(request: Request) {
  const json = await request.json()
  const { userInput, fileIds, embeddingsProvider, sourceCount } = json as {
    userInput: string
    fileIds: string[]
    embeddingsProvider: "openai" | "local"
    sourceCount: number
  }

  const uniqueFileIds = [...new Set(fileIds)]

  try {
    if (!base) throw new Error("BACKEND_URL not configured")
    const profRes = await fetch(`${base}/v1/profile/me`, {
      credentials: "include",
      headers: { cookie: request.headers.get("cookie") || "" }
    })
    if (!profRes.ok) return new Response("Unauthorized", { status: 401 })
    const profile = await profRes.json()

    // Validate required API keys client-side; backend should also enforce
    if (embeddingsProvider === "openai") {
      if (profile.use_azure_openai && !profile.azure_openai_api_key)
        throw new Error("Azure OpenAI API Key not found")
      if (!profile.use_azure_openai && !profile.openai_api_key)
        throw new Error("OpenAI API Key not found")
    }

    let chunks: any[] = []

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
        input: userInput
      })

      const openaiEmbedding = response.data.map(item => item.embedding)[0]

      const matchRes = await fetch(`${base}/v1/retrieval/match`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          cookie: request.headers.get("cookie") || ""
        },
        body: JSON.stringify({
          provider: "openai",
          query_embedding: openaiEmbedding,
          match_count: sourceCount,
          file_ids: uniqueFileIds
        })
      })
      if (!matchRes.ok) throw new Error("Match failed")
      chunks = await matchRes.json()
    } else if (embeddingsProvider === "local") {
      const localEmbedding = await generateLocalEmbedding(userInput)

      const matchRes = await fetch(`${base}/v1/retrieval/match`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          cookie: request.headers.get("cookie") || ""
        },
        body: JSON.stringify({
          provider: "local",
          query_embedding: localEmbedding,
          match_count: sourceCount,
          file_ids: uniqueFileIds
        })
      })
      if (!matchRes.ok) throw new Error("Match failed")
      chunks = await matchRes.json()
    }

    const mostSimilarChunks = chunks?.sort(
      (a, b) => b.similarity - a.similarity
    )

    return new Response(JSON.stringify({ results: mostSimilarChunks }), {
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
