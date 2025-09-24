"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"

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

  return <div>{/* Reports UI components here */}</div>
}
