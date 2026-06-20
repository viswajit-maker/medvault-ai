import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react"
import { AccessRequest, DOCTOR_MOCK_REQUESTS, DOCTOR_MOCK_PATIENTS } from "./mock-data"
import { aiSafetyApi } from "./api/aiSafety"
import { PrescriptionAnalysis } from "./types/aiSafety"

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

export interface IssuedPrescription {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
  issueDate: string;
}

interface DoctorContextType {
  patients: typeof DOCTOR_MOCK_PATIENTS
  requests: AccessRequest[]
  notifications: Notification[]
  alerts: PrescriptionAnalysis[]
  unreadAlertsCount: number
  addPatient: (patient: typeof DOCTOR_MOCK_PATIENTS[0]) => void
  addRequest: (request: AccessRequest) => void
  markNotificationsRead: () => void
  acknowledgeAlert: (alertId: string) => Promise<void>
  searchQuery: string
  setSearchQuery: (q: string) => void
  issuedPrescriptions: IssuedPrescription[]
  issuePrescription: (prescription: Omit<IssuedPrescription, 'id' | 'issueDate'>) => void
}

export const DoctorContext = createContext<DoctorContextType | undefined>(undefined)

export function DoctorProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState(DOCTOR_MOCK_PATIENTS)
  const [requests, setRequests] = useState(DOCTOR_MOCK_REQUESTS)
  const [alerts, setAlerts] = useState<PrescriptionAnalysis[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [issuedPrescriptions, setIssuedPrescriptions] = useState<IssuedPrescription[]>([
    {
      id: "RX-1",
      patientId: "P044",
      medicineName: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times a day",
      duration: "7 days",
      notes: "Take with food",
      issueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    }
  ])
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Access Approved", message: "Jane Doe approved your request for Oncology Consult.", time: "10 mins ago", read: false },
    { id: "2", title: "New Patient Assigned", message: "Marcus Vance has been added to your patient list.", time: "2 hours ago", read: false },
  ])

  const fetchAlerts = async () => {
    const data = await aiSafetyApi.getAlertsForDoctor(patients.map(p => p.id))
    setAlerts(data)
  }

  useEffect(() => {
    fetchAlerts()
  }, [patients])

  const acknowledgeAlert = async (alertId: string) => {
    await aiSafetyApi.acknowledgeAlert(alertId)
    await fetchAlerts()
  }

  const unreadAlertsCount = useMemo(() => {
    return alerts.flatMap(a => a.alerts).filter(al => !al.acknowledged).length
  }, [alerts])

  const addPatient = (patient: typeof DOCTOR_MOCK_PATIENTS[0]) => {
    setPatients((prev) => [patient, ...prev])
  }

  const addRequest = (request: AccessRequest) => {
    setRequests((prev) => [request, ...prev])
  }

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const issuePrescription = (prescription: Omit<IssuedPrescription, 'id' | 'issueDate'>) => {
    const newPrescription: IssuedPrescription = {
      ...prescription,
      id: `RX-${Math.floor(Math.random() * 10000)}`,
      issueDate: new Date().toISOString().split('T')[0]
    }
    setIssuedPrescriptions(prev => [newPrescription, ...prev])
  }

  return (
    <DoctorContext.Provider value={{
      patients,
      requests,
      notifications,
      alerts,
      unreadAlertsCount,
      addPatient,
      addRequest,
      markNotificationsRead,
      acknowledgeAlert,
      searchQuery,
      setSearchQuery,
      issuedPrescriptions,
      issuePrescription
    }}>
      {children}
    </DoctorContext.Provider>
  )
}

export function useDoctor() {
  const context = useContext(DoctorContext)
  if (!context) {
    throw new Error("useDoctor must be used within a DoctorProvider")
  }
  return context
}
