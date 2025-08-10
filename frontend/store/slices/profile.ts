import { Dispatch, SetStateAction } from "react"
import { Tables } from "@/types/db"
import { apply } from "../utils"

export interface ProfileSlice {
  profile: Tables<"profiles"> | null
  setProfile: Dispatch<SetStateAction<Tables<"profiles"> | null>>
}

export const createProfileSlice = (set: any) =>
  ({
    profile: null,
    setProfile: (value: SetStateAction<Tables<"profiles"> | null>) =>
      set((state: ProfileSlice) => ({ profile: apply(state.profile, value) }))
  }) satisfies ProfileSlice as any
