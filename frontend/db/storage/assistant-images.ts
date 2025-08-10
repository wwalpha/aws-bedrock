import { uploadFile } from "@/lib/api/upload"
import { api } from "@/lib/api/client"
import { Tables } from "@/types/db"
import { API } from "@/lib/api/endpoints"

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
      await api.post(API.upload.delete, {
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
    const res = await api.get(API.upload.signedUrl("assistants", filePath))
    return (res as any).url as string
  } catch (error) {
    console.error(error)
  }
}
