import * as React from "react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Users, Key, FileText, ArrowRight, Plus, ChevronDown, ShieldAlert } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../lib/auth-context"
import { useDoctor } from "../../lib/doctor-context"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Modal } from "../../components/ui/Modal"
import { Input } from "../../components/ui/Input"
import { DOCTOR_STATS } from "../../lib/mock-data"
import { crispEasing } from "../../lib/motion"
import { useToast } from "../../components/ui/Toast"
import { cn } from "../../lib/utils"
import { RequestAccessModal } from "../../components/doctor/RequestAccessModal"


export function PatientDetailModal({ isOpen, onClose, patient }: { isOpen: boolean, onClose: () => void, patient: any }) {
  if (!patient) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PATIENT DETAILS" description={`Access Scope: ${patient.accessScope}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-vault-border)] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{patient.name}</h3>
            <p className="text-xs font-mono text-[var(--color-text-secondary)] mt-1">ID: {patient.id} • Hospital Source: {patient.hospitalSource}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest block mb-1">Access Expires</span>
            <Badge variant="outline" className="text-[10px]">{patient.accessScope.includes("72") ? "In 72 Hours" : "In 24 Hours"}</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Accessible Documents</h4>
          <div className="space-y-2">
            {patient.scopedDocuments?.length > 0 ? (
              patient.scopedDocuments.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] rounded-sm hover:border-[var(--color-pulse-emerald)]/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors" />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{doc.title}</p>
                      <p className="text-[10px] font-mono text-[var(--color-text-secondary)] mt-0.5">{doc.hospital} • {doc.date}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors" />
                </div>
              ))
            ) : (
              <p className="text-xs font-mono text-[var(--color-text-secondary)]">No accessible documents in this scope.</p>
            )}
          </div>
        </div>

      </div>
    </Modal>
  )
}

export function DoctorDashboard() {
  const { user } = useAuth()
  const { patients, requests, searchQuery, alerts, unreadAlertsCount } = useDoctor()
  const navigate = useNavigate()
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const pendingCount = requests.filter(r => r.status === "pending").length
  
  const recentAlerts = useMemo(() => {
    return alerts.flatMap(a => 
      a.alerts.map(al => ({
        ...al,
        patientName: a.patient_name,
        patientId: a.patient_id
      }))
    ).filter(a => !a.acknowledged).slice(0, 3)
  }, [alerts])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge variant="active">APPROVED</Badge>
      case "pending": return <Badge variant="consent">PENDING</Badge>
      case "rejected": return <Badge variant="danger">REJECTED</Badge>
      case "expired": return <Badge variant="default">EXPIRED</Badge>
    }
  }

  const filteredRequests = useMemo(() => {
    if (!searchQuery) return requests.slice(0, 5)
    const q = searchQuery.toLowerCase()
    return requests.filter(r => r.patientName.toLowerCase().includes(q) || r.purpose.toLowerCase().includes(q) || r.patientId.toLowerCase().includes(q)).slice(0, 5)
  }, [requests, searchQuery])

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients.slice(0, 4)
    const q = searchQuery.toLowerCase()
    return patients.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)).slice(0, 4)
  }, [patients, searchQuery])

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight">
          Welcome, Dr. {user?.name}
        </h1>
        <p className="text-sm font-mono text-[var(--color-text-secondary)]">
          {user?.affiliation || "General Practice"} | {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--color-vault-surface)] cursor-pointer hover:border-[var(--color-pulse-emerald)]/50 transition-colors" onClick={() => navigate("/doctor/patients")}>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Users className="h-3 w-3" /> Active Patients
            </span>
            <span className="text-2xl font-bold font-heading">{patients.length}</span>
          </CardContent>
        </Card>
        <Card className="bg-[var(--color-vault-surface)] cursor-pointer hover:border-[var(--color-pulse-emerald)]/50 transition-colors" onClick={() => navigate("/doctor/requests")}>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Key className="h-3 w-3" /> Pending Requests
            </span>
            <span className="text-2xl font-bold font-heading text-[var(--color-consent-amber)]">{pendingCount}</span>
          </CardContent>
        </Card>
        <Card className="bg-[var(--color-vault-surface)] cursor-pointer hover:border-[var(--color-pulse-emerald)]/50 transition-colors" onClick={() => navigate("/doctor/patients")}>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-2">
              <FileText className="h-3 w-3" /> Records Reviewed (Week)
            </span>
            <span className="text-2xl font-bold font-heading">{DOCTOR_STATS.recordsAccessedToday + 12}</span>
          </CardContent>
        </Card>
        <Card className="bg-[var(--color-vault-surface)] cursor-pointer hover:border-[var(--color-alert-crimson)]/50 transition-colors" onClick={() => navigate("/doctor/alerts")}>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldAlert className="h-3 w-3" /> Unread AI Alerts
            </span>
            <span className={cn("text-2xl font-bold font-heading", unreadAlertsCount > 0 ? "text-[var(--color-alert-crimson)]" : "text-[var(--color-text-primary)]")}>{unreadAlertsCount}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Access Requests */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-semibold tracking-widest uppercase text-[var(--color-text-primary)]">My Access Requests</h2>
               <Button size="sm" variant="ghost" className="text-[var(--color-pulse-emerald)] hover:bg-[var(--color-pulse-emerald)]/10 px-2 h-8" onClick={() => setIsRequestModalOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> New Request
              </Button>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {filteredRequests.map((req, i) => (
                  <motion.div
                    key={req.id}
                    layout
                    initial={i === 0 ? { opacity: 0, y: -20, backgroundColor: "var(--color-pulse-emerald)" } : false}
                    animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
                    transition={{ duration: 0.5, ease: crispEasing }}
                    className="rounded-sm overflow-hidden"
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
              {filteredRequests.length === 0 && (
                <div className="p-6 text-center border border-dashed border-[var(--color-vault-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
                  No requests found
                </div>
              )}
              <Button variant="secondary" className="w-full text-xs h-9" onClick={() => navigate("/doctor/requests")}>View All Requests</Button>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
           {/* Recent AI Alerts Summary */}
           <section className="space-y-4">
             <div className="flex items-center gap-2 border-b border-[var(--color-vault-border)] pb-2 justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[var(--color-alert-crimson)]" />
                  <h2 className="text-sm font-heading font-semibold tracking-widest uppercase text-[var(--color-text-primary)]">Recent AI Alerts</h2>
                </div>
                {unreadAlertsCount > 0 && <span className="text-[10px] font-mono bg-[var(--color-alert-crimson)] text-white px-2 py-0.5 rounded-sm">{unreadAlertsCount} New</span>}
             </div>
             
             <div className="space-y-2">
               {recentAlerts.length === 0 ? (
                 <div className="p-4 text-center border border-dashed border-[var(--color-vault-border)] text-xs font-mono text-[var(--color-text-secondary)]">
                   No recent alerts.
                 </div>
               ) : (
                 recentAlerts.map(alert => (
                    <div key={alert.alert_id} className="bg-[var(--color-vault-slate)] border-l-2 border-[var(--color-alert-crimson)] p-3 cursor-pointer hover:bg-[#20252b] transition-colors" onClick={() => navigate("/doctor/alerts")}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold">{alert.patientName}</span>
                        <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono">{alert.severity} risk</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)] truncate">{alert.title}</p>
                    </div>
                 ))
               )}
               {recentAlerts.length > 0 && (
                 <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-[var(--color-text-tertiary)] hover:text-white" onClick={() => navigate("/doctor/alerts")}>
                   View All Alerts →
                 </Button>
               )}
             </div>
           </section>

           {/* Approved Patients */}
           <section className="space-y-4">
            <h2 className="text-sm font-heading font-semibold tracking-widest uppercase text-[var(--color-text-primary)]">Approved Patients</h2>
            <div className="space-y-3">
               {filteredPatients.map(patient => (
                 <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }} key={patient.id}>
                    <Card className="bg-[var(--color-vault-surface)] border-[var(--color-vault-border)] cursor-pointer hover:border-[var(--color-pulse-emerald)]/30 group" onClick={() => setSelectedPatient(patient)}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] group-hover:border-[var(--color-pulse-emerald)]/50 transition-colors flex items-center justify-center">
                            <Users className="h-4 w-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold">{patient.name}</h3>
                            <p className="text-xs font-mono text-[var(--color-text-secondary)]">Last Accessed: {patient.lastAccessed}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors" />
                      </CardContent>
                    </Card>
                 </motion.div>
               ))}
               {filteredPatients.length === 0 && (
                 <div className="p-6 text-center border border-dashed border-[var(--color-vault-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase">
                  No patients found
                 </div>
               )}
            </div>
            <Button variant="ghost" size="sm" className="w-full text-xs h-9 text-[var(--color-text-tertiary)] hover:text-white" onClick={() => navigate("/doctor/patients")}>View Patient Directory</Button>
          </section>
        </div>
      </div>

      <PatientDetailModal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} patient={selectedPatient} />
      <RequestAccessModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  )
}
