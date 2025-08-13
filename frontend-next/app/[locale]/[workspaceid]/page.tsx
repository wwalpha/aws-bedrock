"use client"

import { useChatStore } from "@/store"

export default function WorkspacePage() {
  const selectedWorkspace = useChatStore(s => s.selectedWorkspace)

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-4xl">{selectedWorkspace?.name}</div>
    </div>
  )
}
