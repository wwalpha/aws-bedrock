import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getModelById = async (modelId: string) => {
  return api.get(`/v1/models/${encodeURIComponent(modelId)}`)
}

export const getModelWorkspacesByWorkspaceId = async (workspaceId: string) => {
  return api.get(
    `/v1/workspaces/${encodeURIComponent(workspaceId)}?include=models`
  )
}

export const getModelWorkspacesByModelId = async (modelId: string) => {
  return api.get(`/v1/models/${encodeURIComponent(modelId)}?include=workspaces`)
}

export const createModel = async (
  model: TablesInsert<"models">,
  workspace_id: string
) => {
  const created = await api.post(`/v1/models`, model)
  await api.post(`/v1/model_workspaces`, {
    user_id: created.user_id,
    model_id: created.id,
    workspace_id
  })
  return created
}

export const createModels = async (
  models: TablesInsert<"models">[],
  workspace_id: string
) => {
  const createdModels = await api.post(`/v1/models/bulk`, { items: models })
  await createModelWorkspaces(
    createdModels.map((m: any) => ({
      user_id: m.user_id,
      model_id: m.id,
      workspace_id
    }))
  )
  return createdModels
}

export const updateModel = async (
  modelId: string,
  model: TablesUpdate<"models">
) => {
  return api.put(`/v1/models/${encodeURIComponent(modelId)}`, model)
}

export const deleteModel = async (modelId: string) => {
  await api.delete(`/v1/models/${encodeURIComponent(modelId)}`)
  return true
}

export const deleteModelWorkspace = async (
  modelId: string,
  workspaceId: string
) => {
  await api.delete(
    `/v1/model_workspaces?model_id=${encodeURIComponent(modelId)}&workspace_id=${encodeURIComponent(workspaceId)}`
  )
  return true
}

export const createModelWorkspace = async (item: {
  user_id: string
  model_id: string
  workspace_id: string
}) => {
  return api.post(`/v1/model_workspaces`, item)
}

export const createModelWorkspaces = async (
  items: { user_id: string; model_id: string; workspace_id: string }[]
) => {
  return api.post(`/v1/model_workspaces/bulk`, { items })
}
