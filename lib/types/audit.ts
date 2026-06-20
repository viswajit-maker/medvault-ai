export interface AuditLogEntry {
  log_id: string
  patient_id: string
  provider_id: string
  provider_name: string
  provider_type: "Hospital" | "Pharmacy" | "Lab" | "Insurance"
  action: "viewed" | "downloaded" | "consent_granted" | "consent_revoked" | "emergency_access"
  resource: string
  purpose: string
  timestamp: string
}
