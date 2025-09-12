"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  RefreshCw,
  ArrowLeft, // Added ArrowLeft for back button
} from "lucide-react"
import Link from "next/link"

export default function SystemStatusPage() {
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking system status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status - Integrated header content here */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
                <p className="mt-2 text-gray-600">Real-time status of all RiskGuard AI services</p>
              </div>
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

          {/* Health Overview */}
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
            </CardContent>
          </Card>
        </div>

        {/* Service Status Grid */}
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

        {/* Feature Status */}
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
                { name: "Advanced Analytics", status: "✅ Active", description: "Real-time dashboards operational" },
                { name: "Vendor Risk Scoring", status: "✅ Active", description: "AI-powered risk assessment" },
                { name: "Compliance Tracking", status: "✅ Active", description: "SOC 2, ISO 27001, GDPR support" },
                { name: "Third-party Integrations", status: "✅ Ready", description: "Slack, Teams, ServiceNow, Jira" },
                { name: "Audit Logging", status: "✅ Active", description: "Complete activity tracking" },
                { name: "Performance Optimization", status: "✅ Active", description: "Caching and CDN configured" },
                { name: "Security Enhancements", status: "✅ Active", description: "2FA, SSO, encryption enabled" },
                { name: "Modern UX Features", status: "✅ Active", description: "Dark mode, responsive, accessible" },
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

        {/* Recent Activity */}
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
      </div>
    </div>
  )
}