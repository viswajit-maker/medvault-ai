import * as React from "react"
import { Activity, Beaker, FileText, Home, Settings, Users, ShieldAlert, Key, Bell, Sparkles, Scan } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { useAuth } from "../../lib/auth-context"

const patientNav = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Activity, label: "Vault", path: "/dashboard/vault" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Scan, label: "Prescription Reader", path: "/dashboard/ocr-reader" },
  { icon: Sparkles, label: "Prescription Simplifier", path: "/dashboard/simplifier" },
]

const doctorNav = [
  { icon: Home, label: "Portal Dashboard", path: "/doctor" },
  { icon: Users, label: "My Patients", path: "/doctor/patients" },
  { icon: Key, label: "Access Requests", path: "/doctor/requests" },
  { icon: ShieldAlert, label: "AI Screening Alerts", path: "/doctor/alerts" },
  { icon: FileText, label: "My Access Log", path: "/doctor/audit" },
  { icon: FileText, label: "Prescription Upload", path: "/doctor/prescriptions" },
]

export function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()

  const navItems = user?.role === "doctor" ? doctorNav : patientNav

  return (
    <aside className="fixed bottom-0 top-0 left-0 w-[240px] border-r border-[var(--color-vault-border)] bg-[var(--color-vault-surface)] flex flex-col z-40">
      <div className="flex h-14 items-center px-5 border-b border-[var(--color-vault-border)]">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center bg-[var(--color-vault-slate)] border border-[var(--color-pulse-emerald)]">
            <Activity className="h-4 w-4 text-[var(--color-pulse-emerald)]" />
          </div>
          <span className="font-heading font-bold uppercase tracking-widest text-[#F8F9FA] text-[13px]">MEDVAULT AI</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 flex flex-col gap-1">
        <div className="text-[10px] uppercase font-mono font-bold text-[var(--color-text-secondary)] tracking-widest mb-3 px-2">
          {user?.role === "doctor" ? "Doctor Portal Nav" : "Patient Vault Nav"}
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center gap-3 w-full px-2 py-2 rounded-sm text-sm font-sans font-medium transition-colors group",
                isActive 
                  ? "bg-[var(--color-vault-slate)] text-[var(--color-text-primary)] border-l-2 border-[var(--color-pulse-emerald)]" 
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-vault-border)]/50 hover:text-[var(--color-text-primary)] border-l-2 border-transparent"
              )}
            >
              <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-[var(--color-pulse-emerald)]" : "group-hover:text-[var(--color-text-primary)] text-[var(--color-text-tertiary)]")} />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="p-3 border-t border-[var(--color-vault-border)] bg-[var(--color-vault-slate)]">
        <button className="flex items-center gap-3 w-full px-2 py-2 rounded-sm text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-vault-border)] hover:text-[var(--color-text-primary)] transition-colors group border-l-2 border-transparent">
          <Settings className="h-4 w-4 group-hover:text-[var(--color-text-primary)] text-[var(--color-text-tertiary)] transition-colors" />
          Configuration
        </button>
      </div>
    </aside>
  )
}
