import * as React from "react"
import { useState } from "react"
import { Users, Plus, Search, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useDoctor } from "../../lib/doctor-context"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Modal } from "../../components/ui/Modal"
import { Card, CardContent } from "../../components/ui/Card"
import { crispEasing } from "../../lib/motion"
import { useToast } from "../../components/ui/Toast"

function AddPatientModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [patientIdent, setPatientIdent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addPatient } = useDoctor()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    setIsSubmitting(false)

    addPatient({
      id: patientIdent.toUpperCase().startsWith("PAT") || patientIdent.toUpperCase().startsWith("P0") ? patientIdent.toUpperCase() : `P${Math.floor(Math.random()*900) + 100}`,
      name: patientIdent.includes("-") ? "Sarah Connor" : patientIdent || "New Patient",
      lastAccessed: "Just now",
      activeAlerts: 0
    })

    toast({
      title: "PATIENT ADDED",
      description: `Connection request sent and mock patient added.`,
      type: "success"
    })
    
    setPatientIdent("")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={!isSubmitting ? onClose : () => {}} title="ADD NEW PATIENT" description="Link patient vault to your portal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Patient Name or ID</label>
          <Input placeholder="e.g., Sarah Connor" value={patientIdent} onChange={(e) => setPatientIdent(e.target.value)} required />
        </div>
        <Button className="w-full mt-4" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Add to My Patients"}
        </Button>
      </form>
    </Modal>
  )
}

export function PatientsList() {
  const { patients, searchQuery, setSearchQuery } = useDoctor()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-vault-border)] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] flex items-center justify-center">
            <Users className="h-4 w-4 text-[var(--color-pulse-emerald)]" />
          </div>
          <h1 className="text-xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)]">My Patients ({patients.length})</h1>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Patient
        </Button>
      </div>

      <div className="relative max-w-md">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
         <Input 
           placeholder="Search patient directory..." 
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="pl-10"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((patient, i) => (
             <motion.div
               key={patient.id}
               layout
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.3, delay: i * 0.05, ease: crispEasing }}
             >
                <Card className="bg-[var(--color-vault-surface)] border-[var(--color-vault-border)] cursor-pointer hover:border-[var(--color-pulse-emerald)]/30 group h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] group-hover:border-[var(--color-pulse-emerald)]/50 transition-colors flex items-center justify-center">
                          <Users className="h-4 w-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">{patient.name}</h3>
                          <p className="text-[10px] font-mono text-[var(--color-text-secondary)] bg-[#1A1D21] px-1 py-0.5 border border-[#2A2F36] inline-block mt-1">{patient.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--color-vault-border)]/50">
                      <p className="text-xs font-mono text-[var(--color-text-secondary)]">Accessed {patient.lastAccessed}</p>
                      <ArrowRight className="h-4 w-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
             </motion.div>
          ))}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-[var(--color-vault-border)] rounded-sm bg-[var(--color-vault-slate)]">
            <p className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-widest">No patients match your search</p>
          </div>
        )}
      </div>

      <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

