import * as React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useMotionValueEvent, useReducedMotion, AnimatePresence, useTransform, useInView } from "motion/react"
import { Activity, ShieldAlert, CheckCircle2, Shield, Lock, Database, Eye, ArrowRight, ArrowDown, Sparkles, ScanLine, Users, Key, FileText, Stethoscope, AlertTriangle } from "lucide-react"

import { Button, buttonVariants } from "../components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { ProgressBar } from "../components/ui/Progress"
import { AlertCard } from "../components/ui/AlertCard"
import { motionVariants, crispEasing } from "../lib/motion"
import { DOCTOR_STATS, DOCTOR_MOCK_ALERTS } from "../lib/mock-data"
import { SafetyAlert } from "../lib/types/aiSafety"
import { cn } from "../lib/utils"

// --- SCROLL PROGRESS INDICATOR ---

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-pulse-emerald)] z-[60] origin-left"
      style={{ scaleX: scrollYProgress }}
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
    />
  )
}

// --- NAVBAR ---

function NavBar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-[var(--color-vault-slate)]/95 backdrop-blur-md border-[var(--color-vault-border)] py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-[var(--color-vault-slate)] border border-[var(--color-pulse-emerald)]">
            <Activity className="h-5 w-5 text-[var(--color-pulse-emerald)]" />
          </div>
          <span className="font-heading font-bold uppercase tracking-widest text-[#F8F9FA] text-lg">
            MedVault <span className="text-[var(--color-pulse-emerald)]">AI</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#product" className="text-xs font-mono uppercase tracking-widest text-hash hover:text-white transition-colors">Architecture</a>
          <a href="#ai-demo" className="text-xs font-mono uppercase tracking-widest text-hash hover:text-white transition-colors">Safety Agent</a>
          <a href="#security" className="text-xs font-mono uppercase tracking-widest text-hash hover:text-white transition-colors">Trust Model</a>
          <a href="#doctors" className="text-xs font-mono uppercase tracking-widest text-hash hover:text-white transition-colors">For Doctors</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:inline-block text-xs font-mono uppercase tracking-widest text-hash hover:text-white transition-colors">
            Authorize
          </Link>
          <Link to="/signup" className={buttonVariants({ variant: "primary" })}>
            Initialize Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}

// --- HERO CONSENT LOOP ---

function HeroConsentLoop() {
  const shouldReduceMotion = useReducedMotion()
  const [step, setStep] = useState(0) // 0: Wait, 1: Request, 2: Signed, 3: Active
  const [timeLeft, setTimeLeft] = useState(100)

  useEffect(() => {
    if (shouldReduceMotion) {
      setStep(3)
      setTimeLeft(30)
      return
    }

    let timer: any
    if (step === 0) {
      timer = setTimeout(() => setStep(1), 1000)
    } else if (step === 1) {
      timer = setTimeout(() => setStep(2), 2000)
    } else if (step === 2) {
      timer = setTimeout(() => setStep(3), 600)
      setTimeLeft(100)
    } else if (step === 3) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setStep(0)
            return 100
          }
          return prev - 2
        })
      }, 50)
    }
    return () => {
      clearTimeout(timer)
      clearInterval(timer)
    }
  }, [step, shouldReduceMotion])

  return (
    <div className="relative w-full max-w-sm mx-auto h-[260px] flex items-center justify-center">
      <div className="absolute inset-0 bg-vault-grid opacity-30 select-none pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step >= 1 && (
          <motion.div
            key="consent-card"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: crispEasing }}
            className="w-full relative z-10"
          >
            <Card active={step === 3} className={cn("border-2 shadow-2xl", step === 3 ? "border-[var(--color-pulse-emerald)]" : "border-[var(--color-vault-border)]")}>
              <CardHeader className="bg-[var(--color-vault-surface)] border-b border-[#2A2F36] py-3 px-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-widest text-hash uppercase">ID: 0x8F2A...E91</span>
                  {step < 3 ? <Badge variant="consent">AWAITING_SIGNATURE</Badge> : <Badge variant="active">ACCESS_GRANTED</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <h4 className="font-heading font-semibold text-[var(--color-text-primary)]">Dr. Kumar (MD-4482)</h4>
                  <p className="text-sm font-sans text-[var(--color-text-secondary)] mt-1">Requires read-only access to Lab Reports & Vitals for consultation.</p>
                </div>

                {step === 3 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
                      <span>Session Expiry</span>
                      <span className="text-[var(--color-pulse-emerald)]">{Math.ceil((timeLeft / 100) * 30)} MIN</span>
                    </div>
                    <ProgressBar value={timeLeft} indicatorClass="bg-[var(--color-pulse-emerald)] shadow-none" />
                  </div>
                )}
              </CardContent>
              {step < 3 && (
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button variant="secondary" className="flex-1 opacity-50" disabled>Deny</Button>
                  <Button variant="consent" className={cn("flex-1 relative overflow-hidden", step === 2 && "bg-white text-black")}>
                    {step === 2 && (
                      <motion.div 
                        initial={{ x: "-100%" }} 
                        animate={{ x: "100%" }} 
                        transition={{ duration: 0.5, ease: "linear" }}
                        className="absolute inset-0 bg-white/50"
                      />
                    )}
                    {step === 2 ? "Signing..." : "Sign Cryptographically"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- AI SAFETY PROOF MOMENT (uses real AlertCard) ---

function AISafetyProofSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<"idle" | "scanning" | "revealed">("idle")

  // Build a real SafetyAlert from the DOCTOR_MOCK_ALERTS data
  const realAlert: SafetyAlert = useMemo(() => ({
    alert_id: DOCTOR_MOCK_ALERTS[0].id,
    type: "drug_interaction",
    severity: DOCTOR_MOCK_ALERTS[0].severity as "high",
    title: DOCTOR_MOCK_ALERTS[0].title,
    description: `${DOCTOR_MOCK_ALERTS[0].detail} Patient: ${DOCTOR_MOCK_ALERTS[0].patientName} (${DOCTOR_MOCK_ALERTS[0].patientId}). Concurrent use of Warfarin and NSAIDs significantly increases systemic bleeding probability.`,
    involved_items: ["Warfarin 5mg", "Aspirin 81mg"],
    acknowledged: false
  }), [])

  useEffect(() => {
    if (!isInView) return
    if (shouldReduceMotion) {
      setPhase("revealed")
      return
    }
    // Start scan after entering viewport
    const t1 = setTimeout(() => setPhase("scanning"), 300)
    const t2 = setTimeout(() => setPhase("revealed"), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isInView, shouldReduceMotion])

  return (
    <section id="ai-demo" ref={sectionRef} className="py-24 md:py-32 px-6 border-t border-[var(--color-vault-border)] bg-[var(--color-vault-surface)]/30 relative">
      <div className="absolute inset-0 bg-vault-grid opacity-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="w-full lg:w-1/2 space-y-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: crispEasing }}
          >
            <Badge variant="danger" className="mb-4">LIVE DEMONSTRATION</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight text-white leading-tight">
              Quietly observing.<br/>Relentlessly protecting.
            </h2>
          </motion.div>
          <motion.p 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: crispEasing }}
            className="text-lg text-[var(--color-text-secondary)] leading-relaxed"
          >
            Before any new transaction commits to your ledger, the AI Safety Agent cross-references incoming prescriptions against your complete encrypted history. It doesn't require human activation — it's built into the protocol.
          </motion.p>
          <motion.ul 
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: crispEasing }}
            className="space-y-4 font-mono text-sm text-[var(--color-text-primary)]"
          >
            <li className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-[var(--color-pulse-emerald)] mt-0.5 shrink-0" />
              <span>Cross-checks drug interactions, allergies, and dose conflicts.</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-[var(--color-pulse-emerald)] mt-0.5 shrink-0" />
              <span>Real alert below uses actual mock data: "{DOCTOR_MOCK_ALERTS[0].detail}"</span>
            </li>
          </motion.ul>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="relative overflow-hidden bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] p-6">
            {/* Scan line */}
            <AnimatePresence>
              {phase === "scanning" && (
                <motion.div
                  initial={{ top: 0, opacity: 0 }}
                  animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-[var(--color-pulse-emerald)] shadow-[0_0_15px_#00E59B] z-20 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Medicine entries */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-vault-border)]">
              <div>
                <h3 className="font-heading text-lg font-semibold uppercase text-white">Verification Matrix</h3>
                <p className="text-[11px] font-mono text-hash uppercase tracking-widest mt-1">Engine v2.0 - Active</p>
              </div>
              <Badge variant={phase === "revealed" ? "danger" : "active"}>
                {phase === "idle" ? "STANDBY" : phase === "scanning" ? "ANALYZING..." : "ALERT_RAISED"}
              </Badge>
            </div>

            <div className="space-y-4 relative z-10 mb-6">
              <div className="p-3 border border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] opacity-70">
                <span className="text-[10px] font-mono uppercase text-hash tracking-widest block mb-1">Existing Ledger Record</span>
                <span className="font-sans font-medium text-white">Warfarin (5mg daily)</span>
              </div>
              
              <div className="p-3 border flex items-center justify-between transition-colors bg-[var(--color-vault-slate)] border-[var(--color-pulse-emerald)]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--color-pulse-emerald)] tracking-widest block mb-1">Pending Request</span>
                  <span className="font-sans font-medium text-white">Aspirin (81mg daily)</span>
                </div>
              </div>
            </div>

            {/* Real AlertCard reveal */}
            <AnimatePresence>
              {phase === "revealed" && (
                <motion.div
                  initial={shouldReduceMotion ? false : { height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: crispEasing }}
                  className="overflow-hidden"
                >
                  <AlertCard alert={realAlert} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- PRESCRIPTION SIMPLIFIER PREVIEW ---

function SimplifierPreview() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [resolved, setResolved] = useState(false)

  // Real data from Simplifier module
  const medicalJargon = "Sig: 1 cap PO TID x 10d"
  const plainText = "Take 1 capsule by mouth, 3 times a day, for 10 days"
  const [displayText, setDisplayText] = useState(medicalJargon)

  useEffect(() => {
    if (!isInView) return
    if (shouldReduceMotion) {
      setDisplayText(plainText)
      setResolved(true)
      return
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let frame = 0
    const maxFrames = 20

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        frame++
        if (frame >= maxFrames) {
          setDisplayText(plainText)
          setResolved(true)
          clearInterval(interval)
          return
        }
        // Progressively resolve characters from left to right
        const resolvedCount = Math.floor((frame / maxFrames) * plainText.length)
        let scrambled = ""
        for (let i = 0; i < plainText.length; i++) {
          if (i < resolvedCount) {
            scrambled += plainText[i]
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)]
          }
        }
        setDisplayText(scrambled)
      }, 50)
      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(timer)
  }, [isInView, shouldReduceMotion])

  const MOCK_INSTRUCTIONS = [
    { name: "Amoxicillin", dosage: "500mg", category: "Antibiotic", instructions: ["Take 1 capsule every 8 hours", "Take with food to reduce stomach upset", "Complete the full 7-day course even if you feel better"] },
    { name: "Ibuprofen", dosage: "400mg", category: "Pain Relief (NSAID)", instructions: ["Take 1 tablet every 6 hours as needed for pain", "Do not exceed 3 tablets in 24 hours", "Take with food or milk"] },
    { name: "Omeprazole", dosage: "20mg", category: "Stomach Protection", instructions: ["Take 1 capsule once daily before breakfast", "Swallow whole — do not crush or chew", "3 refills available"] },
  ]
  const COLORS = ['var(--color-pulse-emerald)', 'var(--color-alert-crimson)', 'var(--color-consent-amber)']

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 border-t border-[var(--color-vault-border)] bg-[var(--color-vault-slate)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: crispEasing }}
          className="mb-16 text-center"
        >
          <Badge variant="active" className="mb-4">AI TRANSLATION</Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-tight text-white">
            Medical Jargon → Human Language
          </h2>
          <p className="text-sm font-mono text-hash uppercase tracking-widest mt-4 max-w-xl mx-auto">
            The Prescription Simplifier translates cryptic clinical shorthand into clear, actionable instructions.
          </p>
        </motion.div>

        {/* Text Scramble Demo */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: crispEasing }}
          className="mb-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
        >
          <div className="bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] px-6 py-4 max-w-sm w-full text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-hash block mb-2">Doctor Writes</span>
            <p className="font-mono text-lg text-[var(--color-text-secondary)]">{medicalJargon}</p>
          </div>
          <ArrowRight className="w-6 h-6 text-[var(--color-pulse-emerald)] shrink-0 rotate-90 md:rotate-0" />
          <div className={cn(
            "border px-6 py-4 max-w-sm w-full text-center transition-colors duration-500",
            resolved 
              ? "bg-[var(--color-pulse-emerald)]/10 border-[var(--color-pulse-emerald)]" 
              : "bg-[var(--color-vault-surface)] border-[var(--color-vault-border)]"
          )}>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-pulse-emerald)] block mb-2">You Understand</span>
            <p className={cn(
              "font-mono text-lg transition-colors duration-500",
              resolved ? "text-[var(--color-pulse-emerald)]" : "text-[var(--color-text-tertiary)]"
            )}>{displayText}</p>
          </div>
        </motion.div>

        {/* Simplifier Card Preview — replicates real Simplifier output */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_INSTRUCTIONS.map((inst, index) => (
            <motion.div
              key={inst.name}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12, ease: crispEasing }}
              className="bg-[var(--color-vault-surface)] border border-[var(--color-vault-border)] p-4 relative overflow-hidden group hover:border-[var(--color-pulse-emerald)]/40 transition-colors"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[var(--color-vault-border)] group-hover:bg-[var(--color-pulse-emerald)] transition-colors" />
              
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
        </div>
      </div>
    </section>
  )
}

// --- FOR DOCTORS SECTION ---

function ForDoctorsSection() {
  const shouldReduceMotion = useReducedMotion()
  const statCards = [
    { icon: Users, label: "Active Patients", value: DOCTOR_STATS.activePatients, color: "text-[var(--color-text-primary)]" },
    { icon: Key, label: "Pending Requests", value: DOCTOR_STATS.pendingRequests, color: "text-[var(--color-consent-amber)]" },
    { icon: FileText, label: "Records Today", value: DOCTOR_STATS.recordsAccessedToday, color: "text-[var(--color-text-primary)]" },
    { icon: ShieldAlert, label: "AI Alerts", value: DOCTOR_STATS.aiAlerts, color: "text-[var(--color-alert-crimson)]" },
  ]

  return (
    <section id="doctors" className="py-24 md:py-32 px-6 border-t border-[var(--color-vault-border)] bg-[var(--color-vault-surface)]/30 relative">
      <div className="absolute inset-0 bg-vault-grid opacity-5 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: crispEasing }}
          className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <Badge variant="outline" className="mb-4">DOCTOR PORTAL</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-tight text-white">
              Built for clinicians.<br/>Not just patients.
            </h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-sm font-sans leading-relaxed">
            The Doctor Portal gives clinicians a structured, consent-aware view of their patients — with real-time AI safety alerts and scoped document access.
          </p>
        </motion.div>

        {/* Doctor Stat Cards — replica of DoctorDashboard top cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: crispEasing }}
            >
              <Card className="bg-[var(--color-vault-surface)] hover:border-[var(--color-pulse-emerald)]/30 transition-colors">
                <CardContent className="p-4 flex flex-col justify-center h-full">
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <stat.icon className="h-3 w-3" /> {stat.label}
                  </span>
                  <span className={cn("text-2xl font-bold font-heading", stat.color)}>{stat.value}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Doctor feature highlights */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: crispEasing }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: "Consent-Scoped Access", desc: "Every document a doctor sees is bounded by the patient's explicit cryptographic consent — time-limited and auditable." },
            { title: "Real-Time AI Alerts", desc: `Drug interactions like "${DOCTOR_MOCK_ALERTS[0].detail}" surface automatically, flagged with severity and patient context.` },
            { title: "Multi-Hospital Records", desc: "Access records from Raju Gandhi Memorial, Apollo Gleneagles, Fortis Escorts — all through one consent-gated portal." },
          ].map((item, i) => (
            <div key={i} className="bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] p-6 hover:border-[var(--color-pulse-emerald)]/30 transition-colors">
              <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wide mb-3">{item.title}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// --- MAIN PAGE LAYOUT ---

export function Landing() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-[var(--color-vault-slate)] text-[var(--color-text-primary)] font-sans overflow-x-hidden selection:bg-[var(--color-pulse-emerald)] selection:text-[var(--color-vault-slate)]">
      <ScrollProgressBar />
      <NavBar />
      
      {/* 1. HERO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 flex flex-col md:flex-row items-center max-w-7xl mx-auto min-h-[90vh]">
        <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-vault-grid opacity-10 pointer-events-none" />
        
        <div className="w-full md:w-1/2 md:pr-12 space-y-8 z-10">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: crispEasing }}
          >
            <Badge variant="active" className="mb-6 tracking-widest">NETWORK LIVE</Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-[1.1] text-white">
              Your record.<br />
              Your decision.<br />
              <span className="text-[var(--color-pulse-emerald)]">Every time.</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: crispEasing }}
            className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-lg"
          >
            MedVault AI puts you in cryptographic control of every prescription, report, and access request — while our AI pipeline quietly watches for risk.
          </motion.p>
          
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: crispEasing }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link to="/signup" className={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}>
              Initialize Profile
            </Link>
            <a href="#ai-demo" className={buttonVariants({ variant: "ghost", size: "lg", className: "w-full sm:w-auto gap-2 border border-transparent hover:border-[var(--color-vault-border)]" })}>
              Verify Safety Agent <ArrowDown className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 mt-16 md:mt-0 relative z-10">
          <HeroConsentLoop />
        </div>
      </section>

      {/* 2. PROBLEM FRAMING: 2-COLUMN */}
      <section className="border-y border-[var(--color-vault-border)] bg-[#111216] relative">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2">
          {/* Left: Typical */}
          <div className="p-12 md:p-20 border-b md:border-b-0 md:border-r border-[var(--color-vault-border)] bg-[var(--color-vault-slate)]/50">
            <h3 className="font-heading font-bold text-2xl text-[var(--color-text-tertiary)] uppercase tracking-wide mb-10">Legacy System</h3>
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-mono text-hash uppercase tracking-widest block mb-2">Data Residence</span>
                <p className="text-xl font-medium text-[var(--color-text-secondary)]">Siloed Hospital Database</p>
              </div>
              <div className="h-px w-12 bg-[#2A2F36]" />
              <div>
                <span className="text-[10px] font-mono text-hash uppercase tracking-widest block mb-2">Access Authority</span>
                <p className="text-xl font-medium text-[var(--color-text-secondary)]">Internal IT Policy</p>
              </div>
              <div className="h-px w-12 bg-[#2A2F36]" />
              <div>
                <span className="text-[10px] font-mono text-hash uppercase tracking-widest block mb-2">Patient Role</span>
                <p className="text-xl font-medium text-[var(--color-alert-crimson)]">None</p>
              </div>
            </div>
          </div>

          {/* Right: MedVault */}
          <div className="p-12 md:p-20 bg-[var(--color-vault-surface)] relative">
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 hidden md:flex items-center justify-center">
              <div className="w-2 h-2 bg-[var(--color-pulse-emerald)] rounded-full shadow-[0_0_10px_#00E59B]" />
            </div>

            <h3 className="font-heading font-bold text-2xl text-[var(--color-pulse-emerald)] uppercase tracking-wide mb-10">MedVault AI</h3>
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-mono text-[var(--color-pulse-emerald)] uppercase tracking-widest block mb-2">Data Residence</span>
                <p className="text-xl font-medium text-[#F8F9FA]">Patient-Owned Encrypted Vault</p>
              </div>
              <div className="h-px w-12 bg-[var(--color-pulse-emerald)]/30" />
              <div>
                <span className="text-[10px] font-mono text-[var(--color-pulse-emerald)] uppercase tracking-widest block mb-2">Access Authority</span>
                <p className="text-xl font-medium text-[#F8F9FA]">Cryptographic Consent</p>
              </div>
              <div className="h-px w-12 bg-[var(--color-pulse-emerald)]/30" />
              <div>
                <span className="text-[10px] font-mono text-[var(--color-pulse-emerald)] uppercase tracking-widest block mb-2">Patient Role</span>
                <p className="text-xl font-medium text-[#F8F9FA]">Absolute Final Authority</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONNECTED FLOW — 6 stages */}
      <section id="product" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-heading font-bold uppercase tracking-tight text-white">Orchestrated Architecture</h2>
          <p className="text-sm font-mono text-hash uppercase tracking-widest mt-4">Six modules. One seamless cryptographic flow.</p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-0">
          {/* Connector Line */}
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] md:w-auto md:h-[2px] md:top-1/2 md:-translate-y-1/2 md:left-16 md:right-16 bg-[var(--color-vault-border)] z-0" />
          
          {[
            { icon: Database, label: "Encrypted Vault", desc: "Every prescription and report, encrypted, owned by you." },
            { icon: Lock, label: "Consent Engine", desc: "Nobody sees your records without your explicit yes." },
            { icon: ShieldAlert, label: "AI Safety Agent", desc: "Every new prescription checked against your history." },
            { icon: Sparkles, label: "Simplifier", desc: "Medical jargon translated into plain-language instructions." },
            { icon: ScanLine, label: "OCR Reader", desc: "Handwritten prescriptions digitized into clean text." },
            { icon: Stethoscope, label: "Doctor Portal", desc: "Consent-scoped, multi-hospital, alert-integrated." },
          ].map((mod, i) => (
            <motion.div 
              key={i}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: crispEasing }}
              className="relative z-10 flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-3 md:w-1/6 px-2 bg-[var(--color-vault-slate)]"
            >
              <div className="w-11 h-11 shrink-0 bg-[var(--color-vault-surface)] border-2 border-[var(--color-vault-border)] flex items-center justify-center">
                <mod.icon className="h-5 w-5 text-white" />
              </div>
              <div className="md:mt-3">
                <h4 className="font-heading font-bold text-sm text-white mb-1">{mod.label}</h4>
                <p className="text-xs text-[var(--color-text-secondary)] font-sans leading-relaxed">{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. AI SAFETY PROOF MOMENT */}
      <AISafetyProofSection />

      {/* 5. PRESCRIPTION SIMPLIFIER PREVIEW */}
      <SimplifierPreview />

      {/* 6. TRUST / SECURITY STRIP */}
      <section id="security" className="border-t border-b border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] overflow-hidden">
        <div className="max-w-7xl mx-auto py-8 px-6 md:px-12 flex flex-wrap justify-between items-center gap-8 md:gap-4">
          {[
            "AES-256 Encryption",
            "JWT Authentication",
            "Role-Based Access",
            "Immutable Audit Log",
            "Time-Scoped Consent"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[var(--color-pulse-emerald)]" />
              <span className="font-mono text-xs text-hash uppercase tracking-widest">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOR DOCTORS */}
      <ForDoctorsSection />

      {/* 8. CLOSING CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden border-t border-[var(--color-vault-border)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-pulse-emerald)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <motion.h2 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: crispEasing }}
            className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight"
          >
            Take Back Your Data.
          </motion.h2>
          <motion.p 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: crispEasing }}
            className="text-lg text-[var(--color-text-secondary)] font-sans"
          >
            The infrastructure exists. All that's required is your key pair.
          </motion.p>
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: crispEasing }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup" className={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}>
              Initialize Now
            </Link>
            <a href="#product" className={buttonVariants({ variant: "ghost", size: "lg", className: "w-full sm:w-auto" })}>
               Review Architecture
            </a>
          </motion.div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-[var(--color-vault-border)] bg-[var(--color-vault-surface)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-[var(--color-text-secondary)]" />
            <span className="font-heading font-bold uppercase tracking-widest text-[#F8F9FA] text-sm">
              MedVault AI
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#product" className="text-[10px] font-mono uppercase tracking-widest text-hash hover:text-white transition-colors">Architecture</a>
            <a href="#security" className="text-[10px] font-mono uppercase tracking-widest text-hash hover:text-white transition-colors">Security</a>
            <a href="#doctors" className="text-[10px] font-mono uppercase tracking-widest text-hash hover:text-white transition-colors">Doctors</a>
            <Link to="/login" className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-pulse-emerald)] hover:underline transition-colors">Authorize Session</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
