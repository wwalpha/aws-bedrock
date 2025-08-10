// Central API request/response types used by our unified api client.

// Auth
export interface LoginRequest {
  // Backend expects `username`; our UI maps email->username on login
  username: string
  password: string
}

export interface LoginResponse {
  idToken?: string
  accessToken?: string
  refreshToken?: string
  [key: string]: any
}

export interface LogoutRequest {
  accessToken?: string
}

export interface SignupRequest {
  password: string
  email?: string
}

export interface SignupResponse {
  userId?: string
  [key: string]: any
}

export interface GenericErrorResponse {
  error?: string
  message?: string
  status?: number
  [key: string]: any
}

// Profile
export interface ProfileMeResponse {
  id: string
  email?: string
  username?: string
  use_azure_openai?: boolean
  openai_api_key?: string | null
  openai_organization_id?: string | null
  azure_openai_api_key?: string | null
  azure_openai_endpoint?: string | null
  azure_openai_embeddings_id?: string | null
  // other fields tolerated
  [key: string]: any
}

// Retrieval
export interface RetrievalMatchRequest {
  provider: "openai" | "local"
  query_embedding: number[]
  match_count: number
  file_ids: string[]
}

export interface RetrievalChunk {
  id: string
  content: string
  similarity: number
  file_id?: string
  [key: string]: any
}

// Chat: Tools route
import type { ChatSettings } from "@/types"
import type { Tables } from "@/types/db"
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs"

export interface ChatToolsRequest {
  chatSettings: ChatSettings
  messages: ChatCompletionMessageParam[]
  selectedTools: Tables<"tools">[]
}

// For non-streaming tool-less completions path
export interface ChatToolsJSONResponse {
  content: string | null
}

// Generic response type union for this route
export type ChatToolsResponse =
  | ChatToolsJSONResponse
  | ReadableStream<Uint8Array>
