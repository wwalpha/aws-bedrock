/**
 * ProfileSlice
 * - Holds the authenticated user's profile record.
 * - Setters accept React.SetStateAction and are run through `apply()` so you can pass
 *   either a value or an updater function: setProfile(prev => ({ ...prev, ... }))
 */
import { Dispatch, SetStateAction } from "react"
import { Tables } from "@/types/db"
import { apply } from "../utils"

export interface ProfileSlice {
  profile: Tables<"profiles"> | null
  setProfile: Dispatch<SetStateAction<Tables<"profiles"> | null>>
}

/**
 * Factory to create the profile slice. Avoid mutating state directly; always use setters.
 */
export const createProfileSlice = (set: any) =>
  ({
    profile: null,
    setProfile: (value: SetStateAction<Tables<"profiles"> | null>) =>
      set((state: ProfileSlice) => ({ profile: apply(state.profile, value) }))
  }) satisfies ProfileSlice as any
