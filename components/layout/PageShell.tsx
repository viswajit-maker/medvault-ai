import * as React from "react"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

interface PageShellProps {
  children: React.ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-vault-slate)] bg-vault-grid flex text-[var(--color-text-primary)] font-sans">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col relative min-h-screen border-l border-[var(--color-vault-border)] bg-[var(--color-vault-slate)]">
        <TopBar />
        <main className="flex-1 mt-14 p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
