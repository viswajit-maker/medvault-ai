import * as React from "react"
import { Bell, Search } from "lucide-react"
import { useState, useContext } from "react"
import { Input } from "../ui/Input"
import { Avatar } from "../ui/Avatar"
import { Button } from "../ui/Button"
import { useAuth } from "../../lib/auth-context"
import { DOCTOR_MOCK_PATIENTS } from "../../lib/mock-data"
import { DoctorContext } from "../../lib/doctor-context"
import { AnimatePresence, motion } from "motion/react"

export function TopBar() {
  const { user } = useAuth()
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  
  const doctorCtx = useContext(DoctorContext)

  const unreadCount = doctorCtx ? doctorCtx.notifications.filter((n: any) => !n.read).length : 0

  return (
    <header className="fixed top-0 right-0 left-[240px] h-14 border-b border-[var(--color-vault-border)] bg-[var(--color-vault-surface)] z-30 flex items-center justify-between px-6">
      <div className="w-full max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
        <Input 
          placeholder="Query ID, signature, or name..." 
          className="pl-9 bg-[var(--color-vault-slate)] border-transparent text-xs focus-visible:border-[var(--color-pulse-emerald)]"
          value={doctorCtx?.searchQuery || ""}
          onChange={(e) => doctorCtx?.setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative text-[var(--color-text-secondary)] hover:text-white" onClick={() => {
            setIsNotifOpen(!isNotifOpen)
            if (doctorCtx && !isNotifOpen) doctorCtx.markNotificationsRead()
          }}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-none bg-[var(--color-alert-crimson)]"></span>
            )}
          </Button>
          
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full mt-2 right-0 w-80 bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] rounded-sm shadow-xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[var(--color-vault-border)] bg-[var(--color-vault-slate)]">
                  <h3 className="text-xs font-heading font-semibold uppercase tracking-widest">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {doctorCtx?.notifications.length ? doctorCtx.notifications.map((n: any) => (
                     <div key={n.id} className="p-4 border-b border-[var(--color-vault-border)]/50 last:border-0 hover:bg-[var(--color-vault-slate)] transition-colors">
                       <h4 className="text-sm font-semibold mb-1">{n.title}</h4>
                       <p className="text-xs text-[var(--color-text-secondary)] font-mono leading-relaxed mb-2">{n.message}</p>
                       <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest">{n.time}</p>
                     </div>
                  )) : (
                    <div className="p-6 text-center text-xs font-mono text-[var(--color-text-secondary)]">
                      No recent alerts
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-4 w-px bg-[var(--color-vault-border)] mx-1"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end">
             <span className="text-xs font-semibold uppercase text-[var(--color-text-primary)] group-hover:text-[var(--color-pulse-emerald)] transition-colors tracking-wider">
               {user?.role === "doctor" ? `DR. ${user?.name.split(" ").pop()?.toUpperCase()}` : user?.name.toUpperCase() || "USER"}
             </span>
             <span className="text-hash text-[10px]">
               {user?.role === "doctor" ? "MD-4482" : "PAT-1992"}
             </span>
          </div>
          <Avatar fallback={user?.name.substring(0, 2).toUpperCase() || "US"} src="" size="sm" />
        </div>
      </div>
    </header>
  )
}
