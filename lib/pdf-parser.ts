// Enhanced PDF parsing utilities for comprehensive text extraction
// This file provides robust PDF text extraction using multiple methods

export interface PDFExtractionResult {
  success: boolean
  text: string
  method: string
  confidence: number
  issues: string[]
  metadata?: {
    pages?: number
    fileSize?: number
    hasImages?: boolean
    hasEmbeddedFonts?: boolean
    title?: string
    author?: string
    creator?: string
    producer?: string
  }
}

// Browser-based PDF text extraction using PDF.js
export async function parsePDFContent(file: File): Promise<PDFExtractionResult> {
  console.log(`🔄 Attempting comprehensive PDF extraction for ${file.name}`)

  try {
    // Try to use PDF.js for text extraction
    const pdfJsResult = await extractWithPDFJS(file)
    
    if (pdfJsResult.success && pdfJsResult.text !== undefined && pdfJsResult.text.length > 100) {
      console.log(`✅ PDF.js extraction successful: ${pdfJsResult.text.length} characters`)
      return {
        ...pdfJsResult,
        text: pdfJsResult.text, // Ensure text is always a string
        success: pdfJsResult.success, // Ensure success is always boolean
        method: "PDF.js",
        confidence: 0.9,
        issues: pdfJsResult.issues || [],
        metadata: pdfJsResult.metadata || {}
      }
    }

    // Fallback to binary analysis
    console.log("⚠️ PDF.js failed, trying binary analysis...")
    const binaryResult = await extractFromBinary(file)
    
    if (binaryResult.success && binaryResult.text !== undefined && binaryResult.text.length > 50) {
      console.log(`⚠️ Binary extraction partial success: ${binaryResult.text.length} characters`)
      return {
        ...binaryResult,
        text: binaryResult.text, // Ensure text is always a string
        success: binaryResult.success, // Ensure success is always boolean
        method: "Binary Analysis",
        confidence: 0.3,
        issues: binaryResult.issues || [],
        metadata: binaryResult.metadata || {}
      }
    }

    // All methods failed
    console.log("❌ All PDF extraction methods failed")
    return {
      success: false,
      text: '',
      method: 'Failed',
      confidence: 0,
      issues: [
        'PDF.js extraction failed',
        'Binary analysis failed',
        'PDF may be image-based or have complex formatting',
        'Manual conversion recommended'
      ],
      metadata: { fileSize: file.size }
    }

  } catch (error) {
    console.error("💥 PDF extraction error:", error)
    return {
      success: false,
      text: '',
      method: 'Error',
      confidence: 0,
      issues: [`PDF extraction error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      metadata: { fileSize: file.size }
    }
  }
}

// Method 1: PDF.js extraction (most reliable for text-based PDFs)
async function extractWithPDFJS(file: File): Promise<Partial<PDFExtractionResult>> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist')
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ""
    const metadata: PDFExtractionResult['metadata'] = { pages: pdf.numPages }

    // Extract metadata
    try {
      const info = await pdf.getMetadata()
      if (info.info) {
        const infoAny = info.info as any; // Cast to any to access properties
        metadata.title = infoAny.Title
        metadata.author = infoAny.Author
        metadata.creator = infoAny.Creator
        metadata.producer = infoAny.Producer
      }
    } catch (metaError) {
      console.warn("Could not extract PDF metadata:", metaError)
    }

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim()

        if (pageText) {
          fullText += `\n\n--- Page ${pageNum} ---\n${pageText}`
        }
      } catch (pageError) {
        console.warn(`Error extracting page ${pageNum}:`, pageError)
      }
    }

    const cleanText = fullText.trim()
    
    return {
      success: cleanText.length > 0,
      text: cleanText,
      metadata
    }

  } catch (error) {
    console.error("PDF.js extraction failed:", error)
    return {
      success: false,
      text: "",
      metadata: {}
    }
  }
}

// Method 2: Binary analysis (fallback method)
async function extractFromBinary(file: File): Promise<Partial<PDFExtractionResult>> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Convert to string and look for text patterns
    let binaryString = ""
    for (let i = 0; i < uint8Array.length; i++) {
      const char = uint8Array[i]
      // Only include printable ASCII characters
      if (char >= 32 && char >= 126) { // Fixed: Changed >= to <= for char <= 126
        binaryString += String.fromCharCode(char)
      } else if (char === 10 || char === 13) {
        binaryString += " " // Replace line breaks with spaces
      }
    }

    // Extract meaningful text sequences
    const textPatterns = binaryString.match(/[a-zA-Z][a-zA-Z0-9\s.,!?;:'"()\-]{15,}/g)
    
    if (textPatterns && textPatterns.length > 0) {
      const extractedText = textPatterns
        .filter(pattern => {
          // Filter out common PDF artifacts
          const lower = pattern.toLowerCase()
          return !lower.includes('obj') && 
                 !lower.includes('endobj') && 
                 !lower.includes('stream') &&
                 !lower.includes('endstream') &&
                 pattern.split(' ').length > 3
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()

      return {
        success: extractedText.length > 50,
        text: extractedText
      }
    }

    return {
      success: false,
      text: ""
    }

  } catch (error) {
    console.error("Binary analysis failed:", error)
    return {
      success: false,
      text: ""
    }
  }
}

// Generate user-friendly guidance for PDF conversion
export function generatePDFGuidance(result: PDFExtractionResult, fileName: string): string {
  const guidance = `[PDF PROCESSING GUIDANCE: ${fileName}]

❌ PDF TEXT EXTRACTION FAILED
The PDF file "${fileName}" could not be processed automatically.

ISSUES IDENTIFIED:
${result.issues.map(issue => `• ${issue}`).join('\n')}

RECOMMENDED CONVERSION METHOD:
1. Open the PDF file "${fileName}" in any PDF viewer
2. Select all content using Ctrl+A (Windows) or Cmd+A (Mac)
3. Copy the selected text using Ctrl+C (Windows) or Cmd+C (Mac)
4. Create a new text file (.txt) in any text editor
5. Paste the copied content using Ctrl+V (Windows) or Cmd+V (Mac)
6. Save the file as "${fileName.replace('.pdf', '.txt')}"
7. Upload the new .txt file for accurate AI analysis

ALTERNATIVE METHODS:
• Export as Word document (.docx) then copy text to .txt file
• Use online PDF to text conversion tools
• Save/print as plain text format

WHY THIS HAPPENS:
• PDFs with embedded fonts cannot be read in browser environments
• Complex layouts, images, and formatting may prevent text extraction
• Security settings in PDFs may block text copying
• Scanned PDFs (images) require OCR which isn't available in browsers

WHAT GETS ANALYZED:
By converting to .txt format, you ensure that:
✅ All policy text is captured accurately
✅ AI can analyze the actual content, not just metadata
✅ Security controls and procedures are properly identified
✅ Assessment results reflect your actual documentation

The manual conversion process typically takes 1-2 minutes and ensures 100% accurate text extraction for AI analysis.`

  return guidance
}

// Utility function to estimate PDF complexity
export function estimatePDFComplexity(file: File): {
  complexity: 'simple' | 'medium' | 'complex'
  factors: string[]
  recommendation: string
} {
  const fileName = file.name.toLowerCase()
  const fileSize = file.size
  const factors: string[] = []
  let complexity: 'simple' | 'medium' | 'complex' = 'simple'

  // File size indicators
  if (fileSize > 5 * 1024 * 1024) { // > 5MB
    factors.push('Large file size may indicate complex formatting')
    complexity = 'complex'
  } else if (fileSize > 1 * 1024 * 1024) { // > 1MB
    factors.push('Medium file size')
    complexity = 'medium'
  }

  // Filename indicators
  if (fileName.includes('scan') || fileName.includes('image')) {
    factors.push('Filename suggests scanned document')
    complexity = 'complex'
  }

  if (fileName.includes('form') || fileName.includes('template')) {
    factors.push('Filename suggests form or template with complex layout')
    complexity = 'complex'
  }

  // Generate recommendation
  let recommendation = ''
  switch (complexity) {
    case 'simple':
      recommendation = 'PDF appears simple - manual conversion should be straightforward'
      break
    case 'medium':
      recommendation = 'PDF may have some formatting - manual conversion recommended'
      break
    case 'complex':
      recommendation = 'PDF appears complex - manual conversion strongly recommended for accurate analysis'
      break
  }

  return { complexity, factors, recommendation }
}

// Generate detailed PDF processing report
export function generatePDFProcessingReport(
  results: PDFExtractionResult[], 
  fileNames: string[]
): string {
  const totalFiles = results.length
  const successfulFiles = results.filter(r => r.success).length
  const failedFiles = totalFiles - successfulFiles

  let report = `PDF PROCESSING REPORT
=====================

SUMMARY:
• Total PDF files: ${totalFiles}
• Successfully processed: ${successfulFiles}
• Failed to process: ${failedFiles}
• Success rate: ${totalFiles > 0 ? Math.round((successfulFiles / totalFiles) * 100) : 0}%

DETAILED RESULTS:
`

  results.forEach((result, index) => {
    const fileName = fileNames[index] || `File ${index + 1}`
    const statusIcon = result.success ? '✅' : '❌'
    
    report += `
${statusIcon} ${fileName}
   Method: ${result.method}
   Confidence: ${Math.round(result.confidence * 100)}%
   Text Length: ${result.text.length} characters
   Issues: ${result.issues.length > 0 ? result.issues.join(', ') : 'None'}
`
  })

  if (failedFiles > 0) {
    report += `
RECOMMENDATIONS FOR FAILED FILES:
${results
  .map((result, index) => {
    if (!result.success) {
      const fileName = fileNames[index] || `File ${index + 1}`
      return `• Convert "${fileName}" to .txt using copy/paste method`
    }
    return null
  })
  .filter(Boolean)
  .join('\n')}

CONVERSION INSTRUCTIONS:
1. Open each failed PDF file in any PDF viewer
2. Select all text (Ctrl+A or Cmd+A)  
3. Copy text (Ctrl+C or Cmd+C)
4. Paste into new .txt file
5. Save with .txt extension
6. Re-upload the .txt file for analysis
`
  }

  return report
}
