import { Brand } from "@/components/ui/brand"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login"
}

export default async function Login({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | undefined>>
}) {
  // Await if Next hands a promise-like for searchParams in this version
  const sp = (await searchParams) as { message?: string } | undefined
  // If already logged in (via backend), redirect away
  try {
    const meRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/auth/me`,
      {
        cache: "no-store"
      }
    )
    if (meRes.ok) {
      const me = await meRes.json()
      const dest = me?.homeWorkspaceId ? `/${me.homeWorkspaceId}/chat` : "/"
      return redirect(dest)
    }
  } catch {}

  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/auth/login`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      )
      if (!res.ok) {
        const msg = (await res.text()) || "Login failed"
        return redirect(`/login?message=${encodeURIComponent(msg)}`)
      }
    } catch (e: any) {
      return redirect(
        `/login?message=${encodeURIComponent(e?.message || "Login failed")}`
      )
    }

    // After login, try to fetch profile/me for redirect
    try {
      const meRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/auth/me`,
        {
          cache: "no-store"
        }
      )
      if (meRes.ok) {
        const me = await meRes.json()
        const dest = me?.homeWorkspaceId ? `/${me.homeWorkspaceId}/chat` : "/"
        return redirect(dest)
      }
    } catch {}
    return redirect("/")
  }

  const getEnvVarOrEdgeConfigValue = async (name: string) => {
    "use server"
    if (process.env.EDGE_CONFIG) {
      return await get<string>(name)
    }

    return process.env[name]
  }

  const signUp = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
      "EMAIL_DOMAIN_WHITELIST"
    )
    const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
      ? emailDomainWhitelistPatternsString?.split(",")
      : []
    const emailWhitelistPatternsString =
      await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
    const emailWhitelist = emailWhitelistPatternsString?.trim()
      ? emailWhitelistPatternsString?.split(",")
      : []

    // If there are whitelist patterns, check if the email is allowed to sign up
    if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
      const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1])
      const emailMatch = emailWhitelist?.includes(email)
      if (!domainMatch && !emailMatch) {
        return redirect(
          `/login?message=Email ${email} is not allowed to sign up.`
        )
      }
    }

    // Delegate to backend if it supports sign up, otherwise skip
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/auth/signup`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      )
      if (!res.ok) {
        const msg = (await res.text()) || "Sign up failed"
        return redirect(`/login?message=${encodeURIComponent(msg)}`)
      }
    } catch (e: any) {
      return redirect(
        `/login?message=${encodeURIComponent(e?.message || "Sign up failed")}`
      )
    }

    return redirect(
      "/login?message=Account created. Check your email for a confirmation code if required."
    )

    // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
    // return redirect("/login?message=Check email to continue sign in process")
  }

  const handleResetPassword = async (formData: FormData) => {
    "use server"

    const h = await headers()
    const origin = h.get("origin")
    const email = formData.get("email") as string
    // Optionally proxy to backend reset endpoint if exists
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/auth/login`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email,
            reset: true,
            redirectTo: `${origin}/login/password`
          })
        }
      )
      if (!res.ok) {
        const msg = (await res.text()) || "Reset failed"
        return redirect(`/login?message=${encodeURIComponent(msg)}`)
      }
    } catch (e: any) {
      return redirect(
        `/login?message=${encodeURIComponent(e?.message || "Reset failed")}`
      )
    }
    return redirect("/login?message=Check email to reset password")
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        action={signIn}
      >
        <Brand />

        <Label className="text-md mt-4" htmlFor="email">
          Email
        </Label>
        <Input
          className="mb-3 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />

        <Label className="text-md" htmlFor="password">
          Password
        </Label>
        <Input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
        />

        <SubmitButton className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white">
          Login
        </SubmitButton>

        <SubmitButton
          formAction={signUp}
          className="border-foreground/20 mb-2 rounded-md border px-4 py-2"
        >
          Sign Up
        </SubmitButton>

        <div className="text-muted-foreground mt-1 flex justify-center text-sm">
          <span className="mr-1">Forgot your password?</span>
          <button
            formAction={handleResetPassword}
            className="text-primary ml-1 underline hover:opacity-80"
          >
            Reset
          </button>
        </div>

        {sp?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {sp.message}
          </p>
        )}
      </form>
    </div>
  )
}
