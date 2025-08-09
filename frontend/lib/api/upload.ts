export async function uploadFile(
  path: string,
  file: File,
  fields?: Record<string, string>
) {
  // Upload API endpoint on backend should accept multipart/form-data
  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ""
  if (!base) throw new Error("BACKEND_URL not configured")
  const form = new FormData()
  form.append("file", file)
  form.append("path", path)
  if (fields) {
    Object.entries(fields).forEach(([k, v]) => form.append(k, v))
  }
  const res = await fetch(`${base}/v1/upload`, {
    method: "POST",
    body: form,
    credentials: "include"
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
