import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent-cyan)] text-white",
        secondary:
          "border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--ink)]",
        destructive:
          "border-transparent bg-[var(--accent-red)] text-white",
        outline:
          "border-[var(--border-subtle)] text-[var(--ink)] bg-transparent",
        success:
          "border-transparent bg-[var(--accent-green)] text-white",
        warning:
          "border-transparent bg-[var(--accent-orange)] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
