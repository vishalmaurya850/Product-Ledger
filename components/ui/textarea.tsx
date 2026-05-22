import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-[11px] border border-[var(--hairline)] bg-[var(--canvas)] px-4 py-3 text-[17px] tracking-[-0.374px] text-[var(--ink)] ring-offset-[var(--canvas)] placeholder:text-[var(--ink-muted-48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-blue)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 transition-all resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
