import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getMessageById = async (messageId: string) => {
  const message = await api.get(`/v1/messages/${encodeURIComponent(messageId)}`)
  if (!message) throw new Error("Message not found")
  return message
}

export const getMessagesByChatId = async (chatId: string) => {
  const messages = await api.get(
    `/v1/messages?chat_id=${encodeURIComponent(chatId)}`
  )
  if (!messages) throw new Error("Messages not found")
  return messages
}

export const createMessage = async (message: TablesInsert<"messages">) => {
  return api.post(`/v1/messages`, message)
}

export const createMessages = async (messages: TablesInsert<"messages">[]) => {
  return api.post(`/v1/messages/bulk`, { items: messages })
}

export const updateMessage = async (
  messageId: string,
  message: TablesUpdate<"messages">
) => {
  return api.put(`/v1/messages/${encodeURIComponent(messageId)}`, message)
}

export const deleteMessage = async (messageId: string) => {
  await api.delete(`/v1/messages/${encodeURIComponent(messageId)}`)
  return true
}

export async function deleteMessagesIncludingAndAfter(
  userId: string,
  chatId: string,
  sequenceNumber: number
) {
  try {
    await api.post(`/v1/messages/delete_including_and_after`, {
      user_id: userId,
      chat_id: chatId,
      sequence_number: sequenceNumber
    })
    return true
  } catch (e) {
    return { error: "Failed to delete messages." }
  }
}
