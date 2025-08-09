import { api } from "@/lib/api/client"
import { TablesInsert } from "@/types/db"

export const getChatFilesByChatId = async (chatId: string) => {
  return api.get(`/v1/chats/${encodeURIComponent(chatId)}?include=files`)
}

export const createChatFile = async (chatFile: TablesInsert<"chat_files">) => {
  return api.post(`/v1/chat_files`, chatFile)
}

export const createChatFiles = async (
  chatFiles: TablesInsert<"chat_files">[]
) => {
  return api.post(`/v1/chat_files/bulk`, { items: chatFiles })
}
