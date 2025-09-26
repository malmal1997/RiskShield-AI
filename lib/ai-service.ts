import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export interface DocumentAnalysisResult {
  answers: Record<string, boolean | string>
  confidenceScores: Record<string, number>
  reasoning: Record<string, string>
  overallAnalysis: string
  riskFactors: string[]
  recommendations: string[]
  riskScore: number
  riskLevel: string
  analysisDate: string
  documentsAnalyzed: number
  aiProvider?: string
  documentExcerpts?: Record<
    string,
    Array<{
      fileName: string
      quote: string // Changed from excerpt
      relevance: string
      pageOrSection?: string
      pageNumber?: number // Added pageNumber
      documentType?: "primary" | "4th-party" // Added documentType
      documentRelationship?: string // Added documentRelationship
      confidence?: number // Added confidence
    }>
  >
  directUploadResults?: Array<{
    fileName: string
    success: boolean
    fileSize: number
    fileType: string
    processingMethod: string
  }>
  assessmentId?: string // Added assessmentId
}

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested"
  options?: string[]
  weight: number
}

interface DocumentMetadata {
  fileName: string
  type: "primary" | "4th-party"
  relationship?: string
}

// Convert file to buffer for AI API
async function fileToBuffer(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer()
}

// Extract text content from files directly (for non-PDF files)
async function extractTextFromFile(file: File): Promise<{ text: string; success: boolean; method: string }> {
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  try {
    // Handle PDF files - we'll send these directly to Google AI
    if (fileType.includes("application/pdf") || fileName.endsWith(".pdf")) {
      console.log(`📄 PDF file detected: ${file.name} - will be sent directly to Google AI`)
      return {
        text: "", // Empty text - PDF will be sent as file attachment
        success: true,
        method: "pdf-direct-upload",
      }
    }

    // Handle plain text files
    if (fileType.includes("text/plain") || fileName.endsWith(".txt")) {
      const text = await file.text()
      console.log(`✅ Text file processed: ${text.length} characters`)
      return {
        text,
        success: true,
        method: "direct-text",
      }
    }

    // Handle other supported text-based formats
    if (
      fileName.endsWith(".md") ||
      fileName.endsWith(".csv") ||
      fileName.endsWith(".json") ||
      fileName.endsWith(".html") ||
      fileName.endsWith(".xml")
    ) {
      const text = await file.text()
      console.log(`✅ ${fileName.split(".").pop()?.toUpperCase()} file processed: ${text.length} characters`)
      return {
        text,
        success: true,
        method: "direct-text",
      }
    }

    // Fallback for other files
    return {
      text: `[UNSUPPORTED FILE: ${file.name}] - File format not supported for text extraction`,
      success: false,
      method: "unsupported",
    }
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error)
    return {
      text: `[ERROR: ${file.name}] - ${error instanceof Error ? error.message : "Unknown error"}`,
      success: false,
      method: "error",
    }
  }
}

// Check if file type is supported by Google AI
function isSupportedFileType(file: File): boolean {
  const supportedTypes = [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/json",
    "text/html",
    "application/xml",
    "text/xml",
  ]

  const supportedExtensions = [".pdf", ".txt", ".md", ".csv", ".json", ".html", ".xml", ".htm"]

  return (
    supportedTypes.includes(file.type.toLowerCase()) ||
    supportedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  )
}

// Get media type for Google AI API
function getGoogleAIMediaType(file: File): string {
  const fileName = file.name.toLowerCase()

  if (file.type) {
    return file.type
  }

  // Fallback based on file extension
  if (fileName.endsWith(".pdf")) return "application/pdf"
  if (fileName.endsWith(".txt")) return "text/plain"
  if (fileName.endsWith(".md")) return "text/markdown"
  if (fileName.endsWith(".csv")) return "application/csv"
  if (fileName.endsWith(".json")) return "application/json"
  if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return "text/html"
  if (fileName.endsWith(".xml")) return "application/xml"

  return "application/octet-stream"
}

// Mock pricing for AI models (per 1000 tokens)
const MOCK_PRICING = {
  "gemini-2.5-flash": {
    input: 0.00000035, // $0.35 per 1M tokens
    output: 0.00000105, // $1.05 per 1M tokens
  },
}

// Calculate mock cost
function calculateMockCost(modelName: string, inputTokens = 0, outputTokens = 0): number {
  const pricing = MOCK_PRICING[modelName as keyof typeof MOCK_PRICING]
  if (!pricing) {
    return 0
  }
  const inputCost = (inputTokens / 1000) * pricing.input
  const outputCost = (outputTokens / 1000) * pricing.output
  return inputCost + outputCost
}

// Direct AI analysis with file upload support
async function performDirectAIAnalysis(
  files: File[],
  questions: Question[],
  assessmentType: string,
  userId: string,
  selectedProvider: "google",
  assessmentId?: string,
  documentMetadata: DocumentMetadata[] = [],
): Promise<DocumentAnalysisResult> {
  console.log(`🤖 Starting direct ${selectedProvider.toUpperCase()} AI analysis with file upload support...`)

  let apiKey: string | undefined = undefined
  let keySource: "client_key" | "default_key" = "default_key"
  let modelInstance: any
  let modelName: string

  // Configure model instance and name
  modelName = "gemini-2.5-flash"

  const defaultGoogleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey && defaultGoogleKey) {
    apiKey = defaultGoogleKey
    keySource = "default_key"
    console.log("✅ Using default Google AI API key from environment")
  }

  modelInstance = google(modelName, { apiKey: apiKey })

  // Final check for API key
  if (!apiKey) {
    console.error(`❌ ${selectedProvider.toUpperCase()} AI API key not found. Cannot perform real AI analysis.`)
    throw new Error(
      `${selectedProvider.toUpperCase()} API key not configured. Please add your API key in Settings > Integrations.`,
    )
  }

  // Filter and process supported files
  const supportedFiles = files.filter((file) => isSupportedFileType(file))
  const unsupportedFiles = files.filter((file) => !isSupportedFileType(file))

  console.log(`📊 File Analysis:`)
  console.log(`✅ Supported files: ${supportedFiles.length}`)
  console.log(`❌ Unsupported files: ${unsupportedFiles.length}`)

  if (supportedFiles.length === 0) {
    console.log("❌ No supported files found for analysis")

    const answers: Record<string, boolean | string> = {}
    const confidenceScores: Record<string, number> = {}
    const reasoning: Record<string, string> = {}

    questions.forEach((question) => {
      if (question.type === "boolean") {
        answers[question.id] = false
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No supported documents available for analysis. Defaulting to 'No' for safety."
      } else if (question.type === "multiple" && question.options) {
        answers[question.id] = question.options[0] || "Never"
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No supported documents available for analysis. Using most conservative option."
      }
    })

    return {
      answers,
      confidenceScores,
      reasoning,
      overallAnalysis: `No supported documents were available for ${selectedProvider.toUpperCase()} AI analysis. Supported formats: PDF, TXT, MD, CSV, JSON, HTML, XML. Unsupported files: ${unsupportedFiles.map((f) => f.name).join(", ")}`,
      riskFactors: [
        "No supported document content available for analysis",
        "Unable to assess actual security posture from uploaded files",
        `${unsupportedFiles.length} files in unsupported formats`,
      ],
      recommendations: [
        "Upload documents in supported formats: PDF, TXT, MD, CSV, JSON, HTML, XML",
        "Convert Word documents to PDF or TXT format",
        "Convert Excel files to CSV format",
        "Ensure files contain actual policy and procedure content",
      ],
      riskScore: 0,
      riskLevel: "High",
      analysisDate: new Date().toISOString(),
      documentsAnalyzed: files.length,
      aiProvider: `${selectedProvider.toUpperCase()} AI (${modelName}) - ${keySource === "client_key" ? "Client Key" : "Default Key"} (Conservative Analysis)`,
      documentExcerpts: {},
      directUploadResults: files.map((file) => ({
        fileName: file.name,
        success: false,
        fileSize: file.size,
        fileType: file.type || "unknown",
        processingMethod: "no-supported-files",
      })),
      assessmentId: assessmentId,
    }
  }

  // Test AI connection
  try {
    console.log(`🔗 Testing ${selectedProvider.toUpperCase()} AI connection...`)
    const testResult = await generateText({
      model: modelInstance,
      prompt: "Reply with 'OK' if you can read this.",
      maxTokens: 10,
      temperature: 0.1,
    })

    if (!testResult.text.toLowerCase().includes("ok")) {
      throw new Error(`${selectedProvider.toUpperCase()} AI test failed - unexpected response`)
    }
    console.log(`✅ ${selectedProvider.toUpperCase()} AI connection successful.`)
  } catch (error) {
    console.error(`❌ ${selectedProvider.toUpperCase()} AI test failed:`, error)
    throw new Error(
      `${selectedProvider.toUpperCase()} AI is not available with the provided API key: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }

  // Process files
  console.log("📁 Processing files for AI...")
  const pdfFiles: File[] = []
  const textFiles: Array<{ file: File; text: string; metadata: DocumentMetadata }> = []
  const processingResults: Array<{ fileName: string; success: boolean; method: string }> = []

  for (const file of supportedFiles) {
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()
    const metadata = documentMetadata.find((m) => m.fileName === file.name) || { fileName: file.name, type: "primary" }

    if ((fileType.includes("application/pdf") || fileName.endsWith(".pdf")) && selectedProvider === "google") {
      pdfFiles.push(file)
      processingResults.push({ fileName: file.name, success: true, method: "pdf-upload" })
      console.log(`📄 PDF file prepared for upload: ${file.name}`)
    } else {
      // Extract text from all files
      const extraction = await extractTextFromFile(file)
      if (extraction.success && extraction.text.length > 0) {
        textFiles.push({ file, text: extraction.text, metadata })
        processingResults.push({ fileName: file.name, success: true, method: extraction.method })
        console.log(`📝 Text extracted from ${file.name}: ${extraction.text.length} characters`)
      } else {
        processingResults.push({ fileName: file.name, success: false, method: extraction.method })
        console.log(`❌ Failed to extract text from ${file.name}`)
      }
    }
  }

  // Construct the prompt
  let textPromptPart = `You are a cybersecurity expert analyzing documents for ${assessmentType} risk assessment. 

CRITICAL INSTRUCTIONS:
- Your ENTIRE response MUST be a single, valid JSON object.
- ABSOLUTELY NO conversational text, introductory phrases, concluding remarks, or any other non-JSON text.
- The response should start directly with '{' and end directly with '}'.
- Answer questions based ONLY on information that is DIRECTLY found in the documents
- Answer "Yes" for boolean questions ONLY if you find clear, direct evidence in the documents
- Answer "No" for boolean questions if no directly relevant evidence exists

`

  // Add text file content
  if (textFiles.length > 0) {
    textPromptPart += "--- DOCUMENT CONTENT ---\n"
    textFiles.forEach(({ file, text }) => {
      textPromptPart += `\n=== DOCUMENT: ${file.name} ===\n${text}\n`
    })
    textPromptPart += "------------------------\n\n"
  }

  textPromptPart += `ASSESSMENT QUESTIONS:
${questions.map((q, idx) => `${idx + 1}. ID: ${q.id} - ${q.question} (Type: ${q.type}${q.options ? `, Options: ${q.options.join(", ")}` : ""})`).join("\n")}

Respond in this exact JSON format:
{
  "answers": {
    ${questions.map((q) => `"${q.id}": ${q.type === "boolean" ? '"Yes" or "No"' : '"your_answer"'}`).join(",\n    ")}
  },
  "confidence": {
    ${questions.map((q) => `"${q.id}": 0.8`).join(",\n    ")}
  },
  "reasoning": {
    ${questions.map((q) => `"${q.id}": "explanation based on evidence or 'No directly relevant evidence found'"`).join(",\n    ")}
  },
  "evidence": {
    ${questions.map((q) => `"${q.id}": [ { "quote": "EXACT TEXT FROM DOCUMENT", "fileName": "document_name", "relevance": "explanation" } ]`).join(",\n    ")}
  }
}`

  // Prepare message content
  const messageContent: Array<any> = [{ type: "text" as const, text: textPromptPart }]

  // Add PDF files as attachments
  if (selectedProvider === "google") {
    const pdfAttachments = await Promise.all(
      pdfFiles.map(async (file) => {
        try {
          const bufferData = await fileToBuffer(file)
          console.log(`✅ Converted ${file.name} to buffer (${Math.round(bufferData.byteLength / 1024)}KB)`)
          return {
            type: "file" as const,
            name: file.name,
            data: bufferData,
            mediaType: getGoogleAIMediaType(file),
          }
        } catch (error) {
          console.error(`❌ Failed to convert ${file.name} to buffer for attachment:`, error)
          return null
        }
      }),
    )
    messageContent.push(...pdfAttachments.filter(Boolean))
  }

  // Process questions with AI
  const answers: Record<string, boolean | string> = {}
  const confidenceScores: Record<string, number> = {}
  const reasoning: Record<string, string> = {}
  const documentExcerpts: Record<string, Array<any>> = {}

  try {
    console.log(`🧠 Processing documents with ${selectedProvider.toUpperCase()} AI...`)

    const result = await generateText({
      model: modelInstance,
      messages: [
        {
          role: "user" as const,
          content: messageContent,
        },
      ],
      temperature: 0.1,
      maxTokens: 4000,
    })

    console.log(`📝 ${selectedProvider.toUpperCase()} AI response received (${result.text.length} characters)`)

    const rawAiText = result.text
    let jsonString = ""

    try {
      // Attempt direct parse first
      JSON.parse(rawAiText)
      jsonString = rawAiText
      console.log("Successfully parsed AI response directly.")
    } catch (directParseError) {
      console.log("Direct JSON parse failed, attempting fallback extraction...")
      // Try to find JSON object by curly braces
      const firstCurly = rawAiText.indexOf("{")
      const lastCurly = rawAiText.lastIndexOf("}")

      if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
        jsonString = rawAiText.substring(firstCurly, lastCurly + 1).trim()
        console.log("Extracted JSON using first '{' and last '}' indices.")
      } else {
        console.error("❌ No valid JSON structure found in AI response.")
        throw new Error("Invalid AI response format - no JSON object found.")
      }
    }

    const aiResponse = JSON.parse(jsonString)
    console.log(`✅ Successfully parsed AI response JSON`)

    questions.forEach((question) => {
      const questionId = question.id
      const aiAnswer = aiResponse.answers?.[questionId]
      const aiReasoning = aiResponse.reasoning?.[questionId]
      const aiConfidence = aiResponse.confidence?.[questionId] || 0.5
      const aiEvidenceArray = aiResponse.evidence?.[questionId]

      // Process evidence
      if (Array.isArray(aiEvidenceArray) && aiEvidenceArray.length > 0) {
        const relevantExcerpts = aiEvidenceArray
          .map((item: any) => {
            const quote = item.quote || ""
            const fileName = item.fileName || (supportedFiles.length > 0 ? supportedFiles[0].name : "Document")
            const relevance = item.relevance || `Evidence found in ${fileName}`

            return {
              fileName,
              quote: quote.trim(),
              relevance,
              confidence: 0.7,
            }
          })
          .filter(Boolean)

        answers[questionId] = aiAnswer
        confidenceScores[questionId] = Math.min(aiConfidence, 0.9)
        reasoning[question.id] = aiReasoning || "Evidence found and processed"
        documentExcerpts[questionId] = relevantExcerpts
      } else {
        // Conservative defaults
        if (question.type === "boolean") {
          answers[question.id] = false
        } else if (question.options && question.options.length > 0) {
          answers[question.id] = question.options[0]
        }
        confidenceScores[question.id] = 0.1
        reasoning[question.id] = aiReasoning || "No directly relevant evidence found in documents."
        documentExcerpts[questionId] = []
      }
    })
  } catch (error) {
    console.error(`❌ ${selectedProvider.toUpperCase()} AI processing failed:`, error)
    questions.forEach((question) => {
      answers[question.id] = question.type === "boolean" ? false : question.options?.[0] || "Never"
      confidenceScores[question.id] = 0.1
      reasoning[question.id] = `AI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      documentExcerpts[question.id] = []
    })
    throw error
  }

  // Calculate risk score
  let totalScore = 0
  let maxScore = 0

  questions.forEach((question) => {
    const answer = answers[question.id]
    maxScore += question.weight * (question.type === "boolean" ? 1 : 4)

    if (question.type === "boolean") {
      totalScore += answer ? question.weight : 0
    } else if (question.type === "multiple" && question.options) {
      const optionIndex = question.options.indexOf(answer as string)
      if (optionIndex !== -1) {
        const scoreMultiplier = (question.options.length - 1 - optionIndex) / (question.options.length - 1)
        totalScore += question.weight * scoreMultiplier * 4
      }
    }
  })

  const riskScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  let riskLevel = "High"
  if (riskScore >= 75) riskLevel = "Low"
  else if (riskScore >= 50) riskLevel = "Medium"
  else if (riskScore >= 25) riskLevel = "Medium-High"

  // Generate analysis summary
  const successfulProcessing = processingResults.filter((r) => r.success).length
  const failedProcessing = processingResults.filter((r) => !r.success).length

  let analysisNote = `Analysis completed using ${selectedProvider.toUpperCase()} AI with direct document processing.`
  if (successfulProcessing > 0) {
    analysisNote += ` Successfully processed ${successfulProcessing} document(s).`
  }
  if (pdfFiles.length > 0) {
    analysisNote += ` ${pdfFiles.length} PDF file(s) analyzed using Google AI's native PDF capabilities.`
  }
  if (failedProcessing > 0) {
    analysisNote += ` ${failedProcessing} file(s) failed to process.`
  }
  if (unsupportedFiles.length > 0) {
    analysisNote += ` ${unsupportedFiles.length} file(s) in unsupported formats were skipped.`
  }

  console.log(
    `✅ ${selectedProvider.toUpperCase()} AI analysis completed. Risk score: ${riskScore}, Risk level: ${riskLevel}`,
  )

  return {
    answers,
    confidenceScores,
    reasoning,
    overallAnalysis: analysisNote,
    riskFactors: [
      `Analysis based on direct ${selectedProvider.toUpperCase()} AI document processing`,
      "Conservative approach taken where evidence was unclear or missing",
      ...(failedProcessing > 0 ? [`${failedProcessing} files failed to process`] : []),
      ...(unsupportedFiles.length > 0 ? [`${unsupportedFiles.length} files in unsupported formats`] : []),
    ],
    recommendations: [
      "Review assessment results for accuracy and completeness",
      "Implement missing controls based on validated findings",
      "Ensure document evidence directly supports all conclusions",
      "Consider uploading additional documentation for comprehensive analysis",
      ...(unsupportedFiles.length > 0 ? ["Convert unsupported files to PDF, TXT, or other supported formats"] : []),
    ],
    riskScore,
    riskLevel,
    analysisDate: new Date().toISOString(),
    documentsAnalyzed: files.length,
    aiProvider: `${selectedProvider.toUpperCase()} AI (${modelName}) - ${keySource === "client_key" ? "Client Key" : "Default Key"}`,
    documentExcerpts,
    directUploadResults: files.map((file, index) => {
      const result = processingResults.find((r) => r.fileName === file.name)
      return {
        fileName: file.name,
        success: result?.success || false,
        fileSize: file.size,
        fileType: file.type || "unknown",
        processingMethod: result?.method || "unknown",
      }
    }),
    assessmentId: assessmentId,
  }
}

export async function analyzeDocuments(
  files: File[],
  questions: Question[],
  assessmentType: string,
  userId: string,
  selectedProvider: "google",
  assessmentId?: string,
  documentMetadata: DocumentMetadata[] = [],
): Promise<DocumentAnalysisResult> {
  console.log(
    `🚀 Starting ${selectedProvider.toUpperCase()} AI analysis of ${files.length} files for ${assessmentType}`,
  )

  if (!files || files.length === 0) {
    throw new Error("No files provided for analysis")
  }

  if (!questions || questions.length === 0) {
    throw new Error("No questions provided for analysis")
  }

  try {
    console.log("📁 File analysis:")
    files.forEach((file, index) => {
      const supported = isSupportedFileType(file)
      const statusIcon = supported ? "✅" : "❌"
      const supportText = supported ? "Supported for analysis" : "Unsupported format"
      console.log(
        `${statusIcon} ${file.name}: ${Math.round(file.size / 1024)}KB, ${file.type || "unknown"} - ${supportText}`,
      )
    })

    // Perform direct AI analysis
    const result = await performDirectAIAnalysis(
      files,
      questions,
      assessmentType,
      userId,
      selectedProvider,
      assessmentId,
      documentMetadata,
    )

    console.log("🎉 AI analysis completed successfully")
    return result
  } catch (error) {
    console.error("💥 Analysis failed:", error)
    throw error
  }
}

export async function testAIProviders(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  // Test Google AI
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: 'Respond with "OK" if you can read this.',
        maxTokens: 10,
        temperature: 0.1,
      })
      results.google = result.text.toLowerCase().includes("ok")
      console.log("Google AI test result:", results.google)
    } catch (error) {
      console.error("Google AI test failed:", error)
      results.google = false
    }
  } else {
    console.log("Google AI API key not found")
    results.google = false
  }

  return results
}
