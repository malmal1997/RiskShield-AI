import React from "react"
import { CheckCircle, AlertCircle } from "lucide-react"

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested"
  options?: string[]
  weight: number
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
      quote: string // Changed from excerpt
      relevance: string
      pageOrSection?: string
      pageNumber?: number // Added pageNumber
    }>
  >
}

interface ApproverInfo {
  name: string
  title: string
  role: string
  signature: string
}

interface CompanyInfo {
  companyName: string
  productName: string
}

interface SocInfo {
  socType: string
  reportType: string
  auditor: string
  auditorOpinion: string
  auditorOpinionDate: string
  socStartDate: string
  socEndDate: string
  socDateAsOf: string
  testedStatus: string
  exceptions: string
  nonOperationalControls: string
  companyName: string
  productService: string
  subserviceOrganizations: string
  userEntityControls: string
}

interface ReportContentProps {
  aiAnalysisResult: AIAnalysisResult
  currentCategory: {
    id: string
    name: string
    description: string
    icon: React.ElementType
    questions: Question[]
  }
  approverInfo: ApproverInfo
  companyInfo: CompanyInfo
  socInfo?: SocInfo
}

const getRiskLevelColorClass = (level: string) => {
  switch (level.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "medium-high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const ReportContent: React.FC<ReportContentProps> = ({
  aiAnalysisResult,
  currentCategory,
  approverInfo,
  companyInfo,
  socInfo,
}) => {
  return (
    <div className="p-8 bg-white font-sans text-gray-800">
      {/* Header */}
      <div className="text-center pb-8 mb-8 border-b-4 border-blue-600">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          {currentCategory.name} Risk Assessment Report
        </h1>
        <p className="text-lg text-gray-700">
          AI-Powered Risk Analysis • Generated {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Summary Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-sm font-medium text-blue-800 uppercase mb-2">Risk Score</h3>
            <p className="text-4xl font-bold text-blue-600">{aiAnalysisResult.riskScore}%</p>
          </div>
          <div className={`rounded-lg p-6 text-center border ${getRiskLevelColorClass(aiAnalysisResult.riskLevel)}`}>
            <h3 className="text-sm font-medium uppercase mb-2">Risk Level</h3>
            <p className="text-2xl font-bold">{aiAnalysisResult.riskLevel} Risk</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-sm font-medium text-green-800 uppercase mb-2">Documents Analyzed</h3>
            <p className="text-4xl font-bold text-green-600">{aiAnalysisResult.documentsAnalyzed}</p>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
          <p className="text-lg">
            <strong>Company Name:</strong> {companyInfo.companyName || "Not specified"}
          </p>
          <p className="text-lg">
            <strong>Product/Service:</strong> {companyInfo.productName || "Not specified"}
          </p>
          <p className="text-lg">
            <strong>Assessment Date:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* SOC Information (if applicable) */}
      {currentCategory.id === "soc-compliance" && socInfo && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">SOC Assessment Information</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <p>
                <strong>SOC Type:</strong> {socInfo.socType}
              </p>
              <p>
                <strong>Report Type:</strong> {socInfo.reportType}
              </p>
              <p>
                <strong>Auditor:</strong> {socInfo.auditor || "Not specified"}
              </p>
              <p>
                <strong>Auditor Opinion:</strong> {socInfo.auditorOpinion || "Not specified"}
              </p>
              <p>
                <strong>Company:</strong> {socInfo.companyName}
              </p>
              <p>
                <strong>Product/Service:</strong> {socInfo.productService}
              </p>
            </div>
            {socInfo.subserviceOrganizations && (
              <p>
                <strong>Subservice Organizations:</strong> {socInfo.subserviceOrganizations}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Approval Information */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Approval Information</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
          <p className="text-lg">
            <strong>Approved By:</strong> {approverInfo.name}
          </p>
          <p className="text-lg">
            <strong>Title:</strong> {approverInfo.title}
          </p>
          <p className="text-lg">
            <strong>Digital Signature:</strong>{" "}
            <span className="font-serif italic text-blue-600 text-xl">{approverInfo.signature}</span>
          </p>
        </div>
      </div>

      {/* Assessment Questions & Responses */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Questions & Responses</h2>
        {currentCategory.questions.map((question, index) => {
          const answer = aiAnalysisResult.answers[question.id]
          const reasoning = aiAnalysisResult.reasoning[question.id] || "No reasoning provided"
          const excerpts = aiAnalysisResult.documentExcerpts?.[question.id] || []

          return (
            <div key={question.id} className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {index + 1}. {question.question}
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">
                  Weight: {question.weight}
                </span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">
                  Confidence: {Math.round((aiAnalysisResult.confidenceScores[question.id] || 0) * 100)}%
                </span>
              </div>

              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Answer:</p>
                <p className="font-semibold text-blue-900 text-lg">
                  {question.type === "boolean"
                    ? typeof answer === "boolean"
                      ? answer
                        ? "Yes"
                        : "No"
                      : String(answer)
                    : question.type === "tested"
                      ? answer === "tested"
                        ? "Tested"
                        : answer === "not_tested"
                          ? "Not Tested"
                          : String(answer)
                      : String(answer)}
                </p>
              </div>

              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-800 mb-2">Reasoning:</p>
                <p className="text-gray-700">{reasoning}</p>
              </div>

              {excerpts.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">Document Evidence:</p>
                  {excerpts.map((excerpt, excerptIndex) => (
                    <div key={excerptIndex} className="mb-3 last:mb-0">
                      <p className="text-sm text-green-800 italic">
                        "{excerpt.quote}"{" "}
                        {excerpt.pageNumber && `(Page ${excerpt.pageNumber})`}
                      </p>
                      {excerpt.fileName && (
                        <p className="text-xs text-green-600 mt-1">Source: {excerpt.fileName}</p>
                      )}
                      {excerpt.relevance && (
                        <p className="text-xs text-green-600">Relevance: {excerpt.relevance}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Overall Analysis */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Analysis</h2>
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 text-lg">{aiAnalysisResult.overallAnalysis}</p>
        </div>
      </div>

      {/* Risk Factors */}
      {aiAnalysisResult.riskFactors.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-red-700 mb-6">
            <AlertCircle className="inline-block h-6 w-6 mr-2 align-middle" />
            Risk Factors
          </h2>
          <ul className="list-none space-y-3 p-6 bg-red-50 border border-red-200 rounded-lg">
            {aiAnalysisResult.riskFactors.map((factor, index) => (
              <li key={index} className="flex items-start text-red-800">
                <span className="mr-3 mt-1">•</span>
                <span className="text-lg">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {aiAnalysisResult.recommendations.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            <CheckCircle className="inline-block h-6 w-6 mr-2 align-middle" />
            Recommendations
          </h2>
          <ul className="list-none space-y-3 p-6 bg-green-50 border border-green-200 rounded-lg">
            {aiAnalysisResult.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start text-green-800">
                <span className="mr-3 mt-1">•</span>
                <span className="text-lg">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-yellow-800 mb-3">⚠️ Important Disclaimer</h3>
        <p className="text-yellow-700 text-base">
          This assessment was generated using AI technology and should be reviewed by qualified professionals.
          RiskGuard AI may make mistakes. Please use with discretion and verify results with internal expertise.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
        <p>Report generated by RiskGuard AI - AI-Powered Risk Assessment Platform</p>
        <p>
          Assessment ID: {aiAnalysisResult.analysisDate.split("T")[0]}-{Math.random().toString(36).substr(2, 9)} •
          Generation Date: {new Date(aiAnalysisResult.analysisDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default ReportContent