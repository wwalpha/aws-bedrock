"use client"

import { ChangePassword } from "@/components/utility/change-password"
import { useRouter } from "next/navigation"
import { API } from "@/lib/api/endpoints"
import { useEffect, useState } from "react"

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api${API.auth.me}`, { credentials: "include" })
      if (!res.ok) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return null
  }

  return <ChangePassword />
}
