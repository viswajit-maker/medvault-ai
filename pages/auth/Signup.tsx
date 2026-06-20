import * as React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Eye, EyeOff, Loader2, Check } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Checkbox } from "../../components/ui/Checkbox"
import { RoleSelector } from "../../components/auth/RoleSelector"
import { useToast } from "../../components/ui/Toast"
import { useAuth, UserRole } from "../../lib/auth-context"
import { cn } from "../../lib/utils"

export function Signup() {
  const [role, setRole] = useState<UserRole>("patient")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [dob, setDob] = useState("")
  const [affiliation, setAffiliation] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasError, setHasError] = useState(false)
  
  const { toast } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()

  const getPasswordStrength = () => {
    let score = 0
    if (password.length > 5) score += 1
    if (password.length > 8) score += 1
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    return Math.min(score, 3)
  }

  const strength = getPasswordStrength()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasError(false)

    if (!name || !email || !password || !confirmPassword || !acceptedTerms || 
        (role === "patient" && !dob) || (role === "doctor" && !affiliation)) {
      setHasError(true)
      return
    }

    if (password !== confirmPassword) {
      setHasError(true)
      toast({
        title: "MISMATCH ERROR",
        description: "Passkey verification failed.",
        type: "error"
      })
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    setIsLoading(false)
    setIsSuccess(true)
    
    setTimeout(() => {
      login({ name, email, role, dob: role === "patient" ? dob : undefined, affiliation: role === "doctor" ? affiliation : undefined })
      toast({
        title: "PROFILE INITIALIZED",
        description: "Welcome to MedVault AI secure network.",
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
          <CardTitle className="text-xl">INITIALIZE PROFILE</CardTitle>
          <CardDescription className="uppercase">Create new encrypted ledger record</CardDescription>
        </CardHeader>
        <CardContent className="bg-[var(--color-vault-surface)]/50 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <RoleSelector role={role} onChange={setRole} />
            
            <div className="space-y-4">
              <motion.div layout className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Full Name</label>
                <Input 
                  type="text" 
                  placeholder="Ex. Jane Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(hasError && !name && "border-[var(--color-alert-crimson)] focus-visible:border-[var(--color-alert-crimson)] focus-visible:shadow-[0_0_10px_rgba(255,59,48,0.15)]")}
                />
              </motion.div>

              <motion.div layout className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="jane@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(hasError && !email && "border-[var(--color-alert-crimson)] focus-visible:border-[var(--color-alert-crimson)] focus-visible:shadow-[0_0_10px_rgba(255,59,48,0.15)]")}
                />
              </motion.div>

              <AnimatePresence mode="popLayout" initial={false}>
                {role === "patient" && (
                  <motion.div
                    key="patient-fields"
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Date of Birth</label>
                    <Input 
                      type="date" 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={cn(hasError && !dob && "border-[var(--color-alert-crimson)] focus-visible:border-[var(--color-alert-crimson)] focus-visible:shadow-[0_0_10px_rgba(255,59,48,0.15)]")}
                    />
                  </motion.div>
                )}
                {role === "doctor" && (
                  <motion.div
                    key="doctor-fields"
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                   <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Affiliation ID</label>
                    <Input 
                      type="text" 
                      placeholder="Clinic/Hospital Code" 
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      className={cn(hasError && !affiliation && "border-[var(--color-alert-crimson)] focus-visible:border-[var(--color-alert-crimson)] focus-visible:shadow-[0_0_10px_rgba(255,59,48,0.15)]")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout className="space-y-1.5 pt-2">
                 <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Passkey</label>
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
                {/* Password Strength Indicator */}
                <div className="flex gap-1 h-1.5 mt-2 rounded-[1px] overflow-hidden bg-[var(--color-vault-border)]">
                  <motion.div 
                    className="h-full bg-[var(--color-alert-crimson)]"
                    initial={{ width: 0 }}
                    animate={{ width: strength >= 1 ? "33.33%" : "0%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                  <motion.div 
                    className="h-full bg-[var(--color-consent-amber)]"
                    initial={{ width: 0 }}
                    animate={{ width: strength >= 2 ? "33.33%" : "0%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                  <motion.div 
                    className="h-full bg-[var(--color-pulse-emerald)]"
                    initial={{ width: 0 }}
                    animate={{ width: strength >= 3 ? "33.33%" : "0%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                </div>
              </motion.div>

              <motion.div layout className="space-y-1.5">
                 <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Verify Passkey</label>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(hasError && !confirmPassword && "border-[var(--color-alert-crimson)] focus-visible:border-[var(--color-alert-crimson)] focus-visible:shadow-[0_0_10px_rgba(255,59,48,0.15)]")}
                />
              </motion.div>
              
              <motion.label layout className={cn("flex items-start gap-3 cursor-pointer group mt-4 bg-[var(--color-vault-slate)] border p-3 hover:border-[var(--color-pulse-emerald)] transition-colors rounded-sm", hasError && !acceptedTerms ? "border-[var(--color-alert-crimson)]" : "border-[var(--color-vault-border)]")}>
                <Checkbox 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-[11px] uppercase font-mono text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors leading-relaxed">
                  Acknowledge cryptographic <a href="#" className="text-[var(--color-pulse-emerald)] underline">Vault Terms</a> and consent to <a href="#" className="text-[var(--color-pulse-emerald)] underline">AI Risk Screening.</a>
                </span>
              </motion.label>
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
                    Commit Block (Sign up)
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <p className="text-[11px] uppercase font-mono text-center text-[var(--color-text-tertiary)] mt-6 pt-4 border-t border-[var(--color-vault-border)]">
              Active profile exists?{" "}
              <Link to="/login" className="text-[var(--color-pulse-emerald)] hover:underline font-bold transition-colors">
                Authorize Session
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
