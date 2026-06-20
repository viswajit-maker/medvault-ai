export const generateDocumentSummary = async (documentId: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  if (documentId.includes('REC-2A9P') || documentId.includes('REC-9K2L') || documentId.includes('DOC-104')) {
    return "500mg antibiotic prescribed for bacterial infection. Course duration: 7 days. No interactions found with current medications.";
  }
  if (documentId.includes('DOC-101') || documentId.includes('REC-7N3B')) {
    return "Normal sinus rhythm detected. Heart rate within healthy range. No arrhythmia indicators present.";
  }
  if (documentId.includes('DOC-103')) {
    return "No fractures detected. Mild soft tissue swelling noted in left knee. Recommend follow-up in 2 weeks.";
  }
  return "Document analyzed. No critical anomalies detected. Routine monitoring recommended.";
}
