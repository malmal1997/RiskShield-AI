import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("AI Assessment Debug Info")

    // Check environment variables
    const hasGroq = !!process.env.GROQ_API_KEY
    const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY

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
    }

    // File support information
    const fileSupport = {
      supported: {
        ".txt": "Plain text files - Full support",
        ".md": "Markdown files - Full support",
        ".json": "JSON files - Full support",
        ".csv": "CSV files - Full support",
      },
      unsupported: {
        ".pdf": "PDF files - Not supported in browser environment",
        ".doc/.docx": "Word documents - Not supported in browser environment",
        ".xls/.xlsx": "Excel files - Not supported in browser environment",
      },
      workaround: "Convert unsupported files to .txt format for analysis",
    }

    // Feature status
    const features = {
      aiAnalysis: hasGroq || hasHuggingFace ? "Available" : "Requires API keys",
      documentExtraction: "Text files only",
      antiHallucination: "Enabled - strict content validation",
      confidenceScoring: "Enabled",
      evidenceExtraction: "Enabled - exact quotes only",
      riskAssessment: "Enabled",
      batchProcessing: "Enabled - 3 questions per batch",
    }

    return NextResponse.json({
      status: "AI Assessment System Debug Info",
      system: systemInfo,
      aiProviders,
      fileSupport,
      features,
      recommendations: [
        hasGroq || hasHuggingFace ? "✅ AI providers configured" : "❌ Add GROQ_API_KEY or HUGGINGFACE_API_KEY",
        "✅ Upload .txt files for best results",
        "✅ Convert PDF/Word documents to text format",
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
