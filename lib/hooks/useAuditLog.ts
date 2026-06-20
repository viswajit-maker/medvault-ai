import { useState, useEffect, useCallback, useMemo } from "react"
import { auditApi } from "../api/audit"
import { AuditLogEntry } from "../types/audit"

export function useAuditLog(id: string, role: "patient" | "doctor") {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [providerFilter, setProviderFilter] = useState<string>("all")

  const fetchLogs = useCallback(async () => {
    setIsLoading(true)
    const data = role === "patient" ? await auditApi.getAuditLogForPatient(id) : await auditApi.getAuditLogForDoctor(id)
    setLogs(data)
    setIsLoading(false)
  }, [id, role])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchAction = actionFilter === "all" || log.action === actionFilter
      const matchProvider = providerFilter === "all" || log.provider_type === providerFilter
      return matchAction && matchProvider
    })
  }, [logs, actionFilter, providerFilter])

  return { 
    logs, 
    filteredLogs, 
    isLoading, 
    actionFilter, 
    setActionFilter, 
    providerFilter, 
    setProviderFilter, 
    refreshLogs: fetchLogs 
  }
}
