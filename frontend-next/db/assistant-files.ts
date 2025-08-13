import { api } from "@/lib/api/client"
import { TablesInsert } from "@/types/db"

export const getAssistantFilesByAssistantId = async (assistantId: string) => {
  return api.get(
    `/v1/assistants/${encodeURIComponent(assistantId)}?include=files`
  )
}

export const createAssistantFile = async (
  assistantFile: TablesInsert<"assistant_files">
) => {
  return api.post(`/v1/assistant_files`, assistantFile)
}

export const createAssistantFiles = async (
  assistantFiles: TablesInsert<"assistant_files">[]
) => {
  return api.post(`/v1/assistant_files/bulk`, { items: assistantFiles })
}

export const deleteAssistantFile = async (
  assistantId: string,
  fileId: string
) => {
  await api.delete(
    `/v1/assistant_files?assistant_id=${encodeURIComponent(assistantId)}&file_id=${encodeURIComponent(fileId)}`
  )
  return true
}
