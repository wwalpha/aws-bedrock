import { uploadFile } from "@/lib/api/upload"
import { Tables } from "@/types/db"

export const uploadProfileImage = async (
  profile: Tables<"profiles">,
  image: File
) => {
  const imageSizeLimit = 2000000 // 2MB

  if (image.size > imageSizeLimit) {
    throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
  }

  const filePath = `${profile.user_id}/${Date.now()}`
  const result = await uploadFile(`/profiles`, image, { path: filePath })
  return { path: result.path || filePath, url: result.url }
}
