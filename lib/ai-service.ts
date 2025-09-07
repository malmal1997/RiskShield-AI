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
      excerpt: string
      relevance: string
      pageOrSection?: string
      quote?: string
      pageNumber?: number
      lineNumber?: number
    }>
  >
  directUploadResults?: Array<{
    fileName: string
    success: boolean
    fileSize: number
    fileType: string
    processingMethod: string
  }>
}

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple"
  options?: string[]
  weight: number
}

// Convert file to buffer for Google AI API
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
  if (fileName.endsWith(".csv")) return "text/csv"
  if (fileName.endsWith(".json")) return "application/json"
  if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return "text/html"
  if (fileName.endsWith(".xml")) return "application/xml"

  return "application/octet-stream"
}

// Enhanced cybersecurity concept mapping for better evidence validation
const CYBERSECURITY_CONCEPTS = {
  "penetration testing": [
    "penetration test",
    "pen test",
    "pentest",
    "security testing",
    "vulnerability assessment",
    "ethical hacking",
    "red team",
    "security audit",
    "intrusion testing",
    "security evaluation",
    "vulnerability testing",
  ],
  "anti-malware": [
    "antivirus",
    "anti-virus",
    "malware protection",
    "endpoint protection",
    "virus scanner",
    "malware detection",
    "threat protection",
    "security software",
  ],
  "vulnerability scanning": [
    "vulnerability scan",
    "vulnerability scanning",
    "security scan",
    "network scan",
    "system scan",
    "security assessment",
    "vulnerability assessment",
    "automated scanning",
    "security monitoring",
    "vulnerability testing",
    "security evaluation",
    "vulnerability analysis",
  ],
  "disciplinary measures": [
    "disciplinary action",
    "penalties",
    "sanctions",
    "enforcement",
    "consequences",
    "violations",
    "non-compliance",
    "corrective action",
    "punishment",
    "disciplinary procedures",
  ],
  "incident response": [
    "incident response",
    "security incident",
    "breach response",
    "emergency response",
    "incident handling",
    "incident management",
    "security breach",
    "cyber incident",
  ],
  "policy review": [
    "policy review",
    "policy update",
    "policy revision",
    "annual review",
    "policy maintenance",
    "policy evaluation",
    "policy assessment",
    "document review",
  ],
  "access control": [
    "access control",
    "user access",
    "authentication",
    "authorization",
    "permissions",
    "access management",
    "identity management",
    "user privileges",
  ],
  encryption: [
    "encryption",
    "encrypted",
    "cryptographic",
    "data protection",
    "secure transmission",
    "data at rest",
    "data in transit",
    "cryptography",
  ],
  backup: [
    "backup",
    "data backup",
    "backup procedures",
    "recovery",
    "disaster recovery",
    "business continuity",
    "data restoration",
    "backup strategy",
  ],
  training: [
    "training",
    "awareness",
    "education",
    "security training",
    "staff training",
    "employee training",
    "security awareness",
    "cybersecurity training",
  ],
}

// Enhanced semantic relevance checking
function checkSemanticRelevance(
  question: string,
  evidence: string,
): { isRelevant: boolean; confidence: number; reason: string } {
  const questionLower = question.toLowerCase()
  const evidenceLower = evidence.toLowerCase()

  // Skip relevance check if evidence indicates no content found
  if (
    evidenceLower.includes("no directly relevant evidence found") ||
    evidenceLower.includes("no evidence found") ||
    evidenceLower.includes("insufficient information")
  ) {
    return {
      isRelevant: false,
      confidence: 0.1,
      reason: "No evidence found in documents",
    }
  }

  const isVulnerabilityQuestion =
    questionLower.includes("vulnerability") ||
    questionLower.includes("penetration") ||
    questionLower.includes("pen test") ||
    questionLower.includes("security test") ||
    questionLower.includes("security scan")

  if (isVulnerabilityQuestion) {
    // For vulnerability questions, check for broader security-related terms
    const vulnerabilityTerms = [
      "vulnerability",
      "penetration",
      "pen test",
      "pentest",
      "security test",
      "security scan",
      "security assessment",
      "vulnerability scan",
      "vulnerability assessment",
      "security evaluation",
      "vulnerability testing",
      "security audit",
      "intrusion test",
    ]

    const hasVulnerabilityTerms = vulnerabilityTerms.some((term) => evidenceLower.includes(term))

    if (hasVulnerabilityTerms && evidenceLower.length > 20) {
      return {
        isRelevant: true,
        confidence: 0.85,
        reason: "Evidence contains vulnerability/security testing related content",
      }
    }
  }

  // Find the primary concept in the question
  let primaryConcept = ""
  let conceptKeywords: string[] = []

  for (const [concept, keywords] of Object.entries(CYBERSECURITY_CONCEPTS)) {
    if (keywords.some((keyword) => questionLower.includes(keyword))) {
      primaryConcept = concept
      conceptKeywords = keywords
      break
    }
  }

  if (!primaryConcept) {
    // Fallback to basic keyword extraction
    const questionWords = questionLower.split(/\s+/).filter((word) => word.length > 3)
    conceptKeywords = questionWords.slice(0, 3)
    primaryConcept = "general"
  }

  // Check if evidence contains relevant keywords
  const relevantKeywords = conceptKeywords.filter((keyword) => evidenceLower.includes(keyword.toLowerCase()))

  if (relevantKeywords.length === 0) {
    // For general questions, be more lenient
    if (primaryConcept === "general" && evidenceLower.length > 50) {
      return {
        isRelevant: true,
        confidence: 0.6,
        reason: "General evidence found for broad question",
      }
    }

    return {
      isRelevant: false,
      confidence: 0.1,
      reason: `Evidence does not contain keywords related to ${primaryConcept}.`,
    }
  }

  // Calculate confidence based on keyword matches and context
  const keywordRatio = relevantKeywords.length / conceptKeywords.length
  let confidence = keywordRatio * 0.8

  // Boost confidence if multiple relevant keywords are found
  if (relevantKeywords.length >= 2) {
    confidence = Math.min(confidence + 0.2, 0.95)
  }

  return {
    isRelevant: true,
    confidence: Math.max(confidence, 0.6),
    reason: `Evidence contains relevant keywords: ${relevantKeywords.join(", ")}`,
  }
}

// Direct Google AI analysis with file upload support
async function performDirectAIAnalysis(
  files: File[],
  questions: Question[],
  assessmentType: string,
): Promise<DocumentAnalysisResult> {
  console.log("🤖 Starting direct Google AI analysis with file upload support...")

  // Check if Google AI API key is available
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Google AI API key not found. Please add GOOGLE_GENERATIVE_AI_API_KEY environment variable.")
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
      overallAnalysis: `No supported documents were available for Google AI analysis. Supported formats: PDF, TXT, MD, CSV, JSON, HTML, XML. Unsupported files: ${unsupportedFiles.map((f) => f.name).join(", ")}`,
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
      aiProvider: "Conservative Analysis (No supported files found)",
      documentExcerpts: {},
      directUploadResults: files.map((file) => ({
        fileName: file.name,
        success: false,
        fileSize: file.size,
        fileType: file.type || "unknown",
        processingMethod: "no-supported-files",
      })),
    }
  }

  // Test Google AI connection
  try {
    console.log("🔗 Testing Google AI connection...")
    const testResult = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: "Reply with 'OK' if you can read this.",
      maxTokens: 10,
      temperature: 0.1,
    })

    if (!testResult.text.toLowerCase().includes("ok")) {
      throw new Error("Google AI test failed - unexpected response")
    }
    console.log("✅ Google AI connection successful")
  } catch (error) {
    console.error("❌ Google AI test failed:", error)
    throw new Error(`Google AI is not available: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  // Process files - separate PDFs from text files
  console.log("📁 Processing files for Google AI...")
  const pdfFiles: File[] = []
  const textFiles: Array<{ file: File; text: string }> = []
  const processingResults: Array<{ fileName: string; success: boolean; method: string }> = []

  for (const file of supportedFiles) {
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()

    if (fileType.includes("application/pdf") || fileName.endsWith(".pdf")) {
      pdfFiles.push(file)
      processingResults.push({ fileName: file.name, success: true, method: "pdf-upload" })
      console.log(`📄 PDF file prepared for upload: ${file.name}`)
    } else {
      // Extract text from non-PDF files
      const extraction = await extractTextFromFile(file)
      if (extraction.success && extraction.text.length > 0) {
        textFiles.push({ file, text: extraction.text })
        processingResults.push({ fileName: file.name, success: true, method: extraction.method })
        console.log(`📝 Text extracted from ${file.name}: ${extraction.text.length} characters`)
      } else {
        processingResults.push({ fileName: file.name, success: false, method: extraction.method })
        console.log(`❌ Failed to extract text from ${file.name}`)
      }
    }
  }

  // Create comprehensive prompt for Google AI
  let documentContent = ""

  // Add text file content
  if (textFiles.length > 0) {
    documentContent += "TEXT DOCUMENTS:\n"
    textFiles.forEach(({ file, text }) => {
      documentContent += `\n=== DOCUMENT: ${file.name} ===\n${text}\n`
    })
  }

  // Add PDF file references
  if (pdfFiles.length > 0) {
    documentContent += "\nPDF DOCUMENTS:\n"
    pdfFiles.forEach((file) => {
      documentContent += `\n=== PDF DOCUMENT: ${file.name} ===\n[This PDF file has been uploaded and will be analyzed directly]\n`
    })
  }

  const basePrompt = `You are a cybersecurity expert analyzing documents for ${assessmentType} risk assessment. You have been provided with ${supportedFiles.length} document(s) to analyze.

CRITICAL INSTRUCTIONS:
- Analyze ALL provided documents (both text and PDF files) using your built-in document processing capabilities
- Answer questions based ONLY on information that is DIRECTLY and SPECIFICALLY found in the documents
- For PDF files, use your native PDF reading capabilities to extract and analyze the content
- THOROUGHLY scan ALL sections, pages, and content areas of each document
- Look for ALL cybersecurity-related content including but not limited to:
  * VULNERABILITY ASSESSMENTS: vulnerability scans, security scans, penetration testing, pen tests, pentests, security testing, vulnerability testing, ethical hacking, red team, security audit, intrusion testing, security evaluation, vulnerability analysis
  * PENETRATION TESTING: penetration tests, pen tests, pentests, ethical hacking, red team exercises, intrusion testing, security audits
  * Security policies, procedures, controls, and measures
  * Access controls, authentication, authorization, user management
  * Incident response, breach procedures, emergency protocols
  * Data protection, encryption, backup procedures, recovery plans
  * Training programs, awareness initiatives, security education
  * Compliance requirements, audit procedures, review processes
  * Network security, endpoint protection, malware protection
  * Risk management, threat assessment, security monitoring
- SPECIAL ATTENTION: When looking for vulnerability assessments or penetration testing, search for ANY of these terms: "vulnerability scan", "vulnerability scanning", "vulnerability assessment", "vulnerability testing", "vulnerability analysis", "penetration test", "pen test", "pentest", "security test", "security testing", "security scan", "security assessment", "security evaluation", "security audit", "intrusion test", "ethical hacking", "red team"
- If evidence is about a different cybersecurity topic than what's being asked, DO NOT use it
- Answer "Yes" for boolean questions ONLY if you find clear, direct evidence in the documents
- Answer "No" for boolean questions if no directly relevant evidence exists
- Quote exact text from the documents that SPECIFICALLY relates to each question topic
- Do NOT make assumptions or use general knowledge beyond what's in the documents
- Be thorough and comprehensive - scan every section, paragraph, and page for relevant content
- Pay special attention to technical sections, appendices, and detailed procedure descriptions

DOCUMENT FILES PROVIDED:
${supportedFiles.map((file, index) => `${index + 1}. ${file.name} (${getGoogleAIMediaType(file)})`).join("\n")}

${documentContent}

ASSESSMENT QUESTIONS:
${questions.map((q, idx) => `${idx + 1}. ID: ${q.id} - ${q.question} (Type: ${q.type}${q.options ? `, Options: ${q.options.join(", ")}` : ""})`).join("\n")}

Respond ONLY with a JSON object. Do NOT include any markdown code blocks (e.g., \`\`\`json) or conversational text outside the JSON. Ensure all property names are double-quoted.
{
  "answers": {
    ${questions.map((q) => `"${q.id}": ${q.type === "boolean" ? '"Yes" or "No"' : '"your_answer"'}`).join(",\n    ")}
  },
  "confidence": {
    ${questions.map((q) => `"${q.id}": 0.8`).join(",\n    ")}
  },
  "reasoning": {
    ${questions.map((q) => `"${q.id}": "explanation with DIRECTLY RELEVANT evidence from documents or 'No directly relevant evidence found after comprehensive search'"`).join(",\n    ")}
  },
  "evidence": {
    ${questions.map((q) => `"${q.id}": "exact quote from documents that SPECIFICALLY addresses this question topic, including document name and section, or 'No directly relevant evidence found after comprehensive search'"`).join(",\n    ")}
  }
}`

  // Process questions with Google AI - include PDF files if present
  const answers: Record<string, boolean | string> = {}
  const confidenceScores: Record<string, number> = {}
  const reasoning: Record<string, string> = {}
  const documentExcerpts: Record<string, Array<any>> = {}

  try {
    console.log("🧠 Processing documents with Google AI (including PDFs)...")

    let result

    if (pdfFiles.length > 0) {
      console.log(`📄 Sending ${pdfFiles.length} PDF file(s) directly to Google AI...`)

      const pdfAttachments = await Promise.all(
        pdfFiles.map(async (file) => {
          try {
            const bufferData = await fileToBuffer(file)
            console.log(`✅ Converted ${file.name} to buffer (${Math.round(bufferData.byteLength / 1024)}KB)`)
            return {
              name: file.name,
              data: bufferData,
              mediaType: getGoogleAIMediaType(file),
            }
          } catch (error) {
            console.error(`❌ Failed to convert ${file.name} to buffer:`, error)
            return null
          }
        }),
      )

      // Filter out failed conversions
      const validPdfAttachments = pdfAttachments.filter((attachment) => attachment !== null)

      if (validPdfAttachments.length > 0) {
        const messageContent = [
          { type: "text" as const, text: basePrompt },
          ...validPdfAttachments.map((attachment) => ({
            type: "file" as const,
            data: attachment!.data,
            mediaType: attachment!.mediaType,
          })),
        ]

        result = await generateText({
          model: google("gemini-1.5-flash"),
          messages: [
            {
              role: "user" as const,
              content: messageContent,
            },
          ],
          temperature: 0.1,
          maxTokens: 4000,
        })
        console.log(`✅ Successfully processed ${validPdfAttachments.length} PDF file(s) with Google AI`)
      } else {
        // Fallback to text-only if PDF conversion failed
        console.log("⚠️ PDF conversion failed, falling back to text-only analysis")
        result = await generateText({
          model: google("gemini-1.5-flash"),
          prompt: basePrompt,
          temperature: 0.1,
          maxTokens: 4000,
        })
      }
    } else {
      // Text-only analysis
      result = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: basePrompt,
        temperature: 0.1,
        maxTokens: 4000,
      })
    }

    console.log(`📝 Google AI response received (${result.text.length} characters)`)
    console.log(`🔍 Response preview: ${result.text.substring(0, 200)}...`)

    let rawAiResponseText = result.text;

    // Attempt to strip markdown code block fences if present
    if (rawAiResponseText.startsWith("```json")) {
      rawAiResponseText = rawAiResponseText.substring(7); // Remove "```json\n"
    }
    if (rawAiResponseText.endsWith("```")) {
      rawAiResponseText = rawAiResponseText.substring(0, rawAiResponseText.length - 3); // Remove "\n```"
    }
    rawAiResponseText = rawAiResponseText.trim(); // Trim any remaining whitespace

    // Parse AI response
    try {
      const aiResponse = JSON.parse(rawAiResponseText)
      console.log(`✅ Successfully parsed AI response JSON`)

      // Process each question with enhanced validation
      questions.forEach((question) => {
        const questionId = question.id
        const aiAnswer = aiResponse.answers?.[questionId]
        const aiEvidence = aiResponse.evidence?.[questionId]
        const aiReasoning = aiResponse.reasoning?.[questionId]
        const aiConfidence = aiResponse.confidence?.[questionId] || 0.5

        console.log(
          `🔍 Processing question ${questionId}: Answer=${aiAnswer}, Evidence length=${aiEvidence?.length || 0}`,
        )

        // Perform semantic relevance check
        if (
          aiEvidence &&
          typeof aiEvidence === "string" &&
          !aiEvidence.toLowerCase().includes("no directly relevant evidence found") &&
          aiEvidence.length > 20
        ) {
          const relevanceCheck = checkSemanticRelevance(question.question, aiEvidence)
          console.log(
            `🎯 Relevance check for ${questionId}: ${relevanceCheck.isRelevant ? "RELEVANT" : "NOT RELEVANT"} - ${relevanceCheck.reason}`,
          )

          if (relevanceCheck.isRelevant) {
            // Evidence is relevant - use AI's answer
            answers[questionId] = aiAnswer
            confidenceScores[questionId] = Math.min(aiConfidence, relevanceCheck.confidence)
            reasoning[questionId] = aiReasoning || "Evidence found and validated as relevant"

            // Extract document name from evidence
            let sourceFileName = supportedFiles.length > 0 ? supportedFiles[0].name : "Document"
            const documentNameMatch = aiEvidence.match(
              /(?:from|in|document|file)[\s:]*([^,.\n]+\.(pdf|txt|md|csv|json|html|xml))/i,
            )
            if (documentNameMatch) {
              sourceFileName = documentNameMatch[1].trim()
            } else {
              // Try to match against uploaded file names
              const matchingFile = supportedFiles.find((file) =>
                aiEvidence.toLowerCase().includes(file.name.toLowerCase().replace(/\.[^.]+$/, "")),
              )
              if (matchingFile) {
                sourceFileName = matchingFile.name
              }
            }

            // Store the raw AI evidence directly, without cleaning or truncating
            documentExcerpts[questionId] = [
              {
                fileName: sourceFileName,
                excerpt: aiEvidence, 
                relevance: `Evidence found within ${sourceFileName}`,
                pageOrSection: "Document Content",
              },
            ]
          } else {
            // Evidence is not relevant - use conservative answer
            console.log(`❌ Question ${questionId}: Evidence rejected - ${relevanceCheck.reason}`)

            if (question.type === "boolean") {
              answers[question.id] = false
            } else if (question.options && question.options.length > 0) {
              answers[question.id] = question.options[0] // Most conservative option
            }

            confidenceScores[questionId] = 0.9 // High confidence in conservative answer
            reasoning[question.id] = `No directly relevant evidence found. ${relevanceCheck.reason}`
            documentExcerpts[questionId] = []
          }
        } else {
          // No evidence provided - use conservative answer
          console.log(`⚠️ Question ${questionId}: No evidence provided by AI`)

          if (question.type === "boolean") {
            answers[question.id] = false
          } else if (question.options && question.options.length > 0) {
            answers[question.id] = question.options[0]
          }

          confidenceScores[question.id] = 0.9
          reasoning[question.id] = "No directly relevant evidence found in documents"
          documentExcerpts[question.id] = []
        }
      })
    } catch (parseError) {
      console.error("❌ Failed to parse AI response JSON:", parseError)
      console.log("Raw AI response (after stripping markdown):", rawAiResponseText)
      throw new Error("Invalid AI response format - JSON parsing failed")
    }
  } catch (error) {
    console.error("❌ Google AI processing failed:", error)
    // Fallback to conservative answers
    questions.forEach((question) => {
      answers[question.id] = question.type === "boolean" ? false : question.options?.[0] || "Never"
      confidenceScores[question.id] = 0.1
      reasoning[question.id] = `AI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      documentExcerpts[question.id] = []
    })
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

  let analysisNote = `Analysis completed using Google AI with direct document processing.`
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

  console.log(`✅ Google AI analysis completed. Risk score: ${riskScore}, Risk level: ${riskLevel}`)

  return {
    answers,
    confidenceScores,
    reasoning,
    overallAnalysis: analysisNote,
    riskFactors: [
      "Analysis based on direct Google AI document processing",
      "Conservative approach taken where evidence was unclear or missing",
      "Semantic validation applied to all evidence",
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
    aiProvider: "Google AI (Gemini 1.5 Flash) with Direct Document Processing",
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
  }
}

// Main analysis function
export async function analyzeDocuments(
  files: File[],
  questions: Question[],
  assessmentType: string,
): Promise<DocumentAnalysisResult> {
  console.log(`🚀 Starting Google AI analysis of ${files.length} files for ${assessmentType}`)

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
    const result = await performDirectAIAnalysis(files, questions, assessmentType)

    console.log("🎉 Google AI analysis completed successfully")
    return result
  } catch (error) {
    console.error("💥 Analysis failed:", error)
    throw error
  }
}

// Test Google AI provider
export async function testAIProviders(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  // Test Google AI
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      const result = await generateText({
        model: google("gemini-1.5-flash"),
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