export interface ExtractedMedicine {
  id: string
  name: string
  confidence: "high" | "medium" | "low"
  raw_text_snippet?: string
}

export interface OcrExtraction {
  extraction_id: string
  source_filename: string
  source_type: "image" | "pdf"
  status: "processing" | "completed" | "low_confidence"
  medicines: ExtractedMedicine[]
  created_at: string
  raw_text?: string
}

