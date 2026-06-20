import * as React from "react"
import { Routes, Route, Navigate, BrowserRouter, Outlet } from "react-router-dom"
import { AuthProvider, useAuth } from "./lib/auth-context"
import { ToastProvider } from "./components/ui/Toast"
import { ProtectedRoute } from "./lib/ProtectedRoute"

import { Landing } from "./pages/Landing"
import { AuthLayout } from "./pages/auth/AuthLayout"
import { Login } from "./pages/auth/Login"
import { Signup } from "./pages/auth/Signup"
import StyleGuide from "./pages/StyleGuide"
import { PageShell } from "./components/layout/PageShell"
import { Dashboard } from "./pages/dashboard/Dashboard"
import { RecordDetail } from "./pages/dashboard/RecordDetail"
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard"
import { PatientsList } from "./pages/doctor/PatientsList"
import { RequestsList } from "./pages/doctor/RequestsList"
import { DoctorAlerts } from "./pages/doctor/DoctorAlerts"
import { DoctorAudit } from "./pages/doctor/DoctorAudit"
import { Vault } from "./pages/dashboard/Vault"
import { Notifications } from "./pages/dashboard/Notifications"
import { Simplifier } from "./pages/dashboard/Simplifier"
import { OcrReader } from "./pages/dashboard/OcrReader"
import { Prescriptions } from "./pages/doctor/Prescriptions"
import { DoctorProvider } from "./lib/doctor-context"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            
            <Route path="/style-guide" element={<StyleGuide />} />
            
            <Route element={<ProtectedRoute allowedRole="patient" />}>
              <Route path="/dashboard" element={<PageShell><Dashboard /></PageShell>} />
              <Route path="/dashboard/vault" element={<PageShell><Vault /></PageShell>} />
              <Route path="/dashboard/notifications" element={<PageShell><Notifications /></PageShell>} />
              <Route path="/dashboard/ocr-reader" element={<PageShell><OcrReader /></PageShell>} />
              <Route path="/dashboard/simplifier" element={<PageShell><Simplifier /></PageShell>} />
              <Route path="/dashboard/records/:id" element={<PageShell><RecordDetail /></PageShell>} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRole="doctor" />}>
              <Route element={<DoctorProvider><Outlet /></DoctorProvider>}>
                <Route path="/doctor" element={<PageShell><DoctorDashboard /></PageShell>} />
                <Route path="/doctor/patients" element={<PageShell><PatientsList /></PageShell>} />
                <Route path="/doctor/requests" element={<PageShell><RequestsList /></PageShell>} />
                <Route path="/doctor/alerts" element={<PageShell><DoctorAlerts /></PageShell>} />
                <Route path="/doctor/audit" element={<PageShell><DoctorAudit /></PageShell>} />
                <Route path="/doctor/prescriptions" element={<PageShell><Prescriptions /></PageShell>} />
              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}


export default App
