import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

// Returns a Supabase client. If env is not configured, returns a minimal stub
// that prevents crashes and reports that Supabase is disabled.
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    const disabledMsg =
      "Supabase is disabled: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY not set"
    return {
      auth: {
        async getSession() {
          return { data: { session: null }, error: null } as any
        },
        async signInWithPassword() {
          throw new Error(disabledMsg)
        },
        async signUp() {
          throw new Error(disabledMsg)
        },
        async resetPasswordForEmail() {
          throw new Error(disabledMsg)
        },
        async exchangeCodeForSession() {
          return { data: null, error: null } as any
        }
      },
      from() {
        throw new Error(disabledMsg)
      }
    } as any
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      }
    }
  })
}
