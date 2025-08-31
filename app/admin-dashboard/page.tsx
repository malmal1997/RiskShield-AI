"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Send, BarChart3, Settings, Building, FileText, Plus, Server } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <AdminDashboardContent />
    </AuthGuard>
  )
}

function AdminDashboardContent() {
  const { user, profile, organization } = useAuth()

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
                  <p className="text-sm text-gray-600">{organization?.name || "Financial Institution"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">Admin Dashboard</Badge>
              <span className="text-sm text-gray-600">Welcome, {profile?.first_name || "Admin"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Institution Control Center</h1>
          <p className="mt-2 text-gray-600">
            Manage your vendor risk assessments, monitor compliance, and oversee third-party relationships.
          </p>
        </div>

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
                <Button variant="outline" className="w-full">
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
                <Button variant="outline" className="w-full">
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
                <Button variant="outline" className="w-full">
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
                <Button variant="outline" className="w-full">
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
              <Button variant="outline" className="w-full">
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
                <Button variant="outline" className="w-full">
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
