import { type NextRequest, NextResponse } from "next/server"

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
    console.log("AI Assessment API called (placeholder)")

    // Stubbed response to avoid bundling AI SDK during build.
    // Enable real analysis by implementing dynamic import of the AI service.
    return NextResponse.json(
      {
        error: "AI analysis is disabled in this build.",
        setup: {
          google: "Add GOOGLE_GENERATIVE_AI_API_KEY and enable AI service.",
        },
      },
      { status: 503 },
    )
  } catch (error) {
    console.error("AI Assessment API error:", error)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
