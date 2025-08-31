import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("AI Assessment Debug Info")

    // Check environment variables
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
      google: {
        configured: hasGoogleAI,
        keyLength: hasGoogleAI ? process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length : 0,
        status: hasGoogleAI ? "Configured" : "Missing GOOGLE_GENERATIVE_AI_API_KEY",
        models: ["gemini-1.5-flash"],
      },
    }

    // File support information
    const fileSupport = {
      supported: {
        ".txt": "Plain text files - Full support",
        ".md": "Markdown files - Full support",
        ".json": "JSON files - Full support",
        ".csv": "CSV files - Full support",
        ".pdf": "PDF files - Direct upload to Google AI (Full support)",
      },
      unsupported: {
        ".doc/.docx": "Word documents - Not supported directly, convert to PDF or TXT",
        ".xls/.xlsx": "Excel files - Not supported directly, convert to CSV",
      },
      workaround: "Convert unsupported files to supported formats for analysis",
    }

    // Feature status
    const features = {
      aiAnalysis: hasGoogleAI ? "Available" : "Requires API key",
      documentExtraction: "Supported formats (PDF, TXT, MD, CSV, JSON, HTML, XML)",
      antiHallucination: "Enabled - strict content validation",
      confidenceScoring: "Enabled",
      evidenceExtraction: "Enabled - exact quotes only",
      riskAssessment: "Enabled",
      batchProcessing: "Enabled - multiple documents per analysis",
    }

    return NextResponse.json({
      status: "AI Assessment System Debug Info",
      system: systemInfo,
      aiProviders,
      fileSupport,
      features,
      recommendations: [
        hasGoogleAI ? "✅ Google AI provider configured" : "❌ Add GOOGLE_GENERATIVE_AI_API_KEY",
        "✅ Upload PDF, TXT, MD, CSV, JSON, HTML, XML files for best results",
        "✅ Convert Word/Excel documents to supported formats",
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