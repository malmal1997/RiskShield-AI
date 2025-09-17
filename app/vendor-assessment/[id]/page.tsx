"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card" // Added CardDescription
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Shield, 
  Building, 
  User, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Clock, 
  Bot, 
  Upload,
  ArrowRight, // Added ArrowRight
  ArrowLeft, // Added ArrowLeft
  Info, // Added Info
  FileCheck, // Added FileCheck
} from "lucide-react" // Added ArrowRight, ArrowLeft, Info, FileCheck
import { getAssessmentById, submitAssessmentResponse } from "@/lib/assessment-service"

console.log("🔍 Environment check:", {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
  timestamp: new Date().toISOString(),
})

// Define a more specific interface for the assessment data used in the UI
interface UIAssessment {
  id: string;
  companyName: string;
  assessmentType: string;
  dueDate: string;
  customMessage: string;
  contactEmail: string;
  isAiPowered: boolean;
  status?: string; // Add status to UIAssessment
  completedDate?: string | null; // Allow null or undefined
}

// Assessment questions by type
const getAssessmentQuestions = (type: string) => {
  const questionSets = {
    "Cybersecurity Assessment": [
      {
        id: "cyber_1",
        category: "Security Policies",
        question: "Does your organization have a formal information security policy?",
        type: "radio",
        options: ["Yes, comprehensive policy", "Yes, basic policy", "In development", "No"],
        required: true,
      },
      {
        id: "cyber_2",
        category: "Access Control",
        question: "How do you manage user access to systems and data?",
        type: "checkbox",
        options: [
          "Multi-factor authentication",
          "Role-based access control",
          "Regular access reviews",
          "Privileged access management",
          "Single sign-on (SSO)",
        ],
        required: true,
      },
      {
        id: "cyber_3",
        category: "Incident Response",
        question: "Describe your incident response procedures:",
        type: "textarea",
        required: true,
      },
      {
        id: "cyber_4",
        category: "Data Encryption",
        question: "What encryption standards do you use for data at rest and in transit?",
        type: "radio",
        options: ["AES-256 and TLS 1.3", "AES-128 and TLS 1.2", "Basic encryption", "No encryption"],
        required: true,
      },
      {
        id: "cyber_5",
        category: "Security Training",
        question: "How often do you conduct security awareness training?",
        type: "radio",
        options: ["Monthly", "Quarterly", "Annually", "As needed", "Never"],
        required: true,
      },
      {
        id: "cyber_6",
        category: "Vulnerability Management",
        question: "Describe your vulnerability assessment and patch management process:",
        type: "textarea",
        required: true,
      },
    ],
    "Data Privacy Assessment": [
      {
        id: "privacy_1",
        category: "Data Collection",
        question: "What types of personal data do you collect?",
        type: "checkbox",
        options: [
          "Names and contact information",
          "Financial information",
          "Health information",
          "Biometric data",
          "Location data",
          "Behavioral data",
        ],
        required: true,
      },
      {
        id: "privacy_2",
        category: "Legal Compliance",
        question: "Which privacy regulations do you comply with?",
        type: "checkbox",
        options: ["GDPR", "CCPA", "HIPAA", "SOX", "PCI DSS", "Other"],
        required: true,
      },
      {
        id: "privacy_3",
        category: "Data Processing",
        question: "Describe your data processing and retention policies:",
        type: "textarea",
        required: true,
      },
      {
        id: "privacy_4",
        category: "Data Sharing",
        question: "Do you share personal data with third parties?",
        type: "radio",
        options: ["Never", "Only with consent", "For business purposes", "Regularly"],
        required: true,
      },
      {
        id: "privacy_5",
        category: "Data Subject Rights",
        question: "How do you handle data subject requests (access, deletion, etc.)?",
        type: "textarea",
        required: true,
      },
      {
        id: "privacy_6",
        category: "Information Security Policy",
        question: "Do you have a written Information Security Policy (ISP)?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_7",
        category: "Information Security Policy",
        question: "How often do you review and update your Information Security Policy?",
        type: "radio",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        required: true,
      },
      {
        id: "privacy_8",
        category: "Information Security Policy",
        question: "Do you have a designated person responsible for Information Security Policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_9",
        category: "Compliance Monitoring",
        question: "Do you have data privacy compliance monitoring procedures in place?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_10",
        category: "Physical Security",
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_11",
        category: "Physical Security",
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_12",
        category: "Audits & Assessments",
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_13",
        category: "Asset Management",
        question: "Do you have an IT asset management program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_14",
        category: "Asset Management",
        question: "Do you have restrictions on storage devices?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_15",
        category: "Endpoint Protection",
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_16",
        category: "Network Security",
        question: "Do you implement network segmentation?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_17",
        category: "Network Security",
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_18",
        category: "Security Testing",
        question: "How frequently do you conduct vulnerability scanning?",
        type: "radio",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "privacy_19",
        category: "Security Testing",
        question: "How frequently do you conduct penetration testing?",
        type: "radio",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        required: true,
      },
      {
        id: "privacy_20",
        category: "Regulatory Compliance",
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "checkbox",
        options: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST", "None"],
        required: true,
      },
      {
        id: "privacy_21",
        category: "Access Control",
        question: "Do you have a formal access control policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_22",
        category: "Wireless Security",
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_23",
        category: "Access Control",
        question: "Do you have defined password parameters and requirements?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_24",
        category: "Access Control",
        question: "Do you implement least privilege access principles?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_25",
        category: "Access Control",
        question: "How frequently do you conduct access reviews?",
        type: "radio",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "privacy_26",
        category: "Network Access",
        question: "Do you require device authentication for network access?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_27",
        category: "Remote Access",
        question: "Do you have secure remote logical access controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_28",
        category: "Third-Party Management",
        question: "Do you have a third-party oversight program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_29",
        category: "Third-Party Management",
        question: "Do you assess third-party security controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_30",
        category: "Third-Party Management",
        question: "Do you verify third-party compliance controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_31",
        category: "Human Resources",
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_32",
        category: "Training",
        question: "Do you provide information security training to employees?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_33",
        category: "Training",
        question: "Do you provide privacy training to employees?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_34",
        category: "Training",
        question: "Do you provide role-specific compliance training?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_35",
        category: "Policy Management",
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_36",
        category: "Human Resources",
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_37",
        category: "Data Management",
        question: "Do you have a data management program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_38",
        category: "Privacy Policy",
        question: "Do you have a published privacy policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_39",
        category: "Data Retention",
        question: "Do you have consumer data retention policies?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_40",
        category: "Data Protection",
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_41",
        category: "Incident Response",
        question: "Do you have data breach protocols?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_42",
        category: "Consumer Rights",
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "privacy_43",
        category: "Data Collection",
        question: "Do you collect NPI, PII, or PHI data?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
    ],
  }

  return questionSets[type as keyof typeof questionSets] || questionSets["Cybersecurity Assessment"]
}

function VendorAssessmentComponent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const assessmentId = params.id as string
  const token = searchParams.get("token")

  const [assessment, setAssessment] = useState<UIAssessment | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [vendorInfo, setVendorInfo] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    employeeCount: "",
    industry: "",
    description: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedVendorAssessment, setSavedVendorAssessment] = useState<any>(null)
  const [useAiAssessment, setUseAiAssessment] = useState(true) // Default to true for AI assessments
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [showReviewStep, setShowReviewStep] = useState(false)
  const [isAiPoweredAssessment, setIsAiPoweredAssessment] = useState(false)

  useEffect(() => {
    async function loadAssessment() {
      try {
        setIsLoading(true)

        // Validate token
        if (!token) {
          setIsValidToken(false)
          return
        }

        // Check if this is an AI-powered assessment from URL parameter
        const aiParam = searchParams.get("ai")
        const isAiFromUrl = aiParam === "true"

        console.log("🔍 URL Parameters:", {
          assessmentId,
          token,
          aiParam,
          isAiFromUrl,
          fullUrl: window.location.href,
        })

        // For internal delegations - redirect to appropriate internal assessment page
        if (assessmentId.startsWith("internal-")) {
          // Get delegation info
          const delegationKey = `delegation-${assessmentId}`
          const delegationInfo = localStorage.getItem(delegationKey)

          let isAiPowered = isAiFromUrl // Start with URL parameter
          let assessmentType = "Internal Risk Assessment"
          let delegationType = "team"
          let method = "manual"

          if (delegationInfo) {
            try {
              const delegation = JSON.parse(delegationInfo)
              isAiPowered = delegation.isAiPowered || isAiFromUrl
              assessmentType = delegation.assessmentType || "Internal Risk Assessment"
              delegationType = delegation.delegationType || "team"
              method = delegation.method || "manual"
              console.log("📋 Delegation info found:", delegation)
            } catch (error: any) { // Explicitly type error
              console.error("Error parsing delegation info:", error.message)
            }
          }

          // Also check delegated assessments
          try {
            const delegated = JSON.parse(localStorage.getItem("delegatedAssessments") || "[]")
            const delegation = delegated.find((d: any) => d.assessmentId === assessmentId)
            if (delegation) {
              assessmentType = delegation.assessmentType
              isAiPowered =
                delegation.method === "ai" || delegation.assessmentType.includes("(AI-Powered)") || isAiFromUrl
              delegationType = delegation.delegationType || "team"
              method = delegation.method || "manual"
              console.log("📋 Delegated assessment found:", delegation)
            }
          } catch (error: any) { // Explicitly type error
            console.error("Error loading delegation data:", error.message)
          }

          console.log("🤖 Final AI-powered status:", isAiPowered)
          console.log("📋 Final assessment type:", assessmentType)
          console.log("👥 Delegation type:", delegationType)
          console.log("⚙️ Method:", method)

          // Store the assessment info for the internal pages to use
          const internalAssessmentInfo = {
            assessmentId,
            assessmentType: assessmentType.replace(" (AI-Powered)", ""), // Remove AI indicator for category matching
            isAiPowered,
            delegationType,
            method,
            token,
          }

          localStorage.setItem("internalAssessmentInfo", JSON.stringify(internalAssessmentInfo))

          // Redirect to appropriate internal assessment page
          if (isAiPowered || method === "ai") {
            // Redirect to AI assessment page
            window.location.href = `/risk-assessment/ai-assessment?delegated=true&id=${assessmentId}&token=${token}`
          } else {
            // Redirect to manual assessment page
            window.location.href = `/risk-assessment?delegated=true&id=${assessmentId}&token=${token}`
          }
          return
        }

        // Load assessment from database for external assessments
        const assessmentData = await getAssessmentById(assessmentId)

        if (!assessmentData) {
          setError("Assessment not found")
          return
        }

        // Check if already completed
        if (assessmentData.status === "completed") {
          setIsSubmitted(true)
          return
        }

        // Check if this is an AI-powered assessment
        const isAiPowered = assessmentData.assessment_type.includes("(AI-Powered)") || isAiFromUrl

        console.log("🤖 External AI-powered assessment detected:", isAiPowered)

        setAssessment({
          id: assessmentData.id,
          companyName: "RiskShield AI",
          assessmentType: assessmentData.assessment_type,
          dueDate: assessmentData.due_date || "2025-02-15",
          customMessage:
            assessmentData.custom_message ||
            (isAiPowered
              ? "Please complete this AI-powered assessment. You can upload documents for automatic analysis and completion."
              : "Please complete this assessment to help us evaluate our partnership."),
          contactEmail: "security@riskshield.ai",
          isAiPowered: isAiPowered,
          status: assessmentData.status,
          completedDate: assessmentData.completed_date,
        })

        setIsAiPoweredAssessment(isAiPowered)
        setQuestions(getAssessmentQuestions(assessmentData.assessment_type))
      } catch (err: any) { // Explicitly type error
        console.error("Error loading assessment:", err.message)
        setError("Failed to load assessment")
      } finally {
        setIsLoading(false)
      }
    }

    loadAssessment()
  }, [assessmentId, token, searchParams])

  useEffect(() => {
    if (assessment?.isAiPowered) {
      setIsAiPoweredAssessment(true)
      setUseAiAssessment(true) // Auto-enable AI features for AI assessments
    }
  }, [assessment])

  useEffect(() => {
    if (assessmentId) {
      const saved = localStorage.getItem(`vendorAssessment-${assessmentId}`)
      if (saved) {
        setSavedVendorAssessment(JSON.parse(saved))
      }
    }
  }, [assessmentId])

  useEffect(() => {
    if (assessment && !isSubmitted && (Object.keys(answers).length > 0 || vendorInfo.companyName)) {
      const assessmentData = {
        currentStep,
        answers,
        vendorInfo,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem(`vendorAssessment-${assessmentId}`, JSON.stringify(assessmentData))
      setSavedVendorAssessment(assessmentData)
    }
  }, [currentStep, answers, vendorInfo, assessment, isSubmitted, assessmentId])

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleVendorInfoChange = (field: string, value: string) => {
    setVendorInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isStepComplete = (step: number) => {
    if (step === 0) {
      return vendorInfo.companyName && vendorInfo.contactName && vendorInfo.email
    }

    const stepQuestions = questions.slice(step * 2 - 2, step * 2)
    return stepQuestions.every((q: any) => { // Explicitly type q
      if (!q.required) return true
      const answer = answers[q.id]
      if (q.type === "checkbox") {
        return Array.isArray(answer) && answer.length > 0
      }
      return answer && answer.toString().trim() !== ""
    })
  }

  const handleNext = () => {
    if (currentStep < Math.ceil(questions.length / 2)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Remove saved assessment when submitting
    localStorage.removeItem(`vendorAssessment-${assessmentId}`)
    setSavedVendorAssessment(null)

    try {
      console.log("🔄 Starting assessment submission...")
      console.log("📋 Assessment ID:", assessmentId)
      console.log("👤 Vendor Info:", vendorInfo)
      console.log("📝 Assessment Answers:", answers)

      // Check if this is an internal delegation (ID starts with "internal-")
      const isInternalDelegation = assessmentId.startsWith("internal-")
      console.log("🏢 Is Internal Delegation:", isInternalDelegation)

      if (isInternalDelegation) {
        // For internal delegations, we'll simulate the submission since the assessment
        // doesn't exist in the database yet
        console.log("🔄 Processing internal delegation submission...")

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Store the completed assessment data locally for the delegator to see
        const completedAssessment = {
          id: assessmentId,
          vendorInfo,
          answers,
          completedDate: new Date().toISOString(),
          status: "completed",
        }

        console.log("💾 Saving completed assessment data...")

        // Save to localStorage for the delegator to see
        try {
          const existingDelegated = JSON.parse(localStorage.getItem("delegatedAssessments") || "[]")
          console.log("📂 Existing delegated assessments:", existingDelegated)

          const updatedDelegated = existingDelegated.map((delegation: any) =>
            delegation.assessmentId === assessmentId
              ? { ...delegation, status: "completed", completedDate: new Date().toISOString() }
              : delegation,
          )

          localStorage.setItem("delegatedAssessments", JSON.stringify(updatedDelegated))
          console.log("✅ Updated delegated assessments saved")
        } catch (localStorageError: any) { // Explicitly type error
          console.error("❌ Error updating localStorage:", localStorageError.message)
          // Don't fail the submission for localStorage errors
        }

        console.log("✅ Internal delegation completed successfully")
      } else {
        console.log("🔄 Processing external vendor assessment submission...")
        // Submit to database for external vendor assessments
        await submitAssessmentResponse(assessmentId, vendorInfo, answers)
        console.log("✅ External assessment submitted to database")
      }

      // Send notification email to the requesting company
      console.log("📧 Attempting to send notification email...")
      try {
        const notificationResult = await fetch("/api/notify-assessment-completion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentId,
            vendorName: vendorInfo.companyName,
            vendorEmail: vendorInfo.email,
            assessmentType: assessment?.assessmentType,
            completedDate: new Date().toISOString(),
          }),
        })

        if (notificationResult.ok) {
          console.log("✅ Completion notification sent to requesting company")
        } else {
          console.log("⚠️ Failed to send completion notification, but assessment was still submitted")
        }
      } catch (notificationError: any) // Explicitly type error
      {
        console.error("⚠️ Error sending completion notification:", notificationError.message)
        // Don't fail the submission for notification errors
      }

      console.log("🎉 Assessment submission completed successfully!")
      setIsSubmitted(true)
      alert("Assessment submitted successfully! The requesting company will be notified.")
    } catch (error: any) // Explicitly type error
    {
      console.error("💥 Error submitting assessment:", error)
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        assessmentId,
        isInternalDelegation: assessmentId.startsWith("internal-"),
      })
      alert("Failed to submit assessment. Please try again.")
    }
  }

  const loadSavedVendorAssessment = () => {
    if (savedVendorAssessment) {
      setCurrentStep(savedVendorAssessment.currentStep)
      setAnswers(savedVendorAssessment.answers)
      setVendorInfo(savedVendorAssessment.vendorInfo)
      setSavedVendorAssessment(null)
    }
  }

  const deleteSavedVendorAssessment = () => {
    localStorage.removeItem(`vendorAssessment-${assessmentId}`)
    setSavedVendorAssessment(null)
  }

  const calculateProgress = () => {
    const totalSteps = Math.ceil(questions.length / 2) + 1 // +1 for vendor info step
    return ((currentStep + 1) / totalSteps) * 100
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Assessment</h2>
            <p className="text-gray-600">Please wait while we load your assessment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{error || "Invalid Assessment Link"}</h2>
            <p className="text-gray-600 mb-4">
              {error ||
                "This assessment link is invalid or has expired. Please contact the requesting organization for a new link."}
            </p>
            <Button variant="outline" onClick={() => window.close()}>
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing the {assessment?.assessmentType}. Your responses have been securely transmitted
              to {assessment?.companyName}.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li>• Your assessment will be reviewed by {assessment?.companyName}</li>
                <li>• A risk score will be calculated based on your responses</li>
                <li>• You may be contacted for additional information if needed</li>
                <li>• The results will be used to evaluate the business relationship</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.print()}>
                <FileText className="mr-2 h-4 w-4" />
                Print Confirmation
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => window.close()}>
                Close Window
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessment) {
    return null
  }

  const currentQuestions = currentStep === 0 ? [] : questions.slice((currentStep - 1) * 2, currentStep * 2)

  // Helper function to render the evidence citation
  const renderEvidenceCitation = (excerptData: any) => {
    if (!excerptData || excerptData.excerpt === 'No directly relevant evidence found after comprehensive search') {
      return 'No directly relevant evidence found after comprehensive search.';
    }

    let citationParts: string[] = [];
    const fileName = excerptData.fileName;
    const pageNumber = excerptData.pageNumber;
    const label = excerptData.label; // This will be '4th Party' or null

    if (fileName && String(fileName).trim() !== '' && fileName !== 'N/A') {
      citationParts.push(`"${fileName}"`);
    }

    // Explicitly add page number or 'N/A'
    if (pageNumber != null && String(pageNumber).trim() !== '' && pageNumber !== 'N/A') {
      citationParts.push(`Page: ${pageNumber}`);
    } else {
      citationParts.push(`Page: N/A`); // Explicitly show N/A if page number is missing or invalid
    }

    if (label === '4th Party') {
      citationParts.push('4th Party');
    }

    // Filter out any potentially empty or null parts before joining
    const filteredParts = citationParts.filter(part => part && String(part).trim() !== ''); // Ensure parts are non-empty strings

    // The excerpt is always the first part of the return string
    const excerptText = `"${excerptData.excerpt}"`;

    if (filteredParts.length === 0) {
      return excerptText;
    }

    // Join parts for the citation, ensuring the excerpt is first
    return `${excerptText} (from ${filteredParts.join(' - ')})`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {isAiPoweredAssessment ? "AI-Powered " : ""}Vendor Risk Assessment
                </h1>
                <p className="text-sm text-gray-600">Requested by {assessment.companyName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isAiPoweredAssessment && (
                <Badge className="bg-blue-600 text-white">
                  <Bot className="h-3 w-3 mr-1" />
                  AI-POWERED
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(calculateProgress())}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isAiPoweredAssessment ? "bg-blue-600" : "bg-gray-600"
                }`}
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <main> {/* Added missing <main> tag here */}
        {/* Main content of the assessment */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {savedVendorAssessment && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    You have a saved draft from{" "}
                    {new Date(savedVendorAssessment.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-blue-800">
                    Would you like to continue where you left off?
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={loadSavedVendorAssessment}>
                    Load Draft
                  </Button>
                  <Button variant="destructive" size="sm" onClick={deleteSavedVendorAssessment}>
                    Delete Draft
                  </Button>
                </div>
              </div>
            )}

            {/* Step 0: Vendor Information */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Vendor Information</span>
                  </CardTitle>
                  <CardDescription>
                    Please provide your company and contact details for this assessment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="companyName">Your Company Name *</Label>
                    <Input
                      id="companyName"
                      value={vendorInfo.companyName}
                      onChange={(e) => handleVendorInfoChange("companyName", e.target.value)}
                      placeholder="e.g., Acme Corp"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Your Name *</Label>
                    <Input
                      id="contactName"
                      value={vendorInfo.contactName}
                      onChange={(e) => handleVendorInfoChange("contactName", e.target.value)}
                      placeholder="e.g., Jane Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Your Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={vendorInfo.email}
                      onChange={(e) => handleVendorInfoChange("email", e.target.value)}
                      placeholder="e.g., jane.doe@acmecorp.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Your Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={vendorInfo.phone}
                      onChange={(e) => handleVendorInfoChange("phone", e.target.value)}
                      placeholder="e.g., (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Your Company Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      value={vendorInfo.website}
                      onChange={(e) => handleVendorInfoChange("website", e.target.value)}
                      placeholder="e.g., https://www.acmecorp.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeCount">Number of Employees (Optional)</Label>
                    <Input
                      id="employeeCount"
                      value={vendorInfo.employeeCount}
                      onChange={(e) => handleVendorInfoChange("employeeCount", e.target.value)}
                      placeholder="e.g., 50-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry (Optional)</Label>
                    <Input
                      id="industry"
                      value={vendorInfo.industry}
                      onChange={(e) => handleVendorInfoChange("industry", e.target.value)}
                      placeholder="e.g., Software Development"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Company Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={vendorInfo.description}
                      onChange={(e) => handleVendorInfoChange("description", e.target.value)}
                      placeholder="Briefly describe your company..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleNext} disabled={!isStepComplete(0)}>
                      Continue to Questions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI-Powered Assessment Flow */}
            {isAiPoweredAssessment && currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <span>AI-Powered Document Upload</span>
                  </CardTitle>
                  <CardDescription>
                    Upload your policies and procedures for AI to analyze and pre-fill answers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="document-upload" className="text-sm font-medium text-gray-700">
                      Upload Supporting Documents
                    </Label>
                    <div className="mt-2 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-blue-25">
                      <input
                        id="document-upload"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx"
                        onChange={(e) => {
                          if (e.target.files) {
                            setUploadedFiles(Array.from(e.target.files));
                          }
                        }}
                        className="hidden"
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                        <p className="text-lg font-medium text-blue-900 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-blue-700">
                          PDF, DOC, DOCX, TXT, CSV, XLSX, PPT, PPTX up to 10MB each
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          💡 Recommended: Security policies, SOC reports, compliance certificates, procedures
                        </p>
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h5 className="font-medium text-blue-900">Uploaded Files ({uploadedFiles.length}):</h5>
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(1)} MB)
                              </span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => {
                              setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
                            }}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={async () => {
                      setIsAnalyzing(true);
                      setError(null);
                      try {
                        const formData = new FormData();
                        uploadedFiles.forEach(file => formData.append('files', file));
                        formData.append('questions', JSON.stringify(questions));
                        formData.append('assessmentType', assessment.assessmentType);

                        const response = await fetch("/api/ai-assessment/analyze", {
                          method: "POST",
                          body: formData,
                        });

                        if (!response.ok) {
                          const errorData = await response.json();
                          throw new Error(errorData.error || "AI analysis failed");
                        }

                        const result = await response.json();
                        setAnalysisResults(result);
                        setAnswers(result.answers); // Pre-fill answers with AI suggestions
                        setShowReviewStep(true); // Move to review step
                      } catch (err: any) {
                        console.error("AI Analysis Failed:", err);
                        setError(err.message || "Failed to perform AI analysis. Please try again.");
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    disabled={isAnalyzing || uploadedFiles.length === 0}
                  >
                    {isAnalyzing ? (
                      <>
                        <Clock className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Documents...
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-5 w-5" />
                        🚀 Analyze Documents with AI
                      </>
                    )}
                  </Button>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-sm text-red-800">
                          <strong>Error:</strong> {error}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <p className="text-sm text-amber-800">
                        <strong>Note:</strong> AI-generated responses are suggestions based on your documents.
                        Please review and verify all answers before submission.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={() => setShowReviewStep(true)} disabled={!analysisResults}>
                      Review AI Answers
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Review Step */}
            {isAiPoweredAssessment && currentStep === 1 && showReviewStep && analysisResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <span>Review AI-Generated Answers</span>
                  </CardTitle>
                  <CardDescription>
                    The AI has analyzed your documents and provided suggested answers. Please review and edit as needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {questions.map((question: any, index: number) => (
                    <div key={question.id} className="space-y-4 border-b pb-6 last:border-b-0 last:pb-0">
                      <div>
                        <div className="flex items-start space-x-2 mb-2">
                          <Badge variant="outline" className="mt-1">
                            {question.category}
                          </Badge>
                          {question.required && <span className="text-red-500 text-sm">*</span>}
                          {analysisResults.confidenceScores?.[question.id] !== undefined && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              AI Confidence: {Math.round(analysisResults.confidenceScores[question.id] * 100)}%
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {index + 1}. {question.question}
                        </h3>
                      </div>

                      {/* AI Suggested Answer Display */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">
                          <Bot className="inline h-4 w-4 mr-1" />
                          AI Suggestion:
                        </p>
                        <p className="text-sm font-medium text-blue-900">
                          {typeof analysisResults.answers[question.id] === "boolean"
                            ? (analysisResults.answers[question.id] ? "Yes" : "No")
                            : Array.isArray(analysisResults.answers[question.id])
                              ? (analysisResults.answers[question.id] as string[]).join(", ")
                              : analysisResults.answers[question.id] || "N/A"}
                        </p>
                        {analysisResults.documentExcerpts?.[question.id] &&
                          analysisResults.documentExcerpts[question.id].length > 0 && (
                            <div className="mt-3 text-xs text-gray-700 italic ml-4 p-2 bg-gray-50 border border-gray-100 rounded">
                              <Info className="inline h-3 w-3 mr-1" />
                              <strong>Evidence:</strong> {renderEvidenceCitation(analysisResults.documentExcerpts[question.id][0])}
                            </div>
                          )}
                      </div>

                      {/* Editable Answer Field */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Label htmlFor={`answer-${question.id}`} className="text-sm font-medium text-gray-700">
                          Your Final Answer (Edit if needed)
                        </Label>
                        {question.type === "boolean" && (
                          <div className="flex space-x-4 mt-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={answers[question.id] === true}
                                onChange={() => handleAnswerChange(question.id, true)}
                                className="mr-2"
                              />
                              Yes
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={answers[question.id] === false}
                                onChange={() => handleAnswerChange(question.id, false)}
                                className="mr-2"
                              />
                              No
                            </label>
                          </div>
                        )}
                        {question.type === "multiple" && (
                          <select
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                          >
                            <option value="">Select an option</option>
                            {question.options?.map((option: string) => ( // Explicitly type option
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                        {question.type === "textarea" && (
                          <Textarea
                            id={`answer-${question.id}`}
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            placeholder="Provide your detailed response here..."
                            rows={4}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={() => setShowReviewStep(false)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Upload
                    </Button>
                    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Submit Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Manual Assessment Flow */}
            {!isAiPoweredAssessment && currentStep > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Assessment Questions</span>
                  </CardTitle>
                  <CardDescription>
                    Please answer the following questions about your organization's practices.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {currentQuestions.map((question: any, index: number) => ( // Explicitly type question
                    <div key={question.id} className="space-y-4 border-b pb-6 last:border-b-0 last:pb-0">
                      <div>
                        <div className="flex items-start space-x-2 mb-2">
                          <Badge variant="outline" className="mt-1">
                            {question.category}
                          </Badge>
                          {question.required && <span className="text-red-500 text-sm">*</span>}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {(currentStep - 1) * 2 + index + 1}. {question.question}
                        </h3>
                      </div>

                      {question.type === "radio" && (
                        <RadioGroup
                          value={answers[question.id] || ""}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                          className="space-y-2"
                        >
                          {question.options.map((option: string) => ( // Explicitly type option
                            <div key={option} className="flex items-center">
                              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                              <Label htmlFor={`${question.id}-${option}`} className="ml-2">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {question.type === "checkbox" && (
                        <div className="space-y-2">
                          {question.options.map((option: string) => ( // Explicitly type option
                            <div key={option} className="flex items-center">
                              <Checkbox
                                id={`${question.id}-${option}`}
                                checked={answers[question.id]?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                  const currentAnswers = answers[question.id] || []
                                  if (checked) {
                                    handleAnswerChange(question.id, [...currentAnswers, option])
                                  } else {
                                    handleAnswerChange(
                                      question.id,
                                      currentAnswers.filter((item: string) => item !== option), // Explicitly type item
                                    )
                                  }
                                }}
                              />
                              <Label htmlFor={`${question.id}-${option}`} className="ml-2">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "textarea" && (
                        <Textarea
                          id={question.id}
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Provide your detailed response here..."
                          rows={4}
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    {currentStep < Math.ceil(questions.length / 2) ? (
                      <Button onClick={handleNext} disabled={!isStepComplete(currentStep)}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={!isStepComplete(currentStep)}>
                        <FileCheck className="mr-2 h-4 w-4" />
                        Submit Assessment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default function VendorAssessment() {
  try {
    return <VendorAssessmentComponent />
  } catch (error: any) { // Explicitly type error
    console.error("Component error:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment Loading</h2>
          <p className="text-gray-600 mb-4">The assessment is loading in demo mode. This is normal for testing.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }
}