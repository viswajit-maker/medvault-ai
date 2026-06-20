import { PrescriptionAnalysis, SafetyAlert } from "../types/aiSafety"

export let mockAnalyses: PrescriptionAnalysis[] = [
  {
    analysis_id: "ANA-101",
    patient_id: "P044",
    patient_name: "Marcus Vance",
    prescribed_by: "Dr. Smith",
    medicines: ["Warfarin", "Aspirin"],
    status: "flagged",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    alerts: [
      {
        alert_id: "ALT-1",
        type: "drug_interaction",
        severity: "high",
        title: "Major Interaction Risk",
        description: "Concurrent use of Warfarin and Aspirin significantly increases bleeding risk.",
        involved_items: ["Warfarin", "Aspirin"],
        acknowledged: false
      }
    ]
  },
  {
    analysis_id: "ANA-102",
    patient_id: "PAT-1992", // current user patient
    patient_name: "Current User",
    prescribed_by: "Dr. A. Kumar",
    medicines: ["Amoxicillin"],
    status: "clear",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    alerts: []
  }
]

export const aiSafetyApi = {
  analyzePrescription: async (patientId: string, patientName: string, prescribedBy: string, medicines: string[]): Promise<PrescriptionAnalysis> => {
    await new Promise(r => setTimeout(r, 1200)) // 1.2s thinking delay
    
    // Simplistic mock logic: if 'Warfarin' and 'Aspirin' are present, or explicit 'Flagged' item is present.
    const lowerMeds = medicines.map(m => m.toLowerCase())
    const hasConflict = (lowerMeds.includes("warfarin") && lowerMeds.includes("aspirin")) || lowerMeds.some(m => m.includes("flag"))
    
    const isFlagged = hasConflict

    const newAnalysis: PrescriptionAnalysis = {
      analysis_id: `ANA-${Math.floor(Math.random()*10000)}`,
      patient_id: patientId,
      patient_name: patientName,
      prescribed_by: prescribedBy,
      medicines,
      status: isFlagged ? "flagged" : "clear",
      created_at: new Date().toISOString(),
      alerts: isFlagged ? [
        {
          alert_id: `ALT-${Math.floor(Math.random()*10000)}`,
          type: "drug_interaction",
          severity: "high",
          title: "Interaction Detected",
          description: "Potential bleeding risk detected among prescribed items.",
          involved_items: medicines.filter(m => ["warfarin", "aspirin", "flagbed"].some(key => m.toLowerCase().includes(key))),
          acknowledged: false
        }
      ] : []
    }
    
    mockAnalyses = [newAnalysis, ...mockAnalyses]
    return newAnalysis
  },
  
  getPatientAnalysisHistory: async (patientId: string): Promise<PrescriptionAnalysis[]> => {
    await new Promise(r => setTimeout(r, 400))
    return mockAnalyses.filter(a => a.patient_id === patientId)
  },
  
  getAlertsForDoctor: async (patientIds: string[]): Promise<PrescriptionAnalysis[]> => {
    await new Promise(r => setTimeout(r, 400))
    return mockAnalyses.filter(a => patientIds.includes(a.patient_id) && a.status === "flagged")
  },

  acknowledgeAlert: async (alertId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 300))
    mockAnalyses = mockAnalyses.map(a => ({
      ...a,
      alerts: a.alerts.map(al => al.alert_id === alertId ? { ...al, acknowledged: true } : al)
    }))
  }
}
