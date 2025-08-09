import { api } from "@/lib/api/client"
import { TablesInsert } from "@/types/db"

export const getCollectionFilesByCollectionId = async (
  collectionId: string
) => {
  return api.get(
    `/v1/collections/${encodeURIComponent(collectionId)}?include=files`
  )
}

export const createCollectionFile = async (
  collectionFile: TablesInsert<"collection_files">
) => {
  return api.post(`/v1/collection_files`, collectionFile)
}

export const createCollectionFiles = async (
  collectionFiles: TablesInsert<"collection_files">[]
) => {
  return api.post(`/v1/collection_files/bulk`, { items: collectionFiles })
}

export const deleteCollectionFile = async (
  collectionId: string,
  fileId: string
) => {
  await api.delete(
    `/v1/collection_files?collection_id=${encodeURIComponent(collectionId)}&file_id=${encodeURIComponent(fileId)}`
  )
  return true
}
