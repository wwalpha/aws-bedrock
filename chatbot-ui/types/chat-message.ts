import { Tables } from "@/types/db"

export interface ChatMessage {
  message: Tables<"messages">
  fileItems: string[]
}
