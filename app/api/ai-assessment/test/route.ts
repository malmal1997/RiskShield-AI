import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Testing AI providers (disabled in this build)...")

    // Check environment variables
    const hasGroq = !!process.env.GROQ_API_KEY
    const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY

    return NextResponse.json({
      status: "AI Provider Test Complete",
      timestamp: new Date().toISOString(),
      providers: {
        groq: {
          configured: hasGroq,
          working: false,
          status: hasGroq ? "🔧 Disabled in this build" : "❌ Not configured",
          model: "llama-3.1-8b-instant",
        },
        huggingface: {
          configured: hasHuggingFace,
          working: false,
          status: hasHuggingFace ? "🔧 Disabled in this build" : "❌ Not configured",
          model: "meta-llama/Llama-3.1-8B-Instruct",
        },
      },
      summary: {
        totalProviders: 2,
        workingProviders: 0,
        recommendation: hasGroq || hasHuggingFace ? "Add AI build to enable analysis" : "Add API keys to enable AI",
      },
    })
  } catch (error) {
    console.error("AI provider test failed:", error)
    return NextResponse.json(
      {
        error: "Provider test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("Running sample document analysis test (disabled in this build)...")
    return NextResponse.json(
      {
        status: "Disabled",
        message: "AI sample analysis is disabled in this build.",
      },
      { status: 503 },
    )
  } catch (error) {
    console.error("Sample analysis test failed:", error)
    return NextResponse.json(
      {
        error: "Sample analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
