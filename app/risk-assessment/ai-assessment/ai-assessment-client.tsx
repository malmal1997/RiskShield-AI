"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Shield,
  FileText,
  Brain,
  Building,
  Server,
  Upload,
  ArrowLeft,
  CheckCircle,
  Edit,
  Save,
  X,
  PenTool,
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { assessmentCategories as fullAssessmentCategories } from "../page"

const assessmentCategories = [
  {
    id: "cybersecurity",
    title: "Cybersecurity Assessment",
    description: "Comprehensive security posture evaluation",
    icon: Shield,
    color: "bg-red-100 text-red-700",
    questions:
      fullAssessmentCategories
        .find((cat) => cat.name === "Cybersecurity")
        ?.questions.map((q) => ({
          id: q.id,
          text: q.question,
          type: "textarea" as const,
          category: "Cybersecurity",
          weight: q.weight / 100, // Convert weight to decimal
        })) || [],
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

interface ReviewerSignOff {
  reviewerName: string
  reviewerRole: string
  signOffDate: string
  signature: string
  comments?: string
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
  reviewerSignOff?: ReviewerSignOff
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

  const [editingAnswers, setEditingAnswers] = useState<Record<string, string | boolean>>({})
  const [isEditingMode, setIsEditingMode] = useState<Record<string, boolean>>({})
  const [editingExcerpts, setEditingExcerpts] = useState<Record<string, any[]>>({})
  const [isEditingExcerpts, setIsEditingExcerpts] = useState<Record<string, boolean>>({})

  const [reviewerSignOff, setReviewerSignOff] = useState<ReviewerSignOff>({
    reviewerName: "",
    reviewerRole: "",
    signOffDate: "",
    signature: "",
    comments: "",
  })
  const [showSignOffForm, setShowSignOffForm] = useState(false)
  const [isSignedOff, setIsSignedOff] = useState(false)

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

      console.log(`[v0] Fetching ${uploadedFiles.length} files in parallel...`)
      setAnalysisProgress(5) // 5% for starting

      const filePromises = uploadedFiles.map(async (fileMetadata, index) => {
        if (fileMetadata.url) {
          try {
            const response = await fetch(fileMetadata.url)
            if (!response.ok) {
              throw new Error(`Failed to fetch ${fileMetadata.name}: ${response.statusText}`)
            }
            const blob = await response.blob()
            const file = new File([blob], fileMetadata.name, { type: fileMetadata.type })

            // Update progress for each file fetched
            const progressIncrement = Math.round(15 / uploadedFiles.length) // 15% total for file fetching
            setAnalysisProgress((prev) => Math.min(prev + progressIncrement, 20))

            return file
          } catch (error) {
            console.error(`[v0] Failed to fetch file ${fileMetadata.name}:`, error)
            throw new Error(`Could not retrieve ${fileMetadata.name} for analysis`)
          }
        }
        return null
      })

      const actualFiles = (await Promise.all(filePromises)).filter(Boolean) as File[]

      if (actualFiles.length === 0) {
        throw new Error("No valid files could be retrieved for analysis")
      }

      console.log(`[v0] Successfully fetched ${actualFiles.length} files, starting AI analysis`)
      setAnalysisProgress(25) // 25% after file fetching

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

      setAnalysisProgress(30) // 30% when starting API call

      let currentProgress = 30
      const progressInterval = setInterval(() => {
        if (currentProgress < 85) {
          // Slower, more realistic progress increments
          currentProgress += Math.random() * 5 + 2 // 2-7% increments
          setAnalysisProgress(Math.min(currentProgress, 85))
        }
      }, 3000) // Update every 3 seconds

      const analysisResponse = await fetch("/api/ai-assessment/analyze", {
        method: "POST",
        body: formData,
      })

      // Process analysis results
      if (analysisResponse && analysisResponse.ok) {
        clearInterval(progressInterval)
        setAnalysisProgress(95)

        const analysisResult = await analysisResponse.json()
        console.log("[v0] AI analysis completed successfully with real data")

        setAnalysisProgress(100)
        setAiAnalysisResult(analysisResult)

        setTimeout(() => {
          setIsAnalyzing(false)
          setCurrentStep("review")
          console.log("[v0] Transitioning to review step")
        }, 1000)
      } else {
        clearInterval(progressInterval)
        const errorText = await analysisResponse.text().catch(() => "Unknown error")
        console.error("[v0] AI analysis API failed:", analysisResponse.status, errorText)
        throw new Error(`AI analysis failed: ${errorText}`)
      }
    } catch (error) {
      console.error("[v0] Analysis failed:", error)
      setAnalysisError(
        `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or contact support.`,
      )
      setIsAnalyzing(false)
      setCurrentStep("upload")
      setAnalysisProgress(0)
    }
  }

  const handleEditAnswer = (questionId: string, newAnswer: string | boolean) => {
    setEditingAnswers((prev) => ({
      ...prev,
      [questionId]: newAnswer,
    }))
  }

  const handleSaveEdit = (questionId: string) => {
    if (aiAnalysisResult && editingAnswers[questionId] !== undefined) {
      setAiAnalysisResult((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: editingAnswers[questionId],
          },
        }
      })
    }
    setIsEditingMode((prev) => ({ ...prev, [questionId]: false }))
    setEditingAnswers((prev) => {
      const updated = { ...prev }
      delete updated[questionId]
      return updated
    })
  }

  const handleCancelEdit = (questionId: string) => {
    setIsEditingMode((prev) => ({ ...prev, [questionId]: false }))
    setEditingAnswers((prev) => {
      const updated = { ...prev }
      delete updated[questionId]
      return updated
    })
  }

  const handleStartEdit = (questionId: string, currentAnswer: string | boolean) => {
    setIsEditingMode((prev) => ({ ...prev, [questionId]: true }))
    setEditingAnswers((prev) => ({ ...prev, [questionId]: currentAnswer }))
  }

  const handleEditExcerpt = (questionId: string, excerptIndex: number, field: string, value: string | number) => {
    setEditingExcerpts((prev) => {
      const questionExcerpts = prev[questionId] || aiAnalysisResult?.documentExcerpts?.[questionId] || []
      const updatedExcerpts = [...questionExcerpts]
      if (updatedExcerpts[excerptIndex]) {
        updatedExcerpts[excerptIndex] = {
          ...updatedExcerpts[excerptIndex],
          [field]: value,
        }
      }
      return {
        ...prev,
        [questionId]: updatedExcerpts,
      }
    })
  }

  const handleSaveExcerpts = (questionId: string) => {
    if (aiAnalysisResult && editingExcerpts[questionId]) {
      setAiAnalysisResult((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          documentExcerpts: {
            ...prev.documentExcerpts,
            [questionId]: editingExcerpts[questionId],
          },
        }
      })
    }
    setIsEditingExcerpts((prev) => ({ ...prev, [questionId]: false }))
    setEditingExcerpts((prev) => {
      const updated = { ...prev }
      delete updated[questionId]
      return updated
    })
  }

  const handleCancelExcerptEdit = (questionId: string) => {
    setIsEditingExcerpts((prev) => ({ ...prev, [questionId]: false }))
    setEditingExcerpts((prev) => {
      const updated = { ...prev }
      delete updated[questionId]
      return updated
    })
  }

  const handleStartExcerptEdit = (questionId: string) => {
    const currentExcerpts = aiAnalysisResult?.documentExcerpts?.[questionId] || []
    setIsEditingExcerpts((prev) => ({ ...prev, [questionId]: true }))
    setEditingExcerpts((prev) => ({ ...prev, [questionId]: [...currentExcerpts] }))
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

  const handleSaveAnswerChanges = async () => {
    if (!aiAnalysisResult?.assessmentId) return

    try {
      const response = await fetch(`/api/assessment-responses/${aiAnalysisResult.assessmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: aiAnalysisResult.answers,
          documentEvidence: aiAnalysisResult.documentExcerpts,
          reviewerSignOff: aiAnalysisResult.reviewerSignOff,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Assessment updated successfully:", result)

        // Update the risk score if it changed
        if (result.riskScore !== undefined) {
          setAiAnalysisResult((prev) =>
            prev
              ? {
                  ...prev,
                  riskScore: result.riskScore,
                  riskLevel: result.riskLevel,
                }
              : prev,
          )
        }
      }
    } catch (error) {
      console.error("[v0] Error saving changes:", error)
    }
  }

  const handleReviewerSignOff = () => {
    const signOffData: ReviewerSignOff = {
      ...reviewerSignOff,
      signOffDate: new Date().toISOString(),
    }

    setAiAnalysisResult((prev) =>
      prev
        ? {
            ...prev,
            reviewerSignOff: signOffData,
          }
        : prev,
    )

    setIsSignedOff(true)
    setShowSignOffForm(false)

    // Save the sign-off to the database
    handleSaveAnswerChanges()
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
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-4xl mx-auto">
                <p className="text-blue-800 font-medium">
                  💡 You can edit any AI-generated answer by clicking the "Edit" button next to each question. Make sure
                  to save your changes before approving the assessment.
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
                    Review each AI-generated answer and the supporting evidence from your documents. You can edit any
                    answer before approving.
                  </p>

                  {currentCategory.questions.map((question, index) => {
                    const currentAnswer = aiAnalysisResult.answers[question.id]
                    const editingAnswer = editingAnswers[question.id]
                    const isEditing = isEditingMode[question.id]
                    const displayAnswer = isEditing ? editingAnswer : currentAnswer
                    const confidence = aiAnalysisResult.confidenceScores[question.id] || 0
                    const reasoning = aiAnalysisResult.reasoning[question.id] || "No reasoning provided"
                    const excerpts =
                      editingExcerpts[question.id] || aiAnalysisResult.documentExcerpts?.[question.id] || []
                    const isEditingExcerpt = isEditingExcerpts[question.id]

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

                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-blue-800">AI Answer:</p>
                            <div className="flex space-x-2">
                              {!isEditing ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStartEdit(question.id, currentAnswer)}
                                  className="text-xs"
                                >
                                  Edit
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveEdit(question.id)}
                                    className="text-xs bg-green-600 hover:bg-green-700"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCancelEdit(question.id)}
                                    className="text-xs"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {!isEditing ? (
                            <p className="font-semibold text-blue-900 text-lg">
                              {typeof displayAnswer === "boolean"
                                ? displayAnswer
                                  ? "Yes"
                                  : "No"
                                : String(displayAnswer)}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {question.type === "select" && question.options ? (
                                <select
                                  value={String(editingAnswer)}
                                  onChange={(e) => handleEditAnswer(question.id, e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {question.options.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              ) : question.type === "textarea" ? (
                                <textarea
                                  value={String(editingAnswer)}
                                  onChange={(e) => handleEditAnswer(question.id, e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  rows={3}
                                />
                              ) : (
                                <div className="flex space-x-4">
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      name={`edit-${question.id}`}
                                      checked={editingAnswer === true}
                                      onChange={() => handleEditAnswer(question.id, true)}
                                      className="mr-2"
                                    />
                                    Yes
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      name={`edit-${question.id}`}
                                      checked={editingAnswer === false}
                                      onChange={() => handleEditAnswer(question.id, false)}
                                      className="mr-2"
                                    />
                                    No
                                  </label>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* AI Reasoning */}
                        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm font-medium text-gray-800 mb-2">AI Reasoning:</p>
                          <p className="text-gray-700">{reasoning}</p>
                        </div>

                        {/* Document Evidence - Now editable */}
                        {excerpts.length > 0 && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-medium text-green-800">Supporting Evidence from Documents:</p>
                              <div className="flex space-x-2">
                                {!isEditingExcerpt ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStartExcerptEdit(question.id)}
                                    className="text-xs"
                                  >
                                    Edit Evidence
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSaveExcerpts(question.id)}
                                      className="text-xs bg-green-600 hover:bg-green-700"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCancelExcerptEdit(question.id)}
                                      className="text-xs"
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            {excerpts.map((excerpt, excerptIndex) => (
                              <div key={excerptIndex} className="mb-3 last:mb-0">
                                <div className="bg-white p-3 rounded border border-green-200">
                                  {!isEditingExcerpt ? (
                                    <>
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
                                    </>
                                  ) : (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-green-800 mb-1">Quote:</label>
                                        <textarea
                                          value={excerpt.quote}
                                          onChange={(e) =>
                                            handleEditExcerpt(question.id, excerptIndex, "quote", e.target.value)
                                          }
                                          className="w-full p-2 text-sm border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                                          rows={2}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-xs font-medium text-green-800 mb-1">
                                            Document:
                                          </label>
                                          <input
                                            type="text"
                                            value={excerpt.fileName}
                                            onChange={(e) =>
                                              handleEditExcerpt(question.id, excerptIndex, "fileName", e.target.value)
                                            }
                                            className="w-full p-2 text-sm border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-green-800 mb-1">
                                            Page Number:
                                          </label>
                                          <input
                                            type="number"
                                            value={excerpt.pageNumber || ""}
                                            onChange={(e) =>
                                              handleEditExcerpt(
                                                question.id,
                                                excerptIndex,
                                                "pageNumber",
                                                Number.parseInt(e.target.value) || undefined,
                                              )
                                            }
                                            className="w-full p-2 text-sm border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-green-800 mb-1">
                                          Relevance Explanation:
                                        </label>
                                        <textarea
                                          value={excerpt.relevance}
                                          onChange={(e) =>
                                            handleEditExcerpt(question.id, excerptIndex, "relevance", e.target.value)
                                          }
                                          className="w-full p-2 text-sm border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {excerpts.length === 0 && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>
              <p className="text-lg text-gray-600">Your AI-powered risk assessment has been finalized and saved</p>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
                <p className="text-green-800 font-medium">
                  ✅ Report saved successfully! You can also view it anytime in the Reports section.
                </p>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
                <Badge className="mr-2 bg-blue-100 text-blue-800">Editable</Badge>
                <p className="text-blue-800 font-medium inline">
                  💡 You can still edit answers, document references, and page numbers below even after approval.
                </p>
              </div>
            </div>

            {aiAnalysisResult && (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 mb-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Final Risk Assessment</h3>
                    <p className="text-gray-600">Complete analysis with supporting evidence</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-2">{aiAnalysisResult.riskScore}/100</div>
                      <div className="text-xl font-semibold text-gray-900">Risk Score</div>
                      <div className="text-sm text-gray-600 mt-1">Comprehensive Analysis</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold mb-2 ${
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
                      <div className="text-xl font-semibold text-gray-900">Risk Level</div>
                      <div className="text-sm text-gray-600 mt-1">Based on Evidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-600 mb-2">{aiAnalysisResult.documentsAnalyzed}</div>
                      <div className="text-xl font-semibold text-gray-900">Documents</div>
                      <div className="text-sm text-gray-600 mt-1">Analyzed by AI</div>
                    </div>
                  </div>

                  <div className="border-t border-blue-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h4>
                    <p className="text-gray-700 leading-relaxed">{aiAnalysisResult.overallAnalysis}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Reviewer Sign-Off</h3>
                    {!isSignedOff && !aiAnalysisResult.reviewerSignOff && (
                      <Button onClick={() => setShowSignOffForm(true)} className="bg-blue-600 hover:bg-blue-700">
                        <PenTool className="mr-2 h-4 w-4" />
                        Sign Off Assessment
                      </Button>
                    )}
                  </div>

                  {isSignedOff || aiAnalysisResult.reviewerSignOff ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                        <h4 className="text-lg font-semibold text-green-800">Assessment Approved</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-green-700 mb-1">
                            <strong>Reviewer:</strong>
                          </p>
                          <p className="text-green-800">{aiAnalysisResult.reviewerSignOff?.reviewerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700 mb-1">
                            <strong>Role:</strong>
                          </p>
                          <p className="text-green-800">{aiAnalysisResult.reviewerSignOff?.reviewerRole}</p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700 mb-1">
                            <strong>Date:</strong>
                          </p>
                          <p className="text-green-800">
                            {aiAnalysisResult.reviewerSignOff?.signOffDate
                              ? new Date(aiAnalysisResult.reviewerSignOff.signOffDate).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700 mb-1">
                            <strong>E-Signature:</strong>
                          </p>
                          <p className="text-green-800 font-mono bg-green-100 px-2 py-1 rounded">
                            {aiAnalysisResult.reviewerSignOff?.signature}
                          </p>
                        </div>
                      </div>
                      {aiAnalysisResult.reviewerSignOff?.comments && (
                        <div className="mt-4">
                          <p className="text-sm text-green-700 mb-1">
                            <strong>Comments:</strong>
                          </p>
                          <p className="text-green-800 bg-green-100 p-3 rounded">
                            {aiAnalysisResult.reviewerSignOff.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="h-6 w-6 border-2 border-yellow-400 rounded-full mr-3"></div>
                        <p className="text-yellow-800">This assessment is pending reviewer sign-off.</p>
                      </div>
                    </div>
                  )}

                  {/* Sign-Off Form Modal */}
                  {showSignOffForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-xl p-8 max-w-md w-full">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900">Sign Off Assessment</h3>
                          <Button variant="ghost" size="sm" onClick={() => setShowSignOffForm(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reviewerName">Reviewer Name</Label>
                            <Input
                              id="reviewerName"
                              value={reviewerSignOff.reviewerName}
                              onChange={(e) =>
                                setReviewerSignOff((prev) => ({
                                  ...prev,
                                  reviewerName: e.target.value,
                                }))
                              }
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div>
                            <Label htmlFor="reviewerRole">Role/Title</Label>
                            <Input
                              id="reviewerRole"
                              value={reviewerSignOff.reviewerRole}
                              onChange={(e) =>
                                setReviewerSignOff((prev) => ({
                                  ...prev,
                                  reviewerRole: e.target.value,
                                }))
                              }
                              placeholder="e.g., Risk Manager, CISO, Compliance Officer"
                            />
                          </div>

                          <div>
                            <Label htmlFor="signature">Electronic Signature</Label>
                            <Input
                              id="signature"
                              value={reviewerSignOff.signature}
                              onChange={(e) =>
                                setReviewerSignOff((prev) => ({
                                  ...prev,
                                  signature: e.target.value,
                                }))
                              }
                              placeholder="Type your full name as signature"
                              className="font-mono"
                            />
                          </div>

                          <div>
                            <Label htmlFor="comments">Comments (Optional)</Label>
                            <Textarea
                              id="comments"
                              value={reviewerSignOff.comments}
                              onChange={(e) =>
                                setReviewerSignOff((prev) => ({
                                  ...prev,
                                  comments: e.target.value,
                                }))
                              }
                              placeholder="Add any additional comments or notes..."
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                          <Button variant="outline" onClick={() => setShowSignOffForm(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleReviewerSignOff}
                            disabled={
                              !reviewerSignOff.reviewerName ||
                              !reviewerSignOff.reviewerRole ||
                              !reviewerSignOff.signature
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Sign Off Assessment
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Complete Assessment Report</h3>
                    <Badge className="bg-blue-100 text-blue-800">Always Editable</Badge>
                  </div>
                  <p className="text-gray-600 mb-8">
                    Detailed analysis of each security question with AI-generated answers and supporting evidence from
                    your documents. <strong>You can edit any information below at any time.</strong>
                  </p>

                  {/* Questions and Answers - Always editable in results step */}
                  <div className="space-y-8">
                    {assessmentCategories
                      .find((cat) => cat.id === selectedCategory)
                      ?.questions.map((question, index) => {
                        const currentAnswer = aiAnalysisResult.answers[question.id]
                        const editingAnswer = editingAnswers[question.id]
                        const isEditing = isEditingMode[question.id]
                        const displayAnswer = isEditing ? editingAnswer : currentAnswer
                        const confidence = aiAnalysisResult.confidenceScores[question.id] || 0
                        const reasoning = aiAnalysisResult.reasoning[question.id] || "No reasoning provided"
                        const excerpts =
                          editingExcerpts[question.id] || aiAnalysisResult.documentExcerpts?.[question.id] || []
                        const isEditingExcerpt = isEditingExcerpts[question.id]

                        return (
                          <div key={question.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                            <div className="mb-4">
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {index + 1}. {question.text}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-gray-600">Category: {question.category}</span>
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                    confidence >= 0.7
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : confidence >= 0.4
                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                        : "bg-red-100 text-red-800 border-red-200"
                                  }`}
                                >
                                  AI Confidence: {Math.round(confidence * 100)}%
                                </span>
                                <Badge className="bg-blue-100 text-blue-800">Editable</Badge>
                              </div>
                            </div>

                            {/* Answer - Always editable in results step */}
                            <div className="mb-4 p-4 bg-white border border-blue-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-blue-800">Answer:</p>
                                <div className="flex space-x-2">
                                  {!isEditing ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStartEdit(question.id, currentAnswer)}
                                      className="text-xs"
                                    >
                                      <Edit className="mr-1 h-3 w-3" />
                                      Edit
                                    </Button>
                                  ) : (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          handleSaveEdit(question.id)
                                          handleSaveAnswerChanges()
                                        }}
                                        className="text-xs bg-green-600 hover:bg-green-700"
                                      >
                                        <Save className="mr-1 h-3 w-3" />
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCancelEdit(question.id)}
                                        className="text-xs"
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {!isEditing ? (
                                <p className="font-semibold text-blue-900 text-lg">
                                  {typeof displayAnswer === "boolean"
                                    ? displayAnswer
                                      ? "Yes"
                                      : "No"
                                    : String(displayAnswer)}
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {question.type === "select" && question.options ? (
                                    <select
                                      value={String(editingAnswer)}
                                      onChange={(e) => handleEditAnswer(question.id, e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                      {question.options.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : question.type === "textarea" ? (
                                    <textarea
                                      value={String(editingAnswer)}
                                      onChange={(e) => handleEditAnswer(question.id, e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      rows={3}
                                    />
                                  ) : (
                                    <div className="flex space-x-4">
                                      <label className="flex items-center">
                                        <input
                                          type="radio"
                                          name={`edit-${question.id}`}
                                          checked={editingAnswer === true}
                                          onChange={() => handleEditAnswer(question.id, true)}
                                          className="mr-2"
                                        />
                                        Yes
                                      </label>
                                      <label className="flex items-center">
                                        <input
                                          type="radio"
                                          name={`edit-${question.id}`}
                                          checked={editingAnswer === false}
                                          onChange={() => handleEditAnswer(question.id, false)}
                                          className="mr-2"
                                        />
                                        No
                                      </label>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* AI Reasoning */}
                            <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                              <p className="text-sm font-medium text-gray-800 mb-2">AI Analysis:</p>
                              <p className="text-gray-700">{reasoning}</p>
                            </div>

                            {/* Supporting Evidence - Always editable in results step */}
                            {excerpts.length > 0 ? (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-sm font-medium text-green-800">
                                    Supporting Evidence from Your Documents:
                                  </p>
                                  <div className="flex space-x-2">
                                    {!isEditingExcerpt ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStartExcerptEdit(question.id)}
                                        className="text-xs"
                                      >
                                        <Edit className="mr-1 h-3 w-3" />
                                        Edit Evidence
                                      </Button>
                                    ) : (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            handleSaveExcerpts(question.id)
                                            handleSaveAnswerChanges()
                                          }}
                                          className="text-xs bg-green-600 hover:bg-green-700"
                                        >
                                          <Save className="mr-1 h-3 w-3" />
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleCancelExcerptEdit(question.id)}
                                          className="text-xs"
                                        >
                                          Cancel
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  {excerpts.map((excerpt, excerptIndex) => (
                                    <div key={excerptIndex} className="bg-white p-3 rounded border border-green-200">
                                      {!isEditingExcerpt ? (
                                        <>
                                          <p className="text-sm text-green-800 italic mb-2 font-medium">
                                            "{excerpt.quote}"
                                          </p>
                                          <div className="flex flex-wrap items-center gap-3 text-xs text-green-600">
                                            <span className="font-medium bg-green-100 px-2 py-1 rounded">
                                              📄 {excerpt.fileName}
                                            </span>
                                            {excerpt.pageNumber && (
                                              <span className="bg-green-100 px-2 py-1 rounded">
                                                📍 Page {excerpt.pageNumber}
                                              </span>
                                            )}
                                            {excerpt.confidence && (
                                              <span className="bg-green-100 px-2 py-1 rounded">
                                                🎯 {Math.round(excerpt.confidence * 100)}% Relevant
                                              </span>
                                            )}
                                          </div>
                                          {excerpt.relevance && (
                                            <p className="text-xs text-green-700 mt-2 bg-green-100 p-2 rounded">
                                              <strong>Why this supports the answer:</strong> {excerpt.relevance}
                                            </p>
                                          )}
                                        </>
                                      ) : (
                                        <div className="space-y-3">
                                          <div>
                                            <label className="block text-xs font-medium text-green-800 mb-1">
                                              Quote:
                                            </label>
                                            <textarea
                                              value={excerpt.quote}
                                              onChange={(e) =>
                                                handleEditExcerpt(question.id, excerptIndex, "quote", e.target.value)
                                              }
                                              className="w-full p-2 text-sm border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                                              rows={2}
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-3">
                                            <div>
                                              <label className="block text-xs font-medium text-green-800 mb-1">
                                                Document:
                                              </label>
                                              <input
                                                type="text"
                                                value={excerpt.fileName}
                                                onChange={(e) =>
                                                  handleEditExcerpt(
                                                    question.id,
                                                    excerptIndex,
                                                    "fileName",
                                                    e.target.value,
                                                  )
                                                }
                                                className="w-full p-2 text-sm border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs font-medium text-green-800 mb-1">
                                                Page Number:
                                              </label>
                                              <input
                                                type="number"
                                                value={excerpt.pageNumber || ""}
                                                onChange={(e) =>
                                                  handleEditExcerpt(
                                                    question.id,
                                                    excerptIndex,
                                                    "pageNumber",
                                                    Number.parseInt(e.target.value) || undefined,
                                                  )
                                                }
                                                className="w-full p-2 text-sm border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                                              />
                                            </div>
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-green-800 mb-1">
                                              Relevance Explanation:
                                            </label>
                                            <textarea
                                              value={excerpt.relevance}
                                              onChange={(e) =>
                                                handleEditExcerpt(
                                                  question.id,
                                                  excerptIndex,
                                                  "relevance",
                                                  e.target.value,
                                                )
                                              }
                                              className="w-full p-2 text-sm border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                                              rows={2}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                  <strong>⚠️ Limited Evidence Found:</strong> This answer is based on conservative
                                  security assumptions. Consider manual verification or uploading additional relevant
                                  documents.
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>

                {/* Risk Factors and Recommendations */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white border border-red-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                      <span className="mr-2">⚠️</span>
                      Risk Factors Identified
                    </h3>
                    <ul className="space-y-2">
                      {aiAnalysisResult.riskFactors.map((factor, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-green-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                      <span className="mr-2">💡</span>
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {aiAnalysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-8 border-t border-gray-200">
                  <Button
                    onClick={() => window.open("/reports", "_blank")}
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                  >
                    📊 View All Reports
                  </Button>
                  <Button
                    onClick={() => {
                      // Reset for new assessment
                      setSelectedCategory(null)
                      setCurrentStep("upload")
                      setUploadedFiles([])
                      setAiAnalysisResult(null)
                      setAnalysisProgress(0)
                    }}
                    variant="outline"
                    className="px-8"
                  >
                    🔄 Start New Assessment
                  </Button>
                </div>
              </>
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
