"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function GoBackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 border border-[var(--border-subtle)] text-[var(--ink)] rounded-[8px] px-5 py-2.5 text-[15px] font-medium hover:bg-[var(--surface-elevated)] transition-all active:scale-[0.97] cursor-pointer"
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </button>
  )
}
