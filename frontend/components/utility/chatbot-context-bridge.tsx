"use client"

import { ChatbotUIContext } from "@/context/context"
import { useChatStore } from "@/store"
import { PropsWithChildren } from "react"

/**
 * ChatbotContextBridge
 * Temporary compatibility provider that exposes the Zustand store via
 * the existing React Context until all components migrate to useChatStore.
 */
export default function ChatbotContextBridge({ children }: PropsWithChildren) {
  const value = useChatStore()
  return (
    <ChatbotUIContext.Provider value={value as any}>
      {children}
    </ChatbotUIContext.Provider>
  )
}
