import * as React from "react"
import { Activity } from "lucide-react"
import { Outlet } from "react-router-dom"
import { motion } from "motion/react"
import { motionVariants } from "../../lib/motion"

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-vault-slate)] flex flex-col md:flex-row text-[var(--color-text-primary)] overflow-hidden font-sans">
      {/* Branding Panel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 lg:w-5/12 bg-[var(--color-vault-surface)] border-b md:border-b-0 md:border-r border-[var(--color-vault-border)] relative overflow-hidden flex flex-col justify-center p-8 md:p-16 lg:p-24"
      >
        <div className="absolute inset-0 bg-vault-grid opacity-30 z-0" />
        
        {/* Subtle, slow-moving ambient graphic */}
        <div className="absolute top-1/2 right-0 opacity-[0.15] pointer-events-none translate-x-1/2 -translate-y-1/2">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            className="w-[800px] h-[800px] border border-[var(--color-pulse-emerald)] rounded-full flex items-center justify-center border-dashed"
          >
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="w-[600px] h-[600px] border border-[var(--color-pulse-emerald)] rounded-full border-dotted flex items-center justify-center"
            >
              <div className="w-[400px] h-[400px] border border-[var(--color-pulse-emerald)] rounded-full opacity-50" />
            </motion.div>
          </motion.div>
        </div>
        
        <div className="relative z-10 flex flex-col items-start w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center bg-[var(--color-vault-slate)] border border-[var(--color-pulse-emerald)] overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-[var(--color-pulse-emerald)] opacity-10"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <Activity className="h-5 w-5 text-[var(--color-pulse-emerald)] relative z-10" />
            </div>
            <span className="text-xl font-heading font-bold tracking-widest text-[#F8F9FA] uppercase">MedVault <span className="text-[var(--color-pulse-emerald)]">AI</span></span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-heading font-bold tracking-tight leading-tight mb-6 relative z-10">
            Patient-Owned.<br/>
            Consent-Driven.<br/>
            <span className="text-[var(--color-pulse-emerald)]">AI-Protected.</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] font-mono text-xs uppercase tracking-widest max-w-sm hidden md:block relative z-10">
            Establishing secure cryptographic ledger entry. <br/>
            Connection encrypted.
          </p>
        </div>
      </motion.div>

      {/* Form Panel */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-6 md:p-12 relative z-10 bg-[var(--color-vault-slate)]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
