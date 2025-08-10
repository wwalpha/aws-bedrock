import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"
import mammoth from "mammoth"
import { toast } from "sonner"
import { uploadFile } from "./storage/files"
import { API } from "@/lib/api/endpoints"

export const getFileById = async (fileId: string) => {
  return api.get(`/v1/files/${encodeURIComponent(fileId)}`)
}

export const getFileWorkspacesByWorkspaceId = async (workspaceId: string) => {
  return api.get(
    `/v1/workspaces/${encodeURIComponent(workspaceId)}?include=files`
  )
}

export const getFileWorkspacesByFileId = async (fileId: string) => {
  return api.get(`/v1/files/${encodeURIComponent(fileId)}?include=workspaces`)
}

export const createFileBasedOnExtension = async (
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  const fileExtension = file.name.split(".").pop()

  if (fileExtension === "docx") {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({
      arrayBuffer
    })

    return createDocXFile(
      result.value,
      file,
      fileRecord,
      workspace_id,
      embeddingsProvider
    )
  } else {
    return createFile(file, fileRecord, workspace_id, embeddingsProvider)
  }
}

// For non-docx files
export const createFile = async (
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  let validFilename = fileRecord.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase()
  const extension = file.name.split(".").pop()
  const extensionIndex = validFilename.lastIndexOf(".")
  const baseName = validFilename.substring(
    0,
    extensionIndex < 0 ? undefined : extensionIndex
  )
  const maxBaseNameLength = 100 - (extension?.length || 0) - 1
  if (baseName.length > maxBaseNameLength) {
    fileRecord.name = baseName.substring(0, maxBaseNameLength) + "." + extension
  } else {
    fileRecord.name = baseName + "." + extension
  }
  const createdFile = await api.post(`/v1/files`, fileRecord)

  await createFileWorkspace({
    user_id: createdFile.user_id,
    file_id: createdFile.id,
    workspace_id
  })

  const filePath = await uploadFile(file, {
    name: createdFile.name,
    user_id: createdFile.user_id,
    file_id: createdFile.name
  })

  await updateFile(createdFile.id, { file_path: filePath })

  const formData = new FormData()
  formData.append("file_id", createdFile.id)
  formData.append("embeddingsProvider", embeddingsProvider)

  const response = await fetch(`/api${API.retrieval.process}`, {
    method: "POST",
    body: formData
  })

  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${createdFile.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(createdFile.id)
  }

  const fetchedFile = await getFileById(createdFile.id)

  return fetchedFile
}

// // Handle docx files
export const createDocXFile = async (
  text: string,
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  const createdFile = await api.post(`/v1/files`, fileRecord)

  await createFileWorkspace({
    user_id: createdFile.user_id,
    file_id: createdFile.id,
    workspace_id
  })

  const filePath = await uploadFile(file, {
    name: createdFile.name,
    user_id: createdFile.user_id,
    file_id: createdFile.name
  })

  await updateFile(createdFile.id, { file_path: filePath })

  const response = await fetch(`/api${API.retrieval.processDocx}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      fileId: createdFile.id,
      embeddingsProvider,
      fileExtension: "docx"
    })
  })

  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${createdFile.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(createdFile.id)
  }

  const fetchedFile = await getFileById(createdFile.id)

  return fetchedFile
}

export const createFiles = async (
  files: TablesInsert<"files">[],
  workspace_id: string
) => {
  const createdFiles = await api.post(`/v1/files/bulk`, { items: files })
  await createFileWorkspaces(
    createdFiles.map((file: any) => ({
      user_id: file.user_id,
      file_id: file.id,
      workspace_id
    }))
  )
  return createdFiles
}

export const createFileWorkspace = async (item: {
  user_id: string
  file_id: string
  workspace_id: string
}) => {
  return api.post(`/v1/file_workspaces`, item)
}

export const createFileWorkspaces = async (
  items: { user_id: string; file_id: string; workspace_id: string }[]
) => {
  return api.post(`/v1/file_workspaces/bulk`, { items })
}

export const updateFile = async (
  fileId: string,
  file: TablesUpdate<"files">
) => {
  return api.put(`/v1/files/${encodeURIComponent(fileId)}`, file)
}

export const deleteFile = async (fileId: string) => {
  await api.delete(`/v1/files/${encodeURIComponent(fileId)}`)
  return true
}

export const deleteFileWorkspace = async (
  fileId: string,
  workspaceId: string
) => {
  await api.delete(
    `/v1/file_workspaces?file_id=${encodeURIComponent(fileId)}&workspace_id=${encodeURIComponent(workspaceId)}`
  )
  return true
}
