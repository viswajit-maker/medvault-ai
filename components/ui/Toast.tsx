import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, AlertTriangle, Info, X, ShieldAlert } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
}

interface ToastContextType {
  toast: (props: Omit<Toast, "id">) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-[100] p-4 flex flex-col gap-2 pointer-events-none md:bottom-4 md:right-4 w-full md:w-auto max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto bg-[var(--color-vault-surface)] border-y border-r border-solid border-[var(--color-vault-border)] border-l-2 shadow-2xl rounded-sm p-4 flex items-start gap-3"
              style={{
                borderLeftColor: 
                  t.type === "success" ? "var(--color-pulse-emerald)" : 
                  t.type === "error" ? "var(--color-alert-crimson)" : 
                  "var(--color-info-cyan)"
              }}
            >
              {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-[var(--color-pulse-emerald)] shrink-0" />}
              {t.type === "error" && <ShieldAlert className="h-5 w-5 text-[var(--color-alert-crimson)] shrink-0" />}
              {t.type === "info" && <Info className="h-5 w-5 text-[var(--color-info-cyan)] shrink-0" />}
              <div className="flex-1 -mt-0.5">
                <h4 className="text-sm font-heading font-semibold text-[var(--color-text-primary)]">{t.title}</h4>
                {t.description && <p className="text-hash mt-1">{t.description}</p>}
              </div>
              <button onClick={() => removeToast(t.id)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] shrink-0">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
