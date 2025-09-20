"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, ArrowLeft, Brain, Building, Server } from "lucide-react"
import { useAuth } from "@/components/auth-context"

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
  overallScore: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  findings: Array<{
    category: string
    score: number
    issues: string[]
    recommendations: string[]
  }>
  summary: string
  detailedAnalysis: string
  complianceGaps: string[]
  actionItems: Array<{
    priority: "High" | "Medium" | "Low"
    description: string
    timeline: string
  }>
}

interface DelegatedAssessmentInfo {
  assessmentType: string
  delegationType: "team" | "third-party"
  method: "ai" | "questionnaire"
}

export default function AIAssessmentClient() {
  const authContext = useAuth()
  console.log("AI Assessment Debug Info")
  console.log("useAuth hook: context =", authContext)
  const { user, isDemo, signOut } = authContext
  console.log("AIAssessmentPage: user =", user?.email, "isDemo =", isDemo, "signOut =", typeof signOut)

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
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`)
          }

          const result = await response.json()
          console.log("[v0] File uploaded successfully:", result.filename)

          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            url: result.url, // Add blob URL
          }
        } catch (error) {
          console.error("[v0] File upload failed:", error)
          // Fallback to local processing if upload fails
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          }
        }
      })

      const newFiles = await Promise.all(uploadPromises)
      console.log("[v0] Files processed:", newFiles.length)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleStartAnalysis = async () => {
    if (uploadedFiles.length === 0) return

    setIsAnalyzing(true)
    setCurrentStep("processing")
    setAnalysisProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setCurrentStep("results")
          // Mock analysis result
          setAiAnalysisResult({
            overallScore: 75,
            riskLevel: "Medium",
            findings: [
              {
                category: "Security",
                score: 80,
                issues: ["Outdated security protocols", "Missing encryption"],
                recommendations: ["Update security protocols", "Implement end-to-end encryption"],
              },
            ],
            summary: "Overall security posture is good with some areas for improvement.",
            detailedAnalysis: "Detailed analysis of uploaded documents reveals...",
            complianceGaps: ["GDPR compliance needs attention"],
            actionItems: [
              {
                priority: "High",
                description: "Update security protocols",
                timeline: "30 days",
              },
            ],
          })
          return 100
        }
        return prev + 10
      })
    }, 500)
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
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drop files here or click to upload</h3>
              <p className="text-gray-600 mb-6">Supported formats: PDF, DOC, DOCX, TXT</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => {
                  console.log("[v0] Choose Files button clicked")
                  fileInputRef.current?.click()
                }}
                className="cursor-pointer"
              >
                Choose Files
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
                <Button onClick={handleStartAnalysis} className="w-full mt-6">
                  Start AI Analysis
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

      case "results":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Results</h2>
              <p className="text-lg text-gray-600">Your AI-powered risk assessment is complete</p>
            </div>

            {aiAnalysisResult && (
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{aiAnalysisResult.overallScore}/100</div>
                    <div className="text-lg font-semibold">Overall Score</div>
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
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-xl font-semibold mb-4">Summary</h3>
                  <p className="text-gray-700 mb-6">{aiAnalysisResult.summary}</p>

                  <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
                  <div className="space-y-4">
                    {aiAnalysisResult.findings.map((finding, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          {finding.category} (Score: {finding.score}/100)
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-red-700 mb-1">Issues:</h5>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {finding.issues.map((issue, i) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-green-700 mb-1">Recommendations:</h5>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {finding.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
