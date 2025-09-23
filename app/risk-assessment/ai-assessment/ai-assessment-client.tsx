"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Shield, FileText, Brain, Building, Server, Upload, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { Badge } from "@/components/ui/badge"

const assessmentCategories = [
  {
    id: "cybersecurity",
    title: "Cybersecurity Assessment",
    description: "Comprehensive security posture evaluation",
    icon: Shield,
    color: "bg-red-100 text-red-700",
    questions: [
      {
        id: "network_security",
        text: "How do you secure your network infrastructure?",
        type: "textarea" as const,
        category: "Network Security",
        weight: 0.2,
      },
      {
        id: "access_control",
        text: "Describe your access control and authentication mechanisms",
        type: "textarea" as const,
        category: "Access Control",
        weight: 0.25,
      },
      {
        id: "data_protection",
        text: "What measures do you have in place for data protection and encryption?",
        type: "textarea" as const,
        category: "Data Protection",
        weight: 0.2,
      },
      {
        id: "incident_response",
        text: "Describe your incident response and recovery procedures",
        type: "textarea" as const,
        category: "Incident Response",
        weight: 0.15,
      },
      {
        id: "security_monitoring",
        text: "How do you monitor and detect security threats?",
        type: "textarea" as const,
        category: "Security Monitoring",
        weight: 0.2,
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance Assessment",
    description: "Regulatory compliance and governance review",
    icon: FileText,
    color: "bg-blue-100 text-blue-700",
    questions: [
      {
        id: "regulatory_framework",
        text: "Which regulatory frameworks apply to your organization?",
        type: "select" as const,
        category: "Regulatory Framework",
        weight: 0.3,
        options: ["GDPR", "HIPAA", "SOX", "PCI DSS", "ISO 27001", "NIST", "Other"],
      },
      {
        id: "compliance_monitoring",
        text: "How do you monitor and ensure ongoing compliance?",
        type: "textarea" as const,
        category: "Compliance Monitoring",
        weight: 0.25,
      },
      {
        id: "audit_procedures",
        text: "Describe your internal audit procedures and frequency",
        type: "textarea" as const,
        category: "Audit Procedures",
        weight: 0.2,
      },
      {
        id: "documentation",
        text: "How do you maintain compliance documentation and records?",
        type: "textarea" as const,
        category: "Documentation",
        weight: 0.15,
      },
      {
        id: "training",
        text: "What compliance training programs do you have in place?",
        type: "textarea" as const,
        category: "Training",
        weight: 0.1,
      },
    ],
  },
  {
    id: "operational",
    title: "Operational Risk Assessment",
    description: "Business continuity and operational resilience",
    icon: Building,
    color: "bg-green-100 text-green-700",
    questions: [
      {
        id: "business_continuity",
        text: "Describe your business continuity and disaster recovery plans",
        type: "textarea" as const,
        category: "Business Continuity",
        weight: 0.3,
      },
      {
        id: "operational_controls",
        text: "What operational controls and procedures are in place?",
        type: "textarea" as const,
        category: "Operational Controls",
        weight: 0.25,
      },
      {
        id: "vendor_management",
        text: "How do you manage third-party vendor risks?",
        type: "textarea" as const,
        category: "Vendor Management",
        weight: 0.2,
      },
      {
        id: "change_management",
        text: "Describe your change management processes",
        type: "textarea" as const,
        category: "Change Management",
        weight: 0.15,
      },
      {
        id: "performance_monitoring",
        text: "How do you monitor operational performance and identify risks?",
        type: "textarea" as const,
        category: "Performance Monitoring",
        weight: 0.1,
      },
    ],
  },
  {
    id: "technology",
    title: "Technology Risk Assessment",
    description: "IT infrastructure and technology security evaluation",
    icon: Server,
    color: "bg-purple-100 text-purple-700",
    questions: [
      {
        id: "infrastructure_security",
        text: "How do you secure your IT infrastructure and systems?",
        type: "textarea" as const,
        category: "Infrastructure Security",
        weight: 0.25,
      },
      {
        id: "software_security",
        text: "What software security practices do you follow?",
        type: "textarea" as const,
        category: "Software Security",
        weight: 0.2,
      },
      {
        id: "cloud_security",
        text: "Describe your cloud security measures and controls",
        type: "textarea" as const,
        category: "Cloud Security",
        weight: 0.2,
      },
      {
        id: "data_backup",
        text: "What are your data backup and recovery procedures?",
        type: "textarea" as const,
        category: "Data Backup",
        weight: 0.15,
      },
      {
        id: "technology_updates",
        text: "How do you manage system updates and patch management?",
        type: "textarea" as const,
        category: "Technology Updates",
        weight: 0.1,
      },
      {
        id: "emerging_tech",
        text: "How do you assess risks from emerging technologies?",
        type: "textarea" as const,
        category: "Emerging Technology",
        weight: 0.1,
      },
    ],
  },
]

interface Question {
  id: string
  text: string
  type: "text" | "textarea" | "select" | "radio"
  category: string
  weight: number
  options?: string[]
}

interface AssessmentCategory {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  questions: Question[]
}

interface DocumentMetadata {
  name: string
  size: number
  type: string
  lastModified: number
  content?: string
  url?: string // Add URL field for blob storage
}

interface AIAnalysisResult {
  answers: Record<string, boolean | string>
  confidenceScores: Record<string, number>
  reasoning: Record<string, string>
  overallAnalysis: string
  riskFactors: string[]
  recommendations: string[]
  riskScore: number
  riskLevel: string
  analysisDate: string
  documentsAnalyzed: number
  aiProvider?: string
  documentExcerpts?: Record<
    string,
    Array<{
      fileName: string
      quote: string
      relevance: string
      pageOrSection?: string
      pageNumber?: number
      documentType?: "primary" | "4th-party"
      documentRelationship?: string
      confidence?: number
    }>
  >
  assessmentId?: string
  ticket_id?: string
}

interface DelegatedAssessmentInfo {
  assessmentType: string
  delegationType: "team" | "third-party"
  method: "ai" | "questionnaire"
}

export default function AIAssessmentClient() {
  const authContext = useAuth()
  console.log("[v0] AI Assessment Debug Info")
  console.log("[v0] useAuth hook: context =", authContext)
  const { user, isDemo, signOut } = authContext
  console.log("[v0] AIAssessmentPage: user =", user?.email, "isDemo =", isDemo, "signOut =", typeof signOut)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<
    "soc-info" | "upload" | "processing" | "review" | "approve" | "results"
  >("upload")
  const [uploadedFiles, setUploadedFiles] = useState<DocumentMetadata[]>([])
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showDelegateForm, setShowDelegateForm] = useState(false)
  const [delegateForm, setDelegateForm] = useState({
    assessmentType: "",
    recipientName: "",
    recipientEmail: "",
    dueDate: "",
    customMessage: "",
  })
  const [approverInfo, setApproverInfo] = useState({
    name: "",
    title: "",
    role: "",
    signature: "",
  })
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    productName: "",
    industry: "",
    companySize: "",
    description: "",
  })

  const [isDelegatedAssessment, setIsDelegatedAssessment] = useState(false)
  const [delegatedAssessmentInfo, setDelegatedAssessmentInfo] = useState<DelegatedAssessmentInfo | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const delegated = urlParams.get("delegated")
      const assessmentType = urlParams.get("type")
      const delegationType = urlParams.get("delegation") as "team" | "third-party"
      const method = urlParams.get("method") as "ai" | "questionnaire"
      const category = urlParams.get("category")
      const selectedMethod = urlParams.get("selectedMethod")

      if (delegated === "true" && assessmentType && delegationType && method === "ai") {
        setIsDelegatedAssessment(true)
        setDelegatedAssessmentInfo({
          assessmentType,
          delegationType,
          method,
        })

        const categoryMap: { [key: string]: string } = {
          "Cybersecurity Assessment": "cybersecurity",
          "Compliance Assessment": "compliance",
          "Operational Risk Assessment": "operational",
          "Technology Risk Assessment": "technology",
        }

        const categoryId = categoryMap[assessmentType]
        if (categoryId) {
          setSelectedCategory(categoryId)
          setCurrentStep("soc-info")
        }
      } else if (category) {
        setSelectedCategory(category)
        if (selectedMethod === "manual") {
          setCurrentStep("soc-info")
        } else {
          setCurrentStep("upload")
        }
      } else {
        setSelectedCategory("cybersecurity")
        setCurrentStep("upload")
      }
    }
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[v0] File upload triggered", event.target.files?.length)
    const files = event.target.files
    if (files) {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        try {
          console.log("[v0] Uploading file:", file.name)
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
            console.error("[v0] Upload API failed:", response.status, errorData)
            throw new Error(`Upload failed: ${errorData.error || response.statusText}`)
          }

          const result = await response.json()
          console.log("[v0] File uploaded successfully:", result.filename, "URL:", result.url)

          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            url: result.url, // Store blob URL
            content: "File uploaded to blob storage",
          }
        } catch (error) {
          console.error("[v0] File upload failed:", error)
          setAnalysisError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
          throw error
        }
      })

      try {
        const newFiles = await Promise.all(uploadPromises)
        console.log("[v0] All files processed successfully:", newFiles.length)
        console.log("[v0] New files to add:", newFiles)

        setUploadedFiles((prev) => {
          const updated = [...prev, ...newFiles]
          console.log("[v0] Updated uploadedFiles state:", updated)
          return updated
        })
        setAnalysisError(null) // Clear any previous errors

        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        console.error("[v0] File upload batch failed:", error)
        // Don't add files if upload failed
      }
    }
  }

  const handleStartAnalysis = async () => {
    if (uploadedFiles.length === 0) return

    setIsAnalyzing(true)
    setCurrentStep("processing")
    setAnalysisProgress(0)
    setAnalysisError(null)

    try {
      console.log("[v0] Starting AI analysis with", uploadedFiles.length, "files")

      const formData = new FormData()

      // Fetch actual files from blob URLs and add to FormData
      const filePromises = uploadedFiles.map(async (fileMetadata) => {
        if (fileMetadata.url) {
          try {
            const response = await fetch(fileMetadata.url)
            const blob = await response.blob()
            const file = new File([blob], fileMetadata.name, { type: fileMetadata.type })
            return file
          } catch (error) {
            console.error(`[v0] Failed to fetch file ${fileMetadata.name}:`, error)
            return null
          }
        }
        return null
      })

      const actualFiles = (await Promise.all(filePromises)).filter(Boolean) as File[]

      if (actualFiles.length === 0) {
        throw new Error("No valid files could be retrieved for analysis")
      }

      // Add files to FormData
      actualFiles.forEach((file) => {
        formData.append("files", file)
      })

      // Add other required parameters
      const currentCategory = assessmentCategories.find((cat) => cat.id === selectedCategory)
      const questions =
        currentCategory?.questions.map((q, index) => ({
          id: q.id,
          question: q.text,
          type: q.type === "textarea" || q.type === "text" ? "boolean" : q.type,
          weight: q.weight,
          options: q.options,
        })) || []

      formData.append("questions", JSON.stringify(questions))
      formData.append("assessmentType", currentCategory?.title || "Risk Assessment")
      const userId = user?.id || user?.email || "anonymous"
      formData.append("userId", userId)
      formData.append("isDemo", isDemo ? "true" : "false")
      formData.append("selectedProvider", "google")

      // Add document metadata
      const documentMetadata = uploadedFiles.map((file) => ({
        fileName: file.name,
        type: "primary" as const,
      }))
      formData.append("documentMetadata", JSON.stringify(documentMetadata))

      console.log("[v0] Sending FormData with", actualFiles.length, "actual files to AI analysis API")

      const analysisResponse = await fetch("/api/ai-assessment/analyze", {
        method: "POST",
        body: formData, // Send FormData instead of JSON
      })

      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 10
        setAnalysisProgress(currentProgress)
        console.log("[v0] Progress updated to:", currentProgress)

        if (currentProgress >= 100) {
          clearInterval(interval)
          console.log("[v0] Progress complete, clearing interval")
        }
      }, 500)

      const waitForProgress = () => {
        return new Promise<void>((resolve) => {
          const checkProgress = () => {
            if (currentProgress >= 100) {
              console.log("[v0] Progress check: 100% reached")
              resolve()
            } else {
              console.log("[v0] Progress check: still at", currentProgress)
              setTimeout(checkProgress, 100)
            }
          }
          checkProgress()
        })
      }

      // Process analysis results
      if (analysisResponse && analysisResponse.ok) {
        const analysisResult = await analysisResponse.json()
        console.log("[v0] AI analysis completed successfully with real data")
        console.log("[v0] Analysis result:", analysisResult)
        setAiAnalysisResult(analysisResult)
      } else {
        const errorText = await analysisResponse.text().catch(() => "Unknown error")
        console.error("[v0] AI analysis API failed:", analysisResponse.status, errorText)
        throw new Error(`AI analysis failed: ${errorText}`)
      }

      await waitForProgress()
      console.log("[v0] Progress wait completed, transitioning to review")

      setIsAnalyzing(false)
      console.log("[v0] Setting step to review")
      setCurrentStep("review")
      console.log("[v0] Step transition complete")
    } catch (error) {
      console.error("[v0] Analysis failed:", error)
      setAnalysisError(
        `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or contact support.`,
      )
      setIsAnalyzing(false)
      setCurrentStep("upload")
    }
  }

  const handleApproveResults = async () => {
    if (aiAnalysisResult && selectedCategory) {
      try {
        const currentCategory = assessmentCategories.find((cat) => cat.id === selectedCategory)

        // Prepare the report data
        const reportData = {
          report_title: `${currentCategory?.title || "AI Assessment"} - ${new Date().toLocaleDateString()}`,
          assessment_type: currentCategory?.title || "AI Assessment",
          risk_level: aiAnalysisResult.riskLevel,
          risk_score: aiAnalysisResult.riskScore,
          report_summary: aiAnalysisResult.overallAnalysis,
          full_report_content: {
            questions:
              currentCategory?.questions.map((question, index) => ({
                question: question.text,
                answer:
                  typeof aiAnalysisResult.answers[question.id] === "boolean"
                    ? aiAnalysisResult.answers[question.id]
                      ? "Yes"
                      : "No"
                    : String(aiAnalysisResult.answers[question.id]),
                reasoning: aiAnalysisResult.reasoning[question.id] || "No reasoning provided",
                confidence: Math.round((aiAnalysisResult.confidenceScores[question.id] || 0) * 100),
                evidence: (aiAnalysisResult.documentExcerpts?.[question.id] || []).map((excerpt) => ({
                  quote: excerpt.quote,
                  document: excerpt.fileName,
                  page: excerpt.pageNumber || excerpt.pageOrSection,
                  relevance: excerpt.relevance,
                  confidence: excerpt.confidence ? Math.round(excerpt.confidence * 100) : undefined,
                })),
              })) || [],
            riskFactors: aiAnalysisResult.riskFactors,
            recommendations: aiAnalysisResult.recommendations,
            analysisDate: aiAnalysisResult.analysisDate,
            documentsAnalyzed: aiAnalysisResult.documentsAnalyzed,
            aiProvider: aiAnalysisResult.aiProvider || "google",
          },
          uploaded_documents_metadata: uploadedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          })),
          soc_info: companyInfo,
        }

        console.log("[v0] Saving AI assessment report to database")
        console.log("[v0] Report data:", JSON.stringify(reportData, null, 2))

        const response = await fetch("/api/ai-assessment-reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData),
        })

        if (response.ok) {
          const { report } = await response.json()
          console.log("[v0] AI assessment report saved successfully:", report.id)
          alert("Assessment report saved successfully! You can view it in the Reports section.")
        } else {
          const errorText = await response.text()
          console.error("[v0] Failed to save AI assessment report:", response.status, errorText)
          alert("Warning: Failed to save report to database, but you can still view the results.")
        }
      } catch (error) {
        console.error("[v0] Error saving AI assessment report:", error)
        alert("Warning: Failed to save report to database, but you can still view the results.")
      }
    }

    setCurrentStep("results")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "upload":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Documents</h2>
              <p className="text-lg text-gray-600">Upload your documents for AI analysis</p>
            </div>

            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drop files here or click to upload</h3>
              <p className="text-gray-600 mb-6">Supported formats: PDF, DOC, DOCX, TXT (Max 10MB each)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => {
                  console.log("[v0] Choose Files button clicked")
                  if (fileInputRef.current) {
                    fileInputRef.current.click()
                  } else {
                    console.error("[v0] File input ref is null")
                  }
                }}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>

            {analysisError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{analysisError}</p>
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="text-xs text-gray-500 mb-2">Debug: {uploadedFiles.length} files in state</div>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Uploaded</span>
                      </div>
                      <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleStartAnalysis}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700"
                  disabled={isAnalyzing}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Start AI Analysis ({uploadedFiles.length} files)
                </Button>
              </div>
            )}
          </div>
        )

      case "processing":
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Analyzing Documents</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our AI is analyzing your documents for security risks and compliance issues
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{analysisProgress}% Complete</p>
          </div>
        )

      case "review":
        const currentCategory = assessmentCategories.find((cat) => cat.id === selectedCategory)

        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Review AI Assessment Results</h2>
              <p className="text-lg text-gray-600">
                Please review each question, AI answer, and supporting evidence before approving
              </p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-4xl mx-auto">
                <p className="text-yellow-800 font-medium">
                  ⚠️ Important: All questions are shown below, including those where AI found limited evidence. Questions
                  without strong evidence default to conservative "No" answers to ensure security. Review each answer
                  carefully and consider if manual verification is needed.
                </p>
              </div>
            </div>

            {aiAnalysisResult && currentCategory && (
              <>
                {/* Overall Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                  <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{aiAnalysisResult.riskScore}/100</div>
                      <div className="text-lg font-semibold">Risk Score</div>
                      <div className="text-xs text-gray-500 mt-1">
                        (Includes all questions - conservative scoring applied)
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold mb-2 ${
                          aiAnalysisResult.riskLevel === "Low"
                            ? "text-green-600"
                            : aiAnalysisResult.riskLevel === "Medium"
                              ? "text-yellow-600"
                              : aiAnalysisResult.riskLevel === "High"
                                ? "text-orange-600"
                                : "text-red-600"
                        }`}
                      >
                        {aiAnalysisResult.riskLevel} Risk
                      </div>
                      <div className="text-lg font-semibold">Risk Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">{aiAnalysisResult.documentsAnalyzed}</div>
                      <div className="text-lg font-semibold">Documents Analyzed</div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Overall Analysis</h3>
                    <p className="text-gray-700">{aiAnalysisResult.overallAnalysis}</p>
                  </div>
                </div>

                {/* Question-by-Question Review */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Question-by-Question Review</h3>
                  <p className="text-gray-600 mb-6">
                    Review each AI-generated answer and the supporting evidence from your documents. You must approve
                    these results before proceeding.
                  </p>

                  {currentCategory.questions.map((question, index) => {
                    const answer = aiAnalysisResult.answers[question.id]
                    const confidence = aiAnalysisResult.confidenceScores[question.id] || 0
                    const reasoning = aiAnalysisResult.reasoning[question.id] || "No reasoning provided"
                    const excerpts = aiAnalysisResult.documentExcerpts?.[question.id] || []

                    return (
                      <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="mb-4">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {index + 1}. {question.text}
                          </h4>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Category: {question.category}</span>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                confidence >= 0.7
                                  ? "bg-green-100 text-green-800"
                                  : confidence >= 0.4
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              Confidence: {Math.round(confidence * 100)}%
                            </span>
                            {confidence < 0.4 && (
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800">
                                ⚠️ Manual Review Recommended
                              </span>
                            )}
                          </div>
                        </div>

                        {/* AI Answer */}
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-2">AI Answer:</p>
                          <p className="font-semibold text-blue-900 text-lg">
                            {typeof answer === "boolean" ? (answer ? "Yes" : "No") : String(answer)}
                          </p>
                        </div>

                        {/* AI Reasoning */}
                        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm font-medium text-gray-800 mb-2">AI Reasoning:</p>
                          <p className="text-gray-700">{reasoning}</p>
                        </div>

                        {/* Document Evidence */}
                        {excerpts.length > 0 && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-3">
                              Supporting Evidence from Documents:
                            </p>
                            {excerpts.map((excerpt, excerptIndex) => (
                              <div key={excerptIndex} className="mb-3 last:mb-0">
                                <div className="bg-white p-3 rounded border border-green-200">
                                  <p className="text-sm text-green-800 italic mb-2">"{excerpt.quote}"</p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-green-600">
                                    <span className="font-medium">Document: {excerpt.fileName}</span>
                                    {excerpt.pageNumber && <span>• Page {excerpt.pageNumber}</span>}
                                    {excerpt.documentType === "4th-party" && (
                                      <span className="font-semibold text-purple-700">
                                        • 4th Party: {excerpt.documentRelationship || "N/A"}
                                      </span>
                                    )}
                                    {excerpt.confidence && (
                                      <span>• Relevance: {Math.round(excerpt.confidence * 100)}%</span>
                                    )}
                                  </div>
                                  {excerpt.relevance && (
                                    <p className="text-xs text-green-600 mt-1">
                                      <strong>Why this is relevant:</strong> {excerpt.relevance}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {excerpts.length === 0 && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800 mb-2">
                              <strong>No specific document evidence found.</strong> This answer is based on conservative
                              security assumptions.
                            </p>
                            <p className="text-xs text-yellow-700">
                              💡 <strong>Manual Review Needed:</strong> If you have evidence for this question that
                              wasn't detected, consider documenting it separately or uploading additional relevant
                              documents.
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-8 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                    Back to Upload
                  </Button>
                  <Button onClick={handleApproveResults} className="bg-green-600 hover:bg-green-700 px-8">
                    ✓ Approve & Finalize Assessment
                  </Button>
                </div>
              </>
            )}
          </div>
        )

      case "results":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Results</h2>
              <p className="text-lg text-gray-600">Your AI-powered risk assessment is complete</p>
            </div>

            {aiAnalysisResult && (
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{aiAnalysisResult.riskScore}/100</div>
                    <div className="text-lg font-semibold">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-2 ${
                        aiAnalysisResult.riskLevel === "Low"
                          ? "text-green-600"
                          : aiAnalysisResult.riskLevel === "Medium"
                            ? "text-yellow-600"
                            : aiAnalysisResult.riskLevel === "High"
                              ? "text-orange-600"
                              : "text-red-600"
                      }`}
                    >
                      {aiAnalysisResult.riskLevel} Risk
                    </div>
                    <div className="text-lg font-semibold">Risk Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{aiAnalysisResult.documentsAnalyzed}</div>
                    <div className="text-lg font-semibold">Documents Analyzed</div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Overall Analysis</h3>
                  <p className="text-gray-700">{aiAnalysisResult.overallAnalysis}</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Risk Factors</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {aiAnalysisResult.riskFactors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {aiAnalysisResult.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Assessment in Progress</h2>
            <p className="text-gray-600">This feature is being loaded...</p>
            <Button onClick={() => window.history.back()} variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Risk Assessment
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Brain className="mr-1 h-3 w-3" />
              {isDelegatedAssessment ? "Delegated AI Assessment" : "AI-Powered Assessment"}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              {isDelegatedAssessment ? "Complete Your AI-Powered" : "AI-Powered Risk Assessment"}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {isDelegatedAssessment
                ? `Complete the ${delegatedAssessmentInfo?.assessmentType} assessment using AI document analysis.`
                : "Upload your documents and let our AI analyze them for security risks, compliance issues, and vulnerabilities"}
            </p>
            {isDelegatedAssessment && delegatedAssessmentInfo && (
              <div className="mt-6 max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <p>
                    <strong>Assessment Type:</strong> {delegatedAssessmentInfo.assessmentType}
                  </p>
                  <p>
                    <strong>Delegation Type:</strong>{" "}
                    {delegatedAssessmentInfo.delegationType === "team" ? "Team Member" : "Third-Party"}
                  </p>
                  <p>
                    <strong>Method:</strong> AI-Powered Analysis
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {selectedCategory && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-700 font-medium">Assessment Type:</span>
                <span className="text-blue-900 font-semibold">
                  {assessmentCategories.find((cat) => cat.id === selectedCategory)?.title || "Selected Assessment"}
                </span>
              </div>
            </div>
          )}

          {renderStepContent()}
        </div>
      </section>
    </div>
  )
}
