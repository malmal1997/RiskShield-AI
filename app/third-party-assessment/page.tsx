"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, Users, Plus, Eye, Download, CheckCircle, Copy, Trash2, Building, RefreshCw, Shield, ArrowLeft } from "lucide-react"
import { getAssessments, createAssessment, deleteAssessment } from "@/lib/assessment-service"
import type { Assessment, AssessmentResponse } from "@/lib/supabase"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"
import { sendAssessmentEmail } from "./email-service"

// Define a UI-specific interface for assessments to handle transformed data
interface UIAssessment extends Omit<Assessment, 'vendor_name' | 'vendor_email' | 'contact_person' | 'assessment_type' | 'sent_date' | 'completed_date' | 'due_date' | 'risk_score' | 'risk_level' | 'custom_message'> {
  vendorName: string;
  vendorEmail: string;
  contactPerson?: string | null; // Allow null or undefined
  assessmentType: string;
  sentDate: string;
  completedDate?: string | null; // Allow null or undefined
  dueDate?: string | null; // Allow null or undefined
  riskScore?: number | null;
  riskLevel?: string | null;
  customMessage?: string | null;
  responses?: {
    id: number;
    vendor_info: {
      companyName: string;
      contactName: string;
      email: string;
      phone?: string;
      website?: string;
      employeeCount?: string;
      industry?: string;
      description?: string;
    };
    answers: Record<string, any>;
    submitted_at: string;
  } | null;
  completedVendorInfo?: {
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    website?: string;
    employeeCount?: string;
    industry?: string;
    description?: string;
  } | null;
  assessmentAnswers?: Record<string, any> | null;
}

export default function ThirdPartyAssessment() {
  const { user, isDemo } = useAuth()
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Check if user is in preview mode
  useEffect(() => {
    setIsPreviewMode(isDemo)
  }, [isDemo])

  const assessmentTypes = [
    "Cybersecurity Assessment",
    "Data Privacy Assessment",
    "Infrastructure Security",
    "Financial Services Assessment",
    "Operational Risk Assessment",
    "Compliance Assessment",
    "Business Continuity Assessment",
  ]

  const [assessments, setAssessments] = useState<UIAssessment[]>([])
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
  const [selectedAssessment, setSelectedAssessment] = useState<UIAssessment | null>(null)
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

      const data: Assessment[] = await getAssessments()
      console.log("📋 Raw assessment data:", data)

      // Transform data to match our component expectations
      const transformedData: UIAssessment[] = data.map((assessment: Assessment) => ({
        ...assessment, // Copy all original properties
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
        customMessage: assessment.custom_message,
        responses: (assessment as any).assessment_responses?.[0] || null, // Access nested responses
        completedVendorInfo: (assessment as any).assessment_responses?.[0]?.vendor_info || null,
        assessmentAnswers: (assessment as any).assessment_responses?.[0]?.answers || null,
      }));

      console.log("✅ Transformed assessment data:", transformedData)
      setAssessments(transformedData)
      setDebugInfo(`Successfully loaded ${transformedData.length} assessments`)
      console.log(`✅ Successfully loaded ${transformedData.length} assessments`)
    } catch (error: any) {
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
    if (!isPreviewMode) { // Only load real data if not in preview mode
      loadAssessments()
    } else {
      // For preview mode, show some mock data
      setAssessments([
        {
          id: "demo-assessment-1",
          user_id: "demo-user-id", // Added for UIAssessment
          organization_id: "demo-org-id", // Added for UIAssessment
          company_size: "11-50 employees", // Added for UIAssessment
          vendorName: "MockCorp Solutions",
          vendorEmail: "mock@mockcorp.com",
          contactPerson: "Jane Doe",
          assessmentType: "Cybersecurity Assessment",
          status: "pending",
          sentDate: "2024-01-15T10:00:00Z",
          dueDate: "2024-02-15T23:59:59Z",
          riskScore: null, // Changed to null
          riskLevel: "pending",
          customMessage: "This is a mock assessment for demo purposes.",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          responses: null,
          completedVendorInfo: null,
          assessmentAnswers: null,
        },
        {
          id: "demo-assessment-2",
          user_id: "demo-user-id", // Added for UIAssessment
          organization_id: "demo-org-id", // Added for UIAssessment
          company_size: "51-200 employees", // Added for UIAssessment
          vendorName: "Preview Analytics",
          vendorEmail: "preview@example.com",
          contactPerson: "John Smith",
          assessmentType: "Data Privacy Assessment",
          status: "completed",
          sentDate: "2024-01-20T10:00:00Z",
          dueDate: "2024-02-20T23:59:59Z",
          riskScore: 75,
          riskLevel: "medium",
          customMessage: "This assessment is completed in demo mode.",
          created_at: "2024-01-20T10:00:00Z",
          updated_at: "2024-01-25T10:00:00Z",
          responses: {
            id: 101,
            vendor_info: {
              companyName: "Preview Analytics",
              contactName: "John Smith",
              email: "john.smith@preview.com",
            },
            answers: {
              privacy_1: ["Names and contact information"],
              privacy_2: ["GDPR"],
              privacy_3: "We have strict data processing policies.",
            },
            submitted_at: "2024-01-25T09:00:00Z",
          },
          completedVendorInfo: {
            companyName: "Preview Analytics",
            contactName: "John Smith",
            email: "john.smith@preview.com",
          },
          assessmentAnswers: {
            privacy_1: ["Names and contact information"],
            privacy_2: ["GDPR"],
            privacy_3: "We have strict data processing policies.",
          },
        },
      ]);
      setIsLoading(false);
    }
  }, [isPreviewMode])

  const handleInviteFormChange = (field: keyof typeof inviteForm, value: string) => {
    setInviteForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSendInvite = async () => {
    if (isPreviewMode) {
      alert("Preview Mode: Sign up to send real assessment invites.")
      setShowInviteForm(false)
      return
    }

    if (!inviteForm.vendorName || !inviteForm.vendorEmail || !inviteForm.assessmentType) {
      alert("Please fill in all required fields (Vendor Name, Vendor Email, Assessment Type).")
      return
    }

    setIsRefreshing(true)
    try {
      const newAssessment = await createAssessment({
        vendorName: inviteForm.vendorName,
        vendorEmail: inviteForm.vendorEmail,
        contactPerson: inviteForm.contactPerson,
        assessmentType: inviteForm.assessmentType,
        dueDate: inviteForm.dueDate || undefined,
        customMessage: inviteForm.customMessage || undefined,
      })

      if (newAssessment) {
        const emailResult = await sendAssessmentEmail({
          vendorName: newAssessment.vendor_name,
          vendorEmail: newAssessment.vendor_email,
          contactPerson: newAssessment.contact_person || "",
          assessmentType: newAssessment.assessment_type,
          dueDate: newAssessment.due_date || "",
          customMessage: newAssessment.custom_message || "",
          assessmentId: newAssessment.id,
          companyName: user?.email || "RiskShield AI", // Use user's email or a default
        })

        if (emailResult.success) {
          alert(emailResult.message)
          setCopiedLink(emailResult.assessmentLink || null)
        } else {
          alert(`Failed to send email: ${emailResult.message}`)
          setCopiedLink(emailResult.assessmentLink || null)
        }
      }

      setShowInviteForm(false)
      setInviteForm({
        vendorName: "",
        vendorEmail: "",
        contactPerson: "",
        assessmentType: "",
        dueDate: "",
        customMessage: "",
      })
      await loadAssessments() // Refresh the list
    } catch (error) {
      console.error("Error sending invite:", error)
      alert("Failed to send invite. Please try again.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert("Assessment link copied to clipboard!")
    setCopiedLink(null) // Clear copied link after user acknowledges
  }

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (isPreviewMode) {
      alert("Preview Mode: Sign up to delete real assessments.")
      return
    }
    if (!confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      return
    }

    try {
      await deleteAssessment(assessmentId)
      alert("Assessment deleted successfully!")
      await loadAssessments() // Refresh the list
      setShowAssessmentDetails(false) // Close details if the deleted assessment was open
    } catch (error) {
      console.error("Error deleting assessment:", error)
      alert("Failed to delete assessment. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRiskLevelColor = (level: string | null | undefined) => {
    switch (level?.toLowerCase()) {
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
      assessment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.vendorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.assessmentType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Third-Party Assessments</h1>
                <p className="mt-2 text-gray-600">Manage your vendor risk assessments and track their status.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={loadAssessments} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowInviteForm(true)}>
                <Send className="mr-2 h-4 w-4" />
                Send New Assessment
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 mb-6">
            <strong>Debug:</strong> {debugInfo}
          </div>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessments List */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredAssessments.map((assessment: UIAssessment) => (
                <div
                  key={assessment.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedAssessment(assessment)
                    setShowAssessmentDetails(true)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{assessment.vendorName}</h3>
                        <p className="text-sm text-gray-600">{assessment.assessmentType}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          {getStatusBadge(assessment.status)}
                          {assessment.riskLevel && (
                            <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                              {assessment.riskLevel} Risk
                            </Badge>
                          )}
                          {assessment.riskScore !== null && (
                            <span className="text-sm text-gray-500">Score: {assessment.riskScore}/100</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Sent: {new Date(assessment.sentDate).toLocaleDateString()}
                      </p>
                      {assessment.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(assessment.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      {assessment.completedDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed: {new Date(assessment.completedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAssessments.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by sending your first third-party assessment."}
                </p>
                <Button onClick={() => setShowInviteForm(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send First Assessment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Send New Assessment</h2>
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <Label htmlFor="vendorName">Vendor/Company Name *</Label>
                <Input
                  id="vendorName"
                  placeholder="Acme Corp"
                  value={inviteForm.vendorName}
                  onChange={(e) => handleInviteFormChange("vendorName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vendorEmail">Vendor Contact Email *</Label>
                <Input
                  id="vendorEmail"
                  type="email"
                  placeholder="contact@acmecorp.com"
                  value={inviteForm.vendorEmail}
                  onChange={(e) => handleInviteFormChange("vendorEmail", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person (Optional)</Label>
                <Input
                  id="contactPerson"
                  placeholder="Jane Doe"
                  value={inviteForm.contactPerson}
                  onChange={(e) => handleInviteFormChange("contactPerson", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="assessmentType">Assessment Type *</Label>
                <select
                  id="assessmentType"
                  value={inviteForm.assessmentType}
                  onChange={(e) => handleInviteFormChange("assessmentType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an assessment type</option>
                  {assessmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                  <option value="Cybersecurity Assessment (AI-Powered)">Cybersecurity Assessment (AI-Powered)</option>
                  <option value="Data Privacy Assessment (AI-Powered)">Data Privacy Assessment (AI-Powered)</option>
                  <option value="SOC Compliance Assessment (AI-Powered)">SOC Compliance Assessment (AI-Powered)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={inviteForm.dueDate}
                  onChange={(e) => handleInviteFormChange("dueDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Add a personalized message for the vendor..."
                  value={inviteForm.customMessage}
                  onChange={(e) => handleInviteFormChange("customMessage", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendInvite} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Invite
                    </>
                  )}
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
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedAssessment.vendorName}</h2>
                    <p className="text-gray-600">{selectedAssessment.assessmentType}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      {getStatusBadge(selectedAssessment.status)}
                      {selectedAssessment.riskLevel && (
                        <Badge className={getRiskLevelColor(selectedAssessment.riskLevel)}>
                          {selectedAssessment.riskLevel} Risk
                        </Badge>
                      )}
                      {selectedAssessment.riskScore !== null && (
                        <span className="text-sm text-gray-500">Score: {selectedAssessment.riskScore}/100</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowAssessmentDetails(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessment Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>Vendor Email:</strong> {selectedAssessment.vendorEmail}
                    </p>
                    {selectedAssessment.contactPerson && (
                      <p>
                        <strong>Contact Person:</strong> {selectedAssessment.contactPerson}
                      </p>
                    )}
                    <p>
                      <strong>Sent Date:</strong> {new Date(selectedAssessment.sentDate).toLocaleDateString()}
                    </p>
                    {selectedAssessment.dueDate && (
                      <p>
                        <strong>Due Date:</strong> {new Date(selectedAssessment.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {selectedAssessment.completedDate && (
                      <p>
                        <strong>Completed Date:</strong> {new Date(selectedAssessment.completedDate).toLocaleDateString()}
                      </p>
                    )}
                    {selectedAssessment.customMessage && (
                      <p>
                        <strong>Message:</strong> {selectedAssessment.customMessage}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Responses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {selectedAssessment.status === "completed" && selectedAssessment.completedVendorInfo ? (
                      <>
                        <p>
                          <strong>Company:</strong> {selectedAssessment.completedVendorInfo.companyName}
                        </p>
                        <p>
                          <strong>Contact:</strong> {selectedAssessment.completedVendorInfo.contactName}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedAssessment.completedVendorInfo.email}
                        </p>
                        {selectedAssessment.completedVendorInfo.website && (
                          <p>
                            <strong>Website:</strong> {selectedAssessment.completedVendorInfo.website}
                          </p>
                        )}
                        {selectedAssessment.completedVendorInfo.industry && (
                          <p>
                            <strong>Industry:</strong> {selectedAssessment.completedVendorInfo.industry}
                          </p>
                        )}
                        <Button size="sm" className="mt-4 w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Report
                        </Button>
                      </>
                    ) : (
                      <p className="text-gray-600">Vendor has not yet completed the assessment.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAssessment(selectedAssessment.id)}
                  disabled={isRefreshing}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}