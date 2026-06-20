import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, Download, Trash2, ShieldCheck, FileText, FlaskConical, Activity, Clock } from "lucide-react"

import { Card, CardHeader, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Modal } from "../../components/ui/Modal"
import { Skeleton } from "../../components/ui/Skeleton"
import { MOCK_RECORDS, MedicalRecord } from "../../lib/mock-data"
import { useToast } from "../../components/ui/Toast"
import { cn } from "../../lib/utils"

export function RecordDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Simulate network fetch
    const fetchRecord = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      const found = MOCK_RECORDS.find(r => r.id === id)
      if (found) {
        setRecord(found)
      } else {
        // If it's a newly uploaded mock record (which we don't persist globally in this simple mock), 
        // we'd handle it. For now, we'll just mock a generic one if ID doesn't match predefined.
        if (id?.startsWith('REC-')) {
          setRecord({
            id,
            title: "Uploaded Document",
            type: "lab_report",
            date: new Date().toISOString().split('T')[0],
            provider: "Self Uploaded",
            status: "pending",
            fileHash: "0x" + Math.random().toString(16).substring(2, 14),
            content: "Document content is encrypted and pending verification."
          })
        } else {
           navigate('/dashboard')
        }
      }
      setIsLoading(false)
    }

    fetchRecord()
  }, [id, navigate])

  const handleDelete = async () => {
    setIsDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsDeleting(false)
    setIsDeleteModalOpen(false)
    
    toast({
      title: "RECORD PURGED",
      description: "Cryptographic hash removed from ledger.",
      type: "success"
    })
    
    navigate('/dashboard')
  }

  const handleDownload = () => {
    toast({
      title: "DECRYPTION STARTED",
      description: "Downloading secure file artifact...",
      type: "info"
    })
  }

  const getRecordIcon = (type?: string) => {
    switch (type) {
      case "prescription": return <FileText className="h-5 w-5" />
      case "lab_report": return <FlaskConical className="h-5 w-5" />
      case "history": return <Activity className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  if (isLoading || !record) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 border-b border-[var(--color-vault-border)] pb-4">
          <Skeleton className="h-8 w-8 rounded-sm" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
             <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-4">
             <Skeleton className="h-48 w-full" />
             <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Top Nav & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-vault-border)] pb-4 md:pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="shrink-0 rounded-none border border-transparent hover:border-[var(--color-vault-border)]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight">{record.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {new Date(record.date).toLocaleDateString()}</span>
               <span className="hidden sm:inline text-[var(--color-vault-border)]">|</span>
               <span className="truncate max-w-[200px]">{record.provider}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto pl-12 sm:pl-0">
          {record.status === "verified" ? (
             <Badge variant="active" className="gap-1.5"><ShieldCheck className="h-3 w-3" /> VERIFIED</Badge>
          ) : (
            <Badge variant={record.status === "pending" ? "consent" : "default"}>{record.status}</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="min-h-[500px] flex flex-col bg-[var(--color-vault-slate)] border-[var(--color-vault-border)] overflow-hidden">
             <CardHeader className="bg-[var(--color-vault-surface)] border-b py-3 px-4 flex flex-row items-center gap-3">
               <div className="h-6 w-6 text-[var(--color-text-tertiary)] bg-[var(--color-vault-slate)] flex items-center justify-center border border-[var(--color-vault-border)]">
                 {getRecordIcon(record.type)}
               </div>
               <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-text-secondary)]">Document Viewer</span>
             </CardHeader>
             <CardContent className="p-6 flex-1 bg-vault-grid">
               {/* Document Content Render */}
               <div className="bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] h-full min-h-[400px] p-6 shadow-inner font-mono text-sm leading-relaxed text-[var(--color-text-primary)] whitespace-pre-wrap rounded-sm relative">
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                   <ShieldCheck className="h-24 w-24" />
                 </div>
                 <div className="relative z-10 max-w-prose">
                  {record.content}
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-4">
              <h3 className="text-sm font-heading font-semibold uppercase tracking-widest">Metadata Hash</h3>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
               <div className="space-y-1">
                 <span className="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-widest">Record ID</span>
                 <p className="text-xs font-mono bg-[#1A1D21] p-1.5 border border-[#2A2F36] break-all">{record.id}</p>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-widest">Ledger Hash</span>
                 <p className="text-[11px] font-mono bg-[var(--color-pulse-emerald)]/5 text-[var(--color-pulse-emerald)] p-1.5 border border-[var(--color-pulse-emerald)]/20 break-all">{record.fileHash}</p>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] font-mono uppercase text-[var(--color-text-secondary)] tracking-widest">Classification</span>
                 <p className="text-xs font-mono bg-[#1A1D21] p-1.5 border border-[#2A2F36] uppercase">{record.type.replace('_', ' ')}</p>
               </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
             <Button className="w-full justify-start gap-3 bg-[var(--color-vault-surface)] border-[var(--color-vault-border)] text-[var(--color-text-primary)] hover:border-[var(--color-pulse-emerald)] hover:bg-[var(--color-vault-slate)]" variant="secondary" onClick={handleDownload}>
               <Download className="h-4 w-4 text-[var(--color-pulse-emerald)]" />
               Extract Artifact
             </Button>
             <Button className="w-full justify-start gap-3 bg-[var(--color-vault-slate)] border-transparent text-[var(--color-alert-crimson)] hover:border-[var(--color-alert-crimson)] hover:bg-[var(--color-alert-crimson)]/5" variant="ghost" onClick={() => setIsDeleteModalOpen(true)}>
               <Trash2 className="h-4 w-4" />
               Purge Record
             </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)} title="PURGE RECORD">
        <div className="space-y-6">
          <div className="p-4 bg-[var(--color-alert-crimson)]/10 border-l-2 border-[var(--color-alert-crimson)] border-y border-r border-solid border-[var(--color-vault-border)] rounded-r-sm">
            <p className="text-sm font-mono text-[var(--color-text-primary)]">
              This record ({record.id}) will be permanently removed from your vault. This cryptographic operation cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting} className="min-w-[120px]">
              {isDeleting ? "Purging..." : "Confirm Purge"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
