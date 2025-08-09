import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getCollectionById = async (collectionId: string) => {
  return api.get(`/v1/collections/${encodeURIComponent(collectionId)}`)
}

export const getCollectionWorkspacesByWorkspaceId = async (
  workspaceId: string
) => {
  return api.get(
    `/v1/workspaces/${encodeURIComponent(workspaceId)}?include=collections`
  )
}

export const getCollectionWorkspacesByCollectionId = async (
  collectionId: string
) => {
  return api.get(
    `/v1/collections/${encodeURIComponent(collectionId)}?include=workspaces`
  )
}

export const createCollection = async (
  collection: TablesInsert<"collections">,
  workspace_id: string
) => {
  const created = await api.post(`/v1/collections`, collection)
  await createCollectionWorkspace({
    user_id: created.user_id,
    collection_id: created.id,
    workspace_id
  })
  return created
}

export const createCollections = async (
  collections: TablesInsert<"collections">[],
  workspace_id: string
) => {
  const createdCollections = await api.post(`/v1/collections/bulk`, {
    items: collections
  })
  await createCollectionWorkspaces(
    createdCollections.map((collection: any) => ({
      user_id: collection.user_id,
      collection_id: collection.id,
      workspace_id
    }))
  )
  return createdCollections
}

export const createCollectionWorkspace = async (item: {
  user_id: string
  collection_id: string
  workspace_id: string
}) => {
  return api.post(`/v1/collection_workspaces`, item)
}

export const createCollectionWorkspaces = async (
  items: { user_id: string; collection_id: string; workspace_id: string }[]
) => {
  return api.post(`/v1/collection_workspaces/bulk`, { items })
}

export const updateCollection = async (
  collectionId: string,
  collection: TablesUpdate<"collections">
) => {
  return api.put(
    `/v1/collections/${encodeURIComponent(collectionId)}`,
    collection
  )
}

export const deleteCollection = async (collectionId: string) => {
  await api.delete(`/v1/collections/${encodeURIComponent(collectionId)}`)
  return true
}

export const deleteCollectionWorkspace = async (
  collectionId: string,
  workspaceId: string
) => {
  await api.delete(
    `/v1/collection_workspaces?collection_id=${encodeURIComponent(collectionId)}&workspace_id=${encodeURIComponent(workspaceId)}`
  )
  return true
}
