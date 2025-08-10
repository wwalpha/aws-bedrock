/**
 * PresetSlice
 * - Holds the currently selected preset of model/settings for quick application.
 */
import { Dispatch, SetStateAction } from "react"
import { Tables } from "@/types/db"
import { apply } from "../utils"

export interface PresetSlice {
  selectedPreset: Tables<"presets"> | null
  setSelectedPreset: Dispatch<SetStateAction<Tables<"presets"> | null>>
}

/**
 * Factory to create the preset slice.
 */
export const createPresetSlice = (set: any) =>
  ({
    selectedPreset: null,
    setSelectedPreset: (v: SetStateAction<Tables<"presets"> | null>) =>
      set((s: PresetSlice) => ({ selectedPreset: apply(s.selectedPreset, v) }))
  }) satisfies PresetSlice as any
