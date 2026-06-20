import * as React from "react"
import { FileText, Download } from "lucide-react"
import { useAuth } from "../../lib/auth-context"
import { useAuditLog } from "../../lib/hooks/useAuditLog"
import { AuditTimeline } from "../../components/ui/AuditTimeline"
import { Button } from "../../components/ui/Button"

export function DoctorAudit() {
  const { user } = useAuth()
  const { filteredLogs, isLoading, actionFilter, setActionFilter } = useAuditLog(user?.id || "MD-4482", "doctor")

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight flex items-center gap-3">
            <FileText className="h-6 w-6 text-[var(--color-pulse-emerald)]" />
            My Access Log
          </h1>
          <p className="text-sm font-mono text-[var(--color-text-secondary)]">
            Accountability and audit trail of your record accesses across the network.
          </p>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex" disabled>
          <Download className="h-4 w-4 mr-2" /> Download Log (PDF)
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 border border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] p-2 rounded-sm items-center">
         <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-mono uppercase text-[var(--color-text-tertiary)] tracking-widest px-2 shrink-0">Action</span>
            <select 
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="flex-1 sm:w-40 h-8 rounded-sm bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] px-2 text-xs font-mono text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:border-[var(--color-pulse-emerald)]"
            >
              <option value="all">All Actions</option>
              <option value="viewed">Viewed</option>
              <option value="downloaded">Downloaded</option>
              <option value="emergency_access">Emergency Access</option>
            </select>
         </div>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center text-sm font-mono text-[var(--color-text-secondary)]">Loading index...</div>
      ) : (
        <AuditTimeline entries={filteredLogs} role="doctor" />
      )}
    </div>
  )
}
