export interface ConsentRequest {
  id: string
  patient_id: string
  doctor_name: string
  doctor_id: string
  doctor_qualification?: string
  doctor_phone?: string
  hospital_affiliation?: string
  purpose: string
  resource_type: string
  duration: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}
