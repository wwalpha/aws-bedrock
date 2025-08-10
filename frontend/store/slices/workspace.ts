/**
 * WorkspaceSlice
 * - Tracks the currently selected workspace and its associated images (for quick display).
 * - Setters support either values or updater functions via `apply`.
 */
import { Dispatch, SetStateAction } from "react"
import { Tables } from "@/types/db"
import { WorkspaceImage } from "@/types"
import { apply } from "../utils"
import type { WorkspaceSlice } from "@/typings/slices.types"

/**
 * Factory to create the workspace slice.
 */
export const createWorkspaceSlice = (set: any) =>
  ({
    selectedWorkspace: null,
    setSelectedWorkspace: (v: SetStateAction<Tables<"workspaces"> | null>) =>
      set((s: WorkspaceSlice) => ({
        selectedWorkspace: apply(s.selectedWorkspace, v)
      })),
    workspaceImages: [],
    setWorkspaceImages: (v: SetStateAction<WorkspaceImage[]>) =>
      set((s: WorkspaceSlice) => ({
        workspaceImages: apply(s.workspaceImages, v)
      }))
  }) satisfies WorkspaceSlice as any
