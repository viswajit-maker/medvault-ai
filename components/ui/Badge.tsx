import * as React from "react"
import { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-pulse-emerald)]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-vault-border)] bg-[var(--color-vault-surface)] text-[var(--color-text-secondary)]",
        active:
          "border-[var(--color-pulse-emerald)] bg-[var(--color-pulse-emerald)]/10 text-[var(--color-pulse-emerald)]",
        consent:
          "border-[var(--color-consent-amber)] bg-[var(--color-consent-amber)]/10 text-[var(--color-consent-amber)]",
        danger:
          "border-[var(--color-alert-crimson)] bg-[var(--color-alert-crimson)]/10 text-[var(--color-alert-crimson)]",
        info: "border-[var(--color-info-cyan)] bg-[var(--color-info-cyan)]/10 text-[var(--color-info-cyan)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "active" | "consent" | "danger" | "info" | null | undefined;
}

function Badge({ className, variant, children, ...props }: BadgeProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
