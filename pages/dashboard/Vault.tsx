import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Upload, FileText, Activity, Layers, UploadCloud, Plus, X } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Modal } from "../../components/ui/Modal"
import { Input } from "../../components/ui/Input"
import { ProgressBar } from "../../components/ui/Progress"
import { useToast } from "../../components/ui/Toast"
import { VaultEpisode } from "../../lib/types/vault"
import { crispEasing } from "../../lib/motion"
import { useNavigate } from "react-router-dom"
import { cn } from "../../lib/utils"

const MOCK_EPISODES: VaultEpisode[] = [
  {
    episode_id: "EP-01",
    hospital_name: "Raju Gandhi Memorial Hospital",
    visit_date: "12 May 2026",
    doctor_name: "Dr. A. Kumar",
    department: "Cardiology",
    documents: [
      { document_id: "REC-2A9P-11K", type: "prescription", title: "Prescription (Amoxicillin)", file_meta: "PDF · 1.2 MB" },
      { document_id: "DOC-101", type: "lab_report", title: "ECG Report", file_meta: "PDF · 3.4 MB" },
      { document_id: "DOC-102", type: "discharge_summary", title: "Discharge Summary", file_meta: "PDF · 2.1 MB" }
    ]
  },
  {
    episode_id: "EP-02",
    hospital_name: "Metro Diagnostics Lab",
    visit_date: "01 May 2026",
    doctor_name: "Dr. Maria Chen",
    department: "Orthopedics",
    documents: [
      { document_id: "DOC-103", type: "xray", title: "X-Ray Report (Left Knee)", file_meta: "DICOM · 12.4 MB" },
      { document_id: "REC-9K2L-55Q", type: "prescription", title: "Prescription (Ibuprofen)", file_meta: "PDF · 0.8 MB" }
    ]
  },
  {
    episode_id: "EP-03",
    hospital_name: "St. Jude Cardiology Center",
    visit_date: "15 Mar 2026",
    doctor_name: "Dr. A. Kumar",
    department: "Cardiology",
    documents: [
      { document_id: "REC-7N3B-88Z", type: "mri", title: "MRI Scan (Cardiac)", file_meta: "DICOM · 45.2 MB" },
      { document_id: "REC-8X4M-92L", type: "lab_report", title: "Lab Report (Lipid Panel)", file_meta: "PDF · 1.5 MB" },
      { document_id: "DOC-104", type: "prescription", title: "Prescription (Lisinopril)", file_meta: "PDF · 1.1 MB" }
    ]
  }
]

import { generateDocumentSummary } from "../../lib/api/aiSummary"
import { Sparkles } from "lucide-react"

function getDocIcon(type: string) {
  switch (type) {
    case "prescription": return <FileText className="h-4 w-4 text-blue-400" />
    case "xray":
    case "mri": return <Layers className="h-4 w-4 text-purple-400" />
    case "lab_report": return <Activity className="h-4 w-4 text-emerald-400" />
    default: return <FileText className="h-4 w-4 text-gray-400" />
  }
}

function DocumentRow({ doc, index, delayBase }: { doc: any, index: number, delayBase: number, key?: any }) {
  const navigate = useNavigate()
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (summary) {
      setSummary(null)
      return
    }
    setIsSummarizing(true)
    const result = await generateDocumentSummary(doc.document_id)
    setSummary(result)
    setIsSummarizing(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delayBase + index * 0.05 + 0.2 }}
      className="group flex flex-col p-2 sm:p-3 hover:bg-[var(--color-vault-surface)] transition-colors rounded-sm"
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => navigate(`/dashboard/records/${doc.document_id}`)}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-sm bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] flex flex-col items-center justify-center shrink-0 group-hover:border-[var(--color-text-tertiary)] transition-colors">
            {getDocIcon(doc.type)}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors line-clamp-1">{doc.title}</p>
            <p className="text-[10px] font-mono text-[var(--color-text-tertiary)] tracking-wide">{doc.file_meta}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleSummarize}
            className="flex items-center justify-center gap-1.5 h-6 px-2 rounded-[2px] border border-[var(--color-vault-border)] group-hover:border-[var(--color-pulse-emerald)]/30 hover:bg-[var(--color-pulse-emerald)]/10 text-[var(--color-pulse-emerald)] transition-colors opacity-0 group-hover:opacity-100"
          >
            {isSummarizing ? (
               <Sparkles className="h-3 w-3 animate-pulse" />
            ) : (
               <Sparkles className="h-3 w-3" />
            )}
            <span className="text-[10px] font-mono uppercase tracking-widest leading-none hidden sm:inline-block">AI</span>
          </button>
          
          <div className="text-[10px] uppercase font-mono text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
             View
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: crispEasing }}
            className="overflow-hidden"
          >
            <div className="mt-3 py-2.5 px-3 border-l-2 border-[var(--color-pulse-emerald)] bg-[var(--color-pulse-emerald)]/5 text-sm font-mono text-[var(--color-text-secondary)]">
              {summary}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function Vault() {
  const [episodes, setEpisodes] = useState<VaultEpisode[]>(MOCK_EPISODES)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [targetEpisodeId, setTargetEpisodeId] = useState<string>("new")
  const [newHospitalName, setNewHospitalName] = useState("")
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setIsDragActive(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setIsDragActive(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files as FileList)])
      setUploadProgress(0)
      setIsUploadModalOpen(true)
    }
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)])
      setUploadProgress(0)
      setIsUploadModalOpen(true)
    }
    e.target.value = ''
  }
  
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const simulateUpload = () => {
    setUploadProgress(10)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          handleUploadComplete()
          return 100
        }
        return prev + 15
      })
    }, 200)
  }

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false)
    setUploadProgress(0)
    
    // update mock list based on target
    const newDocs = selectedFiles.map((f, i) => ({ 
      document_id: `DOC-NEW-${Math.random()}-${i}`, 
      type: "lab_report" as const, 
      title: f.name, 
      file_meta: f.name.toLowerCase().endsWith('.dicom') ? `DICOM · ${(f.size / 1024 / 1024).toFixed(2)} MB` : `PDF · ${(f.size / 1024 / 1024).toFixed(2)} MB`
    }))

    if (targetEpisodeId === "new") {
      setEpisodes([{
        episode_id: `EP-NEW-${Math.random()}`,
        hospital_name: newHospitalName.trim() || "New Visit Entry",
        visit_date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        doctor_name: "Unknown",
        department: "General",
        documents: newDocs
      }, ...episodes])
    } else {
      setEpisodes(prev => prev.map(ep => ep.episode_id === targetEpisodeId ? { ...ep, documents: [...newDocs, ...ep.documents] } : ep))
    }
    
    setSelectedFiles([])
    setNewHospitalName("")
    
    toast({
      title: "UPLOAD COMPLETE",
      description: `${selectedFiles.length} file(s) securely encrypted and added to your Vault.`,
      type: "success"
    })
  }

  const isUploadValid = selectedFiles.length > 0 && (targetEpisodeId !== "new" || newHospitalName.trim().length > 0)

  const handleModalClose = () => {
    if(uploadProgress === 0) {
      setIsUploadModalOpen(false)
      if (selectedFiles.length === 0) {
         setNewHospitalName("")
         setTargetEpisodeId("new")
      }
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight">
          My Vault
        </h1>
        <p className="text-sm font-mono text-[var(--color-text-secondary)]">
          Records organized by clinical visit and hospital episode.
        </p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {episodes.map((episode, i) => (
            <motion.div
              key={episode.episode_id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: crispEasing }}
            >
              <Card className="bg-[var(--color-vault-slate)] border-[var(--color-vault-border)] overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[var(--color-vault-border)] bg-[var(--color-vault-surface)]/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                   <div>
                     <h2 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">{episode.hospital_name}</h2>
                     <p className="text-xs font-mono text-[var(--color-text-secondary)] mt-1 flex items-center gap-2">
                       <span>{episode.doctor_name}</span>
                       <span className="text-[var(--color-text-tertiary)]">•</span>
                       <span>{episode.department}</span>
                     </p>
                   </div>
                   <div className="text-left sm:text-right">
                     <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-text-secondary)] bg-[#1A1D21] px-2 py-1 border border-[#2A2F36]">
                       {episode.visit_date}
                     </span>
                   </div>
                </div>
                <div className="p-2 sm:p-3 divide-y divide-[var(--color-vault-border)]/50">
                  {episode.documents.map((doc, docIdx) => (
                    <DocumentRow key={doc.document_id} doc={doc} index={docIdx} delayBase={i * 0.1} />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-8">
        <div 
          className={cn(
            "border-2 border-dashed rounded-sm p-10 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden bg-[var(--color-vault-surface)]",
            isDragActive ? "border-[var(--color-pulse-emerald)] bg-[var(--color-pulse-emerald)]/5" : "border-[var(--color-vault-border)] hover:border-[var(--color-text-tertiary)]"
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileSelect} />
          <UploadCloud className={cn("h-10 w-10 mb-4 transition-colors", isDragActive ? "text-[var(--color-pulse-emerald)]" : "text-[var(--color-text-tertiary)]")} />
          <p className="text-sm font-semibold mb-1 text-[var(--color-text-primary)]">Drag & drop files here</p>
          <p className="text-xs font-mono text-[var(--color-text-secondary)] mb-4">or <span className="text-[var(--color-pulse-emerald)] underline decoration-[var(--color-pulse-emerald)]/30 underline-offset-4">browse</span> to upload</p>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-mono">Supported: PDF, JPG, DICOM</p>
        </div>
      </div>

      <Modal isOpen={isUploadModalOpen} onClose={handleModalClose} title="Secure Upload">
        <div className="space-y-6">
          <div className="space-y-2">
            {selectedFiles.map((file, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] p-3 rounded-sm flex items-center justify-between group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-5 w-5 text-[var(--color-text-secondary)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ wordBreak: 'break-word', whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {file.name}
                    </p>
                    <p className="text-xs font-mono text-[var(--color-text-tertiary)] mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {uploadProgress === 0 && (
                  <button onClick={() => removeSelectedFile(i)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-alert-crimson)] transition-colors p-1">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            ))}
            {uploadProgress === 0 && (
              <div className="pt-1">
                 <button className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-pulse-emerald)] hover:text-white transition-colors" onClick={() => document.getElementById('add-file-input')?.click()}>
                    <Plus className="h-3 w-3" /> Add File
                 </button>
                 <input type="file" id="add-file-input" className="hidden" onChange={handleFileSelect} multiple />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">Link to Episode</label>
              <select 
                value={targetEpisodeId} 
                onChange={e => setTargetEpisodeId(e.target.value)}
                disabled={uploadProgress > 0}
                className="w-full h-10 rounded-sm bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] px-3 text-sm text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:border-[var(--color-pulse-emerald)]"
              >
                <option value="new">+ Create new visit entry</option>
                {episodes.map(ep => (
                  <option key={ep.episode_id} value={ep.episode_id}>Add to: {ep.hospital_name} ({ep.visit_date})</option>
                ))}
              </select>
            </div>
            
            {targetEpisodeId === "new" && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5 overflow-hidden">
                 <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">Hospital / Clinic Name</label>
                 <Input 
                   type="text" 
                   placeholder="e.g. Raju Gandhi Memorial Hospital" 
                   value={newHospitalName}
                   onChange={e => setNewHospitalName(e.target.value)}
                   disabled={uploadProgress > 0}
                 />
               </motion.div>
            )}
          </div>
          
          {uploadProgress > 0 ? (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono text-[var(--color-text-secondary)]">
                <span>Encrypting & Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <ProgressBar value={uploadProgress} />
            </div>
          ) : (
            <div className="pt-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <Button onClick={handleModalClose} variant="outline" className="flex-1">Cancel</Button>
                <Button onClick={simulateUpload} disabled={!isUploadValid} className="flex-1">Start Upload</Button>
              </div>
              {!isUploadValid && targetEpisodeId === "new" && selectedFiles.length > 0 && (
                <p className="text-xs text-center text-[var(--color-alert-crimson)] opacity-80">Enter a hospital name to continue</p>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
