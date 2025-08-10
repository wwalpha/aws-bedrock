import { uploadFile } from "@/lib/api/upload"
import { api } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"

export const uploadMessageImage = async (path: string, image: File) => {
  const imageSizeLimit = 6000000 // 6MB

  if (image.size > imageSizeLimit) {
    throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
  }

  await uploadFile(`/messages`, image, { path })
  return path
}

export const getMessageImageFromStorage = async (filePath: string) => {
  const res = await api.get(API.upload.signedUrl("messages", filePath))
  return (res as any).url as string
}
