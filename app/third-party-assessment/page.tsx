"use client"

import { useState, useEffect } from "react"
// Removed: import { AppFooter } from "@/components/app-footer"
import { sendAssessmentEmail } from "./email-service"
import { getAssessments, createAssessment, deleteAssessment } from "@/lib/assessment-service"
import type { Assessment } from "@/lib/supabase"
import { AuthGuard } from "@/components/auth-guard"
import { ThirdPartyAssessmentHero } from "@/components/third-party-assessment/ThirdPartyAssessmentHero"
import { AssessmentStats } from "@/components/third-party-assessment/AssessmentStats"
import { AssessmentFilters } from "@/components/third-party-assessment/AssessmentFilters"
import { AssessmentList } from "@/components/third-party-assessment/AssessmentList"
import { InviteAssessmentModal } from "@/components/third-party-assessment/InviteAssessmentModal"
import { AssessmentDetailsModal } from "@/components/third-party-assessment/AssessmentDetailsModal"

// Define assessment types as a constant outside the component
const ASSESSMENT_TYPES = [
  "Cybersecurity Assessment",
  "Data Privacy Assessment",
  "Infrastructure Security",
  "Financial Services Assessment",
  "Operational Risk Assessment",
  "Compliance Assessment",
  "Business Continuity Assessment",
]

export default function ThirdPartyAssessment() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    vendorName: "",
    vendorEmail: "",
    contactPerson: "",
    assessmentType: "",
    dueDate: "",
    customMessage: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>("") // Kept for potential debugging

  // Check if user is in preview mode
  useEffect(() => {
    const storedSession = sessionStorage.getItem("demo_session")
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession)
        setUserEmail(sessionData.user?.email || null)
      } catch (error) {
        console.error("Error parsing demo session:", error)
        sessionStorage.removeItem("demo_session") // Clear invalid session
        setUserEmail(null)
      }
    } else {
      setUserEmail(null)
    }

    const hasAuth = sessionStorage.getItem("demo_session") || userEmail
    setIsPreviewMode(!hasAuth)
  }, [userEmail])

  // Load assessments from Supabase
  const loadAssessments = async () => {
    try {
      setIsRefreshing(true)
      setDebugInfo("Loading assessments...")
      console.log("🔄 Loading assessments...")

      const data = await getAssessments()
      console.log("📋 Raw assessment data:", data)

      // Transform data to match our component expectations
      const transformedData = data.map((assessment: any) => ({
        id: assessment.id,
        vendor_name: assessment.vendor_name,
        vendor_email: assessment.vendor_email,
        contact_person: assessment.contact_person,
        assessment_type: assessment.assessment_type,
        status: assessment.status,
        sent_date: assessment.sent_date,
        completed_date: assessment.completed_date,
        due_date: assessment.due_date,
        risk_score: assessment.risk_score,
        risk_level: assessment.risk_level || "pending",
        company_size: assessment.company_size,
        custom_message: assessment.custom_message,
        responses: assessment.assessment_responses?.[0] || null,
        // Add vendor info from responses if available
        completedVendorInfo: assessment.assessment_responses?.[0]?.vendor_info || null,
        assessmentAnswers: assessment.assessment_responses?.[0]?.answers || null,
      }))

      console.log("✅ Transformed assessment data:", transformedData)
      setAssessments(transformedData)
      setDebugInfo(`Successfully loaded ${transformedData.length} assessments`)
      console.log(`✅ Successfully loaded ${transformedData.length} assessments`)
    } catch (error) {
      console.error("❌ Error loading assessments:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setDebugInfo(`Load error: ${errorMessage}`)

      // Set empty array on error, component will show "no assessments" state
      setAssessments([])
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAssessments()
  }, [])

  const handleInviteFormChange = (field: keyof typeof inviteForm, value: string) => {
    setInviteForm((prev) => ({ ...prev, [field]: value }))
  }

  const generateAssessmentLink = (assessmentId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    return `${baseUrl}/vendor-assessment/${assessmentId}?token=abc123xyz`
  }

  const handleSendInvite = async () => {
    if (isPreviewMode) {
      alert(
        "Preview Mode: Sign up to send real assessment invitations. This would create and send an assessment to " +
          inviteForm.vendorEmail,
      )
      return
    }

    if (!inviteForm.vendorName || !inviteForm.vendorEmail || !inviteForm.assessmentType) {
      alert("Please fill in all required fields")
      return
    }

    let newAssessment: Assessment | null = null

    try {
      console.log("🚀 Starting assessment creation process...")
      setDebugInfo("Starting assessment creation...")

      // Create assessment in database first
      console.log("📝 Creating assessment in database...")
      setDebugInfo("Creating assessment in database...")

      newAssessment = await createAssessment({
        vendorName: inviteForm.vendorName,
        vendorEmail: inviteForm.vendorEmail,
        contactPerson: inviteForm.contactPerson,
        assessmentType: inviteForm.assessmentType,
        dueDate: inviteForm.dueDate,
        customMessage: inviteForm.customMessage,
      })

      console.log("✅ Assessment created successfully:", newAssessment)
      setDebugInfo("Assessment created successfully")

      // Generate assessment link
      const assessmentLink = generateAssessmentLink(newAssessment.id)
      console.log("🔗 Assessment link:", assessmentLink)

      // Try to send email (but don't fail the whole process if it doesn't work)
      console.log("📧 Attempting to send email...")
      setDebugInfo("Attempting to send email...")

      let emailSuccess = false
      let emailError = null

      try {
        const emailResult = await sendAssessmentEmail({
          vendorName: inviteForm.vendorName,
          vendorEmail: inviteForm.vendorEmail,
          contactPerson: inviteForm.contactPerson,
          assessmentType: inviteForm.assessmentType,
          dueDate: inviteForm.dueDate,
          customMessage: inviteForm.customMessage,
          assessmentId: newAssessment.id,
          companyName: "RiskShield AI",
        })

        emailSuccess = emailResult.success
        if (!emailSuccess) {
          emailError = emailResult.message
        }
        console.log("📧 Email result:", emailResult)
        setDebugInfo(`Email result: ${emailResult.success ? "Success" : emailResult.message}`)
      } catch (error) {
        console.error("📧 Email sending failed:", error)
        emailError = error instanceof Error ? error.message : "Unknown email error"
        setDebugInfo(`Email error: ${emailError}`)
      }

      // Refresh assessments list
      await loadAssessments()

      // Clear form
      setInviteForm({
        vendorName: "",
        vendorEmail: "",
        contactPerson: "",
        assessmentType: "",
        dueDate: "",
        customMessage: "",
      })
      setShowInviteForm(false)

      // ALWAYS show success since assessment was created
      if (emailSuccess) {
        alert(
          `✅ Assessment invitation sent successfully!

` +
            `📧 Email sent to: ${inviteForm.vendorEmail}
` +
            `📋 Assessment ID: ${newAssessment.id}

` +
            `🔗 Assessment link:
${assessmentLink}

` +
            `The vendor should receive the email shortly.`,
        )
      } else {
        // Show success message even if email failed
        alert(
          `✅ Assessment created successfully!

` +
            `📋 Assessment ID: ${newAssessment.id}
` +
            `📧 Vendor Email: ${inviteForm.vendorEmail}

` +
            `⚠️ Email delivery issue: ${emailError || "Email service not configured"}

` +
            `🔗 Please share this link manually:
${assessmentLink}

` +
            `The assessment is ready to be completed.`,
        )
      }
    } catch (error) {
      console.error("💥 Error in assessment creation process:", error)

      // If assessment was created but there was another error, still show partial success
      if (newAssessment) {
        const assessmentLink = generateAssessmentLink(newAssessment.id)
        alert(
          `⚠️ Assessment created but with issues

` +
            `📋 Assessment ID: ${newAssessment.id}
` +
            `🔗 Assessment link:
${assessmentLink}

` +
            `You can share this link manually with the vendor.`,
        )
      } else {
        // Only show error if assessment creation completely failed
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        setDebugInfo(`Creation failed: ${errorMessage}`)

        alert(
          `❌ Failed to create assessment

` +
            `Error Details: ${errorMessage}

` +
            `Please try again or contact support if the issue persists.`,
        )
      }
    }
  }

  const handleCopyAssessmentLink = (assessmentId: string) => {
    const link = generateAssessmentLink(assessmentId)
    navigator.clipboard.writeText(link)
    setCopiedLink(assessmentId)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) {
      return
    }

    try {
      await deleteAssessment(assessmentId)
      await loadAssessments() // Refresh the list
      alert("Assessment deleted successfully")
    } catch (error) {
      console.error("Error deleting assessment:", error)
      alert("Failed to delete assessment. Please try again.")
    }
  }

  const handleViewAssessmentDetails = (assessmentId: string) => {
    const assessment = assessments.find((a) => a.id === assessmentId)
    if (assessment) {
      setSelectedAssessment(assessment)
      setShowAssessmentDetails(true)
    }
  }

  const handlePreviewAssessmentForm = () => {
    const testUrl = `/vendor-assessment/demo-assessment-1?token=abc123xyz`
    window.open(testUrl, "_blank")
  }

  const getRiskLevelColorForModal = (level: string) => {
    const normalizedLevel = level?.toLowerCase() || "pending"
    switch (normalizedLevel) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      case "critical":
        return "text-red-800 bg-red-200"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const assessmentStats = {
    total: assessments.length,
    completed: assessments.filter((a) => a.status === "completed").length,
    pending: assessments.filter((a) => a.status === "pending").length,
    inProgress: assessments.filter((a) => a.status === "in_progress").length,
    overdue: assessments.filter((a) => a.status === "overdue").length,
  }

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Sign up to send real vendor assessments and manage your portfolio"
    >
      <div className="min-h-screen bg-white">
        <ThirdPartyAssessmentHero onSendInvitationClick={() => setShowInviteForm(true)} />
        <AssessmentStats stats={assessmentStats} />

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AssessmentFilters
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onForceRefresh={loadAssessments}
              isRefreshing={isRefreshing}
              onNewAssessmentClick={() => setShowInviteForm(true)}
            />

            <AssessmentList
              assessments={assessments}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              copiedLink={copiedLink}
              onCopyLink={handleCopyAssessmentLink}
              onViewDetails={handleViewAssessmentDetails}
              onDeleteAssessment={handleDeleteAssessment}
              onNewAssessmentClick={() => setShowInviteForm(true)}
            />
          </div>
        </section>

        <InviteAssessmentModal
          isOpen={showInviteForm}
          onClose={() => setShowInviteForm(false)}
          onSubmit={handleSendInvite}
          form={inviteForm}
          onFormChange={handleInviteFormChange}
          assessmentTypes={ASSESSMENT_TYPES}
          onPreviewAssessment={handlePreviewAssessmentForm}
        />

        <AssessmentDetailsModal
          isOpen={showAssessmentDetails}
          onClose={() => setShowAssessmentDetails(false)}
          assessment={selectedAssessment}
          getRiskLevelColor={getRiskLevelColorForModal}
        />

        {/* Removed: <AppFooter /> */}
      </div>
    </AuthGuard>
  )
}