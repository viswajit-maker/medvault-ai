import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Bell, ShieldCheck, UserCheck, X, CheckCircle, Fingerprint } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Modal } from "../../components/ui/Modal"
import { Input } from "../../components/ui/Input"
import { useAuth } from "../../lib/auth-context"
import { useConsent } from "../../lib/hooks/useConsent"
import { ConsentRequest } from "../../lib/types/consent"
import { crispEasing } from "../../lib/motion"
import { useToast } from "../../components/ui/Toast"
import { cn } from "../../lib/utils"
import { Eye, EyeOff } from "lucide-react"

export function Notifications() {
  const { user } = useAuth()
  const { pendingRequests, historicRequests, isLoading, approveRequest, rejectRequest } = useConsent(user?.id || "PAT-1992")
  const { toast } = useToast()
  
  const [signingId, setSigningId] = useState<string | null>(null)
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [pendingAcceptId, setPendingAcceptId] = useState<string | null>(null)

  const handleAcceptClick = (id: string) => {
    setPendingAcceptId(id)
    setPassword("")
    setHasError(false)
    setShowPassword(false)
    setIsPasswordModalOpen(true)
  }

  const handleConfirmGrant = async () => {
    if (!password) {
      setHasError(true)
      return
    }
    const id = pendingAcceptId
    if (!id) return

    setHasError(false)
    setIsPasswordModalOpen(false)
    
    setSigningId(id)
    // simulate Phase 3 signing delay
    setTimeout(async () => {
      await approveRequest(id)
      setSigningId(null)
      setPendingAcceptId(null)
      toast({
        title: "ACCESS GRANTED",
        description: `Access granted to ${pendingRequests.find(r => r.id === id)?.doctor_name || "Doctor."}`,
        type: "success"
      })
    }, 1200)
  }

  const handleDecline = async (id: string) => {
    await rejectRequest(id)
    toast({
      title: "ACCESS DECLINED",
      description: "Request has been rejected.",
    })
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight flex items-center gap-3">
          <Bell className="h-6 w-6 text-[var(--color-pulse-emerald)]" />
          Notifications
        </h1>
        <p className="text-sm font-mono text-[var(--color-text-secondary)]">
          Manage access requests and system alerts.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm font-mono text-[var(--color-text-secondary)]">Loading notifications...</div>
      ) : (
        <div className="space-y-8">
          {/* Featured Pending Requests */}
          <AnimatePresence>
            {pendingRequests.length > 0 && (
              <motion.div 
                key="pending-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                className="space-y-4"
              >
                <h2 className="text-xs font-heading font-semibold tracking-widest uppercase text-[var(--color-pulse-emerald)] flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-pulse-emerald)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-pulse-emerald)]"></span>
                  </span>
                  Requires Action ({pendingRequests.length})
                </h2>
                <div className="space-y-4">
                  {pendingRequests.map(req => (
                    <motion.div key={req.id} layout exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, ease: crispEasing }}>
                      <Card className="bg-[var(--color-vault-slate)] border-[var(--color-pulse-emerald)]/30 overflow-hidden relative">
                        {signingId === req.id && (
                          <div className="absolute inset-0 bg-[#0f1115]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                            <Fingerprint className="h-10 w-10 text-[var(--color-pulse-emerald)] animate-pulse mb-3" />
                            <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-pulse-emerald)]">Generating Signature...</p>
                          </div>
                        )}
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-full bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] flex items-center justify-center font-heading font-bold text-lg text-[var(--color-text-secondary)]">
                                    {req.doctor_name.replace("Dr. ", "").charAt(0)}
                                  </div>
                                  <div>
                                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{req.doctor_name}</h3>
                                    <p className="text-xs font-mono text-[var(--color-text-secondary)]">{req.doctor_qualification}</p>
                                  </div>
                                </div>
                                <span className="text-[10px] uppercase font-mono text-[var(--color-text-tertiary)] bg-[#1A1D21] px-2 py-1 border border-[#2A2F36] hidden sm:block">
                                  {req.id}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 py-4 border-y border-[var(--color-vault-border)]">
                                <div>
                                  <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-text-tertiary)] mb-1">Affiliation</p>
                                  <p className="text-sm font-medium">{req.hospital_affiliation}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-text-tertiary)] mb-1">Contact</p>
                                  <p className="text-sm font-mono">{req.doctor_phone}</p>
                                </div>
                                <div className="sm:col-span-2">
                                  <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-text-tertiary)] mb-1">Purpose</p>
                                  <p className="text-sm font-mono text-[var(--color-text-secondary)]">{req.purpose}</p>
                                </div>
                              </div>

                              <div className="bg-[var(--color-vault-surface)]/50 p-3 rounded-sm border border-[var(--color-vault-border)]/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-[var(--color-text-secondary)]" />
                                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-primary)]">{req.resource_type}</span>
                                </div>
                                <Badge variant="default" className="text-[10px]">{req.duration}</Badge>
                              </div>
                            </div>
                            
                            <div className="sm:w-48 flex flex-col justify-end gap-3 shrink-0">
                               <Button className="w-full" onClick={() => handleAcceptClick(req.id)} disabled={signingId === req.id}>
                                  Accept & Grant Access
                               </Button>
                               <Button variant="ghost" className="w-full text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-vault-surface)]" onClick={() => handleDecline(req.id)} disabled={signingId === req.id}>
                                  Decline
                               </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Historic List */}
          {historicRequests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-heading font-semibold tracking-widest uppercase text-[var(--color-text-secondary)] border-b border-[var(--color-vault-border)] pb-2">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {historicRequests.map(req => (
                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] rounded-sm">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {req.status === "approved" ? <CheckCircle className="h-4 w-4 text-[var(--color-pulse-emerald)]" /> : <X className="h-4 w-4 text-[var(--color-alert-crimson)] opacity-80" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {req.doctor_name}
                        </p>
                        <p className="text-xs font-mono mt-0.5">
                          <span className={cn(req.status === "approved" ? "text-[var(--color-pulse-emerald)]" : "text-[var(--color-alert-crimson)] opacity-80")}>
                            {req.status === "approved" ? "Granted: " : "Declined: "}
                          </span>
                          <span className="text-[var(--color-text-secondary)]">
                            {req.resource_type.replace(/ Access/gi, '')} Access
                          </span>
                        </p>
                        <p className="text-[10px] font-mono text-[var(--color-text-tertiary)] mt-1.5 uppercase tracking-wide">
                          {new Date(req.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {pendingRequests.length === 0 && historicRequests.length === 0 && (
             <div className="py-12 text-center text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-widest border border-dashed border-[var(--color-vault-border)]">
               No notifications
             </div>
          )}
        </div>
      )}

      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Confirm Access Grant">
        <div className="space-y-6">
          <div className="bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] p-4 rounded-sm">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Granting access to <span className="font-bold text-[var(--color-pulse-emerald)]">{pendingRequests.find(r => r.id === pendingAcceptId)?.doctor_name}</span>
            </p>
            <p className="text-xs font-mono text-[var(--color-text-secondary)] mt-1">
              For {pendingRequests.find(r => r.id === pendingAcceptId)?.resource_type} Access
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">Enter your password to confirm and securely sign this access grant.</p>
            <div className="space-y-1.5 relative">
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (hasError) setHasError(false)
                  }}
                  className={cn("pr-10", hasError && !password && "border-[var(--color-alert-crimson)] focus-visible:border-[var(--color-alert-crimson)]")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {hasError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[var(--color-alert-crimson)]"
                >
                  Password required to confirm access
                </motion.p>
              )}
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button onClick={() => setIsPasswordModalOpen(false)} variant="outline" className="flex-1">Cancel</Button>
            <Button onClick={handleConfirmGrant} disabled={!password.trim() && hasError} className="flex-1">Confirm & Grant Access</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
