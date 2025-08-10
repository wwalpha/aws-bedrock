import { api } from "@/lib/api/client"
import { uploadFile as uploadBinary } from "@/lib/api/upload"
import { toast } from "sonner"
import { API } from "@/lib/api/endpoints"

export const uploadFile = async (
  file: File,
  payload: {
    name: string
    user_id: string
    file_id: string
  }
) => {
  const SIZE_LIMIT = parseInt(
    process.env.NEXT_PUBLIC_USER_FILE_SIZE_LIMIT || "10000000"
  )

  if (file.size > SIZE_LIMIT) {
    throw new Error(
      `File must be less than ${Math.floor(SIZE_LIMIT / 1000000)}MB`
    )
  }

  const filePath = `${payload.user_id}/${Buffer.from(payload.file_id).toString("base64")}`
  await uploadBinary(`/files`, file, { path: filePath, name: payload.name })
  return filePath
}

export const deleteFileFromStorage = async (filePath: string) => {
  try {
    await api.post(API.upload.delete, { path: filePath, scope: "files" })
  } catch (e) {
    toast.error("Failed to remove file!")
  }
}

export const getFileFromStorage = async (filePath: string) => {
  try {
    const res = await api.get(API.upload.signedUrl("files", filePath))
    return (res as any).url as string
  } catch (error) {
    console.error(`Error fetching file with path: ${filePath}`, error)
    throw new Error("Error downloading file")
  }
}
