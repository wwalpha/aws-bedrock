import { Database } from "@/supabase/types"
import { createBrowserClient } from "@supabase/ssr"

export const supabase = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    // Return a minimal stub with the same surface used in db/* to prevent crashes
    return {
      from() {
        throw new Error(
          "Supabase is disabled: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY not set"
        )
      },
      auth: {
        getUser: async () => ({ data: { user: null } })
      }
    } as unknown as ReturnType<typeof createBrowserClient<Database>>
  }
  return createBrowserClient<Database>(url, anon)
})()
