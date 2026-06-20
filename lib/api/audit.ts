import { AuditLogEntry } from "../types/audit"

export let mockAuditLogs: AuditLogEntry[] = [
  {
    log_id: "LOG-001",
    patient_id: "PAT-1992",
    provider_id: "MD-4482",
    provider_name: "Dr. Chen",
    provider_type: "Hospital",
    action: "viewed",
    resource: "Prescription History",
    purpose: "Routine checkup preparation",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    log_id: "LOG-002",
    patient_id: "PAT-1992",
    provider_id: "MD-4482",
    provider_name: "Dr. Chen",
    provider_type: "Hospital",
    action: "consent_granted",
    resource: "Full Vault Access (72 hours)",
    purpose: "Oncology consult",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    log_id: "LOG-003",
    patient_id: "PAT-1992",
    provider_id: "PHARM-99",
    provider_name: "City Pharmacy",
    provider_type: "Pharmacy",
    action: "downloaded",
    resource: "Amoxicillin Prescription",
    purpose: "Prescription Fulfillment",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    log_id: "LOG-004",
    patient_id: "PAT-1992",
    provider_id: "HOSP-ER",
    provider_name: "Mercy ER",
    provider_type: "Hospital",
    action: "emergency_access",
    resource: "Allergies & Conditions",
    purpose: "Emergency trauma response",
    timestamp: new Date(Date.now() - 3600000 * 120).toISOString()
  },
  {
    log_id: "LOG-005",
    patient_id: "P044",
    provider_id: "MD-4482",
    provider_name: "Dr. Chen",
    provider_type: "Hospital",
    action: "viewed",
    resource: "Lab Results (Blood Panel)",
    purpose: "Follow-up review",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    log_id: "LOG-006",
    patient_id: "PAT-1992",
    provider_id: "MD-4482",
    provider_name: "Dr. Chen",
    provider_type: "Hospital",
    action: "viewed",
    resource: "Clinical Notes",
    purpose: "Pre-consultation review",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
  }
]

export const auditApi = {
  getAuditLogForPatient: async (patientId: string): Promise<AuditLogEntry[]> => {
    await new Promise(r => setTimeout(r, 450))
    return mockAuditLogs
      .filter(log => log.patient_id === patientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },
  getAuditLogForDoctor: async (doctorId: string): Promise<AuditLogEntry[]> => {
    await new Promise(r => setTimeout(r, 450))
    return mockAuditLogs
      .filter(log => log.provider_id === doctorId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },
  logEvent: (entry: AuditLogEntry) => {
    mockAuditLogs = [entry, ...mockAuditLogs]
  }
}
