import * as React from "react"
import { useState, useMemo } from "react"
import { Key, Search, ChevronDown, Plus } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useDoctor } from "../../lib/doctor-context"
import { Badge } from "../../components/ui/Badge"
import { Input } from "../../components/ui/Input"
import { Card, CardContent } from "../../components/ui/Card"
import { crispEasing } from "../../lib/motion"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/Button"
import { RequestAccessModal } from "../../components/doctor/RequestAccessModal"

export function RequestsList() {
  const { requests, searchQuery, setSearchQuery } = useDoctor()
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "expired">("all")
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge variant="active">APPROVED</Badge>
      case "pending": return <Badge variant="consent">PENDING</Badge>
      case "rejected": return <Badge variant="danger">REJECTED</Badge>
      case "expired": return <Badge variant="default">EXPIRED</Badge>
    }
  }

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchesSearch = r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.purpose.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.patientId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filter === "all" || r.status === filter
      return matchesSearch && matchesFilter
    })
  }, [requests, searchQuery, filter])

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-vault-border)] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] flex items-center justify-center">
            <Key className="h-4 w-4 text-[var(--color-pulse-emerald)]" />
          </div>
          <h1 className="text-xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)]">Access Requests</h1>
        </div>
        <Button size="sm" variant="ghost" className="text-[var(--color-pulse-emerald)] hover:bg-[var(--color-pulse-emerald)]/10 px-2 h-8" onClick={() => setIsRequestModalOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> New Request
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
           <Input 
             placeholder="Search by ID, name, or purpose..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="pl-10"
           />
        </div>
        
        <div className="flex items-center border border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] p-1 text-[11px] font-mono tracking-widest uppercase rounded-sm overflow-x-auto">
          {(["all", "pending", "approved", "rejected"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 transition-colors rounded-[1px] whitespace-nowrap",
                filter === f ? "bg-[var(--color-vault-surface)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((req, i) => (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5), ease: crispEasing }}
            >
              <Card 
                className={cn(
                  "bg-[var(--color-vault-slate)] border-[var(--color-vault-border)] cursor-pointer hover:border-[var(--color-pulse-emerald)]/50 transition-colors",
                )}
                onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)}
              >
                <CardContent className="p-0">
                   <div className="p-4 flex items-center justify-between">
                     <div className="space-y-1">
                       <div className="flex items-center gap-2">
                         <span className="font-semibold text-sm">{req.patientName}</span>
                         <span className="text-[10px] font-mono text-[var(--color-text-secondary)] bg-[#1A1D21] px-1.5 py-0.5 border border-[#2A2F36]">{req.patientId}</span>
                       </div>
                       <p className="text-xs text-[var(--color-text-secondary)] font-mono">{req.purpose} • {req.type}</p>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                       {getStatusBadge(req.status)}
                       <ChevronDown className={cn("h-4 w-4 text-[var(--color-text-tertiary)] transition-transform", expandedRequestId === req.id && "rotate-180")} />
                     </div>
                   </div>
                   
                   <AnimatePresence>
                      {expandedRequestId === req.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-[var(--color-vault-border)] bg-[var(--color-vault-surface)]/50"
                        >
                          <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-1">
                                 <span className="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-widest">Date Requested</span>
                                 <p className="text-xs font-mono">{req.dateRequested}</p>
                               </div>
                               <div className="space-y-1">
                                 <span className="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-widest">Scope</span>
                                 <p className="text-xs font-mono">{req.type}</p>
                               </div>
                            </div>
                            <div className="space-y-1">
                               <span className="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-widest">Full Purpose</span>
                               <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{req.purpose}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="py-12 text-center border border-dashed border-[var(--color-vault-border)] rounded-sm bg-[var(--color-vault-slate)]">
            <p className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-widest">No requests found</p>
          </div>
        )}
      </div>
      <RequestAccessModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  )
}

