import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getHomeWorkspaceByUserId = async (userId: string) => {
  const ws = await api.get(
    `/v1/workspaces?user_id=${encodeURIComponent(userId)}&is_home=true&single=1`
  )
  return ws.id
}

export const getWorkspaceById = async (workspaceId: string) => {
  return api.get(`/v1/workspaces/${encodeURIComponent(workspaceId)}`)
}

export const getWorkspacesByUserId = async (userId: string) => {
  return api.get(
    `/v1/workspaces?user_id=${encodeURIComponent(userId)}&order=created_at.desc`
  )
}

export const createWorkspace = async (
  workspace: TablesInsert<"workspaces">
) => {
  return api.post(`/v1/workspaces`, workspace)
}

export const updateWorkspace = async (
  workspaceId: string,
  workspace: TablesUpdate<"workspaces">
) => {
  return api.put(`/v1/workspaces/${encodeURIComponent(workspaceId)}`, workspace)
}

export const deleteWorkspace = async (workspaceId: string) => {
  await api.delete(`/v1/workspaces/${encodeURIComponent(workspaceId)}`)
  return true
}
