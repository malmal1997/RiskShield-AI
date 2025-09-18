"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, CheckCircle, XCircle, AlertCircle, FileText, Upload } from "lucide-react"

interface ProviderStatus {
  configured: boolean
  working: boolean
  status: string
  model: string
}

interface TestResult {
  providers: {
    google: ProviderStatus
  }
  summary: {
    totalProviders: number
    workingProviders: number
    recommendation: string
  }
}

interface AnalysisResult {
  riskScore: number
  riskLevel: string
  aiProvider: string
  answers: Record<string, any>
  documentsAnalyzed: number
}

export default function AITestPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isTestingProviders, setIsTestingProviders] = useState(false)
  const [isTestingAnalysis, setIsTestingAnalysis] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testProviders = async () => {
    setIsTestingProviders(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch("/api/ai-assessment/test", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Test failed: ${response.status}`)
      }

      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      console.error("Provider test failed:", error)
      setError(error instanceof Error ? error.message : "Provider test failed")
    } finally {
      setIsTestingProviders(false)
    }
  }

  const testAnalysis = async () => {
    setIsTestingAnalysis(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const response = await fetch("/api/ai-assessment/test", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Analysis test failed: ${response.status}`)
      }

      const result = await response.json()
      setAnalysisResult(result.testResult)
    } catch (error) {
      console.error("Analysis test failed:", error)
      setError(error instanceof Error ? error.message : "Analysis test failed")
    } finally {
      setIsTestingAnalysis(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Provider Test Dashboard</h1>
          <p className="text-gray-600">Test your AI providers and document analysis capabilities</p>
        </div>

        {/* File Support Information */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>File Support Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">✅ Supported Files:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• .pdf (PDF documents)</li>
                  <li>• .doc/.docx (Word documents)</li>
                  <li>• .xls/.xlsx (Excel files)</li>
                  <li>• .ppt/.pptx (PowerPoint presentations)</li>
                  <li>• .txt (Plain text)</li>
                  <li>• .md (Markdown)</li>
                  <li>• .json (JSON data)</li>
                  <li>• .csv (CSV data)</li>
                  <li>• .html/.xml (Web/XML documents)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">💡 Note:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Google AI handles most common document types directly.</li>
                  <li>• No client-side conversion needed for PDFs, Word, Excel, etc.</li>
                  <li>• Ensure documents contain extractable text (not image-only scans).</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Recommendation:</strong> For best results, ensure your documents are text-searchable. If you have scanned PDFs, consider using an OCR tool before uploading.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provider Status Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>AI Provider Status</span>
              </CardTitle>
              <CardDescription>Test if your Google AI provider is configured and working</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testProviders} disabled={isTestingProviders} className="w-full">
                {isTestingProviders ? "Testing..." : "Test Google AI Provider"}
              </Button>

              {testResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Google AI (Gemini 1.5 Flash)</span>
                    </div>
                    <Badge
                      className={
                        testResult.providers.google.working
                          ? "bg-green-100 text-green-800"
                          : testResult.providers.google.configured
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {testResult.providers.google.working ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {testResult.providers.google.status}
                    </Badge>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Summary:</strong> {testResult.summary.workingProviders} of{" "}
                      {testResult.summary.totalProviders} providers working
                    </p>
                    <p className="text-sm text-blue-700 mt-1">{testResult.summary.recommendation}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Analysis Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-green-600" />
                <span>Document Analysis Test</span>
              </CardTitle>
              <CardDescription>Test AI analysis with a sample security policy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testAnalysis} disabled={isTestingAnalysis} className="w-full">
                {isTestingAnalysis ? "Analyzing..." : "Test Document Analysis"}
              </Button>

              {analysisResult && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{analysisResult.riskScore}</div>
                      <div className="text-sm text-gray-600">Risk Score</div>
                    </div>
                    <div className="text-center">
                      <Badge
                        className={`text-lg px-3 py-1 ${
                          analysisResult.riskLevel === "Low"
                            ? "bg-green-100 text-green-800"
                            : analysisResult.riskLevel === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {analysisResult.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>AI Provider:</strong> {analysisResult.aiProvider}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      <strong>Documents Analyzed:</strong> {analysisResult.documentsAnalyzed}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      <strong>Questions Answered:</strong> {Object.keys(analysisResult.answers).length}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Sample Answers:</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(analysisResult.answers)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">Question {key}:</span>
                            <span className="font-medium">{value?.toString()}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Test Error</span>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✅ If tests pass: Go to AI Assessment and upload your documents for analysis</p>
              <p>❌ If tests fail: Check your GOOGLE_GENERATIVE_AI_API_KEY in environment variables</p>
              <p>🔍 For debugging: Check /api/ai-assessment/debug for detailed info</p>
            </div>
            <div className="mt-4 space-x-2">
              <Button onClick={() => (window.location.href = "/risk-assessment/ai-assessment")}>
                Try AI Assessment
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/api/ai-assessment/debug")}>
                View Debug Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
