"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Building,
  Plus,
  Search,
  Filter,
  Edit,
  Mail,
  Phone,
  Globe,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  X,
  Trash2,
  ArrowLeft, // Added ArrowLeft for back button
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { getVendors, createVendor, updateVendor, deleteVendor, type Vendor } from "@/lib/vendor-service" // Import vendor service
import Link from "next/link"

export default function VendorsPage() {
  return (
    <AuthGuard>
      <VendorsContent />
    </AuthGuard>
  )
}

function VendorsContent() {
  const { user, profile, organization, isDemo } = useAuth()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showVendorDetails, setShowVendorDetails] = useState(false)
  const [newVendorForm, setNewVendorForm] = useState({
    name: "",
    email: "",
    website: "",
    industry: "",
    size: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    risk_level: "pending",
    status: "active",
    tags: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadVendors = async () => {
    try {
      if (isDemo) {
        // Mock data for demo mode
        setVendors([
          {
            id: "demo-1",
            user_id: "demo-user-id",
            organization_id: "demo-org-id",
            name: "MockCorp Solutions",
            email: "contact@mockcorp.com",
            website: "https://mockcorp.com",
            industry: "Technology",
            size: "201-500 employees",
            contact_person: "Jane Doe",
            contact_email: "jane.doe@mockcorp.com",
            contact_phone: "+1 (555) 111-2222",
            risk_level: "low",
            status: "active",
            tags: ["cloud-provider", "critical"],
            last_assessment_date: "2025-01-15T00:00:00Z",
            next_assessment_date: "2025-07-15T00:00:00Z",
            total_assessments: 3,
            completed_assessments: 3,
            average_risk_score: 85,
            created_at: "2024-06-01T00:00:00Z",
            updated_at: "2025-01-15T00:00:00Z",
          },
          {
            id: "demo-2",
            user_id: "demo-user-id",
            organization_id: "demo-org-id",
            name: "Preview Analytics",
            email: "info@preview.com",
            website: "https://preview.com",
            industry: "Data Analytics",
            size: "51-200 employees",
            contact_person: "John Smith",
            contact_email: "john.smith@preview.com",
            contact_phone: "+1 (555) 333-4444",
            risk_level: "medium",
            status: "under_review",
            tags: ["data-processing", "gdpr"],
            last_assessment_date: "2025-01-20T00:00:00Z",
            next_assessment_date: "2025-08-20T00:00:00Z",
            total_assessments: 2,
            completed_assessments: 1,
            average_risk_score: 72,
            created_at: "2024-08-15T00:00:00Z",
            updated_at: "2025-01-20T14:30:00Z",
          },
        ])
      } else {
        const fetchedVendors = await getVendors()
        setVendors(fetchedVendors)
      }
    } catch (error) {
      console.error("Error loading vendors:", error)
      alert("Failed to load vendors. Please try again.")
    }
  }

  useEffect(() => {
    loadVendors()
  }, [user, organization, isDemo])

  const handleNewVendorFormChange = (field: keyof typeof newVendorForm, value: string | string[]) => {
    setNewVendorForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddVendor = async () => {
    if (isDemo) {
      alert("Preview Mode: Sign up to add real vendors.")
      setShowAddVendor(false)
      return
    }

    if (!newVendorForm.name || !newVendorForm.email || !newVendorForm.industry || !newVendorForm.size || !newVendorForm.contact_person || !newVendorForm.contact_email) {
      alert("Please fill in all required fields (marked with *).")
      return
    }

    setIsSubmitting(true)
    try {
      await createVendor(newVendorForm)
      alert("Vendor added successfully!")
      setShowAddVendor(false)
      setNewVendorForm({
        name: "", email: "", website: "", industry: "", size: "", contact_person: "", contact_email: "", contact_phone: "", risk_level: "pending", status: "active", tags: []
      })
      await loadVendors() // Refresh the list
    } catch (error) {
      console.error("Error adding vendor:", error)
      alert("Failed to add vendor. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVendor = async (vendorId: string) => {
    if (isDemo) {
      alert("Preview Mode: Sign up to delete real vendors.")
      return
    }
    if (!confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) {
      return
    }

    try {
      await deleteVendor(vendorId)
      alert("Vendor deleted successfully!")
      await loadVendors() // Refresh the list
      setShowVendorDetails(false) // Close details if the deleted vendor was open
    } catch (error) {
      console.error("Error deleting vendor:", error)
      alert("Failed to delete vendor. Please try again.")
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "under_review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Review</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter
    const matchesRisk = riskFilter === "all" || vendor.risk_level === riskFilter

    return matchesSearch && matchesStatus && matchesRisk
  })

  const getVendorStats = () => {
    const total = vendors.length
    const active = vendors.filter((v) => v.status === "active").length
    const highRisk = vendors.filter((v) => v.risk_level === "high" || v.risk_level === "critical").length
    const avgRiskScore =
      vendors.length > 0 ? Math.round(vendors.reduce((sum, v) => sum + v.average_risk_score, 0) / vendors.length) : 0

    return { total, active, highRisk, avgRiskScore }
  }

  const stats = getVendorStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header - Integrated header content here */}
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
                <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
                <p className="mt-2 text-gray-600">Manage your vendor relationships and track their risk profiles.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Vendors
              </Button>
              <Button onClick={() => setShowAddVendor(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.highRisk}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgRiskScore}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search vendors..."
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
                    <option value="active">Active</option>
                    <option value="under_review">Under Review</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors List */}
        <Card>
          <CardHeader>
            <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
            <CardDescription>Manage your vendor relationships and track their compliance status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedVendor(vendor)
                    setShowVendorDetails(true)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {vendor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                        <p className="text-sm text-gray-600">
                          {vendor.industry} • {vendor.size}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          {getStatusBadge(vendor.status)}
                          <Badge className={getRiskLevelColor(vendor.risk_level)}>{vendor.risk_level} Risk</Badge>
                          <span className="text-sm text-gray-500">Score: {vendor.average_risk_score}/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">
                          {vendor.completed_assessments}/{vendor.total_assessments} assessments
                        </span>
                      </div>
                      <Progress
                        value={(vendor.completed_assessments / vendor.total_assessments) * 100}
                        className="w-32 h-2"
                      />
                      {vendor.next_assessment_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Next: {new Date(vendor.next_assessment_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {vendor.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-4">
                      {vendor.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredVendors.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all" || riskFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by adding your first vendor."}
                </p>
                <Button onClick={() => setShowAddVendor(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Vendor
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Vendor Modal */}
      {showAddVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Vendor</h2>
                <Button variant="outline" onClick={() => setShowAddVendor(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor_name">Vendor Name *</Label>
                  <Input
                    id="vendor_name"
                    placeholder="Enter vendor name"
                    value={newVendorForm.name}
                    onChange={(e) => handleNewVendorFormChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vendor_email">Email Address *</Label>
                  <Input
                    id="vendor_email"
                    type="email"
                    placeholder="vendor@company.com"
                    value={newVendorForm.email}
                    onChange={(e) => handleNewVendorFormChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor_industry">Industry *</Label>
                  <select
                    id="vendor_industry"
                    value={newVendorForm.industry}
                    onChange={(e) => handleNewVendorFormChange("industry", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="vendor_size">Company Size *</Label>
                  <select
                    id="vendor_size"
                    value={newVendorForm.size}
                    onChange={(e) => handleNewVendorFormChange("size", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select size</option>
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="500+ employees">500+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="vendor_website">Website</Label>
                <Input
                  id="vendor_website"
                  type="url"
                  placeholder="https://vendor.com"
                  value={newVendorForm.website}
                  onChange={(e) => handleNewVendorFormChange("website", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_person">Contact Person *</Label>
                  <Input
                    id="contact_person"
                    placeholder="John Smith"
                    value={newVendorForm.contact_person}
                    onChange={(e) => handleNewVendorFormChange("contact_person", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="john@vendor.com"
                    value={newVendorForm.contact_email}
                    onChange={(e) => handleNewVendorFormChange("contact_email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={newVendorForm.contact_phone}
                  onChange={(e) => handleNewVendorFormChange("contact_phone", e.target.value)}
                />
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setShowAddVendor(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVendor} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vendor
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Details Modal */}
      {showVendorDetails && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {selectedVendor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedVendor.name}</h2>
                    <p className="text-gray-600">
                      {selectedVendor.industry} • {selectedVendor.size}
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      {getStatusBadge(selectedVendor.status)}
                      <Badge className={getRiskLevelColor(selectedVendor.risk_level)}>
                        {selectedVendor.risk_level} Risk
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => setShowVendorDetails(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{selectedVendor.email}</span>
                        </div>
                        {selectedVendor.contact_phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedVendor.contact_phone}</span>
                          </div>
                        )}
                        {selectedVendor.website && (
                          <div className="flex items-center space-x-3">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <a
                              href={selectedVendor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {selectedVendor.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{selectedVendor.contact_person}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Risk Score</span>
                          <span className="text-2xl font-bold">{selectedVendor.average_risk_score}/100</span>
                        </div>
                        <Progress value={selectedVendor.average_risk_score} className="h-3" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Assessments Completed</span>
                          <span className="font-medium">
                            {selectedVendor.completed_assessments}/{selectedVendor.total_assessments}
                          </span>
                        </div>
                        {selectedVendor.last_assessment_date && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Last Assessment</span>
                            <span className="font-medium">
                              {new Date(selectedVendor.last_assessment_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {selectedVendor.tags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedVendor.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteVendor(selectedVendor.id)}
                      className="flex items-center"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Vendor
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="assessments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assessment History</CardTitle>
                      <CardDescription>Track all assessments for this vendor</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Assessment history will be displayed here...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle>Documents & Attachments</CardTitle>
                      <CardDescription>Manage vendor-related documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Document management will be displayed here...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Log</CardTitle>
                      <CardDescription>Recent activities and changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Activity log will be displayed here...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}