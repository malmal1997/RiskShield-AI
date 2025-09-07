"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  FileText,
  Building,
  Users,
  Server,
  Globe,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Lock,
  Cog,
  LifeBuoy,
} from "lucide-react"
// import { MainNavigation } from "@/components/main-navigation" // Removed import

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState("core")

  return (
    <div className="min-h-screen bg-white">
      {/* <MainNavigation showAuthButtons={true} /> */}

      {/* Solutions Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12"> {/* Adjusted padding-top */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Enterprise Solutions</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Risk Management
              <br />
              <span className="text-blue-600">Solutions</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Comprehensive risk management and assessment platform powered by artificial intelligence. Streamline your
              risk processes with automated assessments, intelligent insights, and enterprise-grade security.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Complete Risk Management Suite</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to assess, manage, and mitigate risks across your organization
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                className={`pb-4 px-2 font-medium ${activeTab === "core" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("core")}
              >
                Core Solutions
              </button>
              <button
                className={`pb-4 px-2 font-medium ${activeTab === "specialized" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("specialized")}
              >
                Specialized Assessments
              </button>
              <button
                className={`pb-4 px-2 font-medium ${activeTab === "operational" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("operational")}
              >
                Internal Risk Assessments
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "core" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Compliance Management */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-semibold">Compliance Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Streamline regulatory compliance with AI-powered assessment tools, automated reporting, and
                    comprehensive gap analysis.
                  </CardDescription>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Automated tracking and reporting</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Regulatory reporting</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Compliance tracking</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Audit preparation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Gap analysis</span>
                    </li>
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Cybersecurity Risk */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-semibold">Cybersecurity Risk</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Identify, assess, and mitigate cybersecurity threats with comprehensive risk evaluation and advanced
                    AI-powered tools.
                  </CardDescription>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Automated risk scoring</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Threat intelligence</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Risk visualization</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Custom frameworks</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Security policy management</span>
                    </li>
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Third-Party Risk */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-semibold">Third-Party Risk</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Manage vendor and third-party relationships with comprehensive risk assessment tools.
                  </CardDescription>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Partner risk evaluation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Continuous monitoring</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Contract management</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Risk scoring</span>
                    </li>
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "specialized" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Data Privacy Assessment */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-semibold">Data Privacy Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Evaluate data protection practices and privacy compliance requirements.
                  </CardDescription>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">GDPR compliance review</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Data handling procedures</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Privacy impact assessments</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Data breach response</span>
                    </li>
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Infrastructure Security */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Server className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-semibold">Infrastructure Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Assess IT infrastructure security and system vulnerabilities.
                  </CardDescription>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">System architecture review</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Security controls audit</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Vulnerability scanning</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Network security assessment</span>
                    </li>
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Financial Services Assessment */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Building className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-semibold">Financial Services Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Specialized risk assessment for financial service providers.
                  </CardDescription>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Regulatory compliance check</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Financial risk analysis</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Anti-money laundering</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Credit risk evaluation</span>
                    </li>
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "operational" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Operational Risk Assessment */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Cog className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-semibold">Operational Risk Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Evaluate operational processes and identify potential risk areas.
                  </CardDescription>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Process workflow analysis</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Risk mitigation strategies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Performance monitoring</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Quality assurance</span>
                    </li>
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Business Continuity Assessment */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <LifeBuoy className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-semibold">Business Continuity Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Evaluate business continuity plans and disaster recovery capabilities.
                  </CardDescription>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Disaster recovery planning</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Business impact analysis</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Crisis management</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Recovery testing</span>
                    </li>
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Platform Dashboard Preview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-600">See RiskGuard AI in Action</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Experience our intuitive dashboard that provides real-time insights into your risk assessment progress and
              compliance status.
            </p>
          </div>

          {/* Dashboard Mock-up */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Risk Assessment Dashboard</h3>
                <p className="text-gray-600 mt-2">Monitor your compliance status and manage ongoing assessments</p>
              </div>

              {/* Top Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Assessments</p>
                        <p className="text-3xl font-bold text-blue-600">4</p>
                        <p className="text-xs text-gray-500">Currently in progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed Reports</p>
                        <p className="text-3xl font-bold text-green-600">12</p>
                        <p className="text-xs text-gray-500">Ready for download</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Shield className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Action Items</p>
                        <p className="text-3xl font-bold text-orange-600">3</p>
                        <p className="text-xs text-gray-500">Require attention</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <Card className="border border-gray-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">In Progress Assessments</CardTitle>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </CardHeader>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Action Items</CardTitle>
                      <Button variant="outline" size="sm">
                        Mark All Read
                      </Button>
                    </CardHeader>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Third-Party Assessment</CardTitle>
                      <CardDescription>
                        Send assessment invitations to third-party vendors for risk evaluation.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter organization name"
                        />
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Assessment Link</Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Cybersecurity Assessment completed</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">FDIC Compliance report generated</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Business Continuity review required</p>
                            <p className="text-xs text-gray-500">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Start Assessment
                  </Button>
                  <Button variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a href="/demo">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Try Interactive Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-600">Industry-Specific Solutions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Tailored risk management solutions for different types of institutions.
            </p>
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div
                id="industry-carousel"
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: "translateX(-100%)" }}
              >
                {/* Triple the cards for seamless infinite scroll */}
                {/* First set - for seamless left scrolling */}
                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Banks</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Comprehensive solutions for commercial and retail banks to manage regulatory compliance and
                        operational risks.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Credit Unions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Tailored risk management solutions for credit unions to maintain compliance with NCUA
                        regulations.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Fintech</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Innovative risk management solutions for fintech companies navigating evolving regulatory
                        landscapes.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Global Financial Services</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Cross-border compliance and risk management solutions for international financial institutions.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Healthcare</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Specialized risk management solutions for healthcare organizations to ensure HIPAA compliance
                        and patient data security.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Second set - main visible set */}
                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Banks</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Comprehensive solutions for commercial and retail banks to manage regulatory compliance and
                        operational risks.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Credit Unions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Tailored risk management solutions for credit unions to maintain compliance with NCUA
                        regulations.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Fintech</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Innovative risk management solutions for fintech companies navigating evolving regulatory
                        landscapes.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Global Financial Services</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Cross-border compliance and risk management solutions for international financial institutions.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Healthcare</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Specialized risk management solutions for healthcare organizations to ensure HIPAA compliance
                        and patient data security.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Third set - for seamless right scrolling */}
                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Banks</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Comprehensive solutions for commercial and retail banks to manage regulatory compliance and
                        operational risks.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Credit Unions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Tailored risk management solutions for credit unions to maintain compliance with NCUA
                        regulations.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Fintech</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Innovative risk management solutions for fintech companies navigating evolving regulatory
                        landscapes.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Global Financial Services</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Cross-border compliance and risk management solutions for international financial institutions.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4">
                  <Card className="border border-gray-200 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Healthcare</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Specialized risk management solutions for healthcare organizations to ensure HIPAA compliance
                        and patient data security.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              id="prev-btn"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors z-10"
              onClick={() => {
                const carousel = document.getElementById("industry-carousel")
                const cardWidth = 100 / (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1)
                const currentTransform = carousel.style.transform
                const currentX = currentTransform ? Number.parseFloat(currentTransform.match(/-?\d+\.?\d*/)[0]) : -100

                const newX = currentX + cardWidth
                carousel.style.transform = `translateX(${newX}%)`

                // Reset for infinite loop
                setTimeout(() => {
                  if (newX >= 0) {
                    carousel.style.transition = "none"
                    carousel.style.transform = `translateX(-${cardWidth * 5}%)`
                    setTimeout(() => {
                      carousel.style.transition = "transform 500ms ease-in-out"
                    }, 50)
                  }
                }, 500)
              }}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>

            <button
              id="next-btn"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors z-10"
              onClick={() => {
                const carousel = document.getElementById("industry-carousel")
                const cardWidth = 100 / (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1)
                const currentTransform = carousel.style.transform
                const currentX = currentTransform ? Number.parseFloat(currentTransform.match(/-?\d+\.?\d*/)[0]) : -100

                const newX = currentX - cardWidth
                carousel.style.transform = `translateX(${newX}%)`

                // Reset for infinite loop
                setTimeout(() => {
                  if (newX <= -cardWidth * 10) {
                    carousel.style.transition = "none"
                    carousel.style.transform = `translateX(-${cardWidth * 5}%)`
                    setTimeout(() => {
                      carousel.style.transition = "transform 500ms ease-in-out"
                    }, 50)
                  }
                }, 500)
              }}
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Case Study Highlight */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Case Study</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  How First Regional Bank Reduced Compliance Costs by 65%
                </h3>
                <p className="text-gray-600 mb-6">
                  Learn how First Regional Bank implemented RiskGuard AI's solutions to streamline their compliance
                  processes, reduce manual work, and achieve significant cost savings while improving their risk
                  posture.
                </p>
                <Button>Read Case Study</Button>
              </div>
              <div className="bg-blue-600 p-8 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-5xl font-bold mb-2">65%</div>
                  <div className="text-xl">Reduction in compliance costs</div>
                  <div className="mt-4 text-5xl font-bold mb-2">80%</div>
                  <div className="text-xl">Less time spent on assessments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Risk Management?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Schedule a personalized demo to see how RiskGuard AI can help your financial institution streamline
              compliance and reduce risk.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="secondary">
                Request Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Reused from main page */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">RiskShield AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered risk assessment platform helping financial institutions maintain compliance and mitigate
                risks.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Risk Assessment
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Compliance Monitoring
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Reporting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status Page
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 RiskShield AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}