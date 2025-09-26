import { type NextRequest, NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabase-client"
import { getCurrentUser } from "@/lib/assessment-service"

// Update individual assessment answers
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { answers, documentEvidence, reviewerSignOff } = await request.json()
    const assessmentId = params.id

    console.log("[v0] Updating assessment:", { assessmentId, answers, documentEvidence, reviewerSignOff })

    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // First, get the assessment to verify ownership
    const { data: assessment, error: assessmentError } = await supabaseClient
      .from("assessments")
      .select("user_id")
      .eq("id", assessmentId)
      .single()

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    // Check if user owns this assessment
    if (assessment.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get existing response
    const { data: existingResponse, error: fetchError } = await supabaseClient
      .from("assessment_responses")
      .select("*")
      .eq("assessment_id", assessmentId)
      .single()

    if (fetchError || !existingResponse) {
      return NextResponse.json({ error: "Assessment response not found" }, { status: 404 })
    }

    // Merge new data with existing
    const updatedAnswers = answers ? { ...existingResponse.answers, ...answers } : existingResponse.answers
    const updatedDocumentEvidence = documentEvidence || existingResponse.document_evidence || []
    const updatedReviewerSignOff = reviewerSignOff || existingResponse.reviewer_sign_off || null

    // Recalculate risk score
    const riskScore = calculateRiskScore(updatedAnswers)
    const riskLevel = getRiskLevel(riskScore)

    // Update the assessment_responses table
    const updateData: any = {
      answers: updatedAnswers,
      document_evidence: updatedDocumentEvidence,
      reviewer_sign_off: updatedReviewerSignOff,
      submitted_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabaseClient
      .from("assessment_responses")
      .update(updateData)
      .eq("assessment_id", assessmentId)

    if (updateError) {
      console.error("[v0] Error updating assessment response:", updateError)
      return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 })
    }

    // Update the main assessment table with new risk score and approval status
    const assessmentUpdateData: any = {
      risk_score: riskScore,
      risk_level: riskLevel,
      updated_at: new Date().toISOString(),
    }

    // If reviewer sign-off is provided, update approval status
    if (reviewerSignOff && reviewerSignOff.signOffDate) {
      assessmentUpdateData.approval_status = "approved"
      assessmentUpdateData.approved_by = user.id
      assessmentUpdateData.approved_at = reviewerSignOff.signOffDate
    }

    const { error: assessmentUpdateError } = await supabaseClient
      .from("assessments")
      .update(assessmentUpdateData)
      .eq("id", assessmentId)

    if (assessmentUpdateError) {
      console.error("[v0] Error updating assessment:", assessmentUpdateError)
    }

    console.log("[v0] Assessment updated successfully:", { riskScore, riskLevel })

    return NextResponse.json({
      success: true,
      riskScore,
      riskLevel,
      updatedAnswers,
      updatedDocumentEvidence,
      updatedReviewerSignOff,
    })
  } catch (error) {
    console.error("[v0] Error in assessment update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions (copied from assessment-service.ts)
function calculateRiskScore(answers: Record<string, any>): number {
  let score = 100
  const totalQuestions = Object.keys(answers).length

  if (totalQuestions === 0) return 50

  Object.entries(answers).forEach(([questionId, answer]) => {
    if (questionId.includes("cyber")) {
      if (typeof answer === "string") {
        if (answer.includes("No") || answer.includes("Never") || answer.includes("Basic")) {
          score -= 15
        } else if (answer.includes("comprehensive") || answer.includes("AES-256")) {
          score += 5
        }
      } else if (Array.isArray(answer)) {
        if (answer.length < 2) score -= 10
        else if (answer.length >= 4) score += 5
      }
    } else if (questionId.includes("privacy")) {
      if (typeof answer === "string") {
        if (answer.includes("Never") || answer.includes("Regularly")) {
          if (answer.includes("Never")) score += 5
          else score -= 10
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
