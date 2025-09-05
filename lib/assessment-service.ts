import { supabase, isSupabaseConfigured, type Assessment } from "./supabase"
import { supabaseClient } from "./supabase-client"
import { generateTicketId } from "./utils" // Import generateTicketId

// Mock data for when Supabase is not configured
const mockAssessments: Assessment[] = [
  {
    id: "demo-assessment-1",
    ticket_id: "ASSESS-10001", // Added ticket_id
    vendor_name: "TechCorp Solutions",
    vendor_email: "security@techcorp.com",
    contact_person: "John Smith",
    assessment_type: "Cybersecurity Assessment",
    status: "pending",
    sent_date: "2024-01-15T10:00:00Z",
    due_date: "2024-02-15T23:59:59Z",
    risk_score: null,
    risk_level: "pending",
    custom_message: "Please complete this assessment to help us evaluate our partnership.",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "demo-assessment-2",
    ticket_id: "ASSESS-10002", // Added ticket_id
    vendor_name: "DataFlow Inc",
    vendor_email: "compliance@dataflow.com",
    contact_person: "Sarah Johnson",
    assessment_type: "Data Privacy Assessment",
    status: "completed",
    sent_date: "2024-01-10T09:00:00Z",
    completed_date: "2024-01-20T14:30:00Z",
    due_date: "2024-02-10T23:59:59Z",
    risk_score: 85,
    risk_level: "low",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "demo-assessment-3",
    ticket_id: "ASSESS-10003", // Added ticket_id
    vendor_name: "SecureCloud Systems",
    vendor_email: "admin@securecloud.com",
    contact_person: "Mike Chen",
    assessment_type: "Infrastructure Security",
    status: "in_progress",
    sent_date: "2024-01-20T08:00:00Z",
    due_date: "2024-02-20T23:59:59Z",
    risk_score: null,
    risk_level: "pending",
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-01-22T10:30:00Z",
  },
]

// Get current user with comprehensive error handling
export async function getCurrentUser() {
  try {
    console.log("🔍 Getting current user...")

    // First check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("⚠️ Server-side rendering, no user available")
      return null
    }

    // Check for demo session first
    try {
      const demoSession = sessionStorage.getItem("demo_session")
      if (demoSession) {
        console.log("🎭 Found demo session")
        const session = JSON.parse(demoSession)
        const demoUser = {
          id: session.user.id,
          email: session.user.email,
          user_metadata: { name: session.user.name },
        }
        console.log("✅ Demo user:", demoUser)
        return demoUser
      }
    } catch (demoError) {
      console.error("❌ Error parsing demo session:", demoError)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("demo_session")
      }
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log("⚠️ Supabase not configured, no user available")
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
    if (!isSupabaseConfigured()) {
      console.log("⚠️ Supabase not configured for connection test")
      return false
    }

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

    // Always try to get user first, but don't fail if we can't
    const user = await getCurrentUser()
    console.log("👤 Current user:", user ? user.email : "None")

    let assessments = [...mockAssessments]

    // Add AI assessments from sessionStorage
    try {
      const aiAssessments = JSON.parse(sessionStorage.getItem("riskAssessments") || "[]")
      const assessmentsList = JSON.parse(sessionStorage.getItem("assessmentsList") || "[]")

      // Combine both sources and remove duplicates
      const combinedAIAssessments = [...aiAssessments, ...assessmentsList]
      const uniqueAIAssessments = combinedAIAssessments.filter(
        (assessment, index, self) => index === self.findIndex((a) => a.id === assessment.id),
      )

      assessments = [...assessments, ...uniqueAIAssessments]
      console.log(`📝 Added ${uniqueAIAssessments.length} AI assessments from sessionStorage`)
    } catch (error) {
      console.error("Error loading AI assessments from sessionStorage:", error)
    }

    // If no Supabase config, return combined mock + AI data
    if (!isSupabaseConfigured()) {
      console.log("📝 Using combined mock and AI assessments (Supabase not configured)")
      return assessments
    }

    // If no user, return combined mock + AI data (don't fail)
    if (!user) {
      console.log("📝 Using combined mock and AI assessments (no authenticated user)")
      return assessments
    }

    // Try to fetch from Supabase
    console.log("🔍 Fetching assessments from Supabase...")
    // Validate UUID format before querying
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(user.id)) {
      console.log("📝 Invalid UUID format, using combined mock and AI data:", user.id)
      return assessments
    }

    const { data, error } = await supabaseClient
      .from("assessments")
      .select(`
        *,
        assessment_responses (
          id,
          vendor_info,
          answers,
          submitted_at
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Supabase query error:", error)
      console.log("📝 Falling back to combined mock and AI data")
      return assessments
    }

    if (!data || data.length === 0) {
      console.log("📝 No assessments found in database, using combined mock and AI data")
      return assessments
    }

    console.log(`✅ Successfully fetched ${data.length} assessments from database`)
    // Combine database assessments with AI assessments
    return [...data, ...assessments.filter((a) => a.id.startsWith("RA-") || a.id.startsWith("mock-"))]
  } catch (error) {
    console.error("💥 Error in getAssessments:", error)
    console.log("📝 Falling back to mock data due to error")
    return mockAssessments
  }
}

// Get assessment by ID (public access for vendors)
export async function getAssessmentById(id: string): Promise<Assessment | null> {
  try {
    console.log("🔍 Getting assessment by ID:", id)

    if (!isSupabaseConfigured()) {
      console.log("📝 Using mock assessment data for ID:", id)
      return mockAssessments.find((a) => a.id === id) || mockAssessments[0]
    }

    // For vendor access, we don't filter by user_id since vendors aren't authenticated
    const { data, error } = await supabase.from("assessments").select("*").eq("id", id).single()

    if (error) {
      console.error("❌ Supabase error:", error)
      console.log("📝 Falling back to mock data for ID:", id)
      return mockAssessments.find((a) => a.id === id) || mockAssessments[0]
    }

    console.log("✅ Found assessment:", data?.vendor_name)
    return data
  } catch (error) {
    console.error("💥 Error fetching assessment:", error)
    // Return mock data for demo purposes
    return mockAssessments.find((a) => a.id === id) || mockAssessments[0]
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

    // If Supabase not configured, create mock assessment
    if (!isSupabaseConfigured()) {
      console.log("⚠️ Supabase not configured, creating mock assessment...")
      const mockId = `mock-${Date.now()}`
      const mockAssessment = {
        id: mockId,
        ticket_id: generateTicketId("ASSESS"), // Generate ticket_id
        vendor_name: assessmentData.vendorName,
        vendor_email: assessmentData.vendorEmail,
        contact_person: assessmentData.contactPerson || "",
        assessment_type: assessmentData.assessmentType,
        status: "pending",
        sent_date: new Date().toISOString().split("T")[0],
        due_date: assessmentData.dueDate || "",
        custom_message: assessmentData.customMessage || "",
        risk_level: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      console.log("✅ Mock assessment created:", mockAssessment)
      return mockAssessment
    }

    // Get current user (but don't fail if we can't)
    const user = await getCurrentUser()

    // For demo users or when user doesn't exist in database, create without user_id constraint
    let userId = null
    if (user) {
      // Check if this user actually exists in the database
      try {
        const { data: existingUser, error: userCheckError } = await supabaseClient
          .from("user_profiles")
          .select("user_id")
          .eq("user_id", user.id)
          .single()

        if (!userCheckError && existingUser) {
          userId = user.id
          console.log("✅ Valid database user found:", userId)
        } else {
          console.log("⚠️ User not found in database, creating assessment without user constraint")
        }
      } catch (error) {
        console.log("⚠️ Error checking user in database, proceeding without user constraint")
      }
    }

    const assessmentId = `assessment-${Date.now()}`
    const ticketId = generateTicketId("ASSESS"); // Generate ticket_id
    console.log("📝 Generated assessment ID:", assessmentId, "Ticket ID:", ticketId)

    const insertData: any = {
      id: assessmentId,
      ticket_id: ticketId, // Assign ticket_id
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

    // Only add user_id if we have a valid database user
    if (userId) {
      insertData.user_id = userId
    }

    console.log("📝 Inserting data:", insertData)

    const { data, error } = await supabaseClient.from("assessments").insert(insertData).select().single()

    if (error) {
      console.error("❌ Supabase error:", error)

      // If it's a foreign key constraint error, try creating without user_id
      if (error.message.includes("foreign key constraint") || error.message.includes("user_id_fkey")) {
        console.log("🔄 Retrying without user_id constraint...")
        const { user_id, ...dataWithoutUserId } = insertData
        const { data: retryData, error: retryError } = await supabaseClient
          .from("assessments")
          .insert(dataWithoutUserId)
          .select()
          .single()

        if (retryError) {
          throw new Error(`Database error: ${retryError.message}`)
        }

        if (!retryData) {
          throw new Error("No data returned from database")
        }

        console.log("✅ Assessment created successfully without user constraint:", retryData)
        return retryData
      }

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
    if (!isSupabaseConfigured()) {
      console.log("Mock mode: Assessment status would be updated:", { id, status, riskScore, riskLevel })
      return true
    }

    const user = await getCurrentUser()
    if (!user) {
      console.log("Mock mode: No user, assessment status would be updated:", { id, status, riskScore, riskLevel })
      return true
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

    if (!isSupabaseConfigured()) {
      console.log("⚠️ Mock mode: Assessment response would be submitted")
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return
    }

    // Calculate risk score first
    const riskScore = calculateRiskScore(answers)
    const riskLevel = getRiskLevel(riskScore)
    console.log("📈 Calculated risk score:", riskScore, "level:", riskLevel)

    // Get the assessment to find the owner
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("user_id")
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
    if (!isSupabaseConfigured()) {
      console.log("Mock mode: Assessment would be deleted:", id)
      return
    }

    const user = await getCurrentUser()
    if (!user) {
      console.log("Mock mode: No user, assessment would be deleted:", id)
      return
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
