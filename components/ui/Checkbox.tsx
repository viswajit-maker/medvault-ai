import * as React from "react"
import { cn } from "../../lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="peer h-4 w-4 cursor-pointer appearance-none rounded-none border border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] transition-colors checked:border-[var(--color-pulse-emerald)] checked:bg-[var(--color-pulse-emerald)] focus:outline-none focus:ring-1 focus:ring-[var(--color-pulse-emerald)] focus:ring-offset-2 focus:ring-offset-[var(--color-vault-surface)]"
          ref={ref}
          {...props}
        />
        <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-black opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
