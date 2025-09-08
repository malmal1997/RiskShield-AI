import { supabase, type Assessment } from "./supabase"
import { supabaseClient } from "./supabase-client"
import { getCurrentUserWithProfile } from "./auth-service" // Import from auth-service for comprehensive user data

// Get current user with comprehensive error handling
// This function is intended for server-side use or within API routes
// For client-side components, use the `useAuth` hook
export async function getCurrentUserServer() {
  try {
    console.log("🔍 [Server] Getting current user...")

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error("❌ [Server] Supabase getUser error:", userError.message);
      return null;
    }

    if (!user) {
      console.log("ℹ️ [Server] No authenticated user found.");
      return null;
    }

    console.log("✅ [Server] Supabase user found:", user.email);
    return user;
  } catch (error) {
    console.error("💥 [Server] Error in getCurrentUserServer:", error);
    // Don't throw the error, just return null
    return null;
  }
}


// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("assessments").select("count", { count: "exact", head: true })

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
export async function getAssessments(): Promise<Assessment[]> {
  try {
    console.log("📋 Getting assessments...")

    const { user, profile } = await getCurrentUserWithProfile(); // Use the comprehensive user data

    if (!user || !profile) {
      console.log("📝 No authenticated user or profile, returning empty array")
      return []
    }

    console.log("🔍 Fetching assessments from Supabase for user:", user.id, "and organization:", profile.organization_id)
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
      .eq("organization_id", profile.organization_id) // Filter by organization_id
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Supabase query error:", error)
      throw new Error(`Failed to fetch assessments: ${error.message}`)
    }

    if (!data || data.length === 0) {
      console.log("📝 No assessments found in database for this user/organization")
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
export async function getAssessmentById(id: string): Promise<Assessment | null> {
  try {
    console.log("🔍 Getting assessment by ID:", id)

    const { data, error } = await supabase.from("assessments").select("*").eq("id", id).single()

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

    const { user, profile } = await getCurrentUserWithProfile(); // Use the comprehensive user data
    if (!user || !profile) {
      throw new Error("User not authenticated or profile missing. Cannot create assessment.")
    }

    const assessmentId = `assessment-${Date.now()}`
    console.log("📝 Generated assessment ID:", assessmentId)

    const insertData: any = {
      id: assessmentId,
      user_id: user.id,
      organization_id: profile.organization_id, // Associate with organization
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
    const { user, profile } = await getCurrentUserWithProfile();
    if (!user || !profile) {
      throw new Error("User not authenticated or profile missing. Cannot update assessment.")
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

    const { error } = await supabaseClient.from("assessments").update(updateData).eq("id", id).eq("user_id", user.id).eq("organization_id", profile.organization_id)

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

    // Get the assessment to find the owner and organization
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("user_id, organization_id")
      .eq("id", assessmentId)
      .single()

    if (assessmentError) {
      console.error("❌ Error fetching assessment:", assessmentError)
      throw new Error(`Failed to find assessment: ${assessmentError.message}`)
    }

    // Insert the response into assessment_responses table
    const { error: responseError } = await supabase.from("assessment_responses").insert([
      {
        assessment_id: assessmentId,
        user_id: assessment.user_id, // Link to the assessment owner
        organization_id: assessment.organization_id, // Link to the organization
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
    const { error: updateError } = await supabase
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
    const { user, profile } = await getCurrentUserWithProfile();
    if (!user || !profile) {
      throw new Error("User not authenticated or profile missing. Cannot delete assessment.")
    }

    const { error } = await supabaseClient.from("assessments").delete().eq("id", id).eq("user_id", user.id).eq("organization_id", profile.organization_id)

    if (error) {
      console.error("Error deleting assessment:", error)
      throw new Error(`Failed to delete assessment: ${error.message}`)
    }
  } catch (error) {
    console.error("Error in deleteAssessment:", error)
    throw error
  }
}