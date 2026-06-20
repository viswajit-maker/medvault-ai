import * as React from "react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Upload, FileText, FlaskConical, Activity, Check, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../lib/auth-context"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Modal } from "../../components/ui/Modal"
import { ProgressBar } from "../../components/ui/Progress"
import { Input } from "../../components/ui/Input"
import { MOCK_RECORDS, MOCK_ALLERGIES, STATS, RecordType, MedicalRecord } from "../../lib/mock-data"
import { useToast } from "../../components/ui/Toast"
import { crispEasing, motionVariants } from "../../lib/motion"
import { cn } from "../../lib/utils"

function UploadModal({ isOpen, onClose, onUploadComplete }: { isOpen: boolean, onClose: () => void, onUploadComplete: (record: MedicalRecord) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [type, setType] = useState<RecordType>("lab_report")
  const { toast } = useToast()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 150)

    await new Promise(resolve => setTimeout(resolve, 1500))
    clearInterval(interval)
    setProgress(100)

    const newRecord: MedicalRecord = {
      id: `REC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      title: file.name,
      type,
      date: new Date().toISOString().split('T')[0],
      provider: "Uploaded by Patient",
      status: "pending",
      fileHash: "0x" + Math.random().toString(16).substring(2, 14),
      content: "File uploaded successfully. Pending processing and verification."
    }

    onUploadComplete(newRecord)
    
    toast({
      title: "RECORD COMMITTED",
      description: "File successfully uploaded to Vault.",
      type: "success"
    })
    
    setTimeout(() => {
      setIsUploading(false)
      setProgress(0)
      setFile(null)
      onClose()
    }, 400)
  }

  return (
    <Modal isOpen={isOpen} onClose={!isUploading ? onClose : () => {}} title="UPLOAD RECORD" description="Add medical file to secure ledger">
      <div className="space-y-6">
        <div 
          onDragOver={(e) => e.preventDefault()} 
          onDrop={handleDrop}
          className="border-2 border-dashed border-[var(--color-vault-border)] hover:border-[var(--color-pulse-emerald)] transition-colors rounded-sm bg-[var(--color-vault-slate)] p-8 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer group"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload className="h-6 w-6 text-[var(--color-text-secondary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors" />
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-wide text-[var(--color-text-primary)] uppercase">Drag file to dropzone</p>
            <p className="text-xs text-[var(--color-text-secondary)] font-mono">or click to browse local files</p>
          </div>
          <input id="file-upload" type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
        </div>

        {file && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] rounded-sm">
              <div className="flex flex-col">
                <span className="text-sm font-semibold truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                <span className="text-xs text-[var(--color-text-secondary)] font-mono">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={isUploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Record Classification</label>
               <div className="flex p-1 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] relative box-border h-10 rounded-sm overflow-hidden">
                <button type="button" onClick={() => setType("lab_report")} className={cn("flex-1 h-full text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-colors relative z-10 font-bold", type === "lab_report" ? "text-black" : "text-[var(--color-text-secondary)] hover:text-white")}>
                  Lab
                </button>
                <button type="button" onClick={() => setType("prescription")} className={cn("flex-1 h-full text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-colors relative z-10 font-bold", type === "prescription" ? "text-black" : "text-[var(--color-text-secondary)] hover:text-white")}>
                  Script
                </button>
                <button type="button" onClick={() => setType("history")} className={cn("flex-1 h-full text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-colors relative z-10 font-bold", type === "history" ? "text-black" : "text-[var(--color-text-secondary)] hover:text-white")}>
                  History
                </button>
                <motion.div
                  layout
                  className="absolute top-1 bottom-1 bg-[var(--color-pulse-emerald)] rounded-[1px] shadow-[0_0_10px_rgba(0,229,155,0.2)]"
                  initial={false}
                  animate={{
                    width: "calc(33.33% - 2.66px)",
                    left: type === "lab_report" ? "4px" : type === "prescription" ? "calc(33.33% + 1.33px)" : "calc(66.66% - 1.33px)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </div>
            </div>

            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono uppercase text-[var(--color-text-secondary)]">
                  <span>Encrypting & Uploading</span>
                  <span>{progress}%</span>
                </div>
                <ProgressBar value={progress} />
              </div>
            )}

            <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Processing..." : "Commit Record"}
            </Button>
          </motion.div>
        )}
      </div>
    </Modal>
  )
}

function X(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [records, setRecords] = useState<MedicalRecord[]>(MOCK_RECORDS)
  const [filter, setFilter] = useState<"all" | RecordType>("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [highlightedRecordId, setHighlightedRecordId] = useState<string | null>(null)

  const filteredRecords = useMemo(() => {
    return records.filter(r => filter === "all" || r.type === filter)
  }, [records, filter])

  const handleUploadComplete = (record: MedicalRecord) => {
    setRecords(prev => [record, ...prev])
    setFilter("all")
    setHighlightedRecordId(record.id)
    setTimeout(() => {
      setHighlightedRecordId(null)
    }, 1500)
  }

  const getRecordIcon = (type: RecordType) => {
    switch (type) {
      case "prescription": return <FileText className="h-5 w-5" />
      case "lab_report": return <FlaskConical className="h-5 w-5" />
      case "history": return <Activity className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <Badge variant="active">VERIFIED</Badge>
      case "pending": return <Badge variant="consent">PENDING</Badge>
      case "archived": return <Badge variant="default">ARCHIVED</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)]">
          Welcome back, {user?.name}
        </h1>
        <p className="text-sm font-mono text-[var(--color-text-secondary)]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Total Records</span>
            <span className="text-2xl font-bold font-heading">{records.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Active Allergies</span>
            <span className="text-2xl font-bold font-heading text-[var(--color-alert-crimson)]">{MOCK_ALLERGIES.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Pending Consent</span>
            <span className="text-2xl font-bold font-heading text-[var(--color-consent-amber)]">{STATS.pendingConsent}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Trusted Providers</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-heading text-[var(--color-pulse-emerald)]">{STATS.trustedDoctors}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allergies Strip */}
      <div className="flex items-center gap-3 border-y border-[var(--color-vault-border)] py-4">
        <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-widest">Active Alerts:</span>
        <div className="flex flex-wrap gap-2">
          {MOCK_ALLERGIES.map(allergy => (
            <Badge key={allergy} variant="danger">{allergy}</Badge>
          ))}
        </div>
      </div>

      {/* Records Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-heading font-semibold text-[var(--color-text-primary)]">Health Vault</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[var(--color-vault-border)] rounded-sm bg-[var(--color-vault-slate)] p-1 text-[11px] font-mono tracking-widest uppercase">
              {(["all", "prescription", "lab_report", "history"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 transition-colors rounded-[1px]",
                    filter === f ? "bg-[var(--color-vault-surface)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {f === "all" ? "All" : f === "prescription" ? "Scripts" : f === "lab_report" ? "Labs" : "History"}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={() => setIsUploadModalOpen(true)} className="gap-2">
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Upload Record</span>
            </Button>
          </div>
        </div>

        <motion.div 
          layout
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <motion.div
                  layout
                  key={record.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: crispEasing }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer hover:border-[var(--color-pulse-emerald)]/50 hover:bg-[var(--color-vault-surface)]/80 transition-all group overflow-hidden h-full flex flex-col",
                      highlightedRecordId === record.id && "border-[var(--color-pulse-emerald)] shadow-[0_0_15px_rgba(0,229,155,0.2)]"
                    )}
                    onClick={() => navigate(`/dashboard/records/${record.id}`)}
                  >
                    <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-none space-y-0 relative">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors">
                          {getRecordIcon(record.type)}
                        </div>
                        <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-widest">{new Date(record.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                      </div>
                      {getStatusBadge(record.status)}
                    </CardHeader>
                    <CardContent className="p-4 pt-1 flex-1">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm leading-snug line-clamp-2">{record.title}</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] font-mono truncate">{record.provider}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-16 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] rounded-sm"
              >
                <div className="h-12 w-12 rounded-full bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-widest">No Records Found</p>
                  <p className="text-xs font-mono text-[var(--color-text-secondary)]">Try adjusting your filters or upload a new record.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setFilter("all"); setIsUploadModalOpen(true); }} className="mt-2 text-[var(--color-pulse-emerald)]">
                  Initialize Upload
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUploadComplete={handleUploadComplete} 
      />
    </div>
  )
}
