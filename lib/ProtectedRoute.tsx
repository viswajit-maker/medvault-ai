import * as React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./auth-context"

export function ProtectedRoute({ allowedRole }: { allowedRole?: "patient" | "doctor" }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "doctor" ? "/doctor" : "/dashboard"} replace />
  }

  return <Outlet />
}
