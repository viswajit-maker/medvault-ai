import * as React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Eye, EyeOff, Loader2, Check } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { RoleSelector } from "../../components/auth/RoleSelector"
import { useToast } from "../../components/ui/Toast"
import { useAuth, UserRole } from "../../lib/auth-context"
import { cn } from "../../lib/utils"

export function Login() {
  const [role, setRole] = useState<UserRole>("patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasError, setHasError] = useState(false)
  
  const { toast } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasError(false)

    if (!email || !password) {
      setHasError(true)
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    setIsLoading(false)
    setIsSuccess(true)
    
    setTimeout(() => {
      login({ name: "User", email, role })
      toast({
        title: "CONNECTION ESTABLISHED",
        description: "Successfully authenticated session.",
        type: "success"
      })
      if (role === "doctor") {
        navigate("/doctor")
      } else {
        navigate("/dashboard")
      }
    }, 400)
  }

  return (
    <motion.div
      animate={hasError ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card active className="relative shadow-none border-t-0 border-b-0">
        <CardHeader className="bg-[var(--color-vault-surface)] border-b border-[var(--color-vault-border)]">
          <CardTitle className="text-xl">AUTHORIZE SESSION</CardTitle>
          <CardDescription className="uppercase">Enter credentials to unlock vault</CardDescription>
        </CardHeader>
        <CardContent className="bg-[var(--color-vault-surface)]/50 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <RoleSelector role={role} onChange={setRole} />
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="identity@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(hasError && !email && "border-[var(--color-alert-crimson)] focus-visible:border-[var(--color-alert-crimson)] focus-visible:shadow-[0_0_10px_rgba(255,59,48,0.15)]")}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Passkey</label>
                  <a href="#" className="text-[10px] uppercase font-mono text-[var(--color-pulse-emerald)] hover:underline transition-colors">Recover?</a>
                </div>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn("pr-10", hasError && !password && "border-[var(--color-alert-crimson)] focus-visible:border-[var(--color-alert-crimson)] focus-visible:shadow-[0_0_10px_rgba(255,59,48,0.15)]")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6 relative overflow-hidden" disabled={isLoading || isSuccess}>
              <AnimatePresence mode="popLayout" initial={false}>
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.div>
                ) : isSuccess ? (
                   <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center text-[var(--color-vault-slate)]"
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Authenticate
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <p className="text-[11px] uppercase font-mono text-center text-[var(--color-text-tertiary)] mt-6 pt-4 border-t border-[var(--color-vault-border)]">
              No active profile?{" "}
              <Link to="/signup" className="text-[var(--color-pulse-emerald)] hover:underline font-bold transition-colors">
                Initialize New
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
