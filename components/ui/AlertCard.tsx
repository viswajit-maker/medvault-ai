import * as React from "react"
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent } from "./Card"
import { Badge } from "./Badge"
import { Button } from "./Button"
import { SafetyAlert } from "../../lib/types/aiSafety"
import { cn } from "../../lib/utils"

export function AlertCard({ alert, onAcknowledge, isDoctor }: { alert: SafetyAlert, onAcknowledge?: () => void, isDoctor?: boolean }) {
  const getSeverityIcon = () => {
    switch (alert.severity) {
      case "high": return <AlertTriangle className="h-5 w-5 text-[var(--color-alert-crimson)]" />
      case "medium": return <ShieldAlert className="h-5 w-5 text-orange-500" />
      case "low": return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <Card className={cn(
      "border-l-[3px]",
      alert.severity === "high" ? "border-l-[var(--color-alert-crimson)]" : alert.severity === "medium" ? "border-l-orange-500" : "border-l-yellow-500",
      alert.acknowledged ? "opacity-60 grayscale" : "bg-[var(--color-vault-slate)] border-y border-r border-[var(--color-vault-border)]"
    )}>
      <CardContent className="p-4 space-y-3">
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Badge variant={alert.severity === "high" ? "danger" : "default"}>
                {alert.severity} Risk
              </Badge>
              {alert.acknowledged && (
                <span className="text-[10px] font-mono text-[var(--color-pulse-emerald)] uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Acknowledged
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)] bg-[#1A1D21] px-1.5 py-0.5 border border-[#2A2F36]">{alert.alert_id}</span>
         </div>
         <div className="flex items-start gap-3 mt-2">
           <div className="mt-0.5">{getSeverityIcon()}</div>
           <div>
             <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1 leading-none">{alert.title}</h3>
             <p className="text-[11px] font-mono tracking-wide text-[var(--color-text-secondary)] leading-relaxed">{alert.description}</p>
           </div>
         </div>
         {alert.involved_items.length > 0 && (
           <div className="pt-2">
             <div className="flex items-center gap-2 flex-wrap">
               <span className="text-[10px] uppercase font-mono text-[var(--color-text-tertiary)] tracking-widest">Flags:</span>
               {alert.involved_items.map(item => (
                 <span key={item} className="text-[11px] font-mono text-[var(--color-text-primary)] bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] px-1.5 py-0.5 rounded-sm">
                   {item}
                 </span>
               ))}
             </div>
           </div>
         )}
         {isDoctor && onAcknowledge && !alert.acknowledged && (
           <div className="pt-3 border-t border-[var(--color-vault-border)] mt-3 flex justify-end">
             <Button variant="ghost" size="sm" onClick={onAcknowledge} className="h-8 text-xs text-[var(--color-text-secondary)] hover:text-white">
               Acknowledge Alert
             </Button>
           </div>
         )}
      </CardContent>
    </Card>
  )
}
