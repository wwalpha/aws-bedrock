"use client"

import { getProfileByUserId } from "@/db/profile"
import { getWorkspaceImageFromStorage } from "@/db/storage/workspace-images"
import { getWorkspacesByUserId } from "@/db/workspaces"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import {
  fetchHostedModels,
  fetchOllamaModels,
  fetchOpenRouterModels
} from "@/lib/models/fetch-models"
import { useChatStore } from "@/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { API } from "@/lib/api/endpoints"

/**
 * StoreBootstrap
 * Client-only bootstrap to initialize the Zustand store on app start.
 * Performs minimal auth check via internal /api/auth/me, then loads
 * profile, workspaces, images, and available model lists.
 * Render it once near the top of the app tree.
 */
export default function StoreBootstrap() {
  const router = useRouter()
  const store = useChatStore()

  const {
    // PROFILE
    setProfile,
    // ITEMS
    setWorkspaces,
    // MODELS
    setEnvKeyMap,
    setAvailableHostedModels,
    setAvailableLocalModels,
    setAvailableOpenRouterModels,
    // WORKSPACES
    setWorkspaceImages
  } = store

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchStartingData = async () => {
    try {
      const meRes = await fetch(`/api${API.auth.me}`, { cache: "no-store" })
      if (!meRes.ok) return
      const me = await meRes.json()
      const userId = me?.user?.id || me?.id
      if (!userId) return

      const profile = await getProfileByUserId(userId)
      setProfile(profile)

      if (!profile.has_onboarded) {
        router.push("/setup")
        return
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

  // renders nothing; purely side-effectful
  return null
}
