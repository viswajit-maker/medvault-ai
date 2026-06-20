import { OcrExtraction } from "../types/ocr"

export async function extractMedicinesFromImage(file: File): Promise<OcrExtraction> {
  const formData = new FormData()
  formData.append('file', file)

  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const type = fileExtension === 'pdf' ? 'pdf' : 'image'

  try {
    const response = await fetch('http://localhost:5000/extract-medicines', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`)
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }

    const isHandwritten = file.name.toLowerCase().includes("handwritten")
    const status = isHandwritten ? "low_confidence" : "completed"

    const medicines = (data.medicines || []).map((medName: string, index: number) => ({
      id: String(index + 1),
      name: medName,
      confidence: (isHandwritten ? (index === 0 ? "high" : index === 1 ? "medium" : "low") : "high") as "high" | "medium" | "low",
      raw_text_snippet: medName
    }))

    return {
      extraction_id: data.extraction_id || `OCR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      source_filename: file.name,
      source_type: type as "image" | "pdf",
      status: status,
      medicines: medicines,
      created_at: new Date().toISOString(),
      raw_text: data.raw_text
    }
  } catch (error: any) {
    console.error("OCR Extraction failed:", error)
    throw new Error(error.message || "Cannot reach OCR server. Is python app.py running?")
  }
}

