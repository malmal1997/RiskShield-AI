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
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"

interface Vendor {
  id: string
  name: string
  email: string
  website?: string
  industry: string
  size: string
  contact_person: string
  contact_email: string
  contact_phone?: string
  risk_level: string
  status: string
  tags: string[]
  last_assessment_date?: string
  next_assessment_date?: string
  total_assessments: number
  completed_assessments: number
  average_risk_score: number
  created_at: string
}

export default function VendorsPage() {
  return (
    <AuthGuard>
      <VendorsContent />
    </AuthGuard>
  )
}

function VendorsContent() {
  const { user, profile, organization } = useAuth()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showVendorDetails, setShowVendorDetails] = useState(false)

  // Mock vendor data
  const mockVendors: Vendor[] = [
    {
      id: "1",
      name: "TechCorp Solutions",
      email: "contact@techcorp.com",
      website: "https://techcorp.com",
      industry: "Technology",
      size: "201-500 employees",
      contact_person: "John Smith",
      contact_email: "john.smith@techcorp.com",
      contact_phone: "+1 (555) 123-4567",
      risk_level: "low",
      status: "active",
      tags: ["cloud-provider", "critical"],
      last_assessment_date: "2024-01-15",
      next_assessment_date: "2024-07-15",
      total_assessments: 3,
      completed_assessments: 3,
      average_risk_score: 85,
      created_at: "2023-06-01",
    },
    {
      id: "2",
      name: "DataFlow Analytics",
      email: "info@dataflow.com",
      website: "https://dataflow.com",
      industry: "Data Analytics",
      size: "51-200 employees",
      contact_person: "Sarah Johnson",
      contact_email: "sarah.johnson@dataflow.com",
      contact_phone: "+1 (555) 234-5678",
      risk_level: "medium",
      status: "active",
      tags: ["data-processing", "gdpr"],
      last_assessment_date: "2024-01-20",
      next_assessment_date: "2024-08-20",
      total_assessments: 2,
      completed_assessments: 1,
      average_risk_score: 72,
      created_at: "2023-08-15",
    },
    {
      id: "3",
      name: "SecureNet Services",
      email: "contact@securenet.com",
      website: "https://securenet.com",
      industry: "Cybersecurity",
      size: "11-50 employees",
      contact_person: "Michael Chen",
      contact_email: "michael.chen@securenet.com",
      risk_level: "high",
      status: "under_review",
      tags: ["security", "penetration-testing"],
      last_assessment_date: "2023-12-10",
      next_assessment_date: "2024-06-10",
      total_assessments: 1,
      completed_assessments: 1,
      average_risk_score: 58,
      created_at: "2023-11-01",
    },
    {
      id: "4",
      name: "CloudHost Pro",
      email: "support@cloudhost.com",
      website: "https://cloudhost.com",
      industry: "Cloud Infrastructure",
      size: "500+ employees",
      contact_person: "Lisa Davis",
      contact_email: "lisa.davis@cloudhost.com",
      contact_phone: "+1 (555) 345-6789",
      risk_level: "low",
      status: "active",
      tags: ["infrastructure", "iso27001"],
      last_assessment_date: "2024-01-25",
      next_assessment_date: "2024-07-25",
      total_assessments: 4,
      completed_assessments: 4,
      average_risk_score: 92,
      created_at: "2023-03-20",
    },
  ]

  useEffect(() => {
    // Simulate loading vendors
    setTimeout(() => {
      setVendors(mockVendors)
      setLoading(false)
    }, 1000)
  }, [])

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
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">RiskGuard AI</span>
                  {organization && <p className="text-sm text-gray-600">{organization.name}</p>}
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard">← Back to Dashboard</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
              <p className="mt-2 text-gray-600">Manage your vendor relationships and track their risk profiles.</p>
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
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor_name">Vendor Name *</Label>
                  <Input id="vendor_name" placeholder="Enter vendor name" />
                </div>
                <div>
                  <Label htmlFor="vendor_email">Email Address *</Label>
                  <Input id="vendor_email" type="email" placeholder="vendor@company.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor_industry">Industry</Label>
                  <select
                    id="vendor_industry"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="vendor_size">Company Size</Label>
                  <select
                    id="vendor_size"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="vendor_website">Website</Label>
                <Input id="vendor_website" type="url" placeholder="https://vendor.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input id="contact_person" placeholder="John Smith" />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input id="contact_email" type="email" placeholder="john@vendor.com" />
                </div>
              </div>

              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input id="contact_phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setShowAddVendor(false)}>
                  Cancel
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
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
                    ×
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
