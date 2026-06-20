import { useState, useEffect, useCallback } from "react"
import { consentApi } from "../api/consent"
import { ConsentRequest } from "../types/consent"

export function useConsent(patientId: string) {
  const [requests, setRequests] = useState<ConsentRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRequests = useCallback(async () => {
    setIsLoading(true)
    const data = await consentApi.getRequestsForPatient(patientId)
    setRequests(data)
    setIsLoading(false)
  }, [patientId])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const pendingRequests = requests.filter(r => r.status === "pending")
  const historicRequests = requests.filter(r => r.status !== "pending")

  const approveRequest = async (id: string) => {
    await consentApi.updateRequestStatus(id, "approved")
    await fetchRequests()
  }

  const rejectRequest = async (id: string) => {
    await consentApi.updateRequestStatus(id, "rejected")
    await fetchRequests()
  }

  return { requests, pendingRequests, historicRequests, isLoading, approveRequest, rejectRequest, refresh: fetchRequests }
}
