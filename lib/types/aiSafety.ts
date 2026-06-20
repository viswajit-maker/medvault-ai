export interface SafetyAlert {
  alert_id: string
  type: "drug_interaction" | "allergy_conflict" | "duplicate_medication" | "dose_risk"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  involved_items: string[]
  acknowledged: boolean
}

export interface PrescriptionAnalysis {
  analysis_id: string
  patient_id: string
  patient_name: string
  prescribed_by: string
  medicines: string[]
  status: "clear" | "flagged"
  alerts: SafetyAlert[]
  created_at: string
}
