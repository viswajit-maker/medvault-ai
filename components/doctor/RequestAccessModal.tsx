import * as React from "react"
import { useState } from "react"
import { useDoctor } from "../../lib/doctor-context"
import { Modal } from "../ui/Modal"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { useToast } from "../ui/Toast"

export function RequestAccessModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [patientIdent, setPatientIdent] = useState("")
  const [purpose, setPurpose] = useState("")
  const [accessScope, setAccessScope] = useState("Full Vault Access (72 hours)")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { addRequest, patients } = useDoctor()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSubmitting(false)
    
    // Find patient name from mock list if matched, else use a placeholder
    const matchedPatient = patients.find(p => p.id.toLowerCase() === patientIdent.toLowerCase() || p.name.toLowerCase() === patientIdent.toLowerCase())
    const pName = matchedPatient ? matchedPatient.name : "Unknown Patient"
    const pId = matchedPatient ? matchedPatient.id : patientIdent.toUpperCase()

    addRequest({
      id: `REQ-${Math.floor(Math.random()*1000)}`,
      patientName: pName,
      patientId: pId,
      purpose,
      status: "pending",
      dateRequested: new Date().toISOString().split('T')[0],
      type: accessScope.split(" (")[0]
    })

    toast({
      title: "ACCESS REQUEST SENT",
      description: `Request routed to ${pName}'s Vault.`,
      type: "success"
    })
    
    setPatientIdent("")
    setPurpose("")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={!isSubmitting ? onClose : () => {}} title="REQUEST VAULT ACCESS" description="Initate secure token request">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Patient Identifier</label>
          <Input placeholder="e.g., P044 or Marcus Vance" value={patientIdent} onChange={(e) => setPatientIdent(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Clinical Purpose</label>
           <Input placeholder="e.g., Oncology Consult, Med Review" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
        </div>
         <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Access Scope</label>
          <select value={accessScope} onChange={e => setAccessScope(e.target.value)} className="flex h-10 w-full rounded-sm bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] px-3 py-2 text-sm text-[var(--color-text-primary)] font-mono focus-visible:outline-none focus-visible:border-[var(--color-pulse-emerald)] focus-visible:shadow-[0_0_10px_rgba(0,229,155,0.15)] disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-inner">
            <option>Full Vault Access (72 hours)</option>
            <option>Prescription History Only (24 hours)</option>
            <option>Selected Lab Reports (72 hours)</option>
          </select>
        </div>
        <Button className="w-full mt-4" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating Request..." : "Sign & Transmit Request"}
        </Button>
      </form>
    </Modal>
  )
}
