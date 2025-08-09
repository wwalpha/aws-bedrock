import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getAssistantById = async (assistantId: string) => {
  return api.get(`/v1/assistants/${encodeURIComponent(assistantId)}`)
}

export const getAssistantWorkspacesByWorkspaceId = async (
  workspaceId: string
) => {
  return api.get(
    `/v1/workspaces/${encodeURIComponent(workspaceId)}?include=assistants`
  )
}

export const getAssistantWorkspacesByAssistantId = async (
  assistantId: string
) => {
  return api.get(
    `/v1/assistants/${encodeURIComponent(assistantId)}?include=workspaces`
  )
}

export const createAssistant = async (
  assistant: TablesInsert<"assistants">,
  workspace_id: string
) => {
  const created = await api.post(`/v1/assistants`, assistant)
  await createAssistantWorkspace({
    user_id: created.user_id,
    assistant_id: created.id,
    workspace_id
  })
  return created
}

export const createAssistants = async (
  assistants: TablesInsert<"assistants">[],
  workspace_id: string
) => {
  const createdAssistants = await api.post(`/v1/assistants/bulk`, {
    items: assistants
  })
  await createAssistantWorkspaces(
    createdAssistants.map((assistant: any) => ({
      user_id: assistant.user_id,
      assistant_id: assistant.id,
      workspace_id
    }))
  )
  return createdAssistants
}

export const createAssistantWorkspace = async (item: {
  user_id: string
  assistant_id: string
  workspace_id: string
}) => {
  return api.post(`/v1/assistant_workspaces`, item)
}

export const createAssistantWorkspaces = async (
  items: { user_id: string; assistant_id: string; workspace_id: string }[]
) => {
  return api.post(`/v1/assistant_workspaces/bulk`, { items })
}

export const updateAssistant = async (
  assistantId: string,
  assistant: TablesUpdate<"assistants">
) => {
  return api.put(`/v1/assistants/${encodeURIComponent(assistantId)}`, assistant)
}

export const deleteAssistant = async (assistantId: string) => {
  await api.delete(`/v1/assistants/${encodeURIComponent(assistantId)}`)
  return true
}

export const deleteAssistantWorkspace = async (
  assistantId: string,
  workspaceId: string
) => {
  await api.delete(
    `/v1/assistant_workspaces?assistant_id=${encodeURIComponent(assistantId)}&workspace_id=${encodeURIComponent(workspaceId)}`
  )
  return true
}
