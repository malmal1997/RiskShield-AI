"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Send,
  BarChart3,
  PieChart,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle,
  Shield,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  BarChart,
  Bar,
} from "recharts"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"
import type { RiskMetrics, VendorMetrics } from "@/lib/analytics-service"
import type { Notification } from "@/lib/notification-service"

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#dc2626"]

// Sample real-time data (in production, this would come from your analytics service)
const sampleRiskMetrics: RiskMetrics = {
  totalAssessments: 247,
  completedAssessments: 189,
  averageRiskScore: 72,
  highRiskVendors: 23,
  riskTrend: [
    { date: "2024-01-01", score: 68 },
    { date: "2024-01-02", score: 71 },
    { date: "2024-01-03", score: 69 },
    { date: "2024-01-04", score: 74 },
    { date: "2024-01-05", score: 72 },
    { date: "2024-01-06", score: 76 },
    { date: "2024-01-07", score: 73 },
  ],
  riskDistribution: [
    { level: "Low", count: 45 },
    { level: "Medium", count: 121 },
    { level: "High", count: 18 },
    { level: "Critical", count: 5 },
  ],
  complianceScore: 87,
}

const sampleVendorMetrics: VendorMetrics = {
  totalVendors: 156,
  activeVendors: 134,
  riskLevels: { low: 45, medium: 121, high: 18, critical: 5 },
  industryBreakdown: [
    { industry: "Technology", count: 42 },
    { industry: "Financial Services", count: 28 },
    { industry: "Healthcare", count: 21 },
    { industry: "Manufacturing", count: 18 },
    { industry: "Retail", count: 15 },
  ],
  assessmentCompletion: 76.5,
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "High-risk vendor assessment completed",
    message: "TechCorp assessment shows critical security gaps",
    type: "alert",
    data: {}, // Added
    read_at: undefined, // Changed from null
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "New vendor onboarding request",
    message: "DataFlow Inc. submitted assessment request",
    type: "info",
    data: {}, // Added
    read_at: undefined, // Changed from null
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "Compliance deadline approaching",
    message: "SOC 2 audit due in 7 days",
    type: "warning",
    data: {}, // Added
    read_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(sampleRiskMetrics)
  const [vendorMetrics, setVendorMetrics] = useState<VendorMetrics>(sampleVendorMetrics)
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState("7d")
  const [businessMetrics, setBusinessMetrics] = useState({
    highRiskVendors: 8,
    overdueAssessments: 12,
    pendingReviews: 15,
    complianceRate: 87,
  })
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 23,
    systemLoad: 45,
    responseTime: 120,
    uptime: 99.9,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 10) - 5)),
        responseTime: Math.max(50, Math.min(1000, prev.responseTime + Math.floor(Math.random() * 20) - 10)),
        uptime: Math.max(99.0, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })))
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Simulate data refresh
      setRiskMetrics({
        ...riskMetrics,
        averageRiskScore: riskMetrics.averageRiskScore + Math.floor(Math.random() * 6) - 3,
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - matching other pages style */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Risk Management Dashboard</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Enterprise Dashboard
              <br />
              <span className="text-blue-600">Real-Time Risk Analytics</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Monitor your vendor risk portfolio with live analytics, compliance tracking, and intelligent insights
              powered by AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/third-party-assessment">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Send New Assessment
                </Button>
              </Link>
              <Link href="/vendors">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 bg-transparent"
                >
                  Manage Vendors
                </Button>
              </Link>
            </div>
          </div>
        </section>

      {/* Real-time System Status - matching card style */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/risk-center?tab=high-risk">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{businessMetrics.highRiskVendors}</div>
                  <div className="text-sm text-gray-600 mt-1">High-Risk Vendors</div>
                  <div className="text-xs text-blue-600 mt-2">Click to manage →</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/risk-center?tab=overdue">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{businessMetrics.overdueAssessments}</div>
                  <div className="text-sm text-gray-600 mt-1">Overdue Assessments</div>
                  <div className="text-xs text-blue-600 mt-2">Click to follow up →</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/risk-center?tab=pending">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{businessMetrics.pendingReviews}</div>
                  <div className="text-sm text-gray-600 mt-1">Pending Reviews</div>
                  <div className="text-xs text-blue-600 mt-2">Click to review →</div>
                </CardContent>
              </Card>
            </Link>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-600">{businessMetrics.complianceRate}%</div>
                <div className="text-sm text-gray-600 mt-1">Compliance Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Analytics Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.totalAssessments}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Risk Score</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.averageRiskScore}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <PieChart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">-5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                    <p className="text-3xl font-bold text-gray-900">{vendorMetrics.activeVendors}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.complianceScore}%</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Shield className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={riskMetrics.complianceScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Live Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Trend Chart */}
                <Card className="lg:col-span-2 border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Live Risk Trend</CardTitle>
                      <div className="flex space-x-2">
                        {["7d", "30d", "90d"].map((period) => (
                          <Button
                            key={period}
                            variant={timeframe === period ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTimeframe(period)}
                          >
                            {period}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <CardDescription>Real-time risk score trends with live updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={riskMetrics.riskTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Live Activity Feed */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Live Activity</CardTitle>
                    <CardDescription>Real-time system activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start space-x-3">
                            <div
                              className={`p-1 rounded-full ${
                                notification.type === "alert"
                                  ? "bg-red-100"
                                  : notification.type === "warning"
                                    ? "bg-yellow-100"
                                    : "bg-blue-100"
                              }`}
                            >
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  notification.type === "alert"
                                    ? "bg-red-600"
                                    : notification.type === "warning"
                                      ? "bg-yellow-600"
                                      : "bg-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                            {!notification.read_at && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Distribution & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>Current risk levels across all vendors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={riskMetrics.riskDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ level, count }) => `${level}: ${count}`}
                        >
                          {riskMetrics.riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href="/third-party-assessment">
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" />
                        Send New Assessment
                      </Button>
                    </Link>
                    <Link href="/vendors">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Vendors
                      </Button>
                    </Link>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      Configure Workflows
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tabs with consistent styling */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Vendor Risk Levels</CardTitle>
                    <CardDescription>Distribution of risk across vendor portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={Object.entries(vendorMetrics.riskLevels).map(([level, count]) => ({ level, count }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="level" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Industry Breakdown</CardTitle>
                    <CardDescription>Vendor distribution by industry</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vendorMetrics.industryBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.industry}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(item.count / vendorMetrics.totalVendors) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vendors">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Vendor Management</CardTitle>
                  <CardDescription>Comprehensive vendor portfolio overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor Insights Coming Soon</h3>
                    <p className="text-gray-600 mb-4">Advanced vendor analytics and management tools</p>
                    <Link href="/vendors">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Vendors
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Compliance Dashboard</CardTitle>
                  <CardDescription>Real-time compliance monitoring and reporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Tracking</h3>
                    <p className="text-gray-600">Advanced compliance monitoring features</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Live Alerts & Notifications</CardTitle>
                  <CardDescription>Real-time security alerts and system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          notification.type === "alert"
                            ? "border-l-red-500 bg-red-50"
                            : notification.type === "warning"
                              ? "border-l-yellow-500 bg-yellow-50"
                              : "border-l-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <Badge
                            variant={notification.type === "alert" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1 text-gray-600">{notification.message}</p>
                        <p className="text-xs mt-2 text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer - matching other pages */}
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
                    Integrations
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
  )
}