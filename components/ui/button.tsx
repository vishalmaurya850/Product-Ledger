import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[15px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-cyan)] text-white rounded-[8px] px-5 py-2.5 hover:bg-[var(--accent-cyan-hover)] shadow-[var(--glow-cyan)]",
        destructive:
          "bg-[var(--accent-red)] text-white rounded-[8px] px-5 py-2.5 hover:bg-[#FF6961]",
        outline:
          "border border-[var(--accent-cyan)] bg-transparent text-[var(--accent-cyan)] rounded-[8px] px-5 py-2.5 hover:bg-[var(--accent-cyan)] hover:text-white",
        secondary:
          "bg-[var(--surface-elevated)] text-[var(--ink)] rounded-[8px] px-4 py-2 text-[14px] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)]",
        ghost:
          "text-[var(--ink)] rounded-[8px] px-3 py-2 text-[14px] hover:bg-[var(--surface-elevated)]",
        link:
          "text-[var(--accent-cyan)] underline-offset-4 hover:underline bg-transparent px-0 py-0",
        dark:
          "bg-[var(--surface-black)] text-white rounded-[8px] px-4 py-2 text-[14px] hover:opacity-90",
      },
      size: {
        default: "h-auto",
        sm: "h-auto px-3 py-[6px] text-[14px]",
        lg: "h-auto px-7 py-3 text-[16px]",
        icon: "h-[40px] w-[40px] rounded-[8px] bg-[var(--surface-card)] text-[var(--ink)] p-0 border border-[var(--border-subtle)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
