"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Building,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  ArrowLeft, // Added ArrowLeft for back button
} from "lucide-react"
import Link from "next/link"

const demoSteps = [
  {
    id: 1,
    title: "Risk Assessment Dashboard",
    description: "Monitor your institution's overall risk posture with real-time metrics and insights.",
    component: "dashboard",
  },
  {
    id: 2,
    title: "Cybersecurity Assessment",
    description: "Complete a comprehensive cybersecurity risk evaluation with AI-powered recommendations.",
    component: "assessment",
  },
  {
    id: 3,
    title: "Compliance Report Generation",
    description: "Generate detailed compliance reports with automated analysis and action items.",
    component: "report",
  },
  {
    id: 4,
    title: "Third-Party Risk Evaluation",
    description: "Assess vendor risks and manage third-party relationships effectively.",
    component: "vendor",
  },
]

export default function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const startDemo = () => {
    setIsPlaying(true)
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsPlaying(false)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const resetDemo = () => {
    setCurrentStep(1)
    setProgress(0)
    setIsPlaying(false)
  }

  const renderDashboardDemo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-3xl font-bold text-green-600">94%</p>
                <p className="text-xs text-gray-500">Above industry average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Risks</p>
                <p className="text-3xl font-bold text-orange-600">3</p>
                <p className="text-xs text-gray-500">Require attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Trend</p>
                <p className="text-3xl font-bold text-blue-600">↓12%</p>
                <p className="text-xs text-gray-500">Improved this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Recent Risk Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Cybersecurity Assessment</p>
                  <p className="text-sm text-gray-500">Completed 2 days ago</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Third-Party Risk Review</p>
                  <p className="text-sm text-gray-500">In progress</p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-700">In Review</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAssessmentDemo = () => (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Cybersecurity Risk Assessment</CardTitle>
          <CardDescription>Answer questions about your current security posture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Do you have a formal incident response plan?
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="incident" value="yes" className="text-blue-600" defaultChecked />
                <span>Yes, documented and regularly tested</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="incident" value="partial" className="text-blue-600" />
                <span>Yes, but not regularly updated</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="incident" value="no" className="text-blue-600" />
                <span>No formal plan exists</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How often do you conduct security awareness training?
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Annually</option>
              <option>As needed</option>
              <option>Never</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">AI Recommendation</p>
                <p className="text-sm text-blue-700 mt-1">
                  Based on your responses, consider implementing multi-factor authentication for all administrative
                  accounts to enhance security posture.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-amber-800 text-center">
              ⚠️ RiskGuard AI may make mistakes. Please use with discretion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderReportDemo = () => (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Compliance Report - FDIC Requirements</CardTitle>
          <CardDescription>Generated on {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Compliance Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Information Security</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={95} className="w-20" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Business Continuity</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={88} className="w-20" />
                      <span className="text-sm font-medium">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Third-Party Risk</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-20" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Action Items</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span className="text-sm">Update disaster recovery testing schedule</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span className="text-sm">Review vendor risk assessments</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Security awareness training completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Executive Summary</h4>
              <p className="text-sm text-gray-700">
                Your institution demonstrates strong compliance with FDIC requirements, achieving an overall score of
                92%. Key strengths include robust information security controls and comprehensive staff training
                programs. Priority areas for improvement include disaster recovery testing frequency and third-party
                vendor documentation.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-amber-800 text-center">
              ⚠️ RiskGuard AI may make mistakes. Please use with discretion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderVendorDemo = () => (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Third-Party Risk Assessment</CardTitle>
          <CardDescription>Evaluate and monitor vendor relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">CloudTech Solutions</p>
                      <p className="text-sm text-gray-500">IT Services</p>
                      <Badge className="bg-green-100 text-green-700 text-xs mt-1">Low Risk</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">DataSecure Inc.</p>
                      <p className="text-sm text-gray-500">Cloud Storage</p>
                      <Badge className="bg-red-100 text-red-700 text-xs mt-1">High Risk</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Global Payments</p>
                      <p className="text-sm text-gray-500">Payment Processing</p>
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs mt-1">Medium Risk</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Vendor Risk Overview</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Monitor vendor risk scores, assessment status, and compliance. Drill down into individual vendor
                    profiles for detailed insights.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-amber-800 text-center">
              ⚠️ RiskGuard AI may make mistakes. Please use with discretion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDemoContent = () => {
    switch (currentStep) {
      case 1:
        return renderDashboardDemo()
      case 2:
        return renderAssessmentDemo()
      case 3:
        return renderReportDemo()
      case 4:
        return renderVendorDemo()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interactive Demo</h1>
              <p className="mt-2 text-gray-600">Experience RiskGuard AI's core features</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={startDemo} disabled={isPlaying} className="bg-blue-600 hover:bg-blue-700">
              <Play className="mr-2 h-4 w-4" />
              Start Demo
            </Button>
            <Button onClick={() => setIsPlaying(false)} disabled={!isPlaying} variant="outline">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
            <Button onClick={resetDemo} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demo Progress</CardTitle>
            <CardDescription>Follow the steps to explore the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {demoSteps.length}</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">{demoSteps[currentStep - 1]?.title}</h3>
              <p className="text-sm text-gray-600">{demoSteps[currentStep - 1]?.description}</p>
            </div>
            <div className="mt-6 flex justify-between">
              <Button onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))} disabled={currentStep === 1}>
                Previous
              </Button>
              <Button onClick={() => setCurrentStep(prev => Math.min(demoSteps.length, prev + 1))} disabled={currentStep === demoSteps.length}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {renderDemoContent()}
      </div>
    </div>
  )
}