import { NextResponse } from "next/server"
import { testAIProviders, analyzeDocuments } from "@/lib/ai-service"

export async function GET() {
  try {
    console.log("Testing AI providers...")

    // Test only Google AI provider
    const providerResults = await testAIProviders()

    const hasGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY

    const providersStatus = {
      google: {
        configured: hasGoogle,
        working: providerResults.google,
        status: hasGoogle ? (providerResults.google ? "✅ Working" : "❌ Failed") : "❌ Not configured",
        model: "gemini-1.5-flash",
      },
    }

    const configuredProviders = Object.values(providersStatus).filter(p => p.configured).length;
    const workingProviders = Object.values(providersStatus).filter(p => p.working).length;
    
    let recommendation = "Google AI provider is configured and working. Ready for AI analysis.";
    if (configuredProviders === 0) {
      recommendation = "No AI providers are configured. Add GOOGLE_GENERATIVE_AI_API_KEY to enable AI analysis.";
    } else if (workingProviders === 0 && configuredProviders > 0) {
      recommendation = "Google AI provider is configured but failing. Check API key and network connectivity.";
    }


    return NextResponse.json({
      status: "AI Provider Test Complete",
      timestamp: new Date().toISOString(),
      providers: providersStatus,
      summary: {
        totalProviders: configuredProviders, // Only count configured ones for summary
        workingProviders: workingProviders,
        recommendation: recommendation,
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

    // Run the analysis
    // For testing, we need a dummy userId. In a real scenario, this would come from authentication.
    const dummyUserId = "test-user-id-123"; 
    const result = await analyzeDocuments([mockFile], sampleQuestions, "Sample Security Assessment", dummyUserId)

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
    console.error("Analysis test failed:", error)
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