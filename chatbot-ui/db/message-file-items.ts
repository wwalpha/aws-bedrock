import { api } from "@/lib/api/client"
import { TablesInsert } from "@/types/db"

export const getMessageFileItemsByMessageId = async (messageId: string) => {
  return api.get(
    `/v1/messages/${encodeURIComponent(messageId)}?include=file_items`
  )
}

export const createMessageFileItems = async (
  messageFileItems: TablesInsert<"message_file_items">[]
) => {
  return api.post(`/v1/message_file_items/bulk`, { items: messageFileItems })
}
