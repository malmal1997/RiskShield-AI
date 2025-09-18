"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  BookOpen,
  Code,
  Settings,
  Shield,
  Users,
  FileText,
  ArrowRight,
  ExternalLink,
} from "lucide-react"

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const documentationSections = [
    {
      title: "Getting Started",
      description: "Quick start guides and initial setup instructions",
      icon: BookOpen,
      articles: ["Platform Overview", "Account Setup", "First Risk Assessment", "Dashboard Navigation"],
    },
    {
      title: "Risk Assessment",
      description: "Comprehensive guides for conducting risk assessments",
      icon: Shield,
      articles: ["Creating Assessments", "Assessment Types", "AI-Powered Analysis", "Custom Frameworks"],
    },
    {
      title: "Third-Party Management",
      description: "Managing vendor and partner risk assessments",
      icon: Users,
      articles: ["Vendor Onboarding", "Risk Scoring", "Continuous Monitoring", "Compliance Tracking"],
    },
    {
      title: "Policy Management",
      description: "Creating and managing organizational policies",
      icon: FileText,
      articles: ["Policy Generator", "Policy Library", "Compliance Mapping", "Version Control"],
    },
    {
      title: "API Reference",
      description: "Technical documentation for developers",
      icon: Code,
      articles: ["Authentication", "REST API Endpoints", "Webhooks", "SDKs and Libraries"],
    },
    {
      title: "Administration",
      description: "Platform configuration and user management",
      icon: Settings,
      articles: ["User Management", "Role-Based Access", "Integration Setup", "Security Settings"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Documentation</Badge>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="text-blue-600">RiskShield AI</span> Documentation
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
              Comprehensive guides, tutorials, and API references to help you get the most out of RiskShield AI.
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Documentation Sections</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Find detailed information about all RiskShield AI features and capabilities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentationSections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 mb-4">{section.description}</CardDescription>
                    <ul className="space-y-2 mb-4">
                      {section.articles.map((article, articleIndex) => (
                        <li key={articleIndex} className="flex items-center space-x-2">
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                            {article}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                    >
                      <span>View all articles</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Popular Resources</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Most accessed documentation and guides</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start Guide</h3>
                    <p className="text-gray-600 mb-3">
                      Get up and running with RiskShield AI in under 10 minutes with our comprehensive quick start
                      guide.
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                    >
                      <span>Read guide</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Code className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">API Documentation</h3>
                    <p className="text-gray-600 mb-3">
                      Complete API reference with examples, authentication guides, and integration tutorials.
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                    >
                      <span>View API docs</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Best Practices</h3>
                    <p className="text-gray-600 mb-3">
                      Learn how to configure RiskShield AI securely and follow industry best practices.
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                    >
                      <span>Security guide</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                    <p className="text-gray-600 mb-3">
                      Configure user roles, permissions, and access controls for your organization.
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                    >
                      <span>User guide</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Additional Help?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/help-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Visit Help Center <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Contact Support
            </Button>
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
                AI-powered risk assessment platform helping organizations maintain compliance and mitigate risks.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/risk-assessment" className="hover:text-white">
                    Risk Assessment
                  </Link>
                </li>
                <li>
                  <Link href="/third-party-assessment" className="hover:text-white">
                    Third-Party Assessment
                  </Link>
                </li>
                <li>
                  <Link href="/policy-generator" className="hover:text-white">
                    Policy Generator
                  </Link>
                </li>
                <li>
                  <Link href="/policy-library" className="hover:text-white">
                    Policy Library
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/documentation" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/help-center" className="hover:text-white">
                    Help Center
                  </Link>
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
                  <Link href="/about-us" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
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
