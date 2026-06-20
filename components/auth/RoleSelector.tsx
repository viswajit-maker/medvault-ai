import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { UserRole } from "../../lib/auth-context"

interface RoleSelectorProps {
  role: UserRole
  onChange: (role: UserRole) => void
}

export function RoleSelector({ role, onChange }: RoleSelectorProps) {
  return (
    <div className="flex p-1 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] mb-5 relative box-border h-10 rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => onChange("patient")}
        className={cn(
          "flex-1 h-full text-[11px] font-mono tracking-widest uppercase transition-colors relative z-10 font-bold",
          role === "patient" ? "text-black" : "text-[var(--color-text-secondary)] hover:text-white"
        )}
      >
        Patient
      </button>
      <button
        type="button"
        onClick={() => onChange("doctor")}
        className={cn(
          "flex-1 h-full text-[11px] font-mono tracking-widest uppercase transition-colors relative z-10 font-bold",
          role === "doctor" ? "text-black" : "text-[var(--color-text-secondary)] hover:text-white"
        )}
      >
        Doctor
      </button>
      <motion.div
        layout
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[var(--color-pulse-emerald)] rounded-[1px] shadow-[0_0_10px_rgba(0,229,155,0.2)]"
        animate={{
          left: role === "patient" ? "4px" : "calc(50% + 1px)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  )
}
