import { api } from "@/lib/api/client"
import { TablesInsert } from "@/types/db"

export const getAssistantToolsByAssistantId = async (assistantId: string) => {
  return api.get(
    `/v1/assistants/${encodeURIComponent(assistantId)}?include=tools`
  )
}

export const createAssistantTool = async (
  assistantTool: TablesInsert<"assistant_tools">
) => {
  return api.post(`/v1/assistant_tools`, assistantTool)
}

export const createAssistantTools = async (
  assistantTools: TablesInsert<"assistant_tools">[]
) => {
  return api.post(`/v1/assistant_tools/bulk`, { items: assistantTools })
}

export const deleteAssistantTool = async (
  assistantId: string,
  toolId: string
) => {
  await api.delete(
    `/v1/assistant_tools?assistant_id=${encodeURIComponent(assistantId)}&tool_id=${encodeURIComponent(toolId)}`
  )
  return true
}
