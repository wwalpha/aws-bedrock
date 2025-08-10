"use client"

/**
 * Root Zustand store composition for ChatbotState.
 * Each slice is self-contained and combined here; prefer using selectors
 * like `useChatStore(state => state.chatMessages)` for fine-grained subscriptions.
 */

import { create } from "zustand"
import { createProfileSlice } from "./slices/profile"
import { createItemsSlice } from "./slices/items"
import { createModelsSlice } from "./slices/models"
import { createWorkspaceSlice } from "./slices/workspace"
import { createPresetSlice } from "./slices/preset"
import { createAssistantSlice } from "./slices/assistant"
import { createPassiveChatSlice } from "./slices/passive-chat"
import { createActiveChatSlice } from "./slices/active-chat"
import { createChatInputSlice } from "./slices/chat-input"
import { createAttachmentsSlice } from "./slices/attachments"
import { createRetrievalSlice } from "./slices/retrieval"
import { createToolsSlice } from "./slices/tools"
import type {
  ProfileSlice,
  ItemsSlice,
  ModelsSlice,
  WorkspaceSlice,
  PresetSlice,
  AssistantSlice,
  PassiveChatSlice,
  ActiveChatSlice,
  ChatInputSlice,
  AttachmentsSlice,
  RetrievalSlice,
  ToolsSlice
} from "@/typings/slices"
import { createAppSlice } from "./slices/app"
import type { AppSlice } from "@/typings/store"

export type ChatbotState = ProfileSlice &
  ItemsSlice &
  ModelsSlice &
  WorkspaceSlice &
  PresetSlice &
  AssistantSlice &
  PassiveChatSlice &
  ActiveChatSlice &
  ChatInputSlice &
  AttachmentsSlice &
  RetrievalSlice &
  ToolsSlice &
  AppSlice

export const useChatStore = create<ChatbotState>()((set, get) => ({
  ...createProfileSlice(set),
  ...createItemsSlice(set),
  ...createModelsSlice(set),
  ...createWorkspaceSlice(set),
  ...createPresetSlice(set),
  ...createAssistantSlice(set),
  ...createPassiveChatSlice(set),
  ...createActiveChatSlice(set),
  ...createChatInputSlice(set),
  ...createAttachmentsSlice(set),
  ...createRetrievalSlice(set),
  ...createToolsSlice(set),
  ...createAppSlice(set)
}))
