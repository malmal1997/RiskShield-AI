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
  BarChart3,
  Lock,
  Cog,
  LifeBuoy,
  AlertTriangle, // Added AlertTriangle
  ShoppingCart, // Icon for Retail
  Factory, // Icon for Manufacturing
  HeartPulse, // Icon for Healthcare
  Banknote, // Icon for Banks
} from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel" // Import Carousel components

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState("core")

  const industrySolutions = [
    {
      id: "retail",
      name: "Retail",
      description: "Managing cybersecurity and operational risks for e-commerce and brick-and-mortar retailers.",
      icon: ShoppingCart,
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      description: "Supply chain risk, operational technology security, and compliance for manufacturers.",
      icon: Factory,
    },
    {
      id: "healthcare",
      name: "Healthcare",
      description: "Specialized risk management solutions for healthcare organizations to ensure HIPAA compliance and data security.",
      icon: HeartPulse,
    },
    {
      id: "banks",
      name: "Banks",
      description: "Comprehensive solutions for banks to streamline regulatory compliance and manage operational risks.",
      icon: Banknote,
    },
    {
      id: "tech",
      name: "Technology",
      description: "Addressing unique cybersecurity and compliance challenges for software and IT service providers.",
      icon: Server,
    },
    {
      id: "government",
      name: "Government",
      description: "Ensuring compliance with government regulations and protecting sensitive public data.",
      icon: Building,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Solutions Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
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

      {/* Industry-Specific Solutions */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Industry-Specific Solutions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Tailored risk management solutions for different types of institutions.
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {industrySolutions.map((solution, index) => {
                const IconComponent = solution.icon;
                return (
                  <CarouselItem key={solution.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <Card className="h-full border border-gray-200 hover:shadow-lg transition-shadow">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="p-3 bg-blue-100 rounded-full mb-4">
                          <IconComponent className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{solution.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{solution.description}</p>
                        <Button
                          variant="ghost"
                          className="mt-auto p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                        >
                          <span>Learn more</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-0 -translate-x-full" />
            <CarouselNext className="right-0 translate-x-full" />
          </Carousel>
        </div>
      </section>

      {/* Platform Dashboard Preview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-600">See RiskShield AI in Action</h2>
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
                        <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                        <p className="text-3xl font-bold text-green-600">92%</p>
                        <p className="text-xs text-gray-500">Overall compliance rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">High Risk Vendors</p>
                        <p className="text-3xl font-bold text-orange-600">2</p>
                        <p className="text-xs text-gray-500">Require immediate attention</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your assessments and vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Cybersecurity Assessment Completed</p>
                          <p className="text-sm text-gray-500">Vendor: Acme Corp</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">New Vendor Added</p>
                          <p className="text-sm text-gray-500">Vendor: Global Solutions Ltd.</p>
                        </div>
                      </div>
                      <Badge variant="outline">New</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">High Risk Alert</p>
                          <p className="text-sm text-gray-500">Vendor: DataSecure Inc. risk score increased</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-700">Alert</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Strengthen Your Risk Management?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations using RiskShield AI to maintain compliance and mitigate risks with
              confidence.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">RiskShield AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered risk assessment platform helping organizations maintain compliance and mitigate risks across
                all industries.
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
                    Third-Party Assessment
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
              <p>&copy; 2025 RiskShield AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </div>
  )
}
