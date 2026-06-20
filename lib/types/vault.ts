export interface VaultDocument {
  document_id: string
  type: "prescription" | "xray" | "mri" | "lab_report" | "discharge_summary"
  title: string
  file_meta: string
}

export interface VaultEpisode {
  episode_id: string
  hospital_name: string
  visit_date: string
  doctor_name: string
  department: string
  documents: VaultDocument[]
}
