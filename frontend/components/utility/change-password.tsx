"use client"
import { useRouter } from "next/navigation"
import { FC, useState } from "react"
import { API } from "@/lib/api/endpoints"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog"
import { Input } from "../ui/input"
import { toast } from "sonner"

interface ChangePasswordProps {}

export const ChangePassword: FC<ChangePasswordProps> = () => {
  const router = useRouter()

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleResetPassword = async () => {
    if (!newPassword) return toast.info("Please enter your new password.")
    try {
      const res = await fetch(`/api${API.auth.login}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ newPassword, changePassword: true })
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success("Password changed successfully.")
      return router.push("/login")
    } catch (e: any) {
      toast.error(e?.message || "Failed to change password")
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="h-[240px] w-[400px] p-4">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <Input
          id="password"
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />

        <Input
          id="confirmPassword"
          placeholder="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={handleResetPassword}>Confirm Change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
