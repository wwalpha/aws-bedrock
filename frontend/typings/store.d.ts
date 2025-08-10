import type { Dispatch, SetStateAction } from "react"
import type { LoginResponse } from "@/types/api"

export interface AppSlice {
  idToken: string | null
  accessToken: string | null
  setIdToken: Dispatch<SetStateAction<string | null>>
  setAccessToken: Dispatch<SetStateAction<string | null>>
  loginWithTokens: (params: { idToken?: string; accessToken?: string }) => void
  /**
   * Perform login via internal API and store tokens.
   * Returns { ok, data?, error? } but does not redirect.
   */
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true; data: LoginResponse } | { ok: false; error: string }>
  /** Clear tokens locally (no network). */
  logout: () => void
  /** Call internal API to logout and then clear tokens. */
  logoutApi: () => Promise<void>
}
