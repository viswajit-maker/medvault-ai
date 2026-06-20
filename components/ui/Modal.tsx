import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./Button"
import { crispEasing } from "../../lib/motion"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--color-vault-slate)]/90 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3, ease: crispEasing }}
              className={cn(
                "bg-[var(--color-vault-surface)] chart-border relative w-full max-w-lg rounded-sm shadow-2xl pointer-events-auto flex flex-col",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start p-5 border-b border-[var(--color-vault-border)]">
                <div className="space-y-1">
                  <h2 className="text-xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)] leading-none">{title}</h2>
                  {description && <p className="text-sm text-hash mt-2 leading-relaxed">{description}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none -mt-1 -mr-1"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-5 bg-vault-grid">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
