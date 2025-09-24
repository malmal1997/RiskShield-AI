"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [editingQuestions, setEditingQuestions] = useState<Set<number>>(new Set())
  const [editingEvidence, setEditingEvidence] = useState<Set<string>>(new Set()) // Added evidence editing state
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string>>({})
  const [editedEvidence, setEditedEvidence] = useState<Record<string, any>>({}) // Added evidence editing state
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAiReports()
  }, [])

  const fetchAiReports = async () => {
    try {
      console.log("[v0] Fetching AI reports...") // Added debug logging
      const response = await fetch("/api/ai-assessment-reports")
      if (response.ok) {
        const { reports } = await response.json()
        console.log("[v0] Fetched reports:", reports?.length || 0) // Added debug logging
        setAiReports(reports || [])
      } else {
        console.error("[v0] Failed to fetch reports:", response.status) // Added debug logging
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
          
          <div class="metadata">
            <p>Generated by: ${user.name}</p>
            <p>Organization: ${organization.name}</p>
          </div>
        </body>
        </html>
      `
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${report.report_title}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Error exporting report:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RiskShield AI</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-600">Assessment Reports</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Assessment Reports</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              View and manage your completed risk assessment reports
            </p>
          </div>

          {/* AI Reports Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Assessment Reports</h2>

            {aiReports.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
                <p className="text-gray-600 mb-6">Complete an AI assessment to generate your first report</p>
                <Button className="bg-blue-600 hover:bg-blue-700">Start AI Assessment</Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {aiReports.map((report) => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{report.report_title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Generated: {new Date(report.created_at).toLocaleDateString()}</span>
                          <span>Type: {report.assessment_type}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.risk_level === "Low"
                                ? "bg-green-100 text-green-800"
                                : report.risk_level === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : report.risk_level === "High"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {report.risk_level} Risk
                          </span>
                          <span className="font-semibold">Score: {report.risk_score}/100</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                          View Details
                        </Button>
                        <Button size="sm" onClick={() => handleExportReport(report)}>
                          Export PDF
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">{report.report_summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Detailed Report Modal with Editing Functionality */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-7xl max-h-[90vh] w-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedReport.report_title}</h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>Generated: {new Date(selectedReport.created_at).toLocaleDateString()}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedReport.risk_level === "Low"
                        ? "bg-green-100 text-green-800"
                        : selectedReport.risk_level === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedReport.risk_level === "High"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedReport.risk_level} Risk - Score: {selectedReport.risk_score}/100
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleExportReport(selectedReport)}>
                  Export PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Risk Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{selectedReport.risk_score}/100</div>
                    <div className="text-lg font-semibold text-gray-900">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-2 ${
                        selectedReport.risk_level === "Low"
                          ? "text-green-600"
                          : selectedReport.risk_level === "Medium"
                            ? "text-yellow-600"
                            : selectedReport.risk_level === "High"
                              ? "text-orange-600"
                              : "text-red-600"
                      }`}
                    >
                      {selectedReport.risk_level} Risk
                    </div>
                    <div className="text-lg font-semibold text-gray-900">Risk Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {selectedReport.full_report_content?.questions?.length || 0}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">Questions Analyzed</div>
                  </div>
                </div>
              </div>

              {/* Assessment Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessment Summary</h3>
                <p className="text-gray-700 leading-relaxed">{selectedReport.report_summary}</p>
              </div>

              {/* Detailed Questions and Answers */}
              {selectedReport.full_report_content?.questions && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analysis</h3>

                  {selectedReport.full_report_content.questions.map((question: any, index: number) => {
                    const questionKey = `${selectedReport.id}-${index}`
                    const isEditingAnswer = editingQuestions.has(index)
                    const currentAnswer = editedAnswers[questionKey] || question.answer

                    return (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="mb-4">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">Confidence: {question.confidence}%</span>
                            {question.confidence < 70 && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                ⚠️ Review Recommended
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Answer Section with Edit Capability */}
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-blue-800">Answer:</p>
                            <div className="flex space-x-2">
                              {!isEditingAnswer ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    console.log("[v0] Starting edit for question", index)
                                    setEditingQuestions((prev) => new Set([...prev, index]))
                                    setEditedAnswers((prev) => ({ ...prev, [questionKey]: currentAnswer }))
                                  }}
                                  className="text-xs"
                                >
                                  Edit Answer
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={async () => {
                                      console.log("[v0] Saving answer edit for question", index)
                                      setSaving(true)
                                      try {
                                        // Update the report in the database
                                        const updatedQuestions = [...selectedReport.full_report_content.questions]
                                        updatedQuestions[index] = {
                                          ...updatedQuestions[index],
                                          answer: editedAnswers[questionKey],
                                        }

                                        const response = await fetch(
                                          `/api/ai-assessment-reports/${selectedReport.id}`,
                                          {
                                            method: "PATCH",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                              full_report_content: {
                                                ...selectedReport.full_report_content,
                                                questions: updatedQuestions,
                                              },
                                            }),
                                          },
                                        )

                                        if (response.ok) {
                                          // Update local state
                                          setSelectedReport((prev) => ({
                                            ...prev,
                                            full_report_content: {
                                              ...prev.full_report_content,
                                              questions: updatedQuestions,
                                            },
                                          }))

                                          // Update reports list
                                          setAiReports((prev) =>
                                            prev.map((report) =>
                                              report.id === selectedReport.id
                                                ? {
                                                    ...report,
                                                    full_report_content: {
                                                      ...report.full_report_content,
                                                      questions: updatedQuestions,
                                                    },
                                                  }
                                                : report,
                                            ),
                                          )

                                          setEditingQuestions((prev) => {
                                            const newSet = new Set(prev)
                                            newSet.delete(index)
                                            return newSet
                                          })
                                          console.log("[v0] Answer updated successfully")
                                        } else {
                                          console.error("[v0] Failed to update answer:", response.status)
                                          alert("Failed to save changes. Please try again.")
                                        }
                                      } catch (error) {
                                        console.error("[v0] Error updating answer:", error)
                                        alert("Failed to save changes. Please try again.")
                                      } finally {
                                        setSaving(false)
                                      }
                                    }}
                                    disabled={saving}
                                    className="text-xs bg-green-600 hover:bg-green-700"
                                  >
                                    {saving ? "Saving..." : "Save"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      console.log("[v0] Canceling edit for question", index)
                                      setEditingQuestions((prev) => {
                                        const newSet = new Set(prev)
                                        newSet.delete(index)
                                        return newSet
                                      })
                                      setEditedAnswers((prev) => {
                                        const updated = { ...prev }
                                        delete updated[questionKey]
                                        return updated
                                      })
                                    }}
                                    className="text-xs"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {!isEditingAnswer ? (
                            <p className="font-semibold text-blue-900 text-lg">{currentAnswer}</p>
                          ) : (
                            <textarea
                              value={editedAnswers[questionKey] || ""}
                              onChange={(e) => {
                                console.log("[v0] Updating answer text for question", index)
                                setEditedAnswers((prev) => ({ ...prev, [questionKey]: e.target.value }))
                              }}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
                              placeholder="Enter your answer..."
                            />
                          )}
                        </div>

                        {/* AI Reasoning */}
                        {question.reasoning && (
                          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 mb-2">AI Reasoning:</p>
                            <p className="text-gray-700">{question.reasoning}</p>
                          </div>
                        )}

                        {/* Supporting Evidence with Edit Capability */}
                        {question.evidence && question.evidence.length > 0 && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-medium text-green-800">Supporting Evidence:</p>
                            </div>

                            <div className="space-y-3">
                              {question.evidence.map((evidence: any, evidenceIndex: number) => {
                                const evidenceKey = `${questionKey}-evidence-${evidenceIndex}`
                                const isEditingEvidence = editingEvidence.has(evidenceKey)
                                const currentEvidence = editedEvidence[evidenceKey] || evidence

                                return (
                                  <div key={evidenceIndex} className="bg-white p-3 rounded border border-green-200">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        {!isEditingEvidence ? (
                                          <>
                                            <p className="text-sm text-green-800 italic mb-2">
                                              "{currentEvidence.quote}"
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-green-600">
                                              <span className="font-medium">Source: {currentEvidence.document}</span>
                                              {currentEvidence.page && <span>• Page {currentEvidence.page}</span>}
                                              {currentEvidence.confidence && (
                                                <span>• Confidence: {currentEvidence.confidence}%</span>
                                              )}
                                            </div>
                                            {currentEvidence.relevance && (
                                              <p className="text-xs text-green-600 mt-1">
                                                <strong>Relevance:</strong> {currentEvidence.relevance}
                                              </p>
                                            )}
                                          </>
                                        ) : (
                                          <div className="space-y-2">
                                            <div>
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Quote:
                                              </label>
                                              <textarea
                                                value={currentEvidence.quote || ""}
                                                onChange={(e) => {
                                                  console.log("[v0] Updating evidence quote")
                                                  setEditedEvidence((prev) => ({
                                                    ...prev,
                                                    [evidenceKey]: { ...currentEvidence, quote: e.target.value },
                                                  }))
                                                }}
                                                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                rows={2}
                                              />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                  Document:
                                                </label>
                                                <input
                                                  type="text"
                                                  value={currentEvidence.document || ""}
                                                  onChange={(e) => {
                                                    setEditedEvidence((prev) => ({
                                                      ...prev,
                                                      [evidenceKey]: { ...currentEvidence, document: e.target.value },
                                                    }))
                                                  }}
                                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                  Page:
                                                </label>
                                                <input
                                                  type="text"
                                                  value={currentEvidence.page || ""}
                                                  onChange={(e) => {
                                                    setEditedEvidence((prev) => ({
                                                      ...prev,
                                                      [evidenceKey]: { ...currentEvidence, page: e.target.value },
                                                    }))
                                                  }}
                                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                />
                                              </div>
                                            </div>
                                            <div>
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Relevance:
                                              </label>
                                              <textarea
                                                value={currentEvidence.relevance || ""}
                                                onChange={(e) => {
                                                  setEditedEvidence((prev) => ({
                                                    ...prev,
                                                    [evidenceKey]: { ...currentEvidence, relevance: e.target.value },
                                                  }))
                                                }}
                                                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                rows={2}
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex space-x-1 ml-2">
                                        {!isEditingEvidence ? (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              console.log("[v0] Starting evidence edit")
                                              setEditingEvidence((prev) => new Set([...prev, evidenceKey]))
                                              setEditedEvidence((prev) => ({ ...prev, [evidenceKey]: { ...evidence } }))
                                            }}
                                            className="text-xs px-2 py-1"
                                          >
                                            Edit
                                          </Button>
                                        ) : (
                                          <>
                                            <Button
                                              size="sm"
                                              onClick={async () => {
                                                console.log("[v0] Saving evidence edit")
                                                setSaving(true)
                                                try {
                                                  // Update the evidence in the database
                                                  const updatedQuestions = [
                                                    ...selectedReport.full_report_content.questions,
                                                  ]
                                                  updatedQuestions[index].evidence[evidenceIndex] = currentEvidence

                                                  const response = await fetch(
                                                    `/api/ai-assessment-reports/${selectedReport.id}`,
                                                    {
                                                      method: "PATCH",
                                                      headers: { "Content-Type": "application/json" },
                                                      body: JSON.stringify({
                                                        full_report_content: {
                                                          ...selectedReport.full_report_content,
                                                          questions: updatedQuestions,
                                                        },
                                                      }),
                                                    },
                                                  )

                                                  if (response.ok) {
                                                    // Update local state
                                                    setSelectedReport((prev) => ({
                                                      ...prev,
                                                      full_report_content: {
                                                        ...prev.full_report_content,
                                                        questions: updatedQuestions,
                                                      },
                                                    }))

                                                    setEditingEvidence((prev) => {
                                                      const newSet = new Set(prev)
                                                      newSet.delete(evidenceKey)
                                                      return newSet
                                                    })
                                                    console.log("[v0] Evidence updated successfully")
                                                  } else {
                                                    console.error("[v0] Failed to update evidence:", response.status)
                                                    alert("Failed to save changes. Please try again.")
                                                  }
                                                } catch (error) {
                                                  console.error("[v0] Error updating evidence:", error)
                                                  alert("Failed to save changes. Please try again.")
                                                } finally {
                                                  setSaving(false)
                                                }
                                              }}
                                              disabled={saving}
                                              className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700"
                                            >
                                              Save
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                console.log("[v0] Canceling evidence edit")
                                                setEditingEvidence((prev) => {
                                                  const newSet = new Set(prev)
                                                  newSet.delete(evidenceKey)
                                                  return newSet
                                                })
                                                setEditedEvidence((prev) => {
                                                  const updated = { ...prev }
                                                  delete updated[evidenceKey]
                                                  return updated
                                                })
                                              }}
                                              className="text-xs px-2 py-1"
                                            >
                                              Cancel
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
