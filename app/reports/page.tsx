import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, FileText, Download, Calendar, Filter, ArrowLeft } from "lucide-react" // Added ArrowLeft
import Link from "next/link"

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#dc2626"]

export default function ReportsPage() {
  return (
    <AuthGuard>
      <ReportsContent />
    </AuthGuard>
  )
}

function ReportsContent() {
  const { user, profile, organization } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  // Mock report data
  const reportTemplates = [
    {
      id: "1",
      name: "Executive Risk Summary",
      description: "High-level risk overview for executives",
      type: "executive",
      frequency: "monthly",
      lastGenerated: "2025-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Vendor Risk Assessment Report",
      description: "Detailed vendor risk analysis",
      type: "vendor",
      frequency: "quarterly",
      lastGenerated: "2025-01-10",
      status: "active",
    },
    {
      id: "3",
      name: "Compliance Status Report",
      description: "Regulatory compliance tracking",
      type: "compliance",
      frequency: "monthly",
      lastGenerated: "2025-01-20",
      status: "active",
    },
    {
      id: "4",
      name: "Security Metrics Dashboard",
      description: "Security KPIs and metrics",
      type: "security",
      frequency: "weekly",
      lastGenerated: "2025-01-22",
      status: "active",
    },
  ]

  const riskTrendData = [
    { date: "2025-01-01", score: 75 },
    { date: "2025-01-08", score: 78 },
    { date: "2025-01-15", score: 72 },
    { date: "2025-01-22", score: 80 },
    { date: "2025-01-29", score: 77 },
  ]

  const riskDistributionData = [
    { name: "Low", value: 45, color: "#10b981" },
    { name: "Medium", value: 30, color: "#f59e0b" },
    { name: "High", value: 20, color: "#ef4444" },
    { name: "Critical", value: 5, color: "#dc2626" },
  ]

  const vendorsByIndustry = [
    { industry: "Technology", count: 25, riskScore: 72 },
    { industry: "Financial Services", count: 18, riskScore: 68 },
    { industry: "Healthcare", count: 12, riskScore: 85 },
    { industry: "Manufacturing", count: 15, riskScore: 74 },
    { industry: "Retail", count: 8, riskScore: 69 },
  ]

  const generateReport = (reportId: string) => {
    setLoading(true)
    // Simulate report generation
    setTimeout(() => {
      setLoading(false)
      alert(`Report generated successfully!`)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header - Integrated header content here */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Generate comprehensive risk reports and view analytics</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">76</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Trend</p>
                <p className="text-2xl font-bold text-green-600">+5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold text-gray-900">78</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Generate standardized reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTemplates.map((template: { id: string; name: string; description: string; frequency: string; lastGenerated: string; }) => (
                <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{template.frequency}</Badge>
                      <span className="text-xs text-gray-500">Last: {template.lastGenerated}</span>
                    </div>
                  </div>
                  <Button onClick={() => generateReport(template.id)} disabled={loading} size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Current risk levels across organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskDistributionData.map((item: { name: string; value: number; color: string; }, index: number) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors by Industry */}
      <Card>
        <CardHeader>
          <CardTitle>Vendors by Industry</CardTitle>
          <CardDescription>Risk assessment breakdown by industry sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Industry</th>
                  <th className="text-left py-3 px-4">Vendor Count</th>
                  <th className="text-left py-3 px-4">Avg Risk Score</th>
                  <th className="text-left py-3 px-4">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {vendorsByIndustry.map((item: { industry: string; count: number; riskScore: number; }, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.industry}</td>
                    <td className="py-3 px-4">{item.count}</td>
                    <td className="py-3 px-4">{item.riskScore}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={item.riskScore > 80 ? "destructive" : item.riskScore > 70 ? "default" : "secondary"}
                      >
                        {item.riskScore > 80 ? "High" : item.riskScore > 70 ? "Medium" : "Low"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}