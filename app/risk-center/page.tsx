"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Shield,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle,
  Send,
  Eye,
  Phone,
  Mail,
  Download,
  AlertCircle,
  XCircle,
  Building,
  ArrowLeft, // Added ArrowLeft for back button
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

interface RiskItem {
  id: string
  vendorName: string
  contactPerson: string
  contactEmail: string
  contactPhone?: string
  riskLevel: string
  riskScore: number
  lastAssessment: string
  nextDue: string
  status: string
  issues: string[]
  industry: string
  criticality: string
}

interface OverdueAssessment {
  id: string
  vendorName: string
  contactPerson: string
  contactEmail: string
  assessmentType: string
  dueDate: string
  daysPastDue: number
  lastContact: string
  status: string
}

interface PendingReview {
  id: string
  vendorName: string
  assessmentType: string
  submittedDate: string
  riskScore: number
  riskLevel: string
  reviewer: string
  priority: string
  keyFindings: string[]
}

export default function RiskCenterPage() {
  return (
    <AuthGuard>
      <RiskCenterContent />
    </AuthGuard>
  )
}

function RiskCenterContent() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState("high-risk")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data for high-risk vendors
  const highRiskVendors: RiskItem[] = [
    {
      id: "1",
      vendorName: "TechCorp Solutions",
      contactPerson: "John Smith",
      contactEmail: "john.smith@techcorp.com",
      contactPhone: "+1 (555) 123-4567",
      riskLevel: "critical",
      riskScore: 35,
      lastAssessment: "2024-01-15",
      nextDue: "2024-07-15",
      status: "action_required",
      issues: ["No cyber insurance", "Outdated security policies", "Failed SOC 2 audit"],
      industry: "Technology",
      criticality: "high",
    },
    {
      id: "2",
      vendorName: "DataFlow Analytics",
      contactPerson: "Sarah Johnson",
      contactEmail: "sarah.johnson@dataflow.com",
      riskLevel: "high",
      riskScore: 45,
      lastAssessment: "2024-01-20",
      nextDue: "2024-08-20",
      status: "monitoring",
      issues: ["Limited backup procedures", "No incident response plan"],
      industry: "Data Analytics",
      criticality: "medium",
    },
  ]

  // Mock data for overdue assessments
  const overdueAssessments: OverdueAssessment[] = [
    {
      id: "1",
      vendorName: "SecureNet Services",
      contactPerson: "Michael Chen",
      contactEmail: "michael.chen@securenet.com",
      assessmentType: "Annual Security Review",
      dueDate: "2024-01-01",
      daysPastDue: 19,
      lastContact: "2024-01-10",
      status: "no_response",
    },
    {
      id: "2",
      vendorName: "CloudHost Pro",
      contactPerson: "Lisa Davis",
      contactEmail: "lisa.davis@cloudhost.com",
      assessmentType: "Quarterly Risk Assessment",
      dueDate: "2024-01-05",
      daysPastDue: 15,
      lastContact: "2024-01-12",
      status: "in_progress",
    },
  ]

  // Mock data for pending reviews
  const pendingReviews: PendingReview[] = [
    {
      id: "1",
      vendorName: "FinTech Solutions",
      assessmentType: "Cybersecurity Assessment",
      submittedDate: "2024-01-18",
      riskScore: 78,
      riskLevel: "medium",
      reviewer: "Risk Team",
      priority: "high",
      keyFindings: ["Strong encryption", "Good access controls", "Minor policy gaps"],
    },
    {
      id: "2",
      vendorName: "Payment Gateway Inc",
      assessmentType: "PCI DSS Compliance",
      submittedDate: "2024-01-17",
      riskScore: 85,
      riskLevel: "low",
      reviewer: "Compliance Team",
      priority: "medium",
      keyFindings: ["PCI compliant", "Regular audits", "Strong controls"],
    },
  ]

  const handleSendReminder = (vendor: any) => {
    alert(`Reminder sent to ${vendor.contactEmail}`)
  }

  const handleEscalate = (vendor: any) => {
    alert(`Escalation initiated for ${vendor.vendorName}`)
  }

  const handleApproveReview = (review: PendingReview) => {
    alert(`Assessment approved for ${review.vendorName}`)
  }

  const handleRejectReview = (review: PendingReview) => {
    alert(`Assessment rejected for ${review.vendorName} - requesting additional information`)
  }

  const handleCreateAction = (vendor: RiskItem) => {
    alert(`Action plan created for ${vendor.vendorName}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Adjusted to be part of main content */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <span className="text-gray-400">→</span>
              <span className="text-gray-600 font-medium">Risk Management Center</span>
            </div>
          </div>
          <div className="text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">Action Required</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Risk Management Center
              <br />
              <span className="text-blue-600">Take Action on Critical Items</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Manage high-risk vendors, follow up on overdue assessments, and review completed evaluations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High-Risk Vendors</p>
                    <p className="text-3xl font-bold text-red-600">{highRiskVendors.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Assessments</p>
                    <p className="text-3xl font-bold text-orange-600">{overdueAssessments.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Need follow-up</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                    <p className="text-3xl font-bold text-blue-600">{pendingReviews.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Actions Completed</p>
                    <p className="text-3xl font-bold text-green-600">24</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="high-risk" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>High-Risk Vendors</span>
              </TabsTrigger>
              <TabsTrigger value="overdue" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Overdue Assessments</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Pending Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Action Plans</span>
              </TabsTrigger>
            </TabsList>

            {/* High-Risk Vendors Tab */}
            <TabsContent value="high-risk">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span>High-Risk Vendors Requiring Action</span>
                      </CardTitle>
                      <CardDescription>Vendors with critical risk scores that need immediate attention</CardDescription>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Download className="mr-2 h-4 w-4" />
                      Export Risk Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {highRiskVendors.map((vendor) => (
                      <div key={vendor.id} className="border border-red-200 rounded-lg p-6 bg-red-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-red-100 text-red-600">
                                {vendor.vendorName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{vendor.vendorName}</h3>
                                <Badge className="bg-red-100 text-red-800">
                                  {vendor.riskLevel} Risk - Score: {vendor.riskScore}
                                </Badge>
                                <Badge variant="outline">{vendor.industry}</Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600">Contact: {vendor.contactPerson}</p>
                                  <p className="text-sm text-gray-600">Email: {vendor.contactEmail}</p>
                                  {vendor.contactPhone && (
                                    <p className="text-sm text-gray-600">Phone: {vendor.contactPhone}</p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Last Assessment: {new Date(vendor.lastAssessment).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Next Due: {new Date(vendor.nextDue).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-600">Criticality: {vendor.criticality}</p>
                                </div>
                              </div>
                              <div className="mb-4">
                                <p className="text-sm font-medium text-gray-900 mb-2">Critical Issues:</p>
                                <div className="flex flex-wrap gap-2">
                                  {vendor.issues.map((issue, index) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                      {issue}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-red-200">
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleCreateAction(vendor)}
                          >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Create Action Plan
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSendReminder(vendor)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Vendor
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEscalate(vendor)}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Escalate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Overdue Assessments Tab */}
            <TabsContent value="overdue">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <span>Overdue Assessments</span>
                      </CardTitle>
                      <CardDescription>Vendors who haven't completed their required assessments</CardDescription>
                    </div>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Send className="mr-2 h-4 w-4" />
                      Send Bulk Reminders
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overdueAssessments.map((assessment) => (
                      <div key={assessment.id} className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Building className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{assessment.vendorName}</h3>
                              <p className="text-sm text-gray-600">{assessment.assessmentType}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge className="bg-orange-100 text-orange-800">
                                  {assessment.daysPastDue} days overdue
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Due: {new Date(assessment.dueDate).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Last Contact: {new Date(assessment.lastContact).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" onClick={() => handleSendReminder(assessment)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Reminder
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="mr-2 h-4 w-4" />
                              Call Vendor
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEscalate(assessment)}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Escalate
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pending Reviews Tab */}
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span>Pending Reviews</span>
                      </CardTitle>
                      <CardDescription>Completed assessments awaiting your review and approval</CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Bulk Approve
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pendingReviews.map((review) => (
                      <div key={review.id} className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">{review.vendorName}</h3>
                              <Badge className="bg-blue-100 text-blue-800">
                                {review.riskLevel} Risk - Score: {review.riskScore}
                              </Badge>
                              <Badge variant="outline">{review.assessmentType}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Submitted: {new Date(review.submittedDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600">Assigned to: {review.reviewer}</p>
                                <p className="text-sm text-gray-600">Priority: {review.priority}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 mb-2">Key Findings:</p>
                                <div className="space-y-1">
                                  {review.keyFindings.map((finding, index) => (
                                    <p key={index} className="text-sm text-gray-600">
                                      • {finding}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 pt-4 border-t border-blue-200">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveReview(review)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleRejectReview(review)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Request Changes
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Full Report
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Action Plans Tab */}
            <TabsContent value="actions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Action Plans & Remediation</span>
                  </CardTitle>
                  <CardDescription>Track progress on vendor risk remediation efforts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Action Plan Management</h3>
                    <p className="text-gray-600 mb-6">
                      Create and track remediation plans for high-risk vendors and compliance issues.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Create Action Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}