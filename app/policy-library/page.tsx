"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { MainNavigation } from "@/components/main-navigation"
import { useAuth } from "@/components/auth-context" // Import useAuth

// Mock data for saved policies
const mockPolicies = [
  {
    id: "1",
    title: "Cybersecurity Policy",
    companyName: "First National Bank",
    institutionType: "Community Bank",
    status: "approved",
    approvedBy: "John Smith",
    approverRole: "Chief Information Security Officer (CISO)",
    createdDate: "2024-01-15",
    approvedDate: "2024-01-16",
    nextReviewDate: "2025-01-16",
    version: "1.0",
    description: "Comprehensive cybersecurity framework including data protection and incident response.",
  },
  {
    id: "2",
    title: "Regulatory Compliance Policy",
    companyName: "Community Credit Union",
    institutionType: "Credit Union",
    status: "draft",
    createdDate: "2024-01-20",
    version: "0.1",
    description: "FDIC and regulatory compliance policies tailored to credit union operations.",
  },
  {
    id: "3",
    title: "Third-Party Risk Management",
    companyName: "First National Bank",
    institutionType: "Community Bank",
    status: "approved",
    approvedBy: "Sarah Johnson",
    approverRole: "Chief Risk Officer (CRO)",
    createdDate: "2024-01-10",
    approvedDate: "2024-01-12",
    nextReviewDate: "2025-01-12",
    version: "2.1",
    description: "Vendor management and third-party risk assessment framework.",
  },
  {
    id: "4",
    title: "Business Continuity Plan",
    companyName: "TechFin Solutions",
    institutionType: "Fintech Company",
    status: "pending_review",
    createdDate: "2024-01-22",
    version: "1.0",
    description: "Disaster recovery and business continuity planning procedures.",
  },
  {
    id: "5",
    title: "Privacy & Data Protection Policy",
    companyName: "Regional Investment Group",
    institutionType: "Investment Firm",
    status: "approved",
    approvedBy: "Michael Chen",
    approverRole: "Chief Compliance Officer (CCO)",
    createdDate: "2024-01-05",
    approvedDate: "2024-01-08",
    nextReviewDate: "2025-01-08",
    version: "1.2",
    description: "Customer privacy protection policies compliant with federal regulations.",
  },
  {
    id: "6",
    title: "Operational Risk Policy",
    companyName: "Community Credit Union",
    institutionType: "Credit Union",
    status: "expired",
    approvedBy: "Lisa Davis",
    approverRole: "President",
    createdDate: "2023-06-15",
    approvedDate: "2023-06-18",
    nextReviewDate: "2024-06-18",
    version: "1.0",
    description: "Internal controls and operational risk management framework.",
  },
]

export default function PolicyLibrary() {
  const { user, signOut } = useAuth()
  const [policies, setPolicies] = useState(mockPolicies)
  const [filteredPolicies, setFilteredPolicies] = useState(mockPolicies)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Check preview mode and show sample data
  useEffect(() => {
    // Rely on the user object from useAuth
    setIsPreviewMode(!user)

    if (!user) {
      // Show sample policies for preview
      setPolicies(mockPolicies.slice(0, 3)) // Show only first 3 as preview
    }
  }, [user])

  // Filter policies based on search and status
  useEffect(() => {
    let filtered = policies

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (policy) =>
          policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((policy) => policy.status === statusFilter)
    }

    setFilteredPolicies(filtered)
  }, [searchTerm, statusFilter, policies])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "draft":
        return <Edit3 className="h-4 w-4 text-gray-600" />
      case "pending_review":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "expired":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy)
    setShowPolicyModal(true)
  }

  const handleDownloadPolicy = (policy: any) => {
    if (isPreviewMode) {
      alert("Preview Mode: Sign up to download and manage your actual policies.")
      return
    }
    // Mock download functionality
    alert(`Downloading ${policy.title} for ${policy.companyName}`)
  }

  const handleDeletePolicy = (policyId: string) => {
    if (isPreviewMode) {
      alert("Preview Mode: Sign up to manage your actual policy library.")
      return
    }
    if (confirm("Are you sure you want to delete this policy? This action cannot be undone.")) {
      setPolicies(policies.filter((p) => p.id !== policyId))
    }
  }

  const getPolicyStats = () => {
    const total = policies.length
    const approved = policies.filter((p) => p.status === "approved").length
    const drafts = policies.filter((p) => p.status === "draft").length
    const expired = policies.filter((p) => p.status === "expired").length
    const pendingReview = policies.filter((p) => p.status === "pending_review").length

    return { total, approved, drafts, expired, pendingReview }
  }

  const stats = getPolicyStats()

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Viewing sample policies. Sign up to create and manage your policy library."
    >
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <MainNavigation onSignOut={signOut} />

        {/* Rest of the page content remains exactly the same... */}
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Policy Management</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Policy Library
                <br />
                <span className="text-blue-600">Manage Your Saved Policies</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Access, review, and manage all your organization's policies in one centralized location. Track approval
                status, review dates, and maintain compliance documentation.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href="/policy-generator">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Policy
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Policies</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-sm text-gray-600 mt-1">Approved</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-600">{stats.drafts}</div>
                  <div className="text-sm text-gray-600 mt-1">Drafts</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</div>
                  <div className="text-sm text-gray-600 mt-1">Pending Review</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-600">{stats.expired}</div>
                  <div className="text-sm text-gray-600 mt-1">Expired</div>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search policies..."
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
                      <option value="approved">Approved</option>
                      <option value="draft">Draft</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolicies.map((policy) => (
                <Card key={policy.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(policy.status)}
                        <CardTitle className="text-lg">{policy.title}</CardTitle>
                      </div>
                      {getStatusBadge(policy.status)}
                    </div>
                    <CardDescription className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{policy.companyName}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{policy.description}</p>

                    <div className="space-y-2 text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {new Date(policy.createdDate).toLocaleDateString()}</span>
                      </div>
                      {policy.approvedDate && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3" />
                          <span>Approved: {new Date(policy.approvedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {policy.nextReviewDate && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>Review Due: {new Date(policy.nextReviewDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {policy.approvedBy && (
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>
                            Approved by: {policy.approvedBy} ({policy.approverRole})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        v{policy.version}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewPolicy(policy)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadPolicy(policy)}>
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePolicy(policy.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPolicies.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first policy."}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href="/policy-generator">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Policy
                  </a>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Policy Modal */}
        {showPolicyModal && selectedPolicy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPolicy.title}</h2>
                    <p className="text-gray-600">{selectedPolicy.companyName}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(selectedPolicy.status)}
                    <Button variant="outline" onClick={() => setShowPolicyModal(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Policy Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Institution Type:</span> {selectedPolicy.institutionType}
                      </div>
                      <div>
                        <span className="text-gray-600">Version:</span> {selectedPolicy.version}
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>{" "}
                        {new Date(selectedPolicy.createdDate).toLocaleDateString()}
                      </div>
                      {selectedPolicy.nextReviewDate && (
                        <div>
                          <span className="text-gray-600">Next Review:</span>{" "}
                          {new Date(selectedPolicy.nextReviewDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedPolicy.approvedBy && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Approval Information</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Approved by:</span> {selectedPolicy.approvedBy}
                        </div>
                        <div>
                          <span className="text-gray-600">Role:</span> {selectedPolicy.approverRole}
                        </div>
                        <div>
                          <span className="text-gray-600">Approved on:</span>{" "}
                          {new Date(selectedPolicy.approvedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedPolicy.description}</p>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button
                    onClick={() => handleDownloadPolicy(selectedPolicy)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Policy
                  </Button>
                  <Button variant="outline">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Policy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <span className="text-lg font-bold">RiskShield AI</span>
                </div>
                <p className="text-gray-400 text-sm">
                  AI-powered risk assessment platform helping financial institutions maintain compliance and mitigate
                  risks.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Risk Assessment
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Compliance Monitoring
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Policy Generator
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Policy Library
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Status Page
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 RiskShield AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}