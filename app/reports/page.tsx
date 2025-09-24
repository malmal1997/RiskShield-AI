"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart3, TrendingUp, FileText, Download, Calendar, Filter, Eye, Brain, Quote } from "lucide-react"

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#dc2626"]

const reportTemplates = [
  {
    id: "1",
    name: "Template 1",
    description: "Description for Template 1",
    frequency: "Monthly",
    lastGenerated: "2023-10-01",
  },
  {
    id: "2",
    name: "Template 2",
    description: "Description for Template 2",
    frequency: "Quarterly",
    lastGenerated: "2023-07-01",
  },
]

const vendorsByIndustry = [
  { industry: "Technology", count: 30, riskScore: 85 },
  { industry: "Finance", count: 20, riskScore: 72 },
  { industry: "Healthcare", count: 25, riskScore: 68 },
]

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
  const [aiReports, setAiReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<any>(null)

  useEffect(() => {
    fetchAiReports()
  }, [])

  const fetchAiReports = async () => {
    try {
      const response = await fetch("/api/ai-assessment-reports")
      if (response.ok) {
        const { reports } = await response.json()
        setAiReports(reports || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching AI reports:", error)
    }
  }

  const generateReport = (reportId: string) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert(`Report generated successfully!`)
    }, 2000)
  }

  const handleExportReport = async (report: any) => {
    try {
      // Create HTML content for PDF generation
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${report.report_title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
            .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .question { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .question-title { font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .answer { background: #eff6ff; padding: 10px; border-radius: 4px; margin: 10px 0; }
            .evidence { background: #f9fafb; padding: 10px; margin: 10px 0; border-left: 4px solid #6b7280; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .badge-high { background: #fee2e2; color: #991b1b; }
            .badge-medium { background: #fef3c7; color: #92400e; }
            .badge-low { background: #d1fae5; color: #065f46; }
            .metadata { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${report.report_title}</div>
            <div>Generated: ${new Date(report.created_at).toLocaleDateString()}</div>
            <div>Assessment Type: ${report.assessment_type}</div>
            <div>Risk Level: <span class="badge badge-${report.risk_level.toLowerCase()}">${report.risk_level} Risk</span></div>
            <div>Risk Score: ${report.risk_score}/100</div>
          </div>
          
          <div class="summary">
            <h3>Assessment Summary</h3>
            <p>${report.report_summary}</p>
          </div>
          
          ${
            report.full_report_content?.questions
              ? `
            <h3>Detailed Analysis</h3>
            ${report.full_report_content.questions
              .map(
                (question: any, index: number) => `
              <div class="question">
                <div class="question-title">${index + 1}. ${question.question}</div>
                <div class="answer">
                  <strong>Answer:</strong> ${question.answer}
                </div>
                ${
                  question.evidence && question.evidence.length > 0
                    ? `
                  <div>
                    <strong>Supporting Evidence:</strong>
                    ${question.evidence
                      .map(
                        (evidence: any) => `
                      <div class="evidence">
                        <em>"${evidence.quote}"</em><br>
                        <small>Source: ${evidence.document}${evidence.page ? ` (Page ${evidence.page})` : ""}</small>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
            `,
              )
              .join("")}
          `
              : ""
          }
          
          ${
            report.uploaded_documents_metadata
              ? `
            <h3>Analyzed Documents</h3>
            <ul>
              ${report.uploaded_documents_metadata
                .map(
                  (doc: any) => `
                <li>${doc.name} (${(doc.size / 1024 / 1024).toFixed(2)} MB)</li>
              `,
                )
                .join("")}
            </ul>
          `
              : ""
          }
          
          <div class="metadata">
            <p>Report exported on ${new Date().toLocaleDateString()} by ${user?.email || "Unknown User"}</p>
            <p>Generated by RiskShield AI Risk Assessment Platform</p>
          </div>
        </body>
        </html>
      `

      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()

        // Wait for content to load, then trigger print dialog
        printWindow.onload = () => {
          printWindow.print()
          // Close the window after printing (user can cancel)
          printWindow.onafterprint = () => {
            printWindow.close()
          }
        }
      } else {
        // Fallback: create downloadable HTML file if popup blocked
        const blob = new Blob([htmlContent], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${report.report_title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.html`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      console.log("[v0] Report exported as PDF:", report.report_title)
    } catch (error) {
      console.error("[v0] Error exporting report:", error)
      alert("Failed to export report. Please try again.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate comprehensive risk reports and view analytics</p>
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

      <Tabs defaultValue="ai-reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ai-reports">AI Assessment Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                AI Assessment Reports
              </CardTitle>
              <CardDescription>Your saved AI-powered risk assessments with full evidence and citations</CardDescription>
            </CardHeader>
            <CardContent>
              {aiReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No AI assessment reports yet</p>
                  <p className="text-sm text-gray-500 mt-2">Complete an AI assessment to see your reports here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{report.report_title}</h3>
                          <p className="text-gray-600 mt-1">{report.report_summary}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <Badge variant="outline">{report.assessment_type}</Badge>
                            <Badge
                              variant={
                                report.risk_level === "High"
                                  ? "destructive"
                                  : report.risk_level === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {report.risk_level} Risk
                            </Badge>
                            <span className="text-sm text-gray-500">Score: {report.risk_score}/100</span>
                            <span className="text-sm text-gray-500">
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl">{report.report_title}</DialogTitle>
                                <DialogDescription>Detailed AI assessment with supporting evidence</DialogDescription>
                              </DialogHeader>
                              {selectedReport && (
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="font-semibold mb-2">Assessment Summary</h4>
                                    <p className="text-gray-700">{selectedReport.report_summary}</p>
                                    <div className="flex gap-4 mt-3">
                                      <Badge variant="outline">{selectedReport.assessment_type}</Badge>
                                      <Badge
                                        variant={
                                          selectedReport.risk_level === "High"
                                            ? "destructive"
                                            : selectedReport.risk_level === "Medium"
                                              ? "default"
                                              : "secondary"
                                        }
                                      >
                                        {selectedReport.risk_level} Risk (Score: {selectedReport.risk_score}/100)
                                      </Badge>
                                    </div>
                                  </div>

                                  {selectedReport.full_report_content?.questions && (
                                    <div>
                                      <h4 className="font-semibold mb-4">Detailed Analysis</h4>
                                      <div className="space-y-6">
                                        {selectedReport.full_report_content.questions.map(
                                          (question: any, index: number) => (
                                            <div key={index} className="border rounded-lg p-4">
                                              <h5 className="font-medium text-blue-900 mb-2">{question.question}</h5>
                                              <div className="bg-blue-50 p-3 rounded mb-3">
                                                <p className="font-medium text-blue-800">Answer:</p>
                                                <p className="text-blue-700">{question.answer}</p>
                                              </div>

                                              {question.evidence && question.evidence.length > 0 && (
                                                <div>
                                                  <p className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                                    <Quote className="w-4 h-4" />
                                                    Supporting Evidence:
                                                  </p>
                                                  <div className="space-y-3">
                                                    {question.evidence.map((evidence: any, evidenceIndex: number) => (
                                                      <div
                                                        key={evidenceIndex}
                                                        className="bg-gray-50 p-3 rounded border-l-4 border-gray-300"
                                                      >
                                                        <blockquote className="text-gray-700 italic mb-2">
                                                          "{evidence.quote}"
                                                        </blockquote>
                                                        <div className="text-sm text-gray-600">
                                                          <span className="font-medium">Source:</span>{" "}
                                                          {evidence.document}
                                                          {evidence.page && (
                                                            <span className="ml-2">
                                                              <span className="font-medium">Page:</span> {evidence.page}
                                                            </span>
                                                          )}
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {selectedReport.uploaded_documents_metadata && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Analyzed Documents</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedReport.uploaded_documents_metadata.map((doc: any, index: number) => (
                                          <div key={index} className="bg-gray-50 p-3 rounded">
                                            <p className="font-medium">{doc.name}</p>
                                            <p className="text-sm text-gray-600">
                                              {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.type}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" onClick={() => handleExportReport(report)}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Generate standardized reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
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
                    {vendorsByIndustry.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium">{item.industry}</td>
                        <td className="py-3 px-4">{item.count}</td>
                        <td className="py-3 px-4">{item.riskScore}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              item.riskScore > 80 ? "destructive" : item.riskScore > 70 ? "default" : "secondary"
                            }
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
