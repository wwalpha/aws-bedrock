import { uploadFile } from "@/lib/api/upload"
import { api } from "@/lib/api/client"
import { Tables } from "@/types/db"

export const uploadWorkspaceImage = async (
  workspace: Tables<"workspaces">,
  image: File
) => {
  const imageSizeLimit = 6000000 // 6MB

  if (image.size > imageSizeLimit) {
    throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
  }

  const currentPath = workspace.image_path
  const filePath = `${workspace.user_id}/${workspace.id}/${Date.now()}`
  // Optionally request backend to delete old image
  if (currentPath && currentPath.length > 0) {
    try {
      await api.post(`/v1/upload/delete`, {
        path: currentPath,
        scope: "workspaces"
      })
    } catch {}
  }
  await uploadFile(`/workspaces`, image, { path: filePath })
  return filePath
}

export const getWorkspaceImageFromStorage = async (filePath: string) => {
  try {
    const res = await api.get(
      `/v1/upload/signed-url?scope=workspaces&path=${encodeURIComponent(filePath)}&ttl=86400`
    )
    return res.url as string
  } catch (error) {
    console.error(error)
  }
}
