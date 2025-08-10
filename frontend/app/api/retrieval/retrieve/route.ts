import { generateLocalEmbedding } from "@/lib/generate-local-embedding"
const base = process.env.BACKEND_URL || ""
import OpenAI from "openai/index.mjs"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import type { ProfileMeResponse, RetrievalChunk } from "@/types/api"

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
    const profile = await api.get<ProfileMeResponse>(API.backend.profile.me, {
      headers: { cookie: request.headers.get("cookie") || "" }
    })

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

      chunks = await api.post<RetrievalChunk[]>(
        API.backend.retrieval.match,
        {
          provider: "openai",
          query_embedding: openaiEmbedding,
          match_count: sourceCount,
          file_ids: uniqueFileIds
        },
        { headers: { cookie: request.headers.get("cookie") || "" } }
      )
    } else if (embeddingsProvider === "local") {
      const localEmbedding = await generateLocalEmbedding(userInput)

      chunks = await api.post<RetrievalChunk[]>(
        API.backend.retrieval.match,
        {
          provider: "local",
          query_embedding: localEmbedding,
          match_count: sourceCount,
          file_ids: uniqueFileIds
        },
        { headers: { cookie: request.headers.get("cookie") || "" } }
      )
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
