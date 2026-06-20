import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText, UploadCloud, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { motionVariants } from '../../lib/motion';
import { simplifyPrescription, SimplifiedInstruction } from '../../lib/api/simplifier';

const LANGUAGES = ['English', 'Hindi', 'Tamil'];
const COLORS = ['var(--color-pulse-emerald)', 'var(--color-alert-crimson)', 'var(--color-consent-amber)', '#8B5CF6'];

export function Simplifier() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [instructions, setInstructions] = useState<SimplifiedInstruction[]>([]);
  const [copied, setCopied] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      processDocument(file, language);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      processDocument(file, language);
    }
  };

  const processDocument = async (file: File | null, lang: string) => {
    if (!file) return;
    setIsProcessing(true);
    setInstructions([]);
    try {
      // Simulate reading and sending the file
      const result = await simplifyPrescription(file.name, lang);
      setInstructions(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (selectedFile) {
      processDocument(selectedFile, lang);
    }
  };

  const handleRefresh = () => {
    if (selectedFile) {
      processDocument(selectedFile, language);
    }
  };

  const handleCopy = () => {
    if (instructions.length === 0) return;
    const text = instructions.map((inst, i) => 
      `${i + 1}. ${inst.name} (${inst.dosage})\nPurpose: ${inst.category}\nInstructions:\n${inst.instructions.map(i => `- ${i}`).join('\n')}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] rounded-sm flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[var(--color-pulse-emerald)]" />
            </div>
            <h1 className="text-2xl font-heading font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Prescription Simplifier</h1>
          </div>
          <p className="text-sm font-mono text-[var(--color-text-secondary)] mt-2 uppercase tracking-wide">
            AI translates complex medical jargon into easy-to-understand instructions.
          </p>
        </div>
        
        {/* Language Selector */}
        <div className="flex bg-[var(--color-vault-slate)] p-1 border border-[var(--color-vault-border)] rounded-sm">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={cn(
                "px-4 py-1.5 text-xs font-mono font-bold tracking-widest uppercase rounded-sm transition-colors",
                language === lang 
                  ? "bg-[var(--color-pulse-emerald)] text-[var(--color-vault-slate)]" 
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Left Pane - Original Source */}
        <Card className="flex flex-col h-full bg-[var(--color-vault-surface)] border-[var(--color-vault-border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--color-vault-border)] flex justify-between items-center bg-[var(--color-vault-slate)]">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)] font-heading">Original Medical Text</h2>
            </div>
            {selectedFile && (
              <Badge variant="outline" className="text-[10px] bg-[var(--color-vault-surface)]">Uploaded Just Now</Badge>
            )}
          </div>
          
          <div className="flex-1 p-4 relative flex flex-col">
            {!selectedFile ? (
              <div 
                className={cn(
                  "flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-sm transition-colors",
                  isDragActive ? "border-[var(--color-pulse-emerald)] bg-[var(--color-pulse-emerald)]/5" : "border-[var(--color-vault-border)] bg-[var(--color-vault-slate)]/50"
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileSelect} />
                <UploadCloud className={cn("h-10 w-10 mb-4 transition-colors", isDragActive ? "text-[var(--color-pulse-emerald)]" : "text-[var(--color-text-tertiary)]")} />
                <p className="text-sm font-semibold mb-1 text-[var(--color-text-primary)]">Drag & drop prescription here</p>
                <p className="text-xs font-mono text-[var(--color-text-secondary)] mb-4">or <span className="text-[var(--color-pulse-emerald)] underline decoration-[var(--color-pulse-emerald)]/30 underline-offset-4">browse</span> to upload</p>
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-mono">Supported: PDF, JPG, PNG</p>
              </div>
            ) : (
              <div className="flex-1 bg-[#0A0A0A] p-4 rounded-sm border border-[var(--color-vault-border)] overflow-auto font-mono text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <div className="text-[var(--color-text-primary)] mb-4">File: {selectedFile.name}</div>
                {`CLINICAL NOTES
--------------
Patient: John Doe
Date: 2026-06-20
Provider: Dr. Smith, MD

RX:
1. Amoxicillin 500mg PO TID x 10 days
   Disp: 30 capsules
   Refills: 0
   Notes: Take w/ food.

2. Ibuprofen 400mg PO Q6H PRN pain
   Disp: 30 tablets
   Refills: 1

3. Omeprazole 20mg PO QD AC
   Disp: 30 capsules
   Refills: 3
   Notes: Do not crush/chew.

Electronically signed by Dr. Smith.`}
              </div>
            )}
          </div>
        </Card>

        {/* Right Pane - AI Simplified Plan */}
        <Card className="flex flex-col h-full bg-[var(--color-vault-surface)] border-[var(--color-vault-border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--color-vault-border)] flex justify-between items-center bg-[var(--color-vault-slate)]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--color-pulse-emerald)]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)] font-heading">AI Simplified Plan</h2>
            </div>
            {selectedFile && (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isProcessing} className="h-7 w-7 text-[var(--color-text-secondary)]">
                  <RefreshCw className={cn("h-3 w-3", isProcessing && "animate-spin text-[var(--color-pulse-emerald)]")} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={isProcessing || instructions.length === 0} className="h-7 w-7 text-[var(--color-text-secondary)]">
                  {copied ? <Check className="h-3 w-3 text-[var(--color-pulse-emerald)]" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 overflow-auto relative">
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center px-6"
                >
                  <Sparkles className="h-12 w-12 text-[var(--color-text-tertiary)] mb-4 opacity-50" />
                  <p className="text-sm text-[var(--color-text-secondary)]">Upload a prescription to see the simplified instructions here.</p>
                </motion.div>
              ) : isProcessing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center space-y-4"
                >
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-t-2 border-[var(--color-pulse-emerald)] animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-[var(--color-text-secondary)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-pulse-emerald)] animate-pulse">Analyzing Document...</div>
                </motion.div>
              ) : (
                <motion.div 
                  key={`content-${language}`}
                  variants={motionVariants.staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-4"
                >
                  {instructions.map((inst, index) => (
                    <motion.div 
                      key={inst.medicine_id}
                      variants={motionVariants.fadeInUp}
                      className="bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] rounded-sm p-4 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-[var(--color-vault-border)] group-hover:bg-[var(--color-pulse-emerald)] transition-colors"></div>
                      
                      <div className="flex items-start gap-4 ml-1">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-[#0A0A0A] shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-[var(--color-text-primary)] text-base">{inst.name}</h3>
                              <Badge variant="outline" className="text-xs font-mono">{inst.dosage}</Badge>
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{inst.category}</p>
                          </div>
                          
                          <ul className="space-y-2">
                            {inst.instructions.map((step, i) => (
                              <li key={i} className="text-sm flex gap-2 text-[var(--color-text-primary)] leading-snug">
                                <span className="text-[var(--color-pulse-emerald)] opacity-70 mt-0.5">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}
