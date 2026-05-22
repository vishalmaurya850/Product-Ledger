import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[44px] w-full rounded-[8px] border border-[var(--border-subtle)] bg-[var(--canvas)] px-4 py-3 text-[15px] text-[var(--ink)] ring-offset-[var(--canvas)] file:border-0 file:bg-transparent file:text-[14px] file:font-medium file:text-[var(--ink)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
