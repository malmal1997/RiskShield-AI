import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("AI Assessment Debug Info")

    // Check environment variables
    const hasGroq = !!process.env.GROQ_API_KEY
    const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY
    const hasGoogleAI = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY

    // System information
    const systemInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      platform: process.platform,
      nodeVersion: process.version,
    }

    // AI Provider status
    const aiProviders = {
      groq: {
        configured: hasGroq,
        keyLength: hasGroq ? process.env.GROQ_API_KEY?.length : 0,
        status: hasGroq ? "Configured" : "Missing GROQ_API_KEY",
        models: ["llama-3.1-8b-instant", "mixtral-8x7b-32768"],
      },
      huggingface: {
        configured: hasHuggingFace,
        keyLength: hasHuggingFace ? process.env.HUGGINGFACE_API_KEY?.length : 0,
        status: hasHuggingFace ? "Configured" : "Missing HUGGINGFACE_API_KEY",
        models: ["meta-llama/Llama-3.1-8B-Instruct"],
      },
      google: {
        configured: hasGoogleAI,
        keyLength: hasGoogleAI ? process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length : 0,
        status: hasGoogleAI ? "Configured" : "Missing GOOGLE_GENERATIVE_AI_API_KEY",
        models: ["gemini-1.5-flash"],
      },
    }

    // File support information - updated to reflect direct AI processing capabilities
    const fileSupport = {
      supported: {
        ".pdf": "PDF documents - Full support via Google AI",
        ".doc/.docx": "Word documents - Full support via Google AI",
        ".xls/.xlsx": "Excel files - Full support via Google AI",
        ".ppt/.pptx": "PowerPoint presentations - Full support via Google AI",
        ".txt": "Plain text files - Full support",
        ".md": "Markdown files - Full support",
        ".json": "JSON files - Full support",
        ".csv": "CSV files - Full support",
        ".html/.xml": "HTML/XML files - Full support",
      },
      unsupported: {
        // List truly unsupported formats here, if any
      },
      note: "Google AI handles most common document types directly, no client-side conversion needed.",
    }

    // Feature status
    const features = {
      aiAnalysis: hasGroq || hasHuggingFace || hasGoogleAI ? "Available" : "Requires API keys",
      documentExtraction: "Supports PDF, Word, Excel, PowerPoint, and text-based files via Google AI",
      antiHallucination: "Enabled - strict content validation",
      confidenceScoring: "Enabled",
      evidenceExtraction: "Enabled - exact quotes with source info",
      riskAssessment: "Enabled",
      batchProcessing: "Enabled - 3 questions per batch (configurable)",
    }

    return NextResponse.json({
      status: "AI Assessment System Debug Info",
      system: systemInfo,
      aiProviders,
      fileSupport,
      features,
      recommendations: [
        hasGoogleAI ? "✅ Google AI configured" : "❌ Add GOOGLE_GENERATIVE_AI_API_KEY",
        "✅ Upload PDF, Word, Excel, PowerPoint, or text files for best results",
        "✅ Anti-hallucination measures active",
      ],
      testEndpoints: {
        providerTest: "/api/ai-assessment/test (GET)",
        sampleAnalysis: "/api/ai-assessment/test (POST)",
        mainAnalysis: "/api/ai-assessment/analyze (POST)",
      },
    })
  } catch (error) {
    console.error("Debug info generation failed:", error)
    return NextResponse.json(
      {
        error: "Debug info failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}