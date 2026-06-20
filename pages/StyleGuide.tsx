import { useState } from 'react';
import { motion } from 'motion/react';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/Progress';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { motionVariants } from '../lib/motion';
import { Activity, ShieldAlert, CheckCircle2, Info, Plus } from 'lucide-react';

export default function StyleGuide() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <PageShell>
      <motion.div
        variants={motionVariants.staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-12 pb-20"
      >
        {/* Header */}
        <motion.div variants={motionVariants.fadeInUp} className="space-y-3">
          <Badge variant="active" className="mb-2">Foundation v2.0</Badge>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-[var(--color-text-primary)]">
            Clinical <span className="text-[var(--color-pulse-emerald)]">Precision</span> System
          </h1>
          <p className="text-[var(--color-text-secondary)] font-sans max-w-2xl text-base leading-relaxed">
            MedVault AI operates on a cryptographic clinical foundation. We reject floating glass 
            and soft borders for solid matte surfaces, sharp geometric borders, and vital-sign accents.
          </p>
        </motion.div>

        {/* Section: Tokens */}
        <motion.section variants={motionVariants.fadeInUp} className="space-y-6">
          <h2 className="text-xl font-heading font-semibold border-b border-[var(--color-vault-border)] pb-2 text-[var(--color-text-primary)]">Semantic Tokens</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-12 rounded-sm border border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] flex items-center justify-center text-hash">#15171A</div>
              <p className="text-sm font-semibold">Vault Slate</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-sm border border-[var(--color-vault-border)] bg-[var(--color-vault-surface)] flex items-center justify-center text-hash">#1E2126</div>
              <p className="text-sm font-semibold">Vault Surface</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-sm bg-[var(--color-pulse-emerald)] flex items-center justify-center text-hash text-black">#00E59B</div>
              <p className="text-sm font-semibold">Pulse Emerald</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-sm bg-[var(--color-consent-amber)] flex items-center justify-center text-hash text-black">#F4A261</div>
              <p className="text-sm font-semibold">Consent Amber</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-sm bg-[var(--color-alert-crimson)] flex items-center justify-center text-hash text-white">#FF3B30</div>
              <p className="text-sm font-semibold">Alert Crimson</p>
            </div>
          </div>
        </motion.section>

        {/* Section: Typography */}
        <motion.section variants={motionVariants.fadeInUp} className="space-y-6">
          <h2 className="text-xl font-heading font-semibold border-b border-[var(--color-vault-border)] pb-2">Typography Hierarchy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2 p-4 border border-[var(--color-vault-border)] bg-[var(--color-vault-surface)]">
                <span className="text-hash text-[var(--color-pulse-emerald)]">DISPLAY / HEADING</span>
                <h3 className="text-2xl font-heading font-bold">Space Grotesk</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Used for panel titles, numeric scores, and major structural signposting.</p>
             </div>
             <div className="space-y-2 p-4 border border-[var(--color-vault-border)] bg-[var(--color-vault-surface)]">
                <span className="text-hash text-[var(--color-pulse-emerald)]">BODY / LOGS</span>
                <p className="text-base font-sans">Inter Humanist</p>
                <p className="text-sm text-[var(--color-text-secondary)] font-sans">Used for patient notes, medical logs, and long-form human reading.</p>
             </div>
             <div className="space-y-2 p-4 border border-[var(--color-vault-border)] bg-[var(--color-vault-surface)]">
                <span className="text-hash text-[var(--color-pulse-emerald)]">DATA / CRYPTO</span>
                <p className="text-base text-hash">JetBrains Mono</p>
                <p className="text-sm text-[var(--color-text-secondary)] font-sans">Used for SHA256 signatures, MRNs, tokens, and precise metric values.</p>
             </div>
          </div>
        </motion.section>

        {/* Section: Buttons */}
        <motion.section variants={motionVariants.fadeInUp} className="space-y-6">
          <h2 className="text-xl font-heading font-semibold border-b border-[var(--color-vault-border)] pb-2">Actions</h2>
          <div className="flex flex-wrap gap-4 items-center p-6 border border-[var(--color-vault-border)] bg-[var(--color-vault-surface)]">
            <Button variant="primary">Submit Record</Button>
            <Button variant="secondary">Cancel Operation</Button>
            <Button variant="danger">Override Alert</Button>
            <Button variant="consent">Sign Cryptographically</Button>
            <Button variant="ghost">View Logs</Button>
            <Button variant="primary" disabled>Processing...</Button>
            <Button variant="primary" size="icon"><Activity className="w-4 h-4" /></Button>
          </div>
        </motion.section>

        {/* Section: Badges */}
        <motion.section variants={motionVariants.fadeInUp} className="space-y-6">
          <h2 className="text-xl font-heading font-semibold border-b border-[var(--color-vault-border)] pb-2">Status & Badges</h2>
          <div className="flex flex-wrap gap-3 p-6 border border-[var(--color-vault-border)] bg-vault-grid">
            <Badge variant="default">ARCHIVED_RECORD</Badge>
            <Badge variant="active">SYNC_ACTIVE</Badge>
            <Badge variant="consent">PATIENT_VERIFIED</Badge>
            <Badge variant="danger">CONTRAINDICATION_DETECTED</Badge>
            <Badge variant="info">LOG_ENTRY</Badge>
          </div>
        </motion.section>

        {/* Section: Cards & Surface */}
        <motion.section variants={motionVariants.fadeInUp} className="space-y-6">
          <h2 className="text-xl font-heading font-semibold border-b border-[var(--color-vault-border)] pb-2">Surface Enclosures</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            <Card active>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>ACTIVE TRACE: MRN-84729</CardTitle>
                    <CardDescription>0x7F...3B92</CardDescription>
                  </div>
                  <Avatar fallback="JD" size="md" />
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)] tracking-tight uppercase text-xs font-semibold">Toxicity Probability</span>
                    <span className="text-[var(--color-alert-crimson)] text-hash">Elevated (65%)</span>
                  </div>
                  <ProgressBar value={65} indicatorClass="bg-[var(--color-alert-crimson)] shadow-none" />
                </div>
                <div className="flex gap-2">
                  <Badge variant="danger">ALLERGEN_MATCH: PENICILLIN</Badge>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t border-[var(--color-vault-border)] bg-[var(--color-vault-surface)] border-b-0 border-x-0 !pt-4 mt-2">
                <span className="text-hash">SYNCHRONIZED: 12:04:02 UTC</span>
                <Button variant="secondary" size="sm">Halt Prescription</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-[var(--color-vault-border)] flex items-center justify-center">
                    <Activity className="h-4 w-4 text-[var(--color-pulse-emerald)]" />
                  </div>
                  <div>
                    <CardTitle>AI Screening Rules</CardTitle>
                    <CardDescription>Engine: MedVault-Core-v1</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-3 font-mono text-[13px] text-[var(--color-text-secondary)]">
                  <li className="flex gap-3"><span className="text-[var(--color-pulse-emerald)]">&gt;</span> Check 1: Cross-reference active formulations</li>
                  <li className="flex gap-3"><span className="text-[var(--color-pulse-emerald)]">&gt;</span> Check 2: Evaluate renal clearance bounds</li>
                  <Skeleton className="h-3 w-[70%]" />
                  <Skeleton className="h-3 w-[40%]" />
                 </ul>
              </CardContent>
              <CardFooter className="mt-4 border-t border-[var(--color-vault-border)] !pt-4">
                <Button variant="secondary" className="w-full">Re-run Diagnostics</Button>
              </CardFooter>
            </Card>
          </div>
        </motion.section>

        {/* Section: Forms & Overlay */}
        <motion.section variants={motionVariants.fadeInUp} className="space-y-6">
          <h2 className="text-xl font-heading font-semibold border-b border-[var(--color-vault-border)] pb-2">Data Ingress</h2>
          <div className="p-6 border border-[var(--color-vault-border)] bg-[var(--color-vault-surface)] max-w-xl mx-auto space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Target Compound</label>
               <Input placeholder="Enter CID or Name (e.g. Lisinopril)" />
            </div>
            <Button onClick={() => setIsModalOpen(true)} variant="primary" className="w-full">Initialize Secure Entry Overlay</Button>
          </div>
        </motion.section>
      </motion.div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="SECURE RECORD CREATION"
        description="Data entered here will be cryptographically signed by your key pair. Ensure accuracy before freezing the block."
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Patient Name Hash / ID</label>
            <Input placeholder="ID..." />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Clinical Notes</label>
            <textarea 
              className="flex w-full rounded-sm bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] px-3 py-2 text-sm text-[var(--color-text-primary)] font-mono placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:border-[var(--color-pulse-emerald)] focus-visible:shadow-[0_0_10px_rgba(0,229,155,0.15)] transition-all min-h-[120px] resize-y shadow-inner"
              placeholder="System observations..."
            />
          </div>
          <div className="pt-2 flex justify-between items-center gap-3">
             <span className="text-[10px] uppercase font-mono text-[var(--color-text-secondary)] tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-3 h-3 text-[var(--color-consent-amber)]" />
                KEY LOADED
             </span>
            <div className="flex gap-2">
               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Abort</Button>
               <Button variant="consent">Sign & Commit Block</Button>
            </div>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}

