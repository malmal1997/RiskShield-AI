import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("AI Assessment Debug Info")

    // Check environment variables for all providers
    const hasGoogleAI = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const hasGroq = !!process.env.GROQ_API_KEY
    const hasHuggingFace = !!process.env.HF_API_KEY

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
      groq: {
        configured: hasGroq,
        keyLength: hasGroq ? process.env.GROQ_API_KEY?.length : 0,
        status: hasGroq ? "Configured" : "Missing GROQ_API_KEY",
        models: ["llama3-8b-8192"],
      },
      huggingface: {
        configured: hasHuggingFace,
        keyLength: hasHuggingFace ? process.env.HF_API_KEY?.length : 0,
        status: hasHuggingFace ? "Configured" : "Missing HF_API_KEY",
        models: ["mixtral-8x7b-instruct-v0.1"],
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
      aiAnalysis: (hasGoogleAI || hasGroq || hasHuggingFace) ? "Available" : "Requires at least one API key",
      documentExtraction: "Supported formats (PDF, TXT, MD, CSV, JSON, HTML, XML)",
      antiHallucination: "Enabled - strict content validation",
      confidenceScoring: "Enabled",
      evidenceExtraction: "Enabled - exact quotes only",
      riskAssessment: "Enabled",
      batchProcessing: "Enabled - multiple documents per analysis",
    }

    const recommendations = [];
    if (hasGoogleAI) recommendations.push("✅ Google AI provider configured"); else recommendations.push("❌ Add GOOGLE_GENERATIVE_AI_API_KEY");
    if (hasGroq) recommendations.push("✅ Groq AI provider configured"); else recommendations.push("❌ Add GROQ_API_KEY");
    if (hasHuggingFace) recommendations.push("✅ Hugging Face AI provider configured"); else recommendations.push("❌ Add HF_API_KEY");
    recommendations.push("✅ Upload PDF, TXT, MD, CSV, JSON, HTML, XML files for best results");
    recommendations.push("✅ Convert Word/Excel documents to supported formats");
    recommendations.push("✅ Anti-hallucination measures active");


    return NextResponse.json({
      status: "AI Assessment System Debug Info",
      system: systemInfo,
      aiProviders,
      fileSupport,
      features,
      recommendations,
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
