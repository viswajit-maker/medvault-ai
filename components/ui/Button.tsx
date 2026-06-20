import * as React from "react"
import { motion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:border-[var(--color-pulse-emerald)] focus-visible:ring-1 focus-visible:ring-[var(--color-pulse-emerald)] disabled:pointer-events-none disabled:opacity-50 tracking-wide font-heading uppercase",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-pulse-emerald)] text-[var(--color-vault-slate)] border border-[var(--color-pulse-emerald)] hover:bg-[#00F5A8]",
        secondary:
          "bg-[var(--color-vault-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-vault-border)] border border-[var(--color-vault-border)]",
        ghost: 
          "hover:bg-[var(--color-vault-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        danger:
          "bg-[var(--color-alert-crimson)] text-white hover:bg-[#FF4D42] border border-[var(--color-alert-crimson)]",
        consent:
          "bg-[var(--color-consent-amber)] text-[var(--color-vault-slate)] hover:bg-[#F5B07B] border border-[var(--color-consent-amber)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-sm px-3 text-xs",
        lg: "h-11 rounded-sm px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
