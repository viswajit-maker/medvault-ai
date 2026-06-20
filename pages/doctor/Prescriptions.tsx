import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, Check } from 'lucide-react';
import { useDoctor } from '../../lib/doctor-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { crispEasing } from '../../lib/motion';

export function Prescriptions() {
  const { issuedPrescriptions, issuePrescription } = useDoctor();
  const { toast } = useToast();

  const [patientId, setPatientId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !medicineName || !dosage) return;

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    issuePrescription({
      patientId: patientId.toUpperCase(),
      medicineName,
      dosage,
      frequency,
      duration,
      notes
    });

    toast({
      title: 'PRESCRIPTION ISSUED',
      description: `Prescription issued to ${patientId.toUpperCase()}`,
      type: 'success'
    });

    // Reset form
    setPatientId('');
    setMedicineName('');
    setDosage('');
    setFrequency('Once daily');
    setDuration('');
    setNotes('');
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-vault-border)] pb-4">
        <div className="h-10 w-10 bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] rounded-sm flex items-center justify-center">
          <FileText className="h-5 w-5 text-[var(--color-pulse-emerald)]" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Prescription Upload</h1>
          <p className="text-sm font-mono text-[var(--color-text-secondary)] mt-1 uppercase tracking-wide">
            Write and securely issue a new digital prescription to a patient's health vault.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Pane - Form */}
        <Card className="bg-[var(--color-vault-surface)] border-[var(--color-vault-border)]">
          <div className="p-4 border-b border-[var(--color-vault-border)] bg-[var(--color-vault-slate)] flex items-center gap-2">
            <Plus className="h-4 w-4 text-[var(--color-pulse-emerald)]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)] font-heading">Create Prescription</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Patient ID</label>
                <Input 
                  placeholder="e.g. 91-8888-2222" 
                  value={patientId} 
                  onChange={(e) => setPatientId(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Medicine Name</label>
                  <Input 
                    placeholder="e.g. Amoxicillin" 
                    value={medicineName} 
                    onChange={(e) => setMedicineName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Dosage</label>
                  <Input 
                    placeholder="e.g. 500mg" 
                    value={dosage} 
                    onChange={(e) => setDosage(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Frequency</label>
                  <select 
                    value={frequency} 
                    onChange={e => setFrequency(e.target.value)} 
                    className="flex h-10 w-full rounded-sm bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] px-3 py-2 text-sm text-[var(--color-text-primary)] font-mono focus-visible:outline-none focus-visible:border-[var(--color-pulse-emerald)]"
                  >
                    <option>Once daily</option>
                    <option>Twice daily</option>
                    <option>Three times a day</option>
                    <option>As needed (PRN)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Duration</label>
                  <Input 
                    placeholder="e.g. 7 days" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">Doctor's Notes</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instructions for the patient..."
                  className="flex min-h-[100px] w-full rounded-sm bg-[var(--color-vault-slate)] border border-[var(--color-vault-border)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:border-[var(--color-pulse-emerald)] resize-none"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || !patientId || !medicineName || !dosage}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-t-transparent border-[var(--color-vault-slate)] rounded-full animate-spin" />
                    Issuing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Issue Prescription
                  </span>
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Right Pane - List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)] font-heading">Recent Issued Prescriptions</h2>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {issuedPrescriptions.map((rx, i) => (
                <motion.div
                  key={rx.id}
                  layout
                  initial={{ opacity: 0, y: -20, backgroundColor: "var(--color-pulse-emerald)" }}
                  animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
                  transition={{ duration: 0.5, ease: crispEasing }}
                  className="rounded-sm overflow-hidden"
                >
                  <Card className="bg-[var(--color-vault-slate)] border-[var(--color-vault-border)]">
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[var(--color-text-primary)] text-sm">{rx.medicineName}</h3>
                          <Badge variant="outline" className="text-[10px] font-mono">{rx.dosage}</Badge>
                        </div>
                        <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono">{rx.issueDate}</span>
                      </div>
                      
                      <div className="text-xs text-[var(--color-text-secondary)] font-mono flex items-center gap-2">
                        <span>{rx.frequency}</span>
                        <span>•</span>
                        <span>{rx.duration}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-[var(--color-vault-border)] flex items-center gap-2">
                        <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Patient ID:</span>
                        <span className="text-xs font-mono font-bold text-[var(--color-pulse-emerald)] bg-[var(--color-vault-surface)] px-2 py-0.5 rounded-sm border border-[var(--color-vault-border)]">
                          {rx.patientId}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {issuedPrescriptions.length === 0 && (
              <div className="py-12 text-center border border-dashed border-[var(--color-vault-border)] rounded-sm bg-[var(--color-vault-slate)]">
                <p className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-widest">No recent prescriptions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
