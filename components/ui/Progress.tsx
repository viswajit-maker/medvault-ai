import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { crispEasing } from "../../lib/motion"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 to 100
  indicatorClass?: string
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, indicatorClass, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-1.5 w-full overflow-hidden rounded-none bg-[var(--color-vault-border)]",
          className
        )}
        {...props}
      >
        <motion.div
          className={cn("h-full bg-[var(--color-pulse-emerald)]", indicatorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: crispEasing }}
        />
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
