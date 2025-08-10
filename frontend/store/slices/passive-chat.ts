/**
 * PassiveChatSlice
 * - Non-streaming chat state: input text, accumulated messages, chat settings, selected chat, and matched file items.
 * - Provides sensible defaults for chatSettings; override via setter as needed.
 */
import { Dispatch, SetStateAction } from "react"
import { Tables } from "@/types/db"
import { ChatFile, ChatMessage, ChatSettings } from "@/types"
import { apply } from "../utils"

export interface PassiveChatSlice {
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
  chatMessages: ChatMessage[]
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
  chatSettings: ChatSettings
  setChatSettings: Dispatch<SetStateAction<ChatSettings>>
  selectedChat: Tables<"chats"> | null
  setSelectedChat: Dispatch<SetStateAction<Tables<"chats"> | null>>
  chatFileItems: Tables<"file_items">[]
  setChatFileItems: Dispatch<SetStateAction<Tables<"file_items">[]>>
}

/**
 * Factory to create the passive chat slice.
 */
export const createPassiveChatSlice = (set: any) =>
  ({
    userInput: "",
    setUserInput: (v: SetStateAction<string>) =>
      set((s: PassiveChatSlice) => ({ userInput: apply(s.userInput, v) })),
    chatMessages: [],
    setChatMessages: (v: SetStateAction<ChatMessage[]>) =>
      set((s: PassiveChatSlice) => ({
        chatMessages: apply(s.chatMessages, v)
      })),
    chatSettings: {
      model: "gpt-4-turbo-preview",
      prompt: "You are a helpful AI assistant.",
      temperature: 0.5,
      contextLength: 4000,
      includeProfileContext: true,
      includeWorkspaceInstructions: true,
      embeddingsProvider: "openai"
    },
    setChatSettings: (v: SetStateAction<ChatSettings>) =>
      set((s: PassiveChatSlice) => ({
        chatSettings: apply(s.chatSettings, v)
      })),
    selectedChat: null,
    setSelectedChat: (v: SetStateAction<Tables<"chats"> | null>) =>
      set((s: PassiveChatSlice) => ({
        selectedChat: apply(s.selectedChat, v)
      })),
    chatFileItems: [],
    setChatFileItems: (v: SetStateAction<Tables<"file_items">[]>) =>
      set((s: PassiveChatSlice) => ({
        chatFileItems: apply(s.chatFileItems, v)
      }))
  }) satisfies PassiveChatSlice as any
