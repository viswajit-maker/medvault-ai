import { ConsentRequest } from "../types/consent"

export let mockConsentRequests: ConsentRequest[] = [
  {
    id: "REQ-001",
    patient_id: "PAT-1992",
    doctor_name: "Dr. A. Kumar",
    doctor_id: "MD-101",
    doctor_qualification: "MBBS, MD — Cardiology",
    doctor_phone: "+91 98XXX XXXXX",
    hospital_affiliation: "Raju Gandhi Memorial Hospital",
    purpose: "Requesting access to: Prescription History",
    resource_type: "Full Vault Access",
    duration: "72 hours",
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "REQ-002",
    patient_id: "PAT-1992",
    doctor_name: "Dr. Maria Chen",
    doctor_id: "MD-102",
    doctor_qualification: "MD — Orthopedics",
    doctor_phone: "+1 555-0199",
    hospital_affiliation: "Metro Diagnostics Lab",
    purpose: "Routine Follow-up",
    resource_type: "X-Ray Reports",
    duration: "24 hours",
    status: "approved",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
]

export const consentApi = {
  getRequestsForPatient: async (patientId: string): Promise<ConsentRequest[]> => {
    await new Promise(r => setTimeout(r, 400))
    return mockConsentRequests.filter(req => req.patient_id === patientId).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },
  updateRequestStatus: async (requestId: string, status: "approved" | "rejected"): Promise<void> => {
    await new Promise(r => setTimeout(r, 600))
    mockConsentRequests = mockConsentRequests.map(req => req.id === requestId ? { ...req, status } : req)
  }
}
