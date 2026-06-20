import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, UploadCloud, FileImage, FileText, Check, AlertCircle, Edit2, Save, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { crispEasing, motionVariants } from '../../lib/motion';
import { extractMedicinesFromImage } from '../../lib/api/ocr';
import { OcrExtraction, ExtractedMedicine } from '../../lib/types/ocr';

export function OcrReader() {
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extraction, setExtraction] = useState<OcrExtraction | null>(null);
  const [history, setHistory] = useState<OcrExtraction[]>([]);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showRawText, setShowRawText] = useState(false);

  const stages = [
    "Reading document...",
    "Identifying text regions...",
    "Extracting medicine names..."
  ];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleFile = async (file: File) => {
    setCurrentFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setExtraction(null);
    setIsProcessing(true);
    setProcessingStage(0);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Simulate stages
      setTimeout(() => setProcessingStage(1), 600);
      setTimeout(() => setProcessingStage(2), 1200);
    }

    try {
      const result = await extractMedicinesFromImage(file);
      setExtraction(result);
    } catch (error: any) {
      toast({ 
        title: "CONNECTION ERROR", 
        description: error.message || "Failed to extract text. Make sure the OCR server is running at localhost:5000", 
        type: "error" 
      });
      setCurrentFile(null);
      setPreviewUrl(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditClick = (med: ExtractedMedicine) => {
    setEditingMedicineId(med.id);
    setEditValue(med.name);
  };

  const handleSaveEdit = (medId: string) => {
    if (!extraction) return;
    setExtraction({
      ...extraction,
      medicines: extraction.medicines.map(m => m.id === medId ? { ...m, name: editValue, confidence: "high" } : m)
    });
    setEditingMedicineId(null);
  };

  const handleConfirmSave = () => {
    if (!extraction) return;
    setHistory(prev => [extraction, ...prev]);
    toast({
      title: "SAVED TO VAULT",
      description: "Medicines have been confirmed and attached to the document metadata.",
      type: "success"
    });
    setExtraction(null);
    setCurrentFile(null);
    setPreviewUrl(null);
    setShowRawText(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-vault-border)] pb-4">
        <div className="h-10 w-10 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] rounded-sm flex items-center justify-center">
          <Scan className="h-5 w-5 text-[var(--color-pulse-emerald)]" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Prescription Reader</h1>
          <p className="text-sm font-mono text-[var(--color-text-secondary)] mt-1 uppercase tracking-wide">
            Upload a photo or scan of a prescription — AI extracts the medicine names automatically, even from handwriting.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      {!isProcessing && !extraction && (
        <Card className="bg-[var(--color-vault-surface)] border-[var(--color-vault-border)] border-dashed transition-all hover:border-[var(--color-pulse-emerald)]">
          <label 
            className={`flex flex-col items-center justify-center p-12 cursor-pointer transition-colors ${isDragActive ? 'bg-[var(--color-pulse-emerald)]/5' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" className="hidden" accept="image/jpeg,image/png,application/pdf" onChange={handleFileSelect} />
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-[var(--color-pulse-emerald)]/20' : 'bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)]'}`}>
              <UploadCloud className={`h-8 w-8 ${isDragActive ? 'text-[var(--color-pulse-emerald)]' : 'text-[var(--color-text-tertiary)]'}`} />
            </div>
            <p className="text-sm font-mono text-[var(--color-text-primary)] mb-2 font-bold uppercase tracking-widest">Drop Image or PDF Here</p>
            <p className="text-xs font-mono text-[var(--color-text-secondary)]">JPG, PNG, PDF up to 10MB</p>
          </label>
        </Card>
      )}

      {/* Processing State */}
      {isProcessing && currentFile && previewUrl && (
        <Card className="bg-[var(--color-vault-surface)] border-[var(--color-vault-border)] p-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Document Preview with OCR Scan Animation */}
            <div className="relative w-48 h-64 bg-white/5 border border-[var(--color-vault-border)] rounded-sm overflow-hidden flex-shrink-0">
              <img src={previewUrl} className="w-full h-full object-cover opacity-50 grayscale" alt="Document Preview" />
              
              {/* Scan Line Animation */}
              {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && (
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-[var(--color-pulse-emerald)] shadow-[0_0_15px_rgba(0,229,155,0.8)]"
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                />
              )}
            </div>

            {/* Status Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center justify-center h-10 w-10 bg-[var(--color-pulse-emerald)]/10 border border-[var(--color-pulse-emerald)]/30 rounded-sm mb-2">
                <Scan className="h-5 w-5 text-[var(--color-pulse-emerald)] animate-pulse" />
              </div>
              <h3 className="text-lg font-bold font-heading uppercase tracking-widest text-[var(--color-pulse-emerald)]">
                {stages[processingStage]}
              </h3>
              <p className="text-xs font-mono text-[var(--color-text-secondary)]">
                Analyzing {currentFile.name}...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Result State */}
      {!isProcessing && extraction && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-44 bg-white/5 border border-[var(--color-vault-border)] rounded-sm overflow-hidden flex-shrink-0">
               {previewUrl && <img src={previewUrl} className="w-full h-full object-cover opacity-80 grayscale" alt="Document Preview" />}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-widest text-[var(--color-text-primary)] font-heading">
                  Medicines Found <Badge variant="outline" className="ml-2">{extraction.medicines.length}</Badge>
                </h2>
              </div>

              <motion.div 
                variants={motionVariants.staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {extraction.medicines.map((med) => {
                  const isEditing = editingMedicineId === med.id;
                  
                  return (
                    <motion.div key={med.id} variants={motionVariants.fadeInUp}>
                      <Card className="bg-[var(--color-vault-slate)] border-[var(--color-vault-border)] p-4 group">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              {isEditing ? (
                                <div className="flex items-center gap-2 w-full max-w-xs">
                                  <Input value={editValue} onChange={e => setEditValue(e.target.value)} className="h-8" />
                                  <Button size="sm" onClick={() => handleSaveEdit(med.id)} className="px-2 h-8">
                                    <Save className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="font-bold text-sm text-[var(--color-text-primary)] tracking-wide">{med.name}</span>
                              )}
                              
                              {!isEditing && (
                                <Badge 
                                  variant="outline" 
                                  className={
                                    med.confidence === 'high' ? 'text-emerald-400 border-emerald-400/30' :
                                    med.confidence === 'medium' ? 'text-amber-400 border-amber-400/30' :
                                    'text-rose-400 border-rose-400/30'
                                  }
                                >
                                  {med.confidence} confidence
                                </Badge>
                              )}
                            </div>
                            
                            {(med.confidence === 'low' || med.confidence === 'medium') && med.raw_text_snippet && (
                              <p className="text-[10px] font-mono text-[var(--color-text-secondary)] bg-black/20 p-1.5 rounded-sm inline-block">
                                Read as: '{med.raw_text_snippet}'
                              </p>
                            )}
                          </div>
                          
                          {!isEditing && (med.confidence === 'low' || med.confidence === 'medium') && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleEditClick(med)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                            >
                              <Edit2 className="h-4 w-4 mr-2" /> Edit
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>

              {extraction.raw_text && (
                <div className="border border-[var(--color-vault-border)] rounded-sm p-4 bg-black/25">
                  <button 
                    onClick={() => setShowRawText(!showRawText)}
                    className="flex items-center justify-between w-full text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <span>📄 VIEW RAW OCR TEXT</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${showRawText ? 'rotate-180' : ''}`} />
                  </button>
                  {showRawText && (
                    <pre className="mt-3 text-xs font-mono text-[var(--color-text-tertiary)] bg-black/40 p-3 rounded-sm whitespace-pre-wrap break-all leading-relaxed max-h-48 overflow-y-auto">
                      {extraction.raw_text}
                    </pre>
                  )}
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Button onClick={handleConfirmSave} className="w-full sm:w-auto">
                  <Check className="h-4 w-4 mr-2" /> Confirm & Save to Vault
                </Button>
                
                <Link to="/dashboard/simplifier" className="text-xs font-mono text-[var(--color-text-tertiary)] hover:text-[var(--color-pulse-emerald)] transition-colors flex items-center group">
                  <Sparkles className="h-3 w-3 mr-1.5 text-[var(--color-pulse-emerald)]" />
                  Tip: Run this through the Prescription Simplifier next
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* History Section */}
      {history.length > 0 && !isProcessing && !extraction && (
        <div className="space-y-4 pt-8 border-t border-[var(--color-vault-border)]">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)] font-heading">Past Extractions</h3>
          <div className="space-y-2">
            {history.map((hist) => (
              <Card key={hist.extraction_id} className="bg-[var(--color-vault-slate)] border-[var(--color-vault-border)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{hist.source_filename}</p>
                    <p className="text-[10px] font-mono text-[var(--color-text-secondary)]">{new Date(hist.created_at).toLocaleString()} • {hist.medicines.length} medicines</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-mono">{hist.status.replace('_', ' ')}</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
