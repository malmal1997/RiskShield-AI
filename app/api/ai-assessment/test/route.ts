import { NextResponse } from "next/server"

// Direct Gemini API test without AI SDK
async function testGeminiAPI() {
  const results: any = {}
  
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      console.log("🔗 Testing Google AI connection...")
      
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
                text: "Reply with 'OK' if you can read this."
              }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 10,
            }
          })
        }
      )

      if (!response.ok) {
        results.google = false
        console.log("❌ Google AI test: FAILED - API error")
      } else {
        const geminiResponse = await response.json()
        const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || ""
        results.google = responseText.toLowerCase().includes("ok")
        console.log("✅ Google AI test:", results.google ? "PASSED" : "FAILED")
      }
    } catch (error) {
      console.error("❌ Google AI test failed:", error)
      results.google = false
    }
  }

  return results
}

export async function GET() {
  try {
    console.log("Testing AI providers...")

    // Test Gemini API directly
    const providerResults = await testGeminiAPI()

    // Check environment variables
    const hasGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const hasGroq = !!process.env.GROQ_API_KEY
    const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY

    return NextResponse.json({
      status: "AI Provider Test Complete",
      timestamp: new Date().toISOString(),
      providers: {
        google: {
          configured: hasGoogle,
          working: providerResults.google || false,
          status: hasGoogle ? (providerResults.google ? "✅ Working" : "❌ Failed") : "❌ Not configured",
          model: "gemini-1.5-flash",
        },
        groq: {
          configured: hasGroq,
          working: providerResults.groq || false,
          status: hasGroq ? (providerResults.groq ? "✅ Working" : "❌ Failed") : "❌ Not configured",
          model: "llama-3.1-8b-instant",
        },
        huggingface: {
          configured: hasHuggingFace,
          working: providerResults.huggingface || false,
          status: hasHuggingFace ? (providerResults.huggingface ? "✅ Working" : "❌ Failed") : "❌ Not configured",
          model: "meta-llama/Llama-3.1-8B-Instruct",
        },
      },
      summary: {
        totalProviders: Object.keys(providerResults).length,
        workingProviders: Object.values(providerResults).filter(Boolean).length,
        recommendation: hasGoogle || hasGroq || hasHuggingFace ? "Ready for AI analysis" : "Add API keys to enable AI analysis",
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
    console.log("Running sample document analysis test...")

    // Sample security policy text for testing
    const sampleDocument = `
CYBERSECURITY POLICY DOCUMENT

SECTION 1: DATA PROTECTION
All sensitive data must be encrypted using AES-256 encryption standards.
Data backups are performed on a daily basis and stored securely.
Multi-factor authentication is required for all employees accessing sensitive systems.

SECTION 2: NETWORK SECURITY
Network firewalls are configured and monitored continuously.
All network traffic is logged and reviewed regularly.
Intrusion detection systems are deployed across critical infrastructure.

SECTION 3: SECURITY TESTING
Comprehensive penetration testing is conducted annually by certified professionals.
Vulnerability assessments are performed quarterly on all systems.
Security audits are completed every six months.

SECTION 4: INCIDENT RESPONSE
A 24/7 security operations center monitors all systems.
Incident response procedures are tested monthly.
All security incidents are documented and investigated thoroughly.

SECTION 5: COMPLIANCE
Regular compliance audits ensure adherence to industry standards.
Security awareness training is provided to all staff annually.
Security policies are reviewed and updated yearly.
`

    const sampleQuestions = [
      {
        id: "q1",
        question: "Does your organization encrypt data?",
        type: "boolean" as const,
        weight: 3,
      },
      {
        id: "q2",
        question: "How often do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 3,
      },
      {
        id: "q3",
        question: "Do you have multi-factor authentication?",
        type: "boolean" as const,
        weight: 2,
      },
    ]

    // Create a mock file for testing
    const mockFile = new File([sampleDocument], "sample-policy.txt", { type: "text/plain" })

    // Test simple analysis (placeholder for now)
    const result = {
      status: "Sample analysis disabled in build",
      message: "Use the main analyze endpoint with GOOGLE_GENERATIVE_AI_API_KEY for real analysis"
    }

    return NextResponse.json({
      status: "Sample analysis complete",
      timestamp: new Date().toISOString(),
      testResult: result,
      sampleData: {
        documentLength: sampleDocument.length,
        questionsCount: sampleQuestions.length,
        documentPreview: sampleDocument.substring(0, 200) + "...",
      },
    })
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
