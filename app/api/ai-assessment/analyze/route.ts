import { type NextRequest, NextResponse } from "next/server"
import { analyzeDocuments } from "@/lib/ai-service"

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
    const fileTypes = formData.getAll("fileTypes") as string[] // Get file types
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

    // Combine files and their types into a structured array
    const fileData = files.map((file, index) => ({
      file,
      docType: (fileTypes[index] as 'primary' | '4th-party' | null) || null,
    }));

    console.log(`Processing ${fileData.length} files for ${assessmentType} assessment`)

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

    // Perform analysis
    const result = await analyzeDocuments(fileData, questions, assessmentType || "Unknown")

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