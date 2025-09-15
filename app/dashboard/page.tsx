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
  RefreshCw,
  Bot, // Added Bot icon
  Eye, // Added Eye icon for viewing reports
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
import { getRiskAnalytics, getVendorAnalytics, type RiskMetrics, type VendorMetrics } from "@/lib/analytics-service"
import { getUserNotifications, markAllNotificationsAsRead, type Notification } from "@/lib/notification-service"
import { getAiAssessmentReports, getAssessments } from "@/lib/assessment-service" // Import getAssessments
import type { AiAssessmentReport, Assessment, AssessmentResponse } from "@/lib/supabase" // Import Assessment and AssessmentResponse types
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation" // Import useRouter
// Removed: import { AiReportDetailModal } from "@/src/components/AiReportDetailModal"
// Removed: import { ManualReportDetailModal } from "@/src/components/ManualReportDetailModal" // Import new modal

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#dc2626"]

// Define a common interface for all reports
interface CombinedReport {
  id: string;
  reportType: 'ai' | 'manual';
  title: string;
  type: string; // assessment_type for both
  riskLevel: string;
  riskScore: number | null;
  date: string; // analysis_date for AI, completed_date for manual (or sent_date if not completed)
  fullData: AiAssessmentReport | (Assessment & { responses?: AssessmentResponse[] });
}

// Default values for immediate rendering
const defaultRiskMetrics: RiskMetrics = {
  totalAssessments: 0,
  completedAssessments: 0,
  averageRiskScore: 0,
  highRiskVendors: 0,
  riskTrend: [],
  riskDistribution: [],
  complianceScore: 0,
};

const defaultVendorMetrics: VendorMetrics = {
  totalVendors: 0,
  activeVendors: 0,
  riskLevels: { low: 0, medium: 0, high: 0, critical: 0 },
  industryBreakdown: [],
  assessmentCompletion: 0,
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(defaultRiskMetrics)
  const [vendorMetrics, setVendorMetrics] = useState<VendorMetrics>(defaultVendorMetrics)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [aiReports, setAiReports] = useState<AiAssessmentReport[]>([])
  const [manualReports, setManualReports] = useState<(Assessment & { responses?: AssessmentResponse[] })[]>([]); // State for manual reports
  const [combinedReports, setCombinedReports] = useState<CombinedReport[]>([]); // Combined state for all reports

  const [timeframe, setTimeframe] = useState("7d")

  const { user, organization, loading: authLoading } = useAuth()
  const router = useRouter(); // Initialize useRouter

  const fetchDashboardData = async () => {
    if (authLoading || !user || !organization) {
      // If not authenticated or still loading auth, keep default empty states
      return
    }

    try {
      const fetchedRiskMetrics = await getRiskAnalytics(timeframe)
      setRiskMetrics(fetchedRiskMetrics)

      const fetchedVendorMetrics = await getVendorAnalytics()
      setVendorMetrics(fetchedVendorMetrics)

      const fetchedNotifications = await getUserNotifications()
      setNotifications(fetchedNotifications)

      const fetchedAiReports = await getAiAssessmentReports()
      setAiReports(fetchedAiReports)

      const fetchedManualReports = await getAssessments(); // Fetch manual assessments
      setManualReports(fetchedManualReports);

      // Combine and normalize reports
      const allReports: CombinedReport[] = [];

      fetchedAiReports.forEach(report => {
        allReports.push({
          id: report.id,
          reportType: 'ai',
          title: report.report_title,
          type: report.assessment_type,
          riskLevel: report.risk_level,
          riskScore: report.risk_score,
          date: report.analysis_date,
          fullData: report,
        });
      });

      fetchedManualReports.forEach(report => {
        // Only include completed manual reports with a risk score
        if (report.status === 'completed' && report.risk_score !== null) {
          allReports.push({
            id: report.id,
            reportType: 'manual',
            title: report.vendor_name,
            type: report.assessment_type,
            riskLevel: report.risk_level || 'pending',
            riskScore: report.risk_score,
            date: report.completed_date || report.sent_date, // Prefer completed_date
            fullData: report,
          });
        }
      });

      // Sort reports by date, newest first
      allReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCombinedReports(allReports);

    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // On error, keep default empty states
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [timeframe, user, organization, authLoading])

  const handleMarkAllNotificationsRead = async () => {
    if (!user) return
    await markAllNotificationsAsRead()
    setNotifications((prev) => prev?.map((n) => ({ ...n, read_at: new Date().toISOString() })) || [])
  }

  const handleViewReport = (report: CombinedReport) => {
    router.push(`/reports/${report.id}/view?type=${report.reportType}`); // Navigate within the same tab
  };

  const getRiskLevelColor = (level: string | null) => {
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

  return (
    <div className="min-h-screen bg-white">
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
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/risk-center?tab=high-risk">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{riskMetrics.highRiskVendors}</div>
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
                  <div className="text-3xl font-bold text-orange-600">N/A</div>
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
                  <div className="text-3xl font-bold text-blue-600">N/A</div>
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
                <div className="text-3xl font-bold text-green-600">{riskMetrics.complianceScore}%</div>
                <div className="text-sm text-gray-600 mt-1">Compliance Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Live Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="risk-reports">Risk Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Live Risk Trend</CardTitle>
                      <div className="flex space-x-2">
                        {["7d", "30d", "90d", "1y"].map((period) => (
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

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Live Activity</CardTitle>
                    <CardDescription>Real-time system activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {notifications.map((notification: Notification) => (
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
                            {notification.read_at === null && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Button onClick={handleMarkAllNotificationsRead} className="w-full mt-4" variant="outline">
                      Mark All As Read
                    </Button>
                  </CardContent>
                </Card>
              </div>

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
                          label={({ payload }: { payload?: { level: string; count: number } }) => 
                            payload ? `${payload.level}: ${payload.count}` : ''
                          }
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
                    <Link href="/reports">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Generate Report
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Shield className="mr-2 h-4 w-4" />
                          Configure Workflows
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

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

              <TabsContent value="risk-reports">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Your Risk Reports</span>
                    </CardTitle>
                    <CardDescription>All your generated risk assessment reports.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {combinedReports.length > 0 ? (
                      <div className="space-y-4">
                        {combinedReports.map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold text-gray-900">{report.title}</h3>
                              <p className="text-sm text-gray-600">{report.type}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getRiskLevelColor(report.riskLevel)}>
                                  {report.riskLevel} Risk
                                </Badge>
                                {report.riskScore !== null && (
                                  <span className="text-sm text-gray-500">Score: {report.riskScore}/100</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {report.reportType === 'ai' ? 'Analyzed' : 'Completed'}: {new Date(report.date).toLocaleDateString()}
                              </p>
                              <Button variant="outline" size="sm" className="mt-2" onClick={() => handleViewReport(report)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Report
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Reports Found</h3>
                        <p className="text-gray-600 mb-4">
                          Start an AI-powered assessment or complete a manual assessment to generate your first report.
                        </p>
                        <Link href="/risk-assessment/ai-assessment">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Bot className="mr-2 h-4 w-4" />
                            Start AI Assessment
                          </Button>
                        </Link>
                        <Link href="/third-party-assessment" className="ml-4">
                          <Button variant="outline">
                            <Send className="mr-2 h-4 w-4" />
                            Send Manual Assessment
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

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
              <p>&copy; 2025 RiskShield AI. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Removed: AI Report Detail Modal */}
        {/* Removed: Manual Report Detail Modal */}
      </div>
  )
}