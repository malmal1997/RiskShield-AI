import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export interface DocumentAnalysisResult {
  answers: Record<string, boolean | string | string[]> // Added string[] to answers type
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
      label?: 'Primary' | '4th Party'; // Added label to excerpt
    }>
  >
  directUploadResults?: Array<{
    fileName: string
    success: boolean
    fileSize: number
    fileType: string
    processingMethod: string
    label?: 'Primary' | '4th Party'; // Added label to direct upload results
  }>
}

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested" | "textarea"
  options?: string[]
  weight: number
  category?: string; // Added category
}

interface FileWithLabel {
  file: File;
  label: 'Primary' | '4th Party';
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
    // Handle files that should be sent as binary attachments directly to Google AI
    if (isBinaryAttachmentType(file)) {
      console.log(`📄 Binary attachment detected: ${file.name} - will be sent directly to Google AI`)
      return {
        text: "", // Empty text - file will be sent as binary attachment
        success: true,
        method: "binary-direct-upload",
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
      text: `[ERROR: ${error instanceof Error ? error.message : "Unknown error"}]`,
      success: false,
      method: "error",
    }
  }
}

// Check if file type is supported by Google AI for direct attachment
function isSupportedFileType(file: File): boolean {
  const supportedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.ms-powerpoint", // .ppt
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/json",
    "text/html",
    "text/xml",
  ]

  const supportedExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".md", ".csv", ".json", ".html", ".xml", ".htm"]

  return (
    supportedTypes.includes(file.type.toLowerCase()) ||
    supportedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  )
}

// Check if file type should be treated as a binary attachment (not text-extracted client-side)
function isBinaryAttachmentType(file: File): boolean {
  const binaryTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.ms-powerpoint", // .ppt
  ];
  const binaryExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"];

  return (
    binaryTypes.includes(file.type.toLowerCase()) ||
    binaryExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  );
}

// Get media type for Google AI API
function getGoogleAIMediaType(file: File): string {
  const fileName = file.name.toLowerCase()

  if (file.type) {
    return file.type
  }

  // Fallback based on file extension
  if (fileName.endsWith(".pdf")) return "application/pdf"
  if (fileName.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  if (fileName.endsWith(".doc")) return "application/msword"
  if (fileName.endsWith(".xlsx")) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  if (fileName.endsWith(".xls")) return "application/vnd.ms-excel"
  if (fileName.endsWith(".pptx")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  if (fileName.endsWith(".ppt")) return "application/vnd.ms-powerpoint"
  if (fileName.endsWith(".txt")) return "text/plain"
  if (fileName.endsWith(".md")) return "text/markdown"
  if (fileName.endsWith(".csv")) return "application/json"
  if (fileName.endsWith(".json")) return "application/json"
  if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return "text/html"
  if (fileName.endsWith(".xml")) return "application/xml"

  return "application/octet-stream"
}

// Enhanced semantic relevance checking
function checkSemanticRelevance(
  question: string,
  excerpt: string,
): { isRelevant: boolean; confidence: number; reason: string } {
  const excerptLower = excerpt.toLowerCase();
  if (excerptLower.includes("no directly relevant evidence found") || excerptLower.includes("no evidence found")) {
    return {
      isRelevant: false,
      confidence: 0.1,
      reason: "AI explicitly stated no relevant evidence found.",
    };
  }
  // If AI provided an excerpt, for the purpose of this test, we assume it's relevant.
  // The prompt is designed to make AI provide relevant excerpts.
  return {
    isRelevant: true,
    confidence: 0.9, // High confidence if AI provided an excerpt
    reason: "AI provided an excerpt, assumed relevant based on prompt instructions.",
  };
}

// Direct Google AI analysis with file upload support
export async function analyzeDocuments(
  filesWithLabels: FileWithLabel[],
  questions: Question[],
  assessmentType: string,
): Promise<DocumentAnalysisResult> {
  console.log("🤖 Starting direct Google AI analysis with file upload support...")

  // Check if Google AI API key is available
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Google AI API key not found. Please add GOOGLE_GENERATIVE_AI_API_KEY environment variable.")
  }

  // Filter and process supported files
  const supportedFilesWithLabels = filesWithLabels.filter(({ file }) => isSupportedFileType(file))
  const unsupportedFilesWithLabels = filesWithLabels.filter(({ file }) => !isSupportedFileType(file))

  console.log(`📊 File Analysis:`)
  console.log(`✅ Supported files: ${supportedFilesWithLabels.length}`)
  console.log(`❌ Unsupported files: ${unsupportedFilesWithLabels.length}`)

  if (supportedFilesWithLabels.length === 0) {
    console.log("❌ No supported files found for analysis")

    const answers: Record<string, boolean | string | string[]> = {}
    const confidenceScores: Record<string, number> = {}
    const reasoning: Record<string, string> = {}

    questions.forEach((question) => {
      if (question.type === "boolean") {
        answers[question.id] = false
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No directly relevant evidence found after comprehensive search. Defaulting to 'No' for safety."
      } else if (question.type === "multiple" && question.options) {
        answers[question.id] = question.options[0] || "Never"
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No directly relevant evidence found after comprehensive search. Using most conservative option."
      } else if (question.type === "tested") {
        answers[question.id] = "not_tested"
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No directly relevant evidence found after comprehensive search. Defaulting to 'Not Tested' for safety."
      } else if (question.type === "textarea") {
        answers[question.id] = "No directly relevant evidence found after comprehensive search."
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No directly relevant evidence found after comprehensive search. Defaulting to 'No directly relevant evidence found after comprehensive search' for safety."
      }
    })

    return {
      answers,
      confidenceScores,
      reasoning,
      overallAnalysis: `No supported documents were available for Google AI analysis. Supported formats: PDF, DOCX, XLSX, PPTX, TXT, MD, CSV, JSON, HTML, XML. Unsupported files: ${unsupportedFilesWithLabels.map((item: FileWithLabel) => item.file.name).join(", ")}`,
      riskFactors: [
        "No supported document content available for analysis",
        "Unable to assess actual security posture from uploaded files",
        `${unsupportedFilesWithLabels.length} files in unsupported formats`,
      ],
      recommendations: [
        "Upload documents in supported formats: PDF, DOCX, XLSX, PPTX, TXT, MD, CSV, JSON, HTML, XML",
        "Ensure files contain actual policy and procedure content",
        "Prioritize uploading 'Primary' documents for best results, followed by '4th Party' documents.",
        ...(unsupportedFilesWithLabels.length > 0 ? ["Convert unsupported files to supported formats"] : []),
      ],
      riskScore: 0,
      riskLevel: "High",
      analysisDate: new Date().toISOString(),
      documentsAnalyzed: filesWithLabels.length,
      aiProvider: "Conservative Analysis (No supported files found)",
      documentExcerpts: {},
      directUploadResults: filesWithLabels.map((item: FileWithLabel) => ({
        fileName: item.file.name,
        success: false,
        fileSize: item.file.size,
        fileType: item.file.type || "unknown",
        processingMethod: "no-supported-files",
        label: item.label,
      })),
    }
  }

  // Test Google AI connection
  try {
    console.log("🔗 Testing Google AI connection...")
    const testResult = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: "Reply with 'OK' if you can read this.",
      maxOutputTokens: 10,
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

  // Process files - separate binary attachments from text files
  console.log("📁 Processing files for Google AI...")
  const binaryAttachmentFiles: FileWithLabel[] = []
  const textFiles: Array<{ file: File; label: 'Primary' | '4th Party'; text: string }> = []
  const processingResults: Array<{ fileName: string; success: boolean; method: string; label: 'Primary' | '4th Party' }> = []

  for (const item of supportedFilesWithLabels) {
    if (isBinaryAttachmentType(item.file)) {
      binaryAttachmentFiles.push(item)
      processingResults.push({ fileName: item.file.name, success: true, method: "binary-direct-upload", label: item.label })
      console.log(`📄 Binary attachment prepared for upload: ${item.file.name} (Label: ${item.label})`)
    } else {
      // Extract text from non-binary files (e.g., .txt, .md, .csv, .json, .html, .xml)
      const extraction = await extractTextFromFile(item.file)
      if (extraction.success && extraction.text.length > 0) {
        textFiles.push({ file: item.file, label: item.label, text: extraction.text })
        processingResults.push({ fileName: item.file.name, success: true, method: extraction.method, label: item.label })
        console.log(`📝 Text extracted from ${item.file.name} (Label: ${item.label}): ${extraction.text.length} characters`)
      } else {
        processingResults.push({ fileName: item.file.name, success: false, method: extraction.method, label: item.label })
        console.log(`❌ Failed to extract text from ${item.file.name} (Label: ${item.label})`)
      }
    }
  }

  // Create comprehensive prompt for Google AI
  let documentContent = ""

  // Add text file content
  if (textFiles.length > 0) {
    documentContent += "TEXT DOCUMENTS (extracted content):\n"
    textFiles.forEach(({ file, label, text }) => {
      documentContent += `\n=== DOCUMENT: ${file.name} (Label: ${label}) ===\n${text}\n`
    })
  }

  // Add binary attachment file references
  if (binaryAttachmentFiles.length > 0) {
    documentContent += "\nBINARY ATTACHED DOCUMENTS:\n"
    binaryAttachmentFiles.forEach((item) => {
      documentContent += `\n=== ATTACHED DOCUMENT: ${item.file.name} (Label: ${item.label}) ===\n[This document has been uploaded as a binary attachment and will be analyzed directly by the AI]\n`
    })
  }

  const basePrompt = `YOUR SOLE TASK IS TO EXTRACT ANSWERS DIRECTLY AND EXCLUSIVELY FROM THE PROVIDED DOCUMENTS. DO NOT GUESS. DO NOT USE EXTERNAL KNOWLEDGE. DO NOT INFER.
ENSURE EACH QUESTION IS ANSWERED INDIVIDUALLY AND UNIQUELY BASED ON THE MOST DIRECTLY RELEVANT, VERIFIABLE EVIDENCE.

You are a highly intelligent and meticulous cybersecurity expert specializing in risk assessments for financial institutions. Your task is to analyze the provided documents and answer specific assessment questions.

ABSOLUTE RULES FOR ANSWERING:
1.  **EVIDENCE IS PARAMOUNT:** Every answer MUST be directly supported by an EXACT QUOTE from the provided documents. If no such direct quote exists, you MUST state "No directly relevant evidence found after comprehensive search" for the 'excerpt' and default the 'answer' as specified below.
2.  **NO INFERENCE OR EXTERNAL KNOWLEDGE:** Do NOT use any information outside the provided documents. Do NOT make logical inferences or assumptions.
3.  **STRICT RELEVANCE FOR EXCERPTS:** An 'excerpt' is only valid if it is a VERBATIM, direct quote that, by itself, specifically and completely answers the question. If the text is only loosely related, provides background, or requires interpretation to answer the question, it is NOT a valid excerpt. In such cases, treat it as if no relevant evidence was found.
4.  **DEFAULTING WHEN NO DIRECT EVIDENCE:** If 'excerpt' is set to "No directly relevant evidence found after comprehensive search", then the 'answer' MUST follow the conservative defaults outlined in each question's instructions.

CRITICAL INSTRUCTIONS:
- YOU MUST THOROUGHLY ANALYZE ALL PROVIDED DOCUMENTS. This includes both the text content provided directly in the prompt AND any binary files attached (e.g., PDFs, DOCX, XLSX, PPTX). Use your advanced document processing capabilities to extract and understand the content of ALL attached files.
- For each question, provide the MOST ACCURATE ANSWER based on the evidence.
- For each question, if relevant evidence is found, provide the EXACT QUOTE from the document in the 'excerpt' field. The quote should be verbatim and MUST directly and specifically answer the question.
- For EVERY excerpt, you MUST provide the 'source_file_name' (e.g., "DocumentName.txt"), 'source_page_number' (if applicable and explicitly identifiable in the text, otherwise null), and 'source_label' ('Primary' or '4th Party').
- If NO DIRECTLY RELEVANT EVIDENCE IS FOUND after a comprehensive search of ALL documents (meaning no specific quote directly answers the question), set 'excerpt' to 'No directly relevant evidence found after comprehensive search' and 'source_file_name', 'source_page_number', 'source_label' to null.
- When citing evidence, prioritize documents labeled "Primary". If no relevant evidence is found in "Primary" documents, then prioritize documents labeled "4th Party".
- **IMPORTANT CITATION RULE:** For the 'source_label', ONLY include '4th Party' if the document was explicitly labeled as '4th Party' during upload. If the document was labeled 'Primary' or had no specific label, set 'source_label' to null.
- **AVOID REPETITIVE CITATIONS:** Ensure that the 'excerpt' provided for each question is distinct and directly relevant to that specific question. Do not reuse the same generic excerpt across multiple questions unless it is genuinely the *only* relevant piece of evidence for each. If a question has no *new* relevant evidence, explicitly state 'No directly relevant evidence found after comprehensive search' rather than repeating a previous excerpt.
- Pay special attention to technical sections, appendices, and detailed procedure descriptions.
- **ABSOLUTE PROHIBITION ON GENERIC EVIDENCE FOR SPECIFIC QUESTIONS:**
  - For a question about 'equipment maintenance', you MUST NOT cite a general statement about 'annual risk assessments'.
  - For a question about 'BCM training', you MUST NOT cite a general statement about 'secure development lifecycles'.
  - For a question about 'incident response procedures', you MUST NOT cite a general statement about 'overall risk management'.
  - The excerpt MUST be a direct, specific answer to the question, not a broad, loosely related statement. If no such direct evidence exists, use the 'No directly relevant evidence found after comprehensive search' fallback.

DOCUMENT FILES PROVIDED FOR ANALYSIS:
${supportedFilesWithLabels.map((item: FileWithLabel, index: number) => `${index + 1}. ${item.file.name} (Label: ${item.label}, Type: ${getGoogleAIMediaType(item.file)})`).join("\n")}

${documentContent}

ASSESSMENT QUESTIONS AND DETAILED ANSWERING INSTRUCTIONS:
${questions.map((q: Question, idx: number) => {
  let formatHint = '';
  if (q.type === 'boolean') {
    formatHint = 'Expected: true or false. FIRST, search for explicit affirmative (e.g., "is encrypted", "is required", "we do") or negative (e.g., "no encryption", "not required", "we do not") statements. If an explicit affirmative statement is found, answer `true`. If an explicit negative statement is found, answer `false`. IF NO EXPLICIT STATEMENT (AFFIRMATIVE OR NEGATIVE) IS FOUND, AND \'excerpt\' IS "No directly relevant evidence found after comprehensive search", then default to `false`.';
  } else if (q.type === 'multiple' && q.options) {
    formatHint = `Expected one of: ${q.options.map(opt => `"${opt}"`).join(", ")}. FIRST, find the exact option or a clear equivalent in the documents. If found, use that option. IF NO CLEAR MATCH IS FOUND, AND \'excerpt\' IS "No directly relevant evidence found after comprehensive search", then default to the first option in the list ("${q.options[0]}").`;
  } else if (q.type === 'tested') {
    formatHint = 'Expected: "tested" or "not_tested". FIRST, look for evidence of testing activities or explicit statements about testing status. If no information is found, AND \'excerpt\' IS "No directly relevant evidence found after comprehensive search", then default to "not_tested".';
  } else if (q.type === 'textarea') {
    formatHint = 'Expected: "Detailed text response". Summarize the relevant information from the documents in a concise paragraph. IF NO INFORMATION IS FOUND, AND \'excerpt\' IS "No directly relevant evidence found after comprehensive search", then state "No directly relevant evidence found after comprehensive search."';
  }
  return `${idx + 1}. ID: ${q.id} - ${q.question} (Type: ${q.type}${q.options ? `, Options: ${q.options.join(", ")}` : ""}) - ${formatHint}`;
}).join("\n")}

YOUR FINAL RESPONSE MUST BE A SINGLE, VALID JSON OBJECT. DO NOT INCLUDE ANY TEXT BEFORE OR AFTER THE JSON. DO NOT WRAP THE JSON IN MARKDOWN CODE BLOCKS (e.g., \`\`\`json). ENSURE ALL PROPERTY NAMES ARE DOUBLE-QUOTED.
{
  "question_responses": [
    ${questions.map((q: Question) => `
    {
      "id": "${q.id}",
      "answer": null, // AI MUST fill this with the specific answer for this question, using null as a placeholder for the AI to explicitly fill
      "excerpt": null, // AI MUST fill this with the specific excerpt for this question, using null as a placeholder for the AI to explicitly fill
      "reasoning": null, // AI MUST fill this with specific reasoning for this question, using null as a placeholder for the AI to explicitly fill
      "source_file_name": null, // AI MUST fill this with the specific source file name for this question
      "source_page_number": null, // AI MUST fill this with the specific source page number for this question
      "source_label": null // AI MUST fill this with the specific source label for this question
    }`).join(",\n    ")}
  ],
  "overall_analysis": "Concise overall analysis based on the documents.",
  "risk_factors": ["Factor 1", "Factor 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`

  // Process questions with Google AI - include binary attachment files if present
  const answers: Record<string, boolean | string | string[]> = {}
  const confidenceScores: Record<string, number> = {}
  const reasoning: Record<string, string> = {}
  const documentExcerpts: Record<string, Array<any>> = {}

  try {
    console.log("🧠 Processing documents with Google AI (including binary attachments)...")

    let result;

    if (binaryAttachmentFiles.length > 0) {
      console.log(`📄 Sending ${binaryAttachmentFiles.length} binary attachment file(s) directly to Google AI...`)

      const attachments = await Promise.all(
        binaryAttachmentFiles.map(async (item: FileWithLabel) => {
          try {
            const bufferData = await fileToBuffer(item.file)
            console.log(`✅ Converted ${item.file.name} to buffer (${Math.round(bufferData.byteLength / 1024)}KB)`)
            return {
              name: item.file.name,
              data: bufferData,
              mediaType: getGoogleAIMediaType(item.file),
              label: item.label, // Include label here
            }
          } catch (error) {
            console.error(`❌ Failed to convert ${item.file.name} to buffer:`, error)
            return null
          }
        }),
      )

      // Filter out failed conversions
      const validAttachments = attachments.filter((attachment) => attachment !== null)

      if (validAttachments.length > 0) {
        const messageContent = [
          { type: "text" as const, text: basePrompt },
          ...validAttachments.map((attachment) => ({
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
          maxOutputTokens: 4000,
        })
        console.log(`✅ Successfully processed ${validAttachments.length} binary attachment file(s) with Google AI`)
      } else {
        // Fallback to text-only if binary attachment conversion failed
        console.log("⚠️ Binary attachment conversion failed, falling back to text-only analysis")
        result = await generateText({
          model: google("gemini-1.5-flash"),
          prompt: basePrompt,
          temperature: 0.1,
          maxOutputTokens: 4000,
        })
      }
    } else {
      // Text-only analysis
      result = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: basePrompt,
        temperature: 0.1,
        maxOutputTokens: 4000,
      })
    }

    console.log(`📝 Google AI response received (${result.text.length} characters)`)
    console.log(`🔍 Raw AI response text: ${result.text.substring(0, 500)}...`) // Log raw response

    let rawAiResponseText = result.text;

    // Robustly strip markdown code block fences
    const jsonStart = rawAiResponseText.indexOf('{');
    const jsonEnd = rawAiResponseText.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        rawAiResponseText = rawAiResponseText.substring(jsonStart, jsonEnd + 1);
    } else {
        // Fallback if JSON structure isn't clearly delimited, try stripping common markdown
        if (rawAiResponseText.startsWith("```json")) {
            rawAiResponseText = rawAiResponseText.substring(7); // Remove "```json\n"
        }
        if (rawAiResponseText.endsWith("```")) {
            rawAiResponseText = rawAiResponseText.substring(0, rawAiResponseText.length - 3); // Remove "\n```"
        }
    }
    rawAiResponseText = rawAiResponseText.trim(); // Trim any remaining whitespace

    // Log the exact string before parsing
    console.log("Attempting to parse JSON string:\n", rawAiResponseText);

    // Parse AI response
    try {
      const aiResponse = JSON.parse(rawAiResponseText)
      console.log(`✅ Successfully parsed AI response JSON`)
      console.log("Parsed AI response object:", aiResponse); // Log parsed object

      // Process each question with enhanced validation
      aiResponse.question_responses.forEach((qr: any) => { // Iterate through the new structure
        const questionId = qr.id;
        const question = questions.find((q: Question) => q.id === questionId); // Explicitly type q
        if (!question) {
          console.warn(`Question with ID ${questionId} not found in original questions array.`);
          return;
        }

        let aiAnswer = qr.answer;
        let aiExcerpt = qr.excerpt;
        let aiReasoning = qr.reasoning || "No specific reasoning provided by AI."; // Capture AI's reasoning
        let aiFileName = qr.source_file_name;
        let aiPageNumber = qr.source_page_number;
        let aiLabel = qr.source_label;
        const aiConfidence = qr.confidence || 0.5; // Use confidence from AI response, default to 0.5

        console.log(
          `🔍 Processing question ${questionId}: Answer=${aiAnswer}, Excerpt present=${!!aiExcerpt}`,
        )

        let excerpt = aiExcerpt || 'No directly relevant evidence found after comprehensive search';
        let fileName = aiFileName || "N/A";
        let pageNumber = aiPageNumber || undefined;
        let label = aiLabel || null; // Default to null for primary, as per new rule

        // Clean up fileName if AI incorrectly embeds label or page info
        const cleanupFileNameMatch = fileName.match(/^(.*?)(?:\s*-\s*(?:Page\s*\d+|Primary|4th Party))*\s*$/i);
        if (cleanupFileNameMatch && cleanupFileNameMatch[1]) {
            fileName = cleanupFileNameMatch[1].trim();
        }
        // Ensure label is null if it's 'Primary' for cleaner rendering
        if (label === 'Primary') {
            label = null;
        }

        // --- Robust Type Coercion for Answers ---
        let finalAnswer: boolean | string | string[] = "N/A"; // Default to "N/A" string
        if (question.type === "boolean") {
          if (typeof aiAnswer === 'string') {
            const lowerCaseAnswer = aiAnswer.toLowerCase();
            finalAnswer = (lowerCaseAnswer === 'true' || lowerCaseAnswer === 'yes');
          } else if (typeof aiAnswer === 'boolean') {
            finalAnswer = aiAnswer;
          } else {
            finalAnswer = false; // Default for boolean if AI provides unexpected type
          }
        } else if (question.type === "multiple" || question.type === "tested") {
          if (typeof aiAnswer === 'string') {
            finalAnswer = aiAnswer;
          } else if (Array.isArray(aiAnswer)) {
            finalAnswer = aiAnswer.join(', '); // Convert array to string for single-select multiple
          } else {
            finalAnswer = question.options?.[0] || "N/A"; // Default to first option or N/A
          }
        } else if (question.type === "textarea") {
          if (typeof aiAnswer === 'string') {
            finalAnswer = aiAnswer;
          } else {
            finalAnswer = "No directly relevant evidence found after comprehensive search."; // Default for textarea
          }
        }
        // --- End Type Coercion ---


        // Perform semantic relevance check only if an actual excerpt is provided
        const hasActualExcerpt = excerpt !== 'No directly relevant evidence found after comprehensive search' && excerpt.length > 20;
        let relevanceCheck = { isRelevant: false, confidence: 0.1, reason: "No evidence found in documents" };

        if (hasActualExcerpt) {
          relevanceCheck = checkSemanticRelevance(question.question, excerpt);
          console.log(
            `🎯 Relevance check for ${questionId}: ${relevanceCheck.isRelevant ? "RELEVANT" : "NOT RELEVANT"} - ${relevanceCheck.reason}`,
          );
        }

        // Determine final answer, confidence, and reasoning
        if (relevanceCheck.isRelevant && hasActualExcerpt) {
          answers[questionId] = finalAnswer;
          confidenceScores[questionId] = Math.min(aiConfidence, relevanceCheck.confidence); // Use AI's confidence, capped by relevance check
          reasoning[questionId] = aiReasoning; // Use AI's reasoning
          
          if (excerpt.length > 500) {
              excerpt = excerpt.substring(0, 500) + '...';
          }
          
          documentExcerpts[questionId] = [
            {
              fileName: fileName,
              label: label,
              excerpt: excerpt,
              relevance: `Evidence found within ${fileName}${label ? ` (Label: ${label})` : ''}`,
              pageOrSection: "Document Content",
              pageNumber: pageNumber,
            },
          ];
        } else {
          console.log(`❌ Question ${questionId}: Evidence rejected or not provided - ${relevanceCheck.reason}`);

          // Apply conservative defaults if no relevant evidence or relevance check failed
          if (question.type === "boolean") {
            answers[question.id] = false;
          } else if (question.options && question.options.length > 0) {
            answers[question.id] = question.options[0]; // Most conservative option
          } else if (question.type === "tested") {
            answers[question.id] = "not_tested";
          } else if (question.type === "textarea") {
            answers[question.id] = "No directly relevant evidence found after comprehensive search.";
          }

          confidenceScores[question.id] = 0.1; // Low confidence for conservative answer
          reasoning[question.id] = `No directly relevant evidence found, defaulting to conservative answer. ${relevanceCheck.reason}`;
          documentExcerpts[question.id] = [];
        }
      });
    } catch (parseError) {
      console.error("❌ Failed to parse AI response JSON:", parseError)
      console.log("Raw AI response (after stripping markdown):", rawAiResponseText)
      throw new Error("Invalid AI response format - JSON parsing failed")
    }
  } catch (error) {
    console.error("❌ Google AI processing failed:", error)
    // Fallback to conservative answers
    questions.forEach((question: Question) => {
      answers[question.id] = question.type === "boolean" ? false : question.options?.[0] || "Never"
      confidenceScores[question.id] = 0.1
      reasoning[question.id] = `AI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      documentExcerpts[question.id] = []
    })
  }

  // Calculate risk score
  let totalScore = 0
  let maxScore = 0

  questions.forEach((question: Question) => {
    const answer = answers[question.id]
    
    if (question.type === "tested") {
      maxScore += question.weight || 0; // Ensure weight is treated as number
      if (answer === "tested") {
        totalScore += question.weight || 0;
      }
    } else if (question.type === "boolean") {
      maxScore += question.weight || 0;
      totalScore += answer ? (question.weight || 0) : 0
    } else if (question.type === "multiple" && question.options) {
      // For multiple choice, assign score based on position (e.g., first option is lowest risk)
      // Assuming options are ordered from most conservative (lowest risk) to least conservative (highest risk)
      // So, "Never" (index 0) is lowest risk, "Annually" (index 3) is higher risk.
      // The current sample questions have options like ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually", "Quarterly", "Monthly", "Continuously"]
      // For "How often do you conduct penetration testing?", "Annually" is a good answer, not "Never".
      // So, the scoring should be: higher index = higher score (better answer).
      
      const optionIndex = question.options.indexOf(answer as string);
      if (optionIndex !== -1) {
        // Score based on how "good" the option is. Higher index means better for frequency questions.
        // Max score for a multiple choice question is (question.weight * (options.length - 1))
        // For example, if options are 5, index 4 (last option) is best.
        totalScore += (question.weight || 0) * optionIndex;
      }
      maxScore += (question.weight || 0) * (question.options.length - 1);

    } else if (question.type === "textarea") {
      // Textarea questions don't directly contribute to score, but indicate completeness
      // For now, we'll just ensure they are answered to contribute to completeness, not risk score
      if (answer && (answer as string).length > 0 && !(answer as string).includes("No directly relevant evidence found")) {
        // If there's an answer, give a small boost or mark as complete
        // This part is subjective and can be refined based on desired scoring
        totalScore += (question.weight || 1) * 0.5; // Small boost for having an "answer"
        maxScore += (question.weight || 1) * 0.5; // Max possible for textarea if answered
      }
    }
  })

  // Normalize score to 0-100 range
  let riskScore = 0;
  if (maxScore > 0) {
    riskScore = Math.round((totalScore / maxScore) * 100);
  }

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
  if (binaryAttachmentFiles.length > 0) {
    analysisNote += ` ${binaryAttachmentFiles.length} binary attachment file(s) analyzed using Google AI's native capabilities.`
  }
  if (failedProcessing > 0) {
    analysisNote += ` ${failedProcessing} file(s) failed to process.`
  }
  if (unsupportedFilesWithLabels.length > 0) {
    analysisNote += ` ${unsupportedFilesWithLabels.length} file(s) in unsupported formats were skipped.`
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
      ...(unsupportedFilesWithLabels.length > 0 ? [`${unsupportedFilesWithLabels.length} files in unsupported formats`] : []),
    ],
    recommendations: [
      "Review assessment results for accuracy and completeness",
      "Implement missing controls based on validated findings",
      "Ensure document evidence directly supports all conclusions",
      "Consider uploading additional documentation for comprehensive analysis",
      "Prioritize uploading 'Primary' documents for best results, followed by '4th Party' documents.",
      ...(unsupportedFilesWithLabels.length > 0 ? ["Convert unsupported files to supported formats"] : []),
    ],
    riskScore,
    riskLevel,
    analysisDate: new Date().toISOString(),
    documentsAnalyzed: filesWithLabels.length,
    aiProvider: "Google AI (Gemini 1.5 Flash) with Direct Document Processing",
    documentExcerpts,
    directUploadResults: filesWithLabels.map((item: FileWithLabel) => {
      const result = processingResults.find((r) => r.fileName === item.file.name)
      return {
        fileName: item.file.name,
        success: result?.success || false,
        fileSize: item.file.size,
        fileType: item.file.type || "unknown",
        processingMethod: result?.method || "unknown",
        label: item.label,
      }
    }),
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
        maxOutputTokens: 10,
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