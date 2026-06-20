import * as React from "react"
import { ShieldAlert } from "lucide-react"
import { useDoctor } from "../../lib/doctor-context"
import { AlertCard } from "../../components/ui/AlertCard"
import { motion, AnimatePresence } from "motion/react"
import { crispEasing } from "../../lib/motion"
import { useToast } from "../../components/ui/Toast"

export function DoctorAlerts() {
  const { alerts, acknowledgeAlert } = useDoctor()
  const { toast } = useToast()

  const handleAcknowledge = async (alertId: string) => {
    await acknowledgeAlert(alertId)
    toast({
      title: "ALERT ACKNOWLEDGED",
      description: `Alert ${alertId} has been acknowledged and marked as reviewed.`,
      type: "success"
    })
  }

  // Flatten the alerts list since each PrescriptionAnalysis can have multiple SafetyAlerts
  // but for the doctor we want to list all individual active alerts.
  const allAlerts = alerts.flatMap(a => 
    a.alerts.map(al => ({
      ...al,
      patientName: a.patient_name,
      patientId: a.patient_id,
      analysisId: a.analysis_id
    }))
  )
  
  const pendingAlerts = allAlerts.filter(a => !a.acknowledged)
  const acknowledgedAlerts = allAlerts.filter(a => a.acknowledged)

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-heading font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-[var(--color-pulse-emerald)]" />
          AI Screening Alerts
        </h1>
        <p className="text-sm font-mono text-[var(--color-text-secondary)]">
          Autonomous safety flags across all connected patient records.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-heading font-semibold tracking-widest uppercase text-[var(--color-text-primary)]">Needs Review ({pendingAlerts.length})</h2>
        <div className="space-y-3">
          <AnimatePresence>
            {pendingAlerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 text-center border border-dashed border-[var(--color-vault-border)] text-xs font-mono text-[var(--color-text-secondary)] uppercase"
              >
                No pending alerts
              </motion.div>
            ) : (
              pendingAlerts.map((alert, i) => (
                <motion.div
                  key={alert.alert_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: crispEasing }}
                >
                  <div className="mb-1">
                     <span className="text-xs font-semibold">{alert.patientName}</span>
                     <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono ml-2 uppercase">ID: {alert.patientId} / REF: {alert.analysisId}</span>
                  </div>
                  <AlertCard 
                    alert={alert} 
                    isDoctor={true} 
                    onAcknowledge={() => handleAcknowledge(alert.alert_id)} 
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {acknowledgedAlerts.length > 0 && (
         <div className="space-y-4 pt-8 border-t border-[var(--color-vault-border)]">
           <h2 className="text-xs font-heading font-semibold tracking-widest uppercase text-[var(--color-text-primary)]">Recently Acknowledged</h2>
           <div className="space-y-3 opacity-60">
             {acknowledgedAlerts.map(alert => (
               <div key={alert.alert_id} className="space-y-1">
                  <div className="mb-1 flex items-center justify-between">
                     <div>
                       <span className="text-xs font-semibold">{alert.patientName}</span>
                       <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono ml-2 uppercase">ID: {alert.patientId}</span>
                     </div>
                  </div>
                  <AlertCard alert={alert} isDoctor={true} />
               </div>
             ))}
           </div>
         </div>
      )}
    </div>
  )
}
