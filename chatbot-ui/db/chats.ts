import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getChatById = async (chatId: string) => {
  return api.get(`/v1/chats/${encodeURIComponent(chatId)}`)
}

export const getChatsByWorkspaceId = async (workspaceId: string) => {
  return api.get(
    `/v1/chats?workspace_id=${encodeURIComponent(workspaceId)}&order=created_at.desc`
  )
}

export const createChat = async (chat: TablesInsert<"chats">) => {
  return api.post(`/v1/chats`, chat)
}

export const createChats = async (chats: TablesInsert<"chats">[]) => {
  return api.post(`/v1/chats/bulk`, { items: chats })
}

export const updateChat = async (
  chatId: string,
  chat: TablesUpdate<"chats">
) => {
  return api.put(`/v1/chats/${encodeURIComponent(chatId)}`, chat)
}

export const deleteChat = async (chatId: string) => {
  await api.delete(`/v1/chats/${encodeURIComponent(chatId)}`)
  return true
}
