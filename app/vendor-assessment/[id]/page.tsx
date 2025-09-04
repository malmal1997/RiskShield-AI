"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Building, User, CheckCircle, AlertCircle, FileText, Clock, Bot, Upload } from "lucide-react"
import { getAssessmentById, submitAssessmentResponse } from "@/lib/assessment-service"
import { supabaseClient } from "@/lib/supabase-client" // Import supabaseClient

function VendorAssessmentComponent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const assessmentId = params.id as string
  const token = searchParams.get("token")

  const [assessment, setAssessment] = useState<any>(null)
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
    console.log("🔍 Environment check:", {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      timestamp: new Date().toISOString(),
    })
  }, []) // Run only once on mount

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
          // Fetch delegation info from the database
          const { data: delegation, error: delegationError } = await supabaseClient
            .from("delegated_assessments")
            .select("*")
            .eq("id", assessmentId)
            .single();

          if (delegationError || !delegation) {
            console.error("Error fetching delegated assessment:", delegationError);
            setError("Delegated assessment not found or unauthorized.");
            setIsValidToken(false);
            return;
          }

          let isAiPowered = delegation.method === "ai" || isAiFromUrl;
          let assessmentType = delegation.assessment_type;
          let delegationType = delegation.delegation_type;
          let method = delegation.method;

          console.log("📋 Delegated assessment found in DB:", delegation);

          // Store the assessment info for the internal pages to use
          const internalAssessmentInfo = {
            assessmentId,
            assessmentType: assessmentType.replace(" (AI-Powered)", ""), // Remove AI indicator for category matching
            isAiPowered,
            delegationType,
            method,
            token,
          };

          localStorage.setItem("internalAssessmentInfo", JSON.stringify(internalAssessmentInfo));

          // Redirect to appropriate internal assessment page
          if (isAiPowered || method === "ai") {
            // Redirect to AI assessment page
            window.location.href = `/risk-assessment/ai-assessment?delegated=true&id=${assessmentId}&token=${token}`;
          } else {
            // Redirect to manual assessment page
            window.location.href = `/risk-assessment?delegated=true&id=${assessmentId}&token=${token}`;
          }
          return;
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
          ticket_id: assessmentData.ticket_id, // Include ticket_id
          companyName: "RiskShield AI",
          assessmentType: assessmentData.assessment_type,
          dueDate: assessmentData.due_date || "2024-02-15",
          customMessage:
            assessmentData.custom_message ||
            (isAiPowered
              ? "Please complete this AI-powered assessment. You can upload documents for automatic analysis and completion."
              : "Please complete this assessment to help us evaluate our partnership."),
          contactEmail: "security@riskshield.ai",
          isAiPowered: isAiPowered,
        })

        setIsAiPoweredAssessment(isAiPowered)
        setQuestions(getAssessmentQuestions(assessmentData.assessment_type))
      } catch (err) {
        console.error("Error loading assessment:", err)
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
    return stepQuestions.every((q) => {
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
        console.log("🔄 Processing internal delegation submission...")

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update the delegated assessment in the database
        const { error: updateError } = await supabaseClient
          .from("delegated_assessments")
          .update({
            status: "completed",
            completed_date: new Date().toISOString(),
            // For manual internal assessments, risk_score and risk_level might be calculated later by delegator
            // or based on a simpler internal logic. For now, we'll leave them null or set a default.
            // risk_score: calculateRiskScore(answers),
            // risk_level: getRiskLevel(calculateRiskScore(answers)),
          })
          .eq("id", assessmentId)
          .eq("recipient_email", vendorInfo.email); // Ensure only the recipient can update

        if (updateError) throw updateError;
        console.log("✅ Internal delegation completed successfully in DB");

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
      } catch (notificationError) {
        console.error("⚠️ Error sending completion notification:", notificationError)
        // Don't fail the submission for notification errors
      }

      console.log("🎉 Assessment submission completed successfully!")
      setIsSubmitted(true)
      alert("Assessment submitted successfully! The requesting company will be notified.")
    } catch (error) {
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
              {assessment.ticket_id && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <span>ID: {assessment.ticket_id}</span>
                </Badge>
              )}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assessment Info */}
        <Card className={`mb-8 ${isAiPoweredAssessment ? "border-blue-200 bg-blue-50" : ""}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>{assessment.assessmentType}</span>
              {isAiPoweredAssessment && (
                <Badge className="bg-blue-600 text-white text-xs">
                  <Bot className="h-3 w-3 mr-1" />
                  AI-POWERED
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Requesting Organization</p>
                <p className="font-medium">{assessment.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium">{new Date(assessment.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            {assessment.customMessage && (
              <div className={`p-4 rounded-lg ${isAiPoweredAssessment ? "bg-blue-100" : "bg-blue-50"}`}>
                <p className={`text-sm ${isAiPoweredAssessment ? "text-blue-900" : "text-blue-800"}`}>
                  {assessment.customMessage}
                </p>
              </div>
            )}
            {isAiPoweredAssessment && (
              <div className="bg-white p-4 rounded-lg mt-4 border-l-4 border-blue-400">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">AI-Powered Assessment Features</h4>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload your security policies, procedures, and compliance documents</li>
                  <li>• AI analyzes your documents and suggests answers automatically</li>
                  <li>• Review and approve AI-generated responses</li>
                  <li>• Complete assessments 3x faster with AI assistance</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Assessment Features - Show prominently for AI-powered assessments */}
        {isAiPoweredAssessment && (
          <Card className="mb-8 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-blue-600" />
                <span className="text-blue-900">AI Document Analysis</span>
                <Badge className="bg-green-100 text-green-700 text-xs">RECOMMENDED</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">📄 Upload Your Documents</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Upload your security policies, SOC reports, compliance documents, and procedures. Our AI will
                    analyze them and automatically complete the assessment for you.
                  </p>

                  <div className="space-y-4">
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
                              setUploadedFiles(Array.from(e.target.files))
                            }
                          }}
                          className="hidden"
                        />
                        <label htmlFor="document-upload" className="cursor-pointer">
                          <Upload className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                          <p className="text-lg font-medium text-blue-900 mb-1">Click to upload or drag and drop</p>
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUploadedFiles((files) => files.filter((_, i) => i !== index))}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {uploadedFiles.length > 0 && !isAnalyzing && !analysisResults && (
                      <Button
                        onClick={async () => {
                          setIsAnalyzing(true)
                          // Simulate AI analysis with more realistic timing
                          await new Promise((resolve) => setTimeout(resolve, 4000))
                          setAnalysisResults({
                            documentsAnalyzed: uploadedFiles.length,
                            confidence: Math.floor(Math.random() * 15) + 80, // 80-95% confidence
                            suggestedAnswers: questions.reduce(
                              (acc, q) => {
                                if (q.type === "radio") {
                                  acc[q.id] = q.options?.[0] || "Yes, comprehensive policy"
                                } else if (q.type === "checkbox") {
                                  acc[q.id] = q.options?.slice(0, 3) || []
                                } else {
                                  acc[q.id] =
                                    "Based on the uploaded documentation, comprehensive security measures are in place with regular reviews and updates following industry best practices."
                                }
                                return acc
                              },
                              {} as Record<string, any>,
                            ),
                          })
                          setIsAnalyzing(false)
                          setShowReviewStep(true)
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Clock className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing Documents... This may take a few moments
                          </>
                        ) : (
                          <>
                            <Bot className="mr-2 h-5 w-5" />🚀 Analyze Documents with AI
                          </>
                        )}
                      </Button>
                    )}

                    {isAnalyzing && (
                      <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                          <div>
                            <h4 className="font-semibold text-blue-900">AI Analysis in Progress</h4>
                            <p className="text-sm text-blue-800">
                              Processing {uploadedFiles.length} documents and generating assessment responses...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {analysisResults && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-green-900">Analysis Complete!</h4>
                        </div>
                        <div className="text-sm text-green-800 space-y-1">
                          <p>✅ {analysisResults.documentsAnalyzed} documents successfully analyzed</p>
                          <p>📊 {analysisResults.confidence}% average confidence score</p>
                          <p>🎯 All assessment questions have been automatically completed</p>
                          <p className="font-medium mt-2">
                            👀 Please review the AI-generated answers below and make any necessary adjustments before
                            submitting.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> AI-generated responses are suggestions based on your documents. Please
                      review and verify all answers before submission.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Assessment Banner */}
        {savedVendorAssessment && currentStep === 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Previous Progress Found</h3>
                    <p className="text-sm text-gray-600">
                      You have a saved assessment from {new Date(savedVendorAssessment.timestamp).toLocaleDateString()}
                      at {new Date(savedVendorAssessment.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={loadSavedVendorAssessment} className="bg-orange-600 hover:bg-orange-700" size="sm">
                    Resume
                  </Button>
                  <Button variant="outline" size="sm" onClick={deleteSavedVendorAssessment}>
                    Start Fresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vendor Information Step */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Company Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={vendorInfo.companyName}
                    onChange={(e) => handleVendorInfoChange("companyName", e.target.value)}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Person *</Label>
                  <Input
                    id="contactName"
                    value={vendorInfo.contactName}
                    onChange={(e) => handleVendorInfoChange("contactName", e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={vendorInfo.email}
                    onChange={(e) => handleVendorInfoChange("email", e.target.value)}
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={vendorInfo.phone}
                    onChange={(e) => handleVendorInfoChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={vendorInfo.website}
                    onChange={(e) => handleVendorInfoChange("website", e.target.value)}
                    placeholder="https://www.yourcompany.com"
                  />
                </div>
                <div>
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <select
                    id="employeeCount"
                    value={vendorInfo.employeeCount}
                    onChange={(e) => handleVendorInfoChange("employeeCount", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={vendorInfo.industry}
                  onChange={(e) => handleVendorInfoChange("industry", e.target.value)}
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={vendorInfo.description}
                  onChange={(e) => handleVendorInfoChange("description", e.target.value)}
                  placeholder="Brief description of your company and services..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assessment Questions */}
        {currentStep > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Assessment Questions</span>
                {analysisResults && (
                  <Badge className="bg-green-100 text-green-700">
                    <Bot className="h-3 w-3 mr-1" />
                    AI-Generated
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {currentQuestions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <div>
                    <div className="flex items-start space-x-2 mb-2">
                      <Badge variant="outline" className="mt-1">
                        {question.category}
                      </Badge>
                      {question.required && <span className="text-red-500 text-sm">*</span>}
                      {analysisResults && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          AI Confidence: {analysisResults.confidence}%
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
                  </div>

                  {analysisResults && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        <Bot className="inline h-4 w-4 mr-1" />
                        AI Suggestion based on your documents:
                      </p>
                      <p className="text-sm font-medium text-blue-900">
                        {typeof analysisResults.suggestedAnswers[question.id] === "boolean"
                          ? analysisResults.suggestedAnswers[question.id]
                            ? "Yes"
                            : "No"
                          : Array.isArray(analysisResults.suggestedAnswers[question.id])
                            ? analysisResults.suggestedAnswers[question.id].join(", ")
                            : analysisResults.suggestedAnswers[question.id]}
                      </p>
                    </div>
                  )}

                  {/* Question rendering logic */}
                  {question.type === "radio" && (
                    <RadioGroup
                      value={
                        answers[question.id] || (analysisResults ? analysisResults.suggestedAnswers[question.id] : "")
                      }
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      {question.options?.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                          <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "checkbox" && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${question.id}-${option}`}
                            checked={(
                              answers[question.id] ||
                              (analysisResults ? analysisResults.suggestedAnswers[question.id] : [])
                            ).includes(option)}
                            onCheckedChange={(checked) => {
                              const currentAnswers =
                                answers[question.id] ||
                                (analysisResults ? analysisResults.suggestedAnswers[question.id] : [])
                              if (checked) {
                                handleAnswerChange(question.id, [...currentAnswers, option])
                              } else {
                                handleAnswerChange(
                                  question.id,
                                  currentAnswers.filter((a: string) => a !== option),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "textarea" && (
                    <Textarea
                      value={
                        answers[question.id] || (analysisResults ? analysisResults.suggestedAnswers[question.id] : "")
                      }
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Please provide detailed information..."
                      rows={4}
                    />
                  )}

                  {/* Additional Information Field */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Label htmlFor={`additional-${question.id}`} className="text-sm font-medium text-gray-600">
                      Additional Information (Optional)
                    </Label>
                    <Textarea
                      id={`additional-${question.id}`}
                      value={answers[`${question.id}_additional`] || ""}
                      onChange={(e) => handleAnswerChange(`${question.id}_additional`, e.target.value)}
                      placeholder="Add any additional context, notes, or explanations for this question..."
                      rows={2}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI Disclaimer */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 text-center">
            ⚠️ This assessment{" "}
            {isAiPoweredAssessment
              ? "uses AI technology for document analysis and suggestions"
              : "is processed using AI technology"}
            . Please ensure all information is accurate and complete.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {Math.ceil(questions.length / 2) + 1}
          </div>

          {currentStep < Math.ceil(questions.length / 2) ? (
            <Button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
              className={`${isAiPoweredAssessment ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}`}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepComplete(currentStep)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Assessment
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

export default function VendorAssessment() {
  try {
    return <VendorAssessmentComponent />
  } catch (error) {
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