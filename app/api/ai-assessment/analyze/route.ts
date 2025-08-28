import { type NextRequest, NextResponse } from "next/server"

// Direct Gemini API integration without AI SDK to avoid build issues
async function analyzeWithGemini(files: File[], questions: any[], assessmentType: string) {
  console.log(`🤖 Starting Gemini analysis for ${files.length} files`)
  
  // Extract text from files
  const documentTexts: string[] = []
  const fileProcessingResults: any[] = []

  for (const file of files) {
    try {
      const text = await file.text()
      documentTexts.push(`=== ${file.name} ===\n${text}`)
      fileProcessingResults.push({
        fileName: file.name,
        success: true,
        fileSize: file.size,
        fileType: file.type || 'unknown',
        processingMethod: 'direct-text'
      })
      console.log(`✅ Processed ${file.name}: ${text.length} characters`)
    } catch (error) {
      console.error(`❌ Failed to process ${file.name}:`, error)
      fileProcessingResults.push({
        fileName: file.name,
        success: false,
        fileSize: file.size,
        fileType: file.type || 'unknown',
        processingMethod: 'error'
      })
    }
  }

  if (documentTexts.length === 0) {
    throw new Error("No documents could be processed")
  }

  // Create analysis prompt
  const combinedText = documentTexts.join('\n\n')
  const questionsText = questions.map(q => 
    `${q.id}: ${q.question} (Type: ${q.type}${q.options ? `, Options: ${q.options.join(', ')}` : ''}, Weight: ${q.weight})`
  ).join('\n')

  const prompt = `You are a cybersecurity expert analyzing documents for compliance and risk assessment.

DOCUMENTS TO ANALYZE:
${combinedText}

QUESTIONS TO ANSWER:
${questionsText}

Please provide a comprehensive analysis in the following JSON format:
{
  "answers": {
    "question_id": "answer_value"
  },
  "confidenceScores": {
    "question_id": 0.85
  },
  "reasoning": {
    "question_id": "explanation for the answer"
  },
  "overallAnalysis": "comprehensive analysis summary",
  "riskFactors": ["factor1", "factor2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "riskScore": 75,
  "riskLevel": "Medium"
}

For boolean questions, answer true/false.
For multiple choice questions, select the most appropriate option from the provided choices.
Confidence scores should be between 0 and 1.
Risk score should be 0-100 (higher = more risk).
Risk level should be: Low (0-39), Medium (40-69), High (70-89), or Critical (90-100).`

  try {
    console.log("🔗 Calling Gemini API directly...")
    
    // Call Gemini API directly using fetch
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4000,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const geminiResponse = await response.json()
    console.log("📄 Gemini response received")
    
    if (!geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API")
    }

    const responseText = geminiResponse.candidates[0].content.parts[0].text
    
    // Parse the JSON response
    let analysisResult
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }
      analysisResult = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      console.log("Raw response:", responseText)
      
      // Fallback analysis
      analysisResult = {
        answers: Object.fromEntries(questions.map(q => [q.id, q.type === 'boolean' ? false : 'Unknown'])),
        confidenceScores: Object.fromEntries(questions.map(q => [q.id, 0.5])),
        reasoning: Object.fromEntries(questions.map(q => [q.id, 'Unable to parse AI response'])),
        overallAnalysis: 'Analysis could not be completed due to response parsing issues.',
        riskFactors: ['Response parsing failed'],
        recommendations: ['Review document quality and try again'],
        riskScore: 50,
        riskLevel: 'Medium'
      }
    }

    return {
      ...analysisResult,
      analysisDate: new Date().toISOString(),
      documentsAnalyzed: files.length,
      aiProvider: "Google AI (Gemini 1.5 Flash) - Direct API",
      directUploadResults: fileProcessingResults
    }

  } catch (error) {
    console.error("Gemini API error:", error)
    throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function GET() {
  return NextResponse.json({
    status: "AI Assessment API is running",
    timestamp: new Date().toISOString(),
    providers: {
      google: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log("AI Assessment API called")

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const questionsJson = formData.get("questions") as string
    const assessmentType = formData.get("assessmentType") as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    if (!questionsJson) {
      return NextResponse.json({ error: "No questions provided" }, { status: 400 })
    }

    let questions
    try {
      questions = JSON.parse(questionsJson)
    } catch (error) {
      return NextResponse.json({ error: "Invalid questions format" }, { status: 400 })
    }

    console.log(`Processing ${files.length} files for ${assessmentType} assessment`)

    // Check if Google AI is available
    const hasGoogleAI = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!hasGoogleAI) {
      return NextResponse.json(
        {
          error: "Google AI not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY environment variable.",
          setup: {
            google: "Get API key at https://aistudio.google.com/app/apikey",
          },
        },
        { status: 503 },
      )
    }

    // Create a simple Gemini-based analysis using fetch API
    const result = await analyzeWithGemini(files, questions, assessmentType || "Unknown")

    console.log("Analysis completed successfully")
    return NextResponse.json(result)
  } catch (error) {
    console.error("AI Assessment API error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
        suggestion: "Try uploading text files (.txt) for better analysis results",
      },
      { status: 500 },
    )
  }
}
