import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getPromptById = async (promptId: string) => {
  return api.get(`/v1/prompts/${encodeURIComponent(promptId)}`)
}

export const getPromptWorkspacesByWorkspaceId = async (workspaceId: string) => {
  return api.get(
    `/v1/workspaces/${encodeURIComponent(workspaceId)}?include=prompts`
  )
}

export const getPromptWorkspacesByPromptId = async (promptId: string) => {
  return api.get(
    `/v1/prompts/${encodeURIComponent(promptId)}?include=workspaces`
  )
}

export const createPrompt = async (
  prompt: TablesInsert<"prompts">,
  workspace_id: string
) => {
  const created = await api.post(`/v1/prompts`, prompt)
  await createPromptWorkspace({
    user_id: created.user_id,
    prompt_id: created.id,
    workspace_id
  })
  return created
}

export const createPrompts = async (
  prompts: TablesInsert<"prompts">[],
  workspace_id: string
) => {
  const createdPrompts = await api.post(`/v1/prompts/bulk`, { items: prompts })
  await createPromptWorkspaces(
    createdPrompts.map((prompt: any) => ({
      user_id: prompt.user_id,
      prompt_id: prompt.id,
      workspace_id
    }))
  )
  return createdPrompts
}

export const createPromptWorkspace = async (item: {
  user_id: string
  prompt_id: string
  workspace_id: string
}) => {
  return api.post(`/v1/prompt_workspaces`, item)
}

export const createPromptWorkspaces = async (
  items: { user_id: string; prompt_id: string; workspace_id: string }[]
) => {
  return api.post(`/v1/prompt_workspaces/bulk`, { items })
}

export const updatePrompt = async (
  promptId: string,
  prompt: TablesUpdate<"prompts">
) => {
  return api.put(`/v1/prompts/${encodeURIComponent(promptId)}`, prompt)
}

export const deletePrompt = async (promptId: string) => {
  await api.delete(`/v1/prompts/${encodeURIComponent(promptId)}`)
  return true
}

export const deletePromptWorkspace = async (
  promptId: string,
  workspaceId: string
) => {
  await api.delete(
    `/v1/prompt_workspaces?prompt_id=${encodeURIComponent(promptId)}&workspace_id=${encodeURIComponent(workspaceId)}`
  )
  return true
}
