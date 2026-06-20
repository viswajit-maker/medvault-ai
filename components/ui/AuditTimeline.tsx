import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Hospital, Cross, Beaker, FileText, Download, ShieldAlert, Eye, CheckCircle, XCircle } from "lucide-react"
import { AuditLogEntry } from "../../lib/types/audit"
import { Badge } from "./Badge"
import { crispEasing } from "../../lib/motion"
import { cn } from "../../lib/utils"

function getActionIcon(action: string) {
  switch (action) {
    case "viewed": return <Eye className="h-4 w-4" />
    case "downloaded": return <Download className="h-4 w-4" />
    case "consent_granted": return <CheckCircle className="h-4 w-4 text-[var(--color-pulse-emerald)]" />
    case "consent_revoked": return <XCircle className="h-4 w-4 text-[var(--color-alert-crimson)]" />
    case "emergency_access": return <ShieldAlert className="h-4 w-4 text-[var(--color-consent-amber)]" />
    default: return <FileText className="h-4 w-4" />
  }
}

export function AuditTimeline({ entries, role }: { entries: AuditLogEntry[], role: "patient" | "doctor" }) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-[var(--color-vault-border)] rounded-sm bg-[var(--color-vault-slate)]">
        <p className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-widest">No access logs match current filters</p>
      </div>
    )
  }

  return (
    <div className="relative border-l border-[var(--color-vault-border)] ml-4">
      <AnimatePresence>
        {entries.map((entry, i) => {
          const isEmergency = entry.action === "emergency_access"
          
          return (
            <motion.div
              key={entry.log_id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5), ease: crispEasing }}
              className="mb-8 relative pl-6 last:mb-0"
            >
              <div className={cn(
                "absolute -left-2 top-1 h-4 w-4 rounded-full border-2 border-[var(--color-vault-surface)] flex items-center justify-center transition-colors",
                isEmergency ? "bg-[var(--color-consent-amber)]" : "bg-[var(--color-vault-slate)] border-[var(--color-vault-border)]"
              )}>
                {isEmergency && <span className="h-1.5 w-1.5 bg-[var(--color-vault-surface)] rounded-full"></span>}
              </div>

              <div className="bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] rounded-sm p-4 hover:border-[var(--color-pulse-emerald)]/30 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors">
                      {getActionIcon(entry.action)}
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-sm font-semibold">
                           {role === "patient" ? entry.provider_name : `Viewed Patient: ${entry.patient_id}`}
                         </span>
                         {role === "patient" && <Badge variant="default" className="text-[9px] px-1 py-0">{entry.provider_type}</Badge>}
                         {isEmergency && <Badge variant="consent">EMERGENCY</Badge>}
                       </div>
                       <p className="text-xs text-[var(--color-text-secondary)]">
                         <span className="capitalize">{entry.action.replace("_", " ")}</span>: <span className="font-mono">{entry.resource}</span>
                       </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right shrink-0 ml-7 md:ml-0">
                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] uppercase tracking-widest block mb-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--color-text-secondary)] bg-[#1A1D21] px-1.5 py-0.5 border border-[#2A2F36]">
                      {entry.log_id}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-[var(--color-vault-border)]/50 ml-7 md:ml-0">
                  <p className="text-[11px] font-mono text-[var(--color-text-secondary)] leading-relaxed flex gap-2">
                    <span className="text-[var(--color-text-tertiary)] uppercase tracking-widest shrink-0">Purpose:</span>
                    {entry.purpose}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
