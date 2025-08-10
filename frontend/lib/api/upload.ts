import { api } from "./client"
import { API } from "./endpoints"

export async function uploadFile(
  path: string,
  file: File,
  fields?: Record<string, string>
) {
  const form = new FormData()
  form.append("file", file)
  form.append("path", path)
  if (fields) {
    Object.entries(fields).forEach(([k, v]) => form.append(k, v))
  }
  // Use centralized api client and error handling
  try {
    const res = await api.post(API.upload.root, form)
    return res
  } catch (e) {
    // api client already handles error, but rethrow for clarity
    throw e
  }
}
