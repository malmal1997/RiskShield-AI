import { type NextRequest, NextResponse } from "next/server"
import { analyzeDocuments } from "@/lib/ai-service"
import { supabaseClient } from "@/lib/supabase-client" // Import supabaseClient

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
    const documentMetadataJson = formData.get("documentMetadata") as string; // Get document metadata
    const assessmentId = formData.get("assessmentId") as string | undefined; // Get optional assessmentId
    const userIdFromClient = formData.get("userId") as string; // Get userId from client
    const isDemoFromClient = formData.get("isDemo") === "true"; // Get isDemo status from client

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

    let documentMetadata: Array<{ fileName: string; type: 'primary' | '4th-party'; relationship?: string }> = [];
    if (documentMetadataJson) {
      try {
        documentMetadata = JSON.parse(documentMetadataJson);
      } catch (error) {
        console.error("Invalid document metadata format:", error);
        return NextResponse.json({ error: "Invalid document metadata format" }, { status: 400 });
      }
    }

    let userIdToUse: string | null = null;

    if (isDemoFromClient) {
      // For demo users, trust the userId provided by the client
      userIdToUse = userIdFromClient;
      console.log(`AI Assessment API: Processing as DEMO user: ${userIdToUse}`);
    } else {
      // For non-demo users, verify authentication via Supabase
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

      if (authError || !user) {
        console.warn("Unauthorized AI Assessment API call: No authenticated user.");
        return NextResponse.json({ error: "Unauthorized: User not authenticated." }, { status: 401 });
      }

      // Ensure the userId from client matches the authenticated user
      if (user.id !== userIdFromClient) {
        console.warn(`Unauthorized AI Assessment API call: User ID mismatch. Authenticated: ${user.id}, Client provided: ${userIdFromClient}`);
        return NextResponse.json({ error: "Unauthorized: User ID mismatch." }, { status: 401 });
      }
      userIdToUse = user.id;
      console.log(`AI Assessment API: Processing as authenticated user: ${userIdToUse}`);
    }

    if (!userIdToUse) {
      return NextResponse.json({ error: "Unauthorized: User ID could not be determined." }, { status: 401 });
    }

    console.log(`Processing ${files.length} files for ${assessmentType} assessment by user ${userIdToUse}`)

    // Check if Google AI is available
    const hasGoogleAI = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // Note: The actual API key selection (client vs default) happens inside analyzeDocuments
    // We only need to ensure the default is configured if no client key is expected.
    if (!hasGoogleAI && !isDemoFromClient) { // If not demo and no default key, it will fail if no client key is provided
      console.warn("Default Google AI API key not configured. Analysis might fail if client key is not provided.");
    }

    // Perform analysis, passing the user ID, optional assessment ID, and document metadata
    const result = await analyzeDocuments(files, questions, assessmentType || "Unknown", userIdToUse, assessmentId, documentMetadata);

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