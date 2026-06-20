export type RecordType = "prescription" | "lab_report" | "history"

export interface MedicalRecord {
  id: string
  title: string
  type: RecordType
  date: string
  provider: string
  status: "verified" | "pending" | "archived"
  fileHash: string
  content?: string
}

export const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: "REC-8X4M-92L",
    title: "Blood Panel (Comprehensive)",
    type: "lab_report",
    date: "2026-05-12",
    provider: "Metro Diagnostics Lab",
    status: "verified",
    fileHash: "0x8fa3...41c9",
    content: "Hemoglobin: 14.2 g/dL\nWBC: 6.8 K/uL\nPlatelets: 250 K/uL\nGlucose (Fasting): 88 mg/dL\nCholesterol (Total): 185 mg/dL\nLDL: 110 mg/dL\nHDL: 55 mg/dL",
  },
  {
    id: "REC-2A9P-11K",
    title: "Prescription — Amoxicillin 500mg",
    type: "prescription",
    date: "2026-05-01",
    provider: "Dr. A. Kumar",
    status: "verified",
    fileHash: "0x2bc1...99e2",
    content: "Medication: Amoxicillin 500mg\nDosage: 1 capsule every 8 hours\nDuration: 7 days\nNotes: Take with food.",
  },
  {
    id: "REC-7N3B-88Z",
    title: "Cardiac MRI Scan",
    type: "history",
    date: "2026-03-15",
    provider: "St. Jude Cardiology Center",
    status: "verified",
    fileHash: "0x7fd4...10b5",
    content: "FINDINGS:\nLeft ventricle is normal in size and systolic function.\nEjection fraction is approximately 60%.\nNo evidence of myocardial infarction or ischemia.\nValves appear normal.\nIMPRESSION: Normal cardiac MRI.",
  },
  {
    id: "REC-5Y1C-44R",
    title: "Allergy Test Results",
    type: "lab_report",
    date: "2026-02-10",
    provider: "Allergy & Asthma Associates",
    status: "verified",
    fileHash: "0x5ab1...22c3",
    content: "POSITIVE REACTIONS:\n- Penicillin (Severe)\n- Peanuts (Moderate)\n- Dust Mites (Mild)\nRECOMMENDATIONS: Strict avoidance of penicillin-class antibiotics and peanuts.",
  },
  {
    id: "REC-9K2L-55Q",
    title: "Prescription — Lisinopril 10mg",
    type: "prescription",
    date: "2026-01-20",
    provider: "Dr. Maria Chen",
    status: "archived",
    fileHash: "0x9ef2...33d4",
    content: "Medication: Lisinopril 10mg\nDosage: 1 tablet daily\nDuration: 30 days\nRefills: 0",
  },
  {
    id: "REC-3P8F-77T",
    title: "Annual Physical Exam Notes",
    type: "history",
    date: "2025-11-05",
    provider: "Dr. A. Kumar",
    status: "verified",
    fileHash: "0x3bc9...66a1",
    content: "Patient presents for annual wellness physical.\nVitals: BP 118/78, HR 68, Temp 98.6°F, RR 16.\nGeneral: Healthy appearing adult, no acute distress.\nLungs: Clear to auscultation bilaterally.\nHeart: Regular rate and rhythm, no murmurs.\nAssessment: Healthy adult. Continue routine care.",
  }
]

export const MOCK_ALLERGIES = ["Penicillin", "Peanuts"]

export const STATS = {
  totalRecords: MOCK_RECORDS.length,
  activeAllergies: MOCK_ALLERGIES.length,
  pendingConsent: 0,
  trustedDoctors: 3
}

export type AccessRequestStatus = "pending" | "approved" | "rejected" | "expired"

export interface AccessRequest {
  id: string
  patientName: string
  patientId: string
  purpose: string
  status: AccessRequestStatus
  dateRequested: string
  type: string
}

export const DOCTOR_MOCK_REQUESTS: AccessRequest[] = [
  { id: "REQ-001", patientName: "Jane Doe", patientId: "P001", purpose: "Oncology Consult", status: "pending", dateRequested: "2026-06-20", type: "Full Vault Access" },
  { id: "REQ-002", patientName: "Marcus Vance", patientId: "P044", purpose: "Medication Review", status: "approved", dateRequested: "2026-06-18", type: "Prescription History" },
  { id: "REQ-003", patientName: "Sarah Connor", patientId: "P102", purpose: "Routine Follow-up", status: "rejected", dateRequested: "2026-06-15", type: "Full Vault Access" },
  { id: "REQ-004", patientName: "Alan Turing", patientId: "P891", purpose: "Cardiology Referral", status: "expired", dateRequested: "2026-05-10", type: "Specific Lab Reports (Cardiac)" }
]

export const DOCTOR_MOCK_PATIENTS = [
  { 
    id: "P044", 
    name: "Marcus Vance", 
    lastAccessed: "2 hours ago", 
    activeAlerts: 1,
    hospitalSource: "Raju Gandhi Memorial Hospital",
    accessScope: "Prescription History Only (24 hours)",
    scopedDocuments: [
      { id: "doc-1", title: "Prescription (Amoxicillin)", hospital: "Raju Gandhi Memorial Hospital", date: "2026-06-18" },
      { id: "doc-2", title: "Prescription (Lisinopril 10mg)", hospital: "City Care Clinic", date: "2026-01-20" }
    ]
  },
  { 
    id: "P152", 
    name: "Elena Rostova", 
    lastAccessed: "1 day ago", 
    activeAlerts: 0,
    hospitalSource: "Apollo Gleneagles",
    accessScope: "Full Vault Access (72 hours)",
    scopedDocuments: [
      { id: "doc-3", title: "Chest X-Ray Report", hospital: "Apollo Gleneagles", date: "2026-05-12" },
      { id: "doc-4", title: "Blood Panel (Comprehensive)", hospital: "Apollo Gleneagles", date: "2026-05-10" },
      { id: "doc-5", title: "Prescription (Levothyroxine)", hospital: "City Care Clinic", date: "2025-11-20" }
    ]
  },
  { 
    id: "P881", 
    name: "David Kim", 
    lastAccessed: "3 days ago", 
    activeAlerts: 0,
    hospitalSource: "Fortis Escorts",
    accessScope: "Selected Lab Reports (72 hours)",
    scopedDocuments: [
      { id: "doc-6", title: "Lipid Profile", hospital: "Fortis Escorts", date: "2026-06-15" },
      { id: "doc-7", title: "HbA1c Report", hospital: "Fortis Escorts", date: "2026-06-15" }
    ]
  },
]

export const DOCTOR_STATS = {
  activePatients: 42,
  pendingRequests: 3,
  recordsAccessedToday: 18,
  aiAlerts: 2
}

export const DOCTOR_MOCK_ALERTS = [
  { id: "ALT-1", patientName: "Marcus Vance", patientId: "P044", severity: "high", title: "Drug Interaction Flagged", detail: "Warfarin + Aspirin overlap detected.", date: "2026-06-20T08:30:00Z" },
  { id: "ALT-2", patientName: "David Kim", patientId: "P881", severity: "medium", title: "Abnormal Lab Value", detail: "Elevated Fasting Glucose (126 mg/dL).", date: "2026-06-19T14:15:00Z" }
]
