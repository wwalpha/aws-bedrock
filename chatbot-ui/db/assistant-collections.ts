import { api } from "@/lib/api/client"
import { TablesInsert } from "@/types/db"

export const getAssistantCollectionsByAssistantId = async (
  assistantId: string
) => {
  return api.get(
    `/v1/assistants/${encodeURIComponent(assistantId)}?include=collections`
  )
}

export const createAssistantCollection = async (
  assistantCollection: TablesInsert<"assistant_collections">
) => {
  return api.post(`/v1/assistant_collections`, assistantCollection)
}

export const createAssistantCollections = async (
  assistantCollections: TablesInsert<"assistant_collections">[]
) => {
  return api.post(`/v1/assistant_collections/bulk`, {
    items: assistantCollections
  })
}

export const deleteAssistantCollection = async (
  assistantId: string,
  collectionId: string
) => {
  await api.delete(
    `/v1/assistant_collections?assistant_id=${encodeURIComponent(assistantId)}&collection_id=${encodeURIComponent(collectionId)}`
  )
  return true
}
