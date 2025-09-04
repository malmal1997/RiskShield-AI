"use client"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainNavigation } from "@/components/main-navigation"
import { AppFooter } from "@/components/app-footer" // Added AppFooter import
import { Send, Users, Plus, Eye, Download, CheckCircle, Copy, Trash2, Building, RefreshCw, Info } from "lucide-react"
import { sendAssessmentEmail } from "./email-service"
import { getAssessments, createAssessment, deleteAssessment } from "@/lib/assessment-service"
import type { Assessment } from "@/lib/supabase"
import { AuthGuard } from "@/components/auth-guard"

// Simple demo session setup
// Removed setupDemoSession function as it was causing automatic sign-in.

export default function ThirdPartyAssessment() {
  // Add a preview mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check if user is in preview mode
  useEffect(() => {
    const storedSession = localStorage.getItem("demo_session")
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession)
        setUserEmail(sessionData.user?.email || null)
      } catch (error) {
        console.error("Error parsing demo session:", error)
        setUserEmail(null)
      }
    } else {
      setUserEmail(null)
    }

    const hasAuth = localStorage.getItem("demo_session") || userEmail
    setIsPreviewMode(!hasAuth)
  }, [userEmail])

  // Set up demo session immediately
  useEffect(() => {
    // Removed the call to setupDemoSession() here.
  }, [])

  const assessmentTypes = [
    "Cybersecurity Assessment",
    "Data Privacy Assessment",
    "Infrastructure Security",
    "Financial Services Assessment",
    "Operational Risk Assessment",
    "Compliance Assessment",
    "Business Continuity Assessment",
  ]

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
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>("")

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
        vendorName: assessment.vendor_name,
        vendorEmail: assessment.vendor_email,
        contactPerson: assessment.contact_person,
        assessmentType: assessment.assessment_type,
        status: assessment.status,
        sentDate: assessment.sent_date,
        completedDate: assessment.completed_date,
        dueDate: assessment.due_date,
        riskScore: assessment.risk_score,
        riskLevel: assessment.risk_level || "pending",
        companySize: assessment.company_size,
        customMessage: assessment.custom_message,
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

  // Modify handleSendInvite to show preview limitation
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

    let newAssessment = null

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

  const generateAssessmentLink = (assessmentId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    return `${baseUrl}/vendor-assessment/${assessmentId}?token=abc123xyz`
  }

  const copyAssessmentLink = (assessmentId: string) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRiskLevelColor = (level: string) => {
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

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.vendorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.assessmentType?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getAssessmentStats = () => {
    const total = assessments.length
    const completed = assessments.filter((a) => a.status === "completed").length
    const pending = assessments.filter((a) => a.status === "pending").length
    const inProgress = assessments.filter((a) => a.status === "in_progress").length
    const overdue = assessments.filter((a) => a.status === "overdue").length

    return { total, completed, pending, inProgress, overdue }
  }

  const stats = getAssessmentStats()

  const viewAssessmentDetails = (assessmentId: string) => {
    const assessment = assessments.find((a) => a.id === assessmentId)
    if (assessment) {
      setSelectedAssessment(assessment)
      setShowAssessmentDetails(true)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("demo_session")
    window.location.href = "/"
  }

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Sign up to send real vendor assessments and manage your portfolio"
    >
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <MainNavigation userEmail="demo@riskshield.ai" onSignOut={handleSignOut} />

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Vendor Risk Management</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Third-Party Assessment
                <br />
                <span className="text-blue-600">Vendor Risk Evaluation</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Send secure assessment invitations to your vendors and third-party partners. Evaluate their risk posture
                and compliance status through comprehensive questionnaires.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowInviteForm(true)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Assessment Invitation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Assessments</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-gray-600 mt-1">Completed</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
                  <div className="text-sm text-gray-600 mt-1">In Progress</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600 mt-1">Pending</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
                  <div className="text-sm text-gray-600 mt-1">Overdue</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Search and Filter */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search vendors or assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      setIsRefreshing(true)
                      setDebugInfo("Force refreshing...")
                      await loadAssessments()
                      console.log("🔄 Force refreshing assessment data...")
                    }}
                    disabled={isRefreshing}
                    title="Force refresh all assessment data"
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    {isRefreshing ? "Refreshing..." : "Force Refresh"}
                  </Button>
                  <Button onClick={() => setShowInviteForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    New Assessment
                  </Button>
                </div>
              </div>
            </div>

            {/* Assessments List */}
            <div className="space-y-4">
              {filteredAssessments.map((assessment) => (
                <Card key={assessment.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Building className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{assessment.vendorName}</h3>
                          <p className="text-sm text-gray-600">{assessment.vendorEmail}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            {getStatusBadge(assessment.status)}
                            <span className="text-sm text-gray-500">{assessment.assessmentType}</span>
                            {assessment.riskLevel && assessment.riskLevel !== "pending" && (
                              <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                                {assessment.riskLevel} Risk
                              </Badge>
                            )}
                            {assessment.responses && <Badge className="bg-blue-100 text-blue-800">Has Data</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            <div>
                              Sent: {assessment.sentDate ? new Date(assessment.sentDate).toLocaleDateString() : "N/A"}
                            </div>
                            {assessment.dueDate && <div>Due: {new Date(assessment.dueDate).toLocaleDateString()}</div>}
                            {assessment.completedDate && (
                              <div>Completed: {new Date(assessment.completedDate).toLocaleDateString()}</div>
                            )}
                          </div>
                          {assessment.riskScore && (
                            <div className="text-lg font-semibold text-gray-900 mt-1">{assessment.riskScore}/100</div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyAssessmentLink(assessment.id)}
                            title="Copy assessment link"
                          >
                            {copiedLink === assessment.id ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="View details"
                            onClick={() => viewAssessmentDetails(assessment.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="Download report">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            title="Delete assessment"
                            onClick={() => handleDeleteAssessment(assessment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAssessments.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by sending your first vendor assessment invitation."}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowInviteForm(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send First Assessment
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Invite Form Modal */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Send Assessment Invitation</h2>
                  <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                    ×
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendorName">Vendor Company Name *</Label>
                    <Input
                      id="vendorName"
                      value={inviteForm.vendorName}
                      onChange={(e) => setInviteForm({ ...inviteForm, vendorName: e.target.value })}
                      placeholder="Enter vendor company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={inviteForm.contactPerson}
                      onChange={(e) => setInviteForm({ ...inviteForm, contactPerson: e.target.value })}
                      placeholder="Contact person name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="vendorEmail">Vendor Email Address *</Label>
                  <Input
                    id="vendorEmail"
                    type="email"
                    value={inviteForm.vendorEmail}
                    onChange={(e) => setInviteForm({ ...inviteForm, vendorEmail: e.target.value })}
                    placeholder="vendor@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assessmentType">Assessment Type *</Label>
                    <select
                      id="assessmentType"
                      value={inviteForm.assessmentType}
                      onChange={(e) => setInviteForm({ ...inviteForm, assessmentType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select assessment type</option>
                      {assessmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={inviteForm.dueDate}
                      onChange={(e) => setInviteForm({ ...inviteForm, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                  <Textarea
                    id="customMessage"
                    value={inviteForm.customMessage}
                    onChange={(e) => setInviteForm({ ...inviteForm, customMessage: e.target.value })}
                    placeholder="Add a custom message for the vendor..."
                    rows={4}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>The vendor will receive an email with a secure assessment link</li>
                    <li>They can complete the assessment at their convenience</li>
                    <li>You'll receive notifications when the assessment is completed</li>
                    <li>Risk scores and reports will be automatically generated</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 text-center">
                    ⚠️ RiskShield AI may make mistakes. Please use with discretion.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendInvite} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const testUrl = `/vendor-assessment/demo-assessment-1?token=abc123xyz`
                      window.open(testUrl, "_blank")
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Assessment Form
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Details Modal */}
        {showAssessmentDetails && selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Assessment Results</h2>
                    <p className="text-gray-600">
                      {selectedAssessment.vendorName} - {selectedAssessment.assessmentType}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setShowAssessmentDetails(false)}>
                    ×
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Show if this has real data */}
                {selectedAssessment.responses && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Assessment Completed</h3>
                    <p className="text-sm text-green-800">
                      This assessment was completed on{" "}
                      {new Date(selectedAssessment.responses.submitted_at).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Support Reference */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="mr-2 h-5 w-5" />
                      Support Reference
                    </CardTitle>
                    <CardDescription>
                      Use this ID if you need to contact support regarding this assessment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-800">{selectedAssessment.id}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedAssessment.id)
                          alert("Assessment ID copied to clipboard!")
                        }}
                      >
                        Copy ID
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Score Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Risk Assessment Summary</h3>
                      <div className="flex items-center space-x-4">
                        <Badge className={getRiskLevelColor(selectedAssessment.riskLevel)}>
                          {selectedAssessment.riskLevel} Risk
                        </Badge>
                        {selectedAssessment.riskScore && (
                          <div className="text-2xl font-bold text-gray-900">{selectedAssessment.riskScore}/100</div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Completed Date</p>
                        <p className="font-medium">
                          {selectedAssessment.completedDate
                            ? new Date(selectedAssessment.completedDate).toLocaleDateString()
                            : "Not completed"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Assessment Type</p>
                        <p className="font-medium">{selectedAssessment.assessmentType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact Person</p>
                        <p className="font-medium">{selectedAssessment.contactPerson || "Not provided"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vendor Information */}
                {selectedAssessment.responses && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Vendor Name</p>
                          <p className="font-medium">{selectedAssessment.vendorName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact Person</p>
                          <p className="font-medium">{selectedAssessment.contactPerson || "Not provided"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Assessment Responses */}
                {selectedAssessment.responses && selectedAssessment.assessmentAnswers && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Assessment Responses</h3>
                      <div className="space-y-4">
                        {Object.entries(selectedAssessment.assessmentAnswers).map(([questionId, answer]) => (
                          <div key={questionId} className="border-b border-gray-200 pb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {questionId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600">
                              {Array.isArray(answer) ? answer.join(", ") : answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <AppFooter />
      </div>
    </AuthGuard>
  )
}