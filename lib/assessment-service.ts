import { supabaseClient } from "./supabase-client"
import { supabaseAdmin } from "@/src/integrations/supabase/admin" // Import supabaseAdmin
import { getCurrentUserWithProfile } from "./auth-service" // Import getCurrentUserWithProfile
import type { User } from "@supabase/supabase-js" // Import User type

// Get current user with comprehensive error handling
export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log("🔍 Getting current user...")

    // First check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("⚠️ Server-side rendering, no user available")
      return null
    }

    // Try to get the current session
    console.log("🔐 Checking Supabase session...")
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession()

    if (sessionError) {
      console.error("❌ Session error:", sessionError.message)
      return null
    }

    if (!sessionData?.session?.user) {
      console.log("ℹ️ No active Supabase session")
      return null
    }

    console.log("✅ Supabase user found:", sessionData.session.user.email)
    return sessionData.session.user
  } catch (error) {
    console.error("💥 Error in getCurrentUser:", error)
    // Don't throw the error, just return null
    return null
  }
}

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabaseClient.from("assessments").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Database connection test failed:", error)
      return false
    }

    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

// Function to calculate risk score based on responses
function calculateRiskScore(answers: Record<string, any>): number {
  // Simple risk scoring algorithm
  let score = 100 // Start with perfect score
  const totalQuestions = Object.keys(answers).length

  if (totalQuestions === 0) return 50 // Default score if no answers

  Object.entries(answers).forEach(([questionId, answer]) => {
    if (questionId.includes("cyber")) {
      // Cybersecurity questions
      if (typeof answer === "string") {
        if (answer.includes("No") || answer.includes("Never") || answer.includes("Basic")) {
          score -= 15
        } else if (answer.includes("comprehensive") || answer.includes("AES-256")) {
          score += 5
        }
      } else if (Array.isArray(answer)) {
        // More security measures = better score
        if (answer.length < 2) score -= 10
        else if (answer.length >= 4) score += 5
      }
    } else if (questionId.includes("privacy")) {
      // Privacy questions
      if (typeof answer === "string") {
        if (answer.includes("Never") || answer.includes("Regularly")) {
          if (answer.includes("Never"))
            score += 5 // Good for data sharing
          else score -= 10 // Bad for regular sharing
        }
      }
    }
  })

  return Math.max(0, Math.min(100, score))
}

function getRiskLevel(score: number): string {
  if (score >= 80) return "low"
  if (score >= 60) return "medium"
  if (score >= 40) return "high"
  return "critical"
}

// Get all assessments for the current user
export async function getAssessments(): Promise<any[]> { // Changed to any[] for flexibility with nested data
  try {
    console.log("📋 Getting assessments...")

    const user = await getCurrentUser()
    console.log("👤 Current user:", user ? user.email : "None")

    if (!user) {
      console.log("📝 No authenticated user, returning empty array")
      return []
    }

    console.log("🔍 Fetching assessments from Supabase...")
    const { data, error } = await supabaseClient
      .from("assessments")
      .select(
        `
        *,
        assessment_responses (
          id,
          vendor_info,
          answers,
          submitted_at
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Supabase query error:", error)
      throw new Error(`Failed to fetch assessments: ${error.message}`)
    }

    if (!data || data.length === 0) {
      console.log("📝 No assessments found in database")
      return []
    }

    console.log(`✅ Successfully fetched ${data.length} assessments from database`)
    return data
  } catch (error) {
    console.error("💥 Error in getAssessments:", error)
    throw error
  }
}

// Get assessment by ID (public access for vendors)
export async function getAssessmentById(id: string): Promise<any | null> { // Changed to any for flexibility
  try {
    console.log("🔍 Getting assessment by ID:", id)

    const { data, error } = await supabaseClient.from("assessments").select("*").eq("id", id).single()

    if (error) {
      console.error("❌ Supabase error:", error)
      throw new Error(`Failed to fetch assessment: ${error.message}`)
    }

    console.log("✅ Found assessment:", data?.vendor_name)
    return data
  } catch (error) {
    console.error("💥 Error fetching assessment:", error)
    throw error
  }
}

// Create a new assessment for the current user
export async function createAssessment(assessmentData: {
  vendorName: string
  vendorEmail: string
  contactPerson?: string
  assessmentType: string
  dueDate?: string
  customMessage?: string
}) {
  try {
    console.log("📝 Creating assessment with data:", assessmentData)

    // Validate required fields
    if (!assessmentData.vendorName || !assessmentData.vendorEmail || !assessmentData.assessmentType) {
      throw new Error("Missing required assessment data")
    }

    const user = await getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated. Cannot create assessment.")
    }

    const assessmentId = `assessment-${Date.now()}`
    console.log("📝 Generated assessment ID:", assessmentId)

    const insertData: any = {
      id: assessmentId,
      user_id: user.id,
      vendor_name: assessmentData.vendorName,
      vendor_email: assessmentData.vendorEmail,
      contact_person: assessmentData.contactPerson || null,
      assessment_type: assessmentData.assessmentType,
      status: "pending",
      sent_date: new Date().toISOString().split("T")[0],
      due_date: assessmentData.dueDate || null,
      custom_message: assessmentData.customMessage || null,
      risk_level: "pending",
    }

    console.log("📝 Inserting data:", insertData)

    const { data, error } = await supabaseClient.from("assessments").insert(insertData).select().single()

    if (error) {
      console.error("❌ Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!data) {
      throw new Error("No data returned from database")
    }

    console.log("✅ Assessment created successfully:", data)
    return data
  } catch (error) {
    console.error("💥 Error in createAssessment:", error)
    throw error
  }
}

// Update assessment status (only for the owner)
export async function updateAssessmentStatus(id: string, status: string, riskScore?: number, riskLevel?: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated. Cannot update assessment.")
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "completed") {
      updateData.completed_date = new Date().toISOString()
    }

    if (riskScore !== undefined) {
      updateData.risk_score = riskScore
    }

    if (riskLevel) {
      updateData.risk_level = riskLevel
    }

    const { error } = await supabaseClient.from("assessments").update(updateData).eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error updating assessment:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Error updating assessment status:", error)
    throw error
  }
}

// Submit assessment response (public access for vendors)
export async function submitAssessmentResponse(
  assessmentId: string,
  vendorInfo: any,
  answers: Record<string, any>,
): Promise<void> {
  try {
    console.log("🔄 Submitting assessment response for ID:", assessmentId)
    console.log("📊 Vendor info:", vendorInfo)
    console.log("📝 Answers:", answers)

    // Calculate risk score first
    const riskScore = calculateRiskScore(answers)
    const riskLevel = getRiskLevel(riskScore)
    console.log("📈 Calculated risk score:", riskScore, "level:", riskLevel)

    // Get the assessment to find the owner
    const { data: assessment, error: assessmentError } = await supabaseClient
      .from("assessments")
      .select("user_id")
      .eq("id", assessmentId)
      .single()

    if (assessmentError) {
      console.error("❌ Error fetching assessment:", assessmentError)
      throw new Error(`Failed to find assessment: ${assessmentError.message}`)
    }

    // Insert the response into assessment_responses table
    const { error: responseError } = await supabaseClient.from("assessment_responses").insert([
      {
        assessment_id: assessmentId,
        user_id: assessment.user_id, // Link to the assessment owner
        vendor_info: vendorInfo,
        answers: answers,
        submitted_at: new Date().toISOString(),
      },
    ])

    if (responseError) {
      console.error("❌ Error inserting assessment response:", responseError)
      throw new Error(`Failed to save assessment response: ${responseError.message}`)
    }

    console.log("✅ Assessment response saved successfully")

    // Update the assessment status to completed with proper data
    const { error: updateError } = await supabaseClient
      .from("assessments")
      .update({
        status: "completed",
        completed_date: new Date().toISOString(),
        risk_score: riskScore,
        risk_level: riskLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)

    if (updateError) {
      console.error("❌ Error updating assessment status:", updateError)
      throw new Error(`Failed to update assessment status: ${updateError.message}`)
    }

    console.log("✅ Assessment status updated to completed")
  } catch (error) {
    console.error("💥 Error submitting assessment response:", error)
    throw error
  }
}

// Delete assessment (only for the owner)
export async function deleteAssessment(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated. Cannot delete assessment.")
    }

    const { error } = await supabaseClient.from("assessments").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting assessment:", error)
      throw new Error(`Failed to delete assessment: ${error.message}`)
    }
  } catch (error) {
    console.error("Error in deleteAssessment:", error)
    throw error
  }
}

// New function to save AI assessment reports
export async function saveAiAssessmentReport(reportData: {
  assessmentType: string;
  reportTitle: string;
  riskScore: number;
  riskLevel: string;
  reportSummary: string;
  fullReportContent: any; // JSON object containing all details
  uploadedDocumentsMetadata: any[];
  socInfo?: any; // Optional SOC-specific info
}) {
  try {
    console.log("💾 Attempting to save AI assessment report...");
    const { user, organization, profile } = await getCurrentUserWithProfile();

    if (!user || !organization || !profile) {
      throw new Error("User not authenticated or organization not found. Cannot save report.");
    }

    const insertData = {
      user_id: user.id,
      organization_id: organization.id,
      assessment_type: reportData.assessmentType,
      report_title: reportData.reportTitle,
      risk_score: reportData.riskScore,
      risk_level: reportData.riskLevel,
      analysis_date: new Date().toISOString(),
      report_summary: reportData.reportSummary,
      full_report_content: reportData.fullReportContent,
      uploaded_documents_metadata: reportData.uploadedDocumentsMetadata,
      soc_info: reportData.socInfo || null,
    };

    console.log("📝 Inserting AI assessment report data:", insertData);

    const { data, error } = await supabaseClient
      .from("ai_assessment_reports")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error saving AI assessment report:", error);
      throw new Error(`Failed to save AI assessment report: ${error.message}`);
    }

    console.log("✅ AI assessment report saved successfully:", data);
    return data;
  } catch (error) {
    console.error("💥 Error in saveAiAssessmentReport:", error);
    throw error;
  }
}