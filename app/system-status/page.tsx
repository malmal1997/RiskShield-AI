"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Shield,
  Users,
  Building,
  BarChart3,
  Bell,
  Zap,
  Globe,
  AlertTriangle,
  ServerOff,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { MainNavigation } from "@/components/main-navigation"
import { useAuth } from "@/components/auth-context"
import { AppFooter } from "@/components/app-footer" // Import AppFooter

export default function SystemStatusPage() {
  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="System status is publicly available. Sign up for detailed system metrics and enterprise features."
    >
      <SystemStatusContent />
    </AuthGuard>
  )
}

function SystemStatusContent() {
  const { user, profile, role, loading: authLoading, signOut, isDemo } = useAuth()
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // State for detailed system components (for authorized view)
  const systemComponents = [
    {
      name: "Database",
      status: "operational",
      description: "PostgreSQL with enterprise schema",
      icon: Database,
      uptime: "99.9%",
      responseTime: "< 50ms",
    },
    {
      name: "Authentication",
      status: "operational",
      description: "Supabase Auth with multi-tenant support",
      icon: Shield,
      uptime: "100%",
      responseTime: "< 100ms",
    },
    {
      name: "User Management",
      status: "operational",
      description: "Role-based access control",
      icon: Users,
      uptime: "99.8%",
      responseTime: "< 75ms",
    },
    {
      name: "Vendor Management",
      status: "operational",
      description: "Comprehensive vendor tracking",
      icon: Building,
      uptime: "99.9%",
      responseTime: "< 120ms",
    },
    {
      name: "Analytics Engine",
      status: "operational",
      description: "Real-time risk analytics",
      icon: BarChart3,
      uptime: "99.7%",
      responseTime: "< 200ms",
    },
    {
      name: "Notification System",
      status: "operational",
      description: "Real-time alerts and notifications",
      icon: Bell,
      uptime: "99.9%",
      responseTime: "< 50ms",
    },
    {
      name: "Integration Framework",
      status: "operational",
      description: "Third-party API connections",
      icon: Zap,
      uptime: "99.5%",
      responseTime: "< 300ms",
    },
    {
      name: "Web Application",
      status: "operational",
      description: "Next.js frontend with enterprise features",
      icon: Globe,
      uptime: "99.9%",
      responseTime: "< 150ms",
    },
  ]

  // State for simplified status (for unauthorized view)
  const [overallSimplifiedStatus, setOverallSimplifiedStatus] = useState<"operational" | "degraded" | "offline">(
    "operational",
  )
  const [currentIncident, setCurrentIncident] = useState<{
    active: boolean
    message: string
    startTime: string
  } | null>(null)
  const [scheduledMaintenance, setScheduledMaintenance] = useState<{
    active: boolean
    message: string
    date: string
    time: string
  } | null>(null)
  const simplifiedLastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  useEffect(() => {
    // Simulate fetching status from an external service for simplified view
    setScheduledMaintenance({
      active: true,
      message: "Planned database upgrade",
      date: "2025-09-01",
      time: "02:00 AM - 04:00 AM UTC",
    })

    if (currentIncident?.active) {
      setOverallSimplifiedStatus("degraded")
    } else {
      setOverallSimplifiedStatus("operational")
    }
  }, [currentIncident]) // Re-run if currentIncident changes

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "down":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-800">Down</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const overallHealth = systemComponents.every((c) => c.status === "operational") ? "healthy" : "issues"
  const operationalCount = systemComponents.filter((c) => c.status === "operational").length
  const healthPercentage = (operationalCount / systemComponents.length) * 100

  // Check if user has developer role or admin role, AND is NOT in demo mode
  const isAuthorized = (role?.role === "admin" || (role?.permissions && role.permissions.developer === true)) && !isDemo

  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Changed to bg-white */}
      {/* Header - Always present */}
      <MainNavigation onSignOut={signOut} showAuthButtons={false} />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        {" "}
        {/* Added gradient here */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">RiskGuard AI System Status</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Real-time updates on our platform's availability and performance.
            </p>
          </div>
        </div>
      </section>
      {/* Main Content Area */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!isAuthorized ? (
            // Simplified view (similar to the image)
            <div className="flex items-center justify-center p-4">
              {" "}
              {/* Center the card */}
              <Card className="w-full max-w-md text-center">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <Globe className="h-12 w-12 text-blue-600 mr-3" />
                    <CardTitle className="text-3xl font-bold text-gray-900">System Status</CardTitle>
                  </div>
                  <CardDescription className="text-lg text-gray-700">RiskGuard AI Platform Services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {overallSimplifiedStatus === "operational" && !currentIncident && (
                    <div className="flex items-center justify-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <span className="text-xl font-semibold text-green-800">All Systems Operational</span>
                    </div>
                  )}

                  {overallSimplifiedStatus === "degraded" && currentIncident && (
                    <div className="flex items-center justify-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                      <span className="text-xl font-semibold text-yellow-800">Degraded Performance</span>
                    </div>
                  )}

                  {overallSimplifiedStatus === "offline" && currentIncident && (
                    <div className="flex items-center justify-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <ServerOff className="h-8 w-8 text-red-600" />
                      <span className="text-xl font-semibold text-red-800">Major Outage</span>
                    </div>
                  )}

                  {currentIncident?.active && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                      <h3 className="font-semibold text-red-800 flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Current Incident: {currentIncident.message}</span>
                      </h3>
                      <p className="text-sm text-red-700">Started: {currentIncident.startTime}</p>
                      <p className="text-sm text-red-700 mt-1">
                        We are actively investigating and working to resolve this issue.
                      </p>
                    </div>
                  )}

                  {scheduledMaintenance?.active && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                      <h3 className="font-semibold text-blue-800 flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5" />
                        <span>Scheduled Maintenance: {scheduledMaintenance.message}</span>
                      </h3>
                      <p className="text-sm text-blue-700">Date: {scheduledMaintenance.date}</p>
                      <p className="text-sm text-blue-700 mt-1">Time: {scheduledMaintenance.time}</p>
                      <p className="text-sm text-blue-700 mt-1">
                        During this period, some services may experience intermittent availability.
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Last updated: {simplifiedLastUpdated}</span>
                  </p>
                  <p className="text-gray-700 mt-4">
                    We are continuously monitoring our services to ensure optimal performance and availability.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Detailed view for authorized users
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
                    <p className="mt-2 text-gray-600">Real-time status of all RiskGuard AI services</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      {overallHealth === "healthy" ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-yellow-500" />
                      )}
                      <span className="text-lg font-semibold">
                        {overallHealth === "healthy" ? "All Systems Operational" : "Some Issues Detected"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Overall System Health</h3>
                        <p className="text-gray-600">
                          {operationalCount} of {systemComponents.length} services operational
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">{Math.round(healthPercentage)}%</div>
                        <div className="text-sm text-gray-500">Uptime</div>
                      </div>
                    </div>
                    <Progress value={healthPercentage} className="h-3" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {systemComponents.map((component) => {
                  const IconComponent = component.icon
                  return (
                    <Card key={component.name} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                            <CardTitle className="text-base">{component.name}</CardTitle>
                          </div>
                          {getStatusIcon(component.status)}
                        </div>
                        <CardDescription className="text-sm">{component.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {getStatusBadge(component.status)}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Uptime:</span>
                            <span className="font-medium">{component.uptime}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Response:</span>
                            <span className="font-medium">{component.responseTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Features Status</CardTitle>
                  <CardDescription>Status of all enterprise-grade features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Multi-tenant Organizations",
                        status: "✅ Active",
                        description: "Organization isolation working",
                      },
                      {
                        name: "Role-based Access Control",
                        status: "✅ Active",
                        description: "Admin/Manager/User roles configured",
                      },
                      {
                        name: "Advanced Analytics",
                        status: "✅ Active",
                        description: "Real-time dashboards operational",
                      },
                      { name: "Vendor Risk Scoring", status: "✅ Active", description: "AI-powered risk assessment" },
                      {
                        name: "Compliance Tracking",
                        status: "✅ Active",
                        description: "SOC 2, ISO 27001, GDPR support",
                      },
                      {
                        name: "Third-party Integrations",
                        status: "✅ Ready",
                        description: "Slack, Teams, ServiceNow, Jira",
                      },
                      { name: "Audit Logging", status: "✅ Active", description: "Complete activity tracking" },
                      {
                        name: "Performance Optimization",
                        status: "✅ Active",
                        description: "Caching and CDN configured",
                      },
                      {
                        name: "Security Enhancements",
                        status: "✅ Active",
                        description: "2FA, SSO, encryption enabled",
                      },
                      {
                        name: "Modern UX Features",
                        status: "✅ Active",
                        description: "Dark mode, responsive, accessible",
                      },
                      { name: "API Framework", status: "✅ Ready", description: "RESTful APIs for integrations" },
                      { name: "Automated Reporting", status: "✅ Active", description: "Scheduled report generation" },
                    ].map((feature, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{feature.name}</h4>
                          <span className="text-sm font-medium text-green-600">{feature.status}</span>
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                  <CardDescription>Latest system events and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "2 minutes ago", event: "Database optimization completed", type: "success" },
                      { time: "15 minutes ago", event: "New user authentication successful", type: "info" },
                      { time: "1 hour ago", event: "Vendor risk assessment completed", type: "success" },
                      { time: "2 hours ago", event: "Analytics report generated", type: "info" },
                      { time: "3 hours ago", event: "System backup completed", type: "success" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "success"
                              ? "bg-green-500"
                              : activity.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
      <AppFooter />
    </div>
  )
}
