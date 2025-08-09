import { uploadFile } from "@/lib/api/upload"
import { api } from "@/lib/api/client"
import { Tables } from "@/types/db"

export const uploadAssistantImage = async (
  assistant: Tables<"assistants">,
  image: File
) => {
  const imageSizeLimit = 6000000 // 6MB

  if (image.size > imageSizeLimit) {
    throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
  }

  const currentPath = assistant.image_path
  let filePath = `${assistant.user_id}/${assistant.id}/${Date.now()}`
  if (currentPath && currentPath.length > 0) {
    try {
      await api.post(`/v1/upload/delete`, {
        path: currentPath,
        scope: "assistants"
      })
    } catch {}
  }
  await uploadFile(`/assistants`, image, { path: filePath })
  return filePath
}

export const getAssistantImageFromStorage = async (filePath: string) => {
  try {
    const res = await api.get(
      `/v1/upload/signed-url?scope=assistants&path=${encodeURIComponent(filePath)}&ttl=86400`
    )
    return (res as any).url as string
  } catch (error) {
    console.error(error)
  }
}
