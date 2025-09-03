"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Shield, FileText, BadgeCheck, TrendingUp, CheckCircle, Users, Cog, LifeBuoy } from "lucide-react"
import Link from "next/link"
import { MainNavigation } from "@/components/main-navigation"
import { AppFooter } from "@/components/app-footer"

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <MainNavigation showAuthButtons={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Our Solutions</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Comprehensive Risk Management
              <br />
              <span className="text-blue-600">Solutions for Your Business</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              RiskGuard AI offers a suite of intelligent tools to streamline your risk assessment, compliance, and
              third-party management processes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/demo" asChild>
                <Button 
                  size="lg" 
                  variant="default" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Overview Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Explore Our Offerings</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover how RiskGuard AI can address your specific risk and compliance needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Client Dashboard */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Client Dashboard</CardTitle>
                </div>
                <CardDescription>
                  Monitor compliance status, track assessment progress, and receive real-time alerts on regulatory
                  requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Real-time compliance tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Risk assessment overview</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Regulatory change notifications</span>
                  </div>
                </div>
                <Link href="/dashboard" asChild>
                  <Button variant="ghost" className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Assessment Questionnaire */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </div>
                <CardDescription>
                  Streamlined assessment tools covering cybersecurity, business continuity, and compliance requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Cybersecurity questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Business continuity risk audit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Compliance requirements</span>
                  </div>
                </div>
                <Link href="/risk-assessment" asChild>
                  <Button variant="ghost" className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Risk Analysis Reports */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Risk Analysis Reports</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive automated reports with actionable recommendations and compliance verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Automated risk analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Comprehensive risk reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Actionable advisory statements</span>
                  </div>
                </div>
                <Link href="/reports" asChild>
                  <Button variant="ghost" className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Additional Certifications */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Compliance Certifications</CardTitle>
                </div>
                <CardDescription>
                  Accepts organizational assessments for SOC 2 Type II, ISO 27001, NIST, and other industry
                  certifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">SOC 2 comprehensive assessments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">ISO 27001 compliance evaluation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">NIST Framework alignment</span>
                  </div>
                </div>
                <Link href="/risk-assessment" asChild>
                  <Button variant="ghost" className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Third-Party Risk Assessments */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Third-Party Risk</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive vendor risk evaluation and monitoring with automated assessment distribution and
                  tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Vendor risk questionnaires</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Automated assessment distribution</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Risk scoring and monitoring</span>
                  </div>
                </div>
                <Link href="/third-party-assessment" asChild>
                  <Button variant="ghost" className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Policy Generator/Manager */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Cog className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Policy Management</CardTitle>
                </div>
                <CardDescription>
                  AI-powered policy creation and management system with regulatory compliance templates and version
                  control.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">AI-powered policy generation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Regulatory compliance templates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Version control and tracking</span>
                  </div>
                </div>
                <Link href="/policy-generator" asChild>
                  <Button variant="ghost" className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Risk Management?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations leveraging RiskGuard AI for intelligent, efficient, and comprehensive risk
              and compliance management.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/auth/register" asChild>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/help-center" asChild>
                <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white hover:text-blue-600 px-8 py-3">
                  <LifeBuoy className="mr-2 h-5 w-5" />
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  )
}
