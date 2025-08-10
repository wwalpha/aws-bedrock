"use client"

import { create } from "zustand"
import { type ProfileSlice, createProfileSlice } from "./slices/profile"
import { type ItemsSlice, createItemsSlice } from "./slices/items"
import { type ModelsSlice, createModelsSlice } from "./slices/models"
import { type WorkspaceSlice, createWorkspaceSlice } from "./slices/workspace"
import { type PresetSlice, createPresetSlice } from "./slices/preset"
import { type AssistantSlice, createAssistantSlice } from "./slices/assistant"
import {
  type PassiveChatSlice,
  createPassiveChatSlice
} from "./slices/passive-chat"
import {
  type ActiveChatSlice,
  createActiveChatSlice
} from "./slices/active-chat"
import { type ChatInputSlice, createChatInputSlice } from "./slices/chat-input"
import {
  type AttachmentsSlice,
  createAttachmentsSlice
} from "./slices/attachments"
import { type RetrievalSlice, createRetrievalSlice } from "./slices/retrieval"
import { type ToolsSlice, createToolsSlice } from "./slices/tools"

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
  ToolsSlice

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
  ...createToolsSlice(set)
}))
