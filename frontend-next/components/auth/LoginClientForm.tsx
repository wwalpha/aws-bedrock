"use client"

import { useChatStore } from "@/store"
import { API } from "@/lib/api/endpoints"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Brand } from "@/components/ui/brand"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"

export default function LoginClientForm() {
  const router = useRouter()
  const login = useChatStore(s => s.login)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = await login(email, password)
    if (!res.ok) {
      setError(res.error || "Login failed")
      return
    }
    try {
      const meRes = await fetch(`/api${API.auth.me}`, { cache: "no-store" })
      if (meRes.ok) {
        const me = await meRes.json()
        const dest = me?.homeWorkspaceId ? `/${me.homeWorkspaceId}/chat` : "/"
        router.push(dest)
        router.refresh()
        return
      }
    } catch {}
    router.push("/")
    router.refresh()
  }

  return (
    <form
      className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
      onSubmit={onSubmit}
    >
      <Brand />

      <Label className="text-md mt-4" htmlFor="login-email">
        Email
      </Label>
      <Input
        id="login-email"
        className="mb-3 rounded-md border bg-inherit px-4 py-2"
        name="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <Label className="text-md" htmlFor="login-password">
        Password
      </Label>
      <Input
        id="login-password"
        className="mb-6 rounded-md border bg-inherit px-4 py-2"
        type="password"
        name="password"
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <SubmitButton className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white">
        Login
      </SubmitButton>

      {error && (
        <p className="bg-foreground/10 text-foreground mt-2 p-2 text-center">
          {error}
        </p>
      )}
    </form>
  )
}
