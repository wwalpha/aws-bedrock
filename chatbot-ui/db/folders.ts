import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getFoldersByWorkspaceId = async (workspaceId: string) => {
  return api.get(`/v1/folders?workspace_id=${encodeURIComponent(workspaceId)}`)
}

export const createFolder = async (folder: TablesInsert<"folders">) => {
  return api.post(`/v1/folders`, folder)
}

export const updateFolder = async (
  folderId: string,
  folder: TablesUpdate<"folders">
) => {
  return api.put(`/v1/folders/${encodeURIComponent(folderId)}`, folder)
}

export const deleteFolder = async (folderId: string) => {
  await api.delete(`/v1/folders/${encodeURIComponent(folderId)}`)
  return true
}
