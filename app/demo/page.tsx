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
  Settings, // Added Settings icon
  BarChart3, // Added BarChart3 icon
} from "lucide-react"
import Link from "next/link" // Import Link

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
                      <p className="font-medium">DataSecure Inc</p>
                      <p className="text-sm text-gray-500">Data Processing</p>
                      <Badge className="bg-orange-100 text-orange-700 text-xs mt-1">Medium Risk</Badge>
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
                      <p className="font-medium">FinanceFlow LLC</p>
                      <p className="text-sm text-gray-500">Payment Processing</p>
                      <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">Under Review</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Risk Assessment Details - DataSecure Inc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Risk Factors</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Security</span>
                        <Badge className="bg-green-100 text-green-700">Strong</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Financial Stability</span>
                        <Badge className="bg-orange-100 text-orange-700">Moderate</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Compliance History</span>
                        <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Request updated SOC 2 Type II report</li>
                      <li>• Schedule quarterly business reviews</li>
                      <li>• Monitor financial health indicators</li>
                      <li>• Review contract terms annually</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-amber-800 text-center">
                      ⚠️ RiskGuard AI may make mistakes. Please use with discretion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentDemo = () => {
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
        return renderDashboardDemo()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">RiskGuard AI</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Platform
              </a>
              <a href="/solutions" className="text-gray-600 hover:text-gray-900">
                Solutions
              </a>
              <a href="/policy-generator" className="text-gray-600 hover:text-gray-900">
                Policy Generator
              </a>
              <a href="/policy-library" className="text-gray-600 hover:text-gray-900">
                Policy Library
              </a>
              <a href="/risk-assessment" className="text-gray-600 hover:text-gray-900">
                Risk Assessment
              </a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Interactive Demo</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Experience RiskGuard AI
              <br />
              <span className="text-blue-600">in Action</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Explore our comprehensive risk management platform through this interactive demonstration. See how
              RiskGuard AI can transform your institution's risk assessment process.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Controls */}
      <section className="py-8 bg-white"> {/* Changed bg-gray-50 to bg-white */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button onClick={startDemo} disabled={isPlaying} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Demo Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Demo
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetDemo}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <Progress value={progress} className="w-32" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {demoSteps.map((step) => (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all ${
                  currentStep === step.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === step.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.id}
                    </div>
                    <div>
                      <p
                        className={`font-medium text-sm ${currentStep === step.id ? "text-blue-900" : "text-gray-900"}`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {demoSteps.find((step) => step.id === currentStep)?.title}
            </h2>
            <p className="text-gray-600">{demoSteps.find((step) => step.id === currentStep)?.description}</p>
          </div>

          {renderCurrentDemo()}

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous Step
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={currentStep === 4}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Experience the full power of RiskGuard AI with a personalized demo tailored to your institution's needs.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard" asChild>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Explore Dashboard
                </Button>
              </Link>
              <Link href="/vendors" asChild>
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  <Building className="mr-2 h-5 w-5" />
                  Manage Vendors
                </Button>
              </Link>
              <Link href="/settings" asChild>
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  <Settings className="mr-2 h-5 w-5" />
                  Configure Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
