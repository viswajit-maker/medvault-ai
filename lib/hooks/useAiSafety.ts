import { useState, useCallback } from "react"
import { aiSafetyApi } from "../api/aiSafety"
import { PrescriptionAnalysis } from "../types/aiSafety"

export function useAiSafety() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzePrescription = useCallback(async (patientId: string, patientName: string, prescribedBy: string, medicines: string[]) => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const result = await aiSafetyApi.analyzePrescription(patientId, patientName, prescribedBy, medicines)
      return result
    } catch (err: any) {
      setError(err.message || "Failed to analyze")
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return { analyzePrescription, isAnalyzing, error }
}
