// TODO: Separate into multiple contexts, keeping simple for now

"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId } from "@/db/profile"
import { getWorkspaceImageFromStorage } from "@/db/storage/workspace-images"
import { getWorkspacesByUserId } from "@/db/workspaces"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import {
  fetchHostedModels,
  fetchOllamaModels,
  fetchOpenRouterModels
} from "@/lib/models/fetch-models"
import { Tables } from "@/types/db"
import {
  ChatFile,
  ChatMessage,
  ChatSettings,
  LLM,
  MessageImage,
  OpenRouterLLM,
  WorkspaceImage
} from "@/types"
import { AssistantImage } from "@/types/images/assistant-image"
import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { useRouter } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { useChatStore } from "@/store/use-chat-store"

interface GlobalStateProps {
  children: React.ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const router = useRouter()
  const store = useChatStore()

  // PROFILE STORE
  const { profile, setProfile } = store

  // ITEMS STORE
  const {
    assistants,
    setAssistants,
    collections,
    setCollections,
    chats,
    setChats,
    files,
    setFiles,
    folders,
    setFolders,
    models,
    setModels,
    presets,
    setPresets,
    prompts,
    setPrompts,
    tools,
    setTools,
    workspaces,
    setWorkspaces
  } = store

  // MODELS STORE
  const {
    envKeyMap,
    setEnvKeyMap,
    availableHostedModels,
    setAvailableHostedModels,
    availableLocalModels,
    setAvailableLocalModels,
    availableOpenRouterModels,
    setAvailableOpenRouterModels
  } = store

  // WORKSPACE STORE
  const {
    selectedWorkspace,
    setSelectedWorkspace,
    workspaceImages,
    setWorkspaceImages
  } = store

  // PRESET STORE
  const { selectedPreset, setSelectedPreset } = store

  // ASSISTANT STORE
  const {
    selectedAssistant,
    setSelectedAssistant,
    assistantImages,
    setAssistantImages,
    openaiAssistants,
    setOpenaiAssistants
  } = store

  // PASSIVE CHAT STORE
  const {
    userInput,
    setUserInput,
    chatMessages,
    setChatMessages,
    chatSettings,
    setChatSettings,
    selectedChat,
    setSelectedChat,
    chatFileItems,
    setChatFileItems
  } = store

  // ACTIVE CHAT STORE
  const {
    isGenerating,
    setIsGenerating,
    firstTokenReceived,
    setFirstTokenReceived,
    abortController,
    setAbortController
  } = store

  // CHAT INPUT COMMAND STORE
  const {
    isPromptPickerOpen,
    setIsPromptPickerOpen,
    slashCommand,
    setSlashCommand,
    isFilePickerOpen,
    setIsFilePickerOpen,
    hashtagCommand,
    setHashtagCommand,
    isToolPickerOpen,
    setIsToolPickerOpen,
    toolCommand,
    setToolCommand,
    focusPrompt,
    setFocusPrompt,
    focusFile,
    setFocusFile,
    focusTool,
    setFocusTool,
    focusAssistant,
    setFocusAssistant,
    atCommand,
    setAtCommand,
    isAssistantPickerOpen,
    setIsAssistantPickerOpen
  } = store

  // ATTACHMENTS STORE
  const {
    chatFiles,
    setChatFiles,
    chatImages,
    setChatImages,
    newMessageFiles,
    setNewMessageFiles,
    newMessageImages,
    setNewMessageImages,
    showFilesDisplay,
    setShowFilesDisplay
  } = store

  // RETIEVAL STORE
  const { useRetrieval, setUseRetrieval, sourceCount, setSourceCount } = store

  // TOOL STORE
  const { selectedTools, setSelectedTools, toolInUse, setToolInUse } = store

  useEffect(() => {
    ;(async () => {
      const profile = await fetchStartingData()

      if (profile) {
        const hostedModelRes = await fetchHostedModels(profile)
        if (!hostedModelRes) return

        setEnvKeyMap(hostedModelRes.envKeyMap)
        setAvailableHostedModels(hostedModelRes.hostedModels)

        if (
          profile["openrouter_api_key"] ||
          hostedModelRes.envKeyMap["openrouter"]
        ) {
          const openRouterModels = await fetchOpenRouterModels()
          if (!openRouterModels) return
          setAvailableOpenRouterModels(openRouterModels)
        }
      }

      if (process.env.NEXT_PUBLIC_OLLAMA_URL) {
        const localModels = await fetchOllamaModels()
        if (!localModels) return
        setAvailableLocalModels(localModels)
      }
    })()
  }, [])

  const fetchStartingData = async () => {
    try {
      const meRes = await fetch(`/api/auth/me`, { cache: "no-store" })
      if (!meRes.ok) return
      const me = await meRes.json()
      const userId = me?.user?.id || me?.id
      if (!userId) return

      const profile = await getProfileByUserId(userId)
      setProfile(profile)

      if (!profile.has_onboarded) {
        return router.push("/setup")
      }

      const workspaces = await getWorkspacesByUserId(userId)
      setWorkspaces(workspaces)

      for (const workspace of workspaces) {
        let workspaceImageUrl = ""

        if (workspace.image_path) {
          workspaceImageUrl =
            (await getWorkspaceImageFromStorage(workspace.image_path)) || ""
        }

        if (workspaceImageUrl) {
          const response = await fetch(workspaceImageUrl)
          const blob = await response.blob()
          const base64 = await convertBlobToBase64(blob)

          setWorkspaceImages(prev => [
            ...prev,
            {
              workspaceId: workspace.id,
              path: workspace.image_path,
              base64: base64,
              url: workspaceImageUrl
            }
          ])
        }
      }

      return profile
    } catch {}
  }

  return (
    <ChatbotUIContext.Provider
      value={{
        // PROFILE STORE
        profile,
        setProfile,

        // ITEMS STORE
        assistants,
        setAssistants,
        collections,
        setCollections,
        chats,
        setChats,
        files,
        setFiles,
        folders,
        setFolders,
        models,
        setModels,
        presets,
        setPresets,
        prompts,
        setPrompts,
        tools,
        setTools,
        workspaces,
        setWorkspaces,

        // MODELS STORE
        envKeyMap,
        setEnvKeyMap,
        availableHostedModels,
        setAvailableHostedModels,
        availableLocalModels,
        setAvailableLocalModels,
        availableOpenRouterModels,
        setAvailableOpenRouterModels,

        // WORKSPACE STORE
        selectedWorkspace,
        setSelectedWorkspace,
        workspaceImages,
        setWorkspaceImages,

        // PRESET STORE
        selectedPreset,
        setSelectedPreset,

        // ASSISTANT STORE
        selectedAssistant,
        setSelectedAssistant,
        assistantImages,
        setAssistantImages,
        openaiAssistants,
        setOpenaiAssistants,

        // PASSIVE CHAT STORE
        userInput,
        setUserInput,
        chatMessages,
        setChatMessages,
        chatSettings,
        setChatSettings,
        selectedChat,
        setSelectedChat,
        chatFileItems,
        setChatFileItems,

        // ACTIVE CHAT STORE
        isGenerating,
        setIsGenerating,
        firstTokenReceived,
        setFirstTokenReceived,
        abortController,
        setAbortController,

        // CHAT INPUT COMMAND STORE
        isPromptPickerOpen,
        setIsPromptPickerOpen,
        slashCommand,
        setSlashCommand,
        isFilePickerOpen,
        setIsFilePickerOpen,
        hashtagCommand,
        setHashtagCommand,
        isToolPickerOpen,
        setIsToolPickerOpen,
        toolCommand,
        setToolCommand,
        focusPrompt,
        setFocusPrompt,
        focusFile,
        setFocusFile,
        focusTool,
        setFocusTool,
        focusAssistant,
        setFocusAssistant,
        atCommand,
        setAtCommand,
        isAssistantPickerOpen,
        setIsAssistantPickerOpen,

        // ATTACHMENT STORE
        chatFiles,
        setChatFiles,
        chatImages,
        setChatImages,
        newMessageFiles,
        setNewMessageFiles,
        newMessageImages,
        setNewMessageImages,
        showFilesDisplay,
        setShowFilesDisplay,

        // RETRIEVAL STORE
        useRetrieval,
        setUseRetrieval,
        sourceCount,
        setSourceCount,

        // TOOL STORE
        selectedTools,
        setSelectedTools,
        toolInUse,
        setToolInUse
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  )
}
