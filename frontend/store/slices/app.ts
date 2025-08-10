import { Dispatch, SetStateAction } from "react"
import { apply } from "../utils"
import { API } from "@/lib/api/endpoints"
import type { LoginResponse } from "@/types/api"
import type { AppSlice } from "@/typings/index"

export const createAppSlice = (set: any) =>
  ({
    idToken: null,
    accessToken: null,
    setIdToken: (value: SetStateAction<string | null>) =>
      set((s: AppSlice) => ({ idToken: apply(s.idToken, value) })),
    setAccessToken: (value: SetStateAction<string | null>) =>
      set((s: AppSlice) => ({ accessToken: apply(s.accessToken, value) })),
    loginWithTokens: ({
      idToken,
      accessToken
    }: {
      idToken?: string
      accessToken?: string
    }) =>
      set((s: AppSlice) => ({
        idToken: idToken ?? s.idToken,
        accessToken: accessToken ?? s.accessToken
      })),
    async login(email: string, password: string) {
      try {
        const res = await fetch(`${API.auth.login}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username: email, password })
        })
        if (!res.ok) {
          const msg = (await res.text()) || "Login failed"
          return { ok: false as const, error: msg }
        }
        const data = (await res.json()) as LoginResponse
        set((s: AppSlice) => ({
          idToken: data.idToken ?? s.idToken,
          accessToken: data.accessToken ?? s.accessToken
        }))
        return { ok: true as const, data }
      } catch (e: any) {
        return { ok: false as const, error: e?.message || "Login failed" }
      }
    },
    logout: () => set(() => ({ idToken: null, accessToken: null })),
    async logoutApi() {
      try {
        await fetch(`/api${API.auth.logout}`, { method: "POST" })
      } catch {}
      set(() => ({ idToken: null, accessToken: null }))
    }
  }) satisfies AppSlice as any

export default undefined as unknown as AppSlice
