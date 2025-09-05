"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  Send,
  BarChart3,
  Settings,
  Building,
  FileText,
  Plus,
  Server,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
// import { AdminGuard } from "@/components/admin-guard"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

interface PendingRegistration {
  id: string
  institution_name: string
  institution_type: string
  contact_name: string
  email: string
  phone: string
  status: string
  created_at: string
  notes?: string
  password_hash: string
}

export default function AdminDashboard() {
  return <AdminDashboardContent />
}

function AdminDashboardContent() {
  const { user, profile, organization, signOut } = useAuth()
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allRegistrations, setAllRegistrations] = useState<PendingRegistration[]>([])

  const fetchPendingRegistrations = async () => {
    try {
      console.log("[v0] Fetching pending registrations via API...")
      setIsLoading(true)

      const response = await fetch("/api/admin/registrations")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch registrations")
      }

      console.log("[v0] API response:", result)
      const registrations = result.registrations || []

      setPendingRegistrations(registrations.filter((r: PendingRegistration) => r.status === "pending"))
      setAllRegistrations(registrations)

      console.log(
        "[v0] Set pending registrations:",
        registrations.filter((r: PendingRegistration) => r.status === "pending").length,
      )
    } catch (error) {
      console.error("[v0] Error fetching pending registrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createTestRegistration = async () => {
    try {
      const testData = {
        institution_name: "Test Institution " + Date.now(),
        institution_type: "Bank",
        contact_name: "Test Contact",
        email: `test${Date.now()}@example.com`,
        phone: "555-0123",
        password_hash: btoa("testpassword123"),
        status: "pending",
      }

      const response = await fetch("/api/admin/registrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Test registration created successfully!")
        fetchPendingRegistrations()
      } else {
        alert(`Error creating test registration: ${result.error}`)
      }
    } catch (error: any) {
      console.error("[v0] Error creating test registration:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const approveRegistration = async (registration: PendingRegistration) => {
    try {
      const response = await fetch("/api/admin/registrations/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.id }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Registration approved for ${registration.institution_name}`)
        fetchPendingRegistrations()
      } else {
        alert(`Error approving registration: ${result.error}`)
      }
    } catch (error: any) {
      console.error("Error approving registration:", error)
      alert(`Error approving registration: ${error.message}`)
    }
  }

  const rejectRegistration = async (registration: PendingRegistration, reason: string) => {
    try {
      const response = await fetch("/api/admin/registrations/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.id, reason }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Registration rejected for ${registration.institution_name}`)
        fetchPendingRegistrations()
      } else {
        alert(`Error rejecting registration: ${result.error}`)
      }
    } catch (error: any) {
      console.error("Error rejecting registration:", error)
      alert(`Error rejecting registration: ${error.message}`)
    }
  }

  useEffect(() => {
    console.log("[v0] Admin dashboard mounted, user:", user?.email)
    fetchPendingRegistrations()
  }, [])

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Institution Control Center</h1>
          <p className="mt-2 text-gray-600">
            Manage your vendor risk assessments, monitor compliance, and oversee third-party relationships.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Logged in as: {user?.email} | Loading: {isLoading ? "Yes" : "No"} | Pending: {pendingRegistrations.length} |
            Total: {allRegistrations.length}
          </div>
        </div>

        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Total registrations in database:</strong> {allRegistrations.length}
              </p>
              <p>
                <strong>Pending registrations:</strong> {pendingRegistrations.length}
              </p>
              <p>
                <strong>Database connection:</strong> {isLoading ? "Testing..." : "Connected"}
              </p>
              <Button onClick={createTestRegistration} className="mt-2">
                Create Test Registration
              </Button>
              <Button onClick={fetchPendingRegistrations} variant="outline" className="mt-2 ml-2 bg-transparent">
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <p>Loading pending registrations...</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && pendingRegistrations.length === 0 && allRegistrations.length === 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-gray-600">
                No registrations found in database. Try creating a test registration above or check if the registration
                form is working properly.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && pendingRegistrations.length === 0 && allRegistrations.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-gray-600">
                Found {allRegistrations.length} total registrations, but none are pending approval. All may have been
                processed already.
              </p>
            </CardContent>
          </Card>
        )}

        {pendingRegistrations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span>Pending Registration Approvals ({pendingRegistrations.length})</span>
              </CardTitle>
              <CardDescription>New institution registration requests awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">{registration.institution_name}</p>
                          <p className="text-sm text-gray-600">{registration.institution_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{registration.contact_name}</p>
                          <p className="text-sm text-gray-600">{registration.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(registration.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => approveRegistration(registration)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const reason = prompt("Reason for rejection (optional):") || "No reason provided"
                          rejectRegistration(registration, reason)
                        }}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {allRegistrations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>All Registrations (Debug View)</CardTitle>
              <CardDescription>All registration requests in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <span>
                      {registration.institution_name} - {registration.contact_name}
                    </span>
                    <Badge
                      variant={
                        registration.status === "pending"
                          ? "default"
                          : registration.status === "approved"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {registration.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                  <p className="text-3xl font-bold text-gray-900">156</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Assessments</p>
                  <p className="text-3xl font-bold text-gray-900">23</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk Vendors</p>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                  <p className="text-3xl font-bold text-gray-900">87%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Send Assessment */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/third-party-assessment">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  <span>Send Vendor Assessment</span>
                </CardTitle>
                <CardDescription>
                  Send risk assessment invitations to your vendors and third-party partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Assessment
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Manage Vendors */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/vendors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Manage Vendors</span>
                </CardTitle>
                <CardDescription>
                  View and manage your vendor relationships, risk scores, and compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <Building className="mr-2 h-4 w-4" />
                  View All Vendors
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Analytics Dashboard */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span>Analytics Dashboard</span>
                </CardTitle>
                <CardDescription>View real-time analytics, risk trends, and comprehensive reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* System Settings */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/settings">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>System Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure organization settings, user management, and system preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Settings
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Reports */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/reports">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span>Generate Reports</span>
                </CardTitle>
                <CardDescription>
                  Create comprehensive risk reports, compliance documentation, and audit trails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Help & Support */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Help & Support</span>
              </CardTitle>
              <CardDescription>Access documentation, training materials, and technical support</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                <Shield className="mr-2 h-4 w-4" />
                Get Support
              </Button>
            </CardContent>
          </Card>

          {/* Developer Dashboard - Only visible to admins */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dev-dashboard">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-gray-600" />
                  <span>Developer Dashboard</span>
                </CardTitle>
                <CardDescription>Access system metrics, logs, and performance data (Admin only)</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <Server className="mr-2 h-4 w-4" />
                  View Dev Dashboard
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest vendor assessment activities and system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">TechCorp Assessment Completed</p>
                  <p className="text-sm text-gray-600">High-risk vendor assessment submitted - requires review</p>
                </div>
                <Badge variant="destructive">High Risk</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">DataFlow Inc. Assessment Sent</p>
                  <p className="text-sm text-gray-600">Cybersecurity assessment invitation delivered</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Sent</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Compliance Deadline Approaching</p>
                  <p className="text-sm text-gray-600">SOC 2 audit due in 7 days</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
