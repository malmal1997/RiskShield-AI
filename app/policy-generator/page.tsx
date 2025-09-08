"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input" // Added Input import
import { Label } from "@/components/ui/label" // Added Label import
import { ScrollArea } from "@/components/ui/scroll-area" // Import ScrollArea
import {
  Shield,
  FileText,
  Loader2,
  Download,
  Copy,
  CheckCircle,
  Edit3,
  Save,
  X,
  FileCheck,
  Calendar,
  User,
} from "lucide-react"
import { generatePolicy } from "./actions"
// import { MainNavigation } from "@/components/main-navigation" // Removed import
import { AuthGuard } from "@/components/auth-guard"

const policyTypes = [
  {
    id: "cybersecurity",
    name: "Cybersecurity Policy",
    description:
      "Comprehensive cybersecurity framework including data protection, access controls, and incident response procedures.",
    features: ["Data Protection", "Access Controls", "Incident Response", "Employee Training"],
  },
  {
    id: "compliance",
    name: "Regulatory Compliance Policy",
    description:
      "Policies ensuring adherence to federal and state financial regulations, including BSA/AML and consumer protection.",
    features: ["BSA/AML", "Consumer Protection", "Regulatory Reporting", "Compliance Monitoring"],
  },
  {
    id: "third-party",
    name: "Third-Party Risk Management Policy",
    description:
      "Framework for managing risks associated with third-party relationships, including due diligence and ongoing monitoring.",
    features: ["Vendor Due Diligence", "Contract Management", "Risk Assessments", "Continuous Monitoring"],
  },
  {
    id: "business-continuity",
    name: "Business Continuity Plan",
    description:
      "Ensures critical operations continue during and after disruptive events, covering disaster recovery and emergency response.",
    features: ["Disaster Recovery", "Emergency Response", "Critical Function Identification", "Testing & Maintenance"],
  },
  {
    id: "privacy",
    name: "Privacy & Data Protection Policy",
    description:
      "Establishes commitment to protecting customer and employee personal information in compliance with privacy laws.",
    features: ["Data Collection & Use", "Customer Rights", "Data Security", "Legal Framework (GLBA, CCPA)"],
  },
  {
    id: "operational",
    name: "Operational Risk Policy",
    description:
      "Framework for identifying, assessing, monitoring, and managing operational risks to ensure safe and sound banking operations.",
    features: ["Process Controls", "System Failures", "Human Error", "External Fraud"],
  },
]

export default function PolicyGenerator() {
  const [selectedPolicyType, setSelectedPolicyType] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyName: "",
    institutionType: "",
    employeeCount: "",
    assets: "",
  })
  const [generatedPolicy, setGeneratedPolicy] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    const hasAuth = localStorage.getItem("demo_session")
    setIsPreviewMode(!hasAuth)
  }, [])

  const handleGeneratePolicy = async () => {
    if (isPreviewMode) {
      alert("Preview Mode: Sign up to generate and save your actual policies.")
      return
    }

    if (!selectedPolicyType || !formData.companyName || !formData.institutionType) {
      setError("Please fill in all required fields: Policy Type, Company Name, and Institution Type.")
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedPolicy(null)

    try {
      const policyData = await generatePolicy({
        companyName: formData.companyName,
        institutionType: formData.institutionType,
        selectedPolicy: selectedPolicyType,
        employeeCount: formData.employeeCount,
        assets: formData.assets,
      })
      setGeneratedPolicy(policyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate policy. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPolicy = () => {
    if (!generatedPolicy) return

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${generatedPolicy.title} - ${generatedPolicy.companyName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 8px; }
        h1 { color: #1e40af; text-align: center; margin-bottom: 20px; }
        h2 { color: #1e40af; border-bottom: 2px solid #e0e7ff; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; }
        h3 { color: #3b82f6; margin-top: 20px; margin-bottom: 10px; }
        p { margin-bottom: 10px; }
        ul { list-style-type: disc; margin-left: 20px; margin-bottom: 10px; }
        li { margin-bottom: 5px; }
        .meta-info { background: #f0f8ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; font-size: 0.9em; }
        .meta-info p { margin: 0; }
        .disclaimer { background: #fffbe6; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 30px; font-size: 0.85em; color: #92400e; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${generatedPolicy.title}</h1>
        <div class="meta-info">
            <p><strong>Company:</strong> ${generatedPolicy.companyName}</p>
            <p><strong>Institution Type:</strong> ${generatedPolicy.institutionType}</p>
            <p><strong>Effective Date:</strong> ${generatedPolicy.effectiveDate}</p>
            <p><strong>Next Review Date:</strong> ${generatedPolicy.nextReviewDate}</p>
        </div>

        ${generatedPolicy.sections
          .map(
            (section: any) => `
            <h2>SECTION ${section.number}: ${section.title}</h2>
            <p>${section.content}</p>
            ${
              section.items
                ? `<ul>${section.items.map((item: string) => `<li>${item}</li>`).join("")}</ul>`
                : ""
            }
        `,
          )
          .join("")}

        <div class="disclaimer">
            <h3>Disclaimer:</h3>
            <p>This policy document is a template generated by RiskGuard AI. It is intended for informational purposes only and should be reviewed, customized, and approved by qualified legal and compliance professionals to ensure it meets your organization's specific needs and all applicable regulatory requirements. RiskGuard AI is not responsible for any legal or compliance implications arising from the use of this template.</p>
        </div>
    </div>
</body>
</html>
    `

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${generatedPolicy.title.replace(/\s+/g, "_")}_${generatedPolicy.companyName.replace(/\s+/g, "_")}_Policy.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyPolicy = () => {
    if (!generatedPolicy) return
    const policyText = JSON.stringify(generatedPolicy, null, 2)
    navigator.clipboard.writeText(policyText)
    alert("Policy copied to clipboard!")
  }

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Viewing sample policies. Sign up to create and manage your policy library."
    >
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Policy Generation</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                AI-Powered Policy Generator
                <br />
                <span className="text-blue-600">Create Custom Policies Instantly</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Generate comprehensive, regulatory-compliant policies tailored to your organization's needs using
                advanced AI.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href="/policy-library">
                    <FileText className="mr-2 h-4 w-4" />
                    View Policy Library
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Policy Generation Form */}
              <div>
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span>Generate New Policy</span>
                    </CardTitle>
                    <CardDescription>Fill in the details to generate your custom policy.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Your Organization Name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="institutionType">Institution Type *</Label>
                      <select
                        id="institutionType"
                        value={formData.institutionType}
                        onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="Commercial Bank">Commercial Bank</option>
                        <option value="Credit Union">Credit Union</option>
                        <option value="Investment Firm">Investment Firm</option>
                        <option value="Fintech Company">Fintech Company</option>
                        <option value="Other Financial Institution">Other Financial Institution</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="employeeCount">Number of Employees (Optional)</Label>
                      <Input
                        id="employeeCount"
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                        placeholder="e.g., 100-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assets">Total Assets (Optional)</Label>
                      <Input
                        id="assets"
                        value={formData.assets}
                        onChange={(e) => setFormData({ ...formData, assets: e.target.value })}
                        placeholder="e.g., $1 Billion"
                      />
                    </div>

                    <div>
                      <Label htmlFor="policyType">Select Policy Type *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {policyTypes.map((policy) => (
                          <Card
                            key={policy.id}
                            className={`cursor-pointer ${
                              selectedPolicyType === policy.id ? "border-blue-600 ring-2 ring-blue-600" : ""
                            }`}
                            onClick={() => setSelectedPolicyType(policy.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <div>
                                  <h3 className="font-medium text-gray-900">{policy.name}</h3>
                                  <p className="text-xs text-gray-600">{policy.description.substring(0, 60)}...</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        <p className="font-medium">Error: {error}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleGeneratePolicy}
                      disabled={loading || !selectedPolicyType || !formData.companyName || !formData.institutionType}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileCheck className="mr-2 h-4 w-4" />
                          Generate Policy
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Generated Policy Preview */}
              <div>
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span>Generated Policy Preview</span>
                    </CardTitle>
                    <CardDescription>Review your AI-generated policy before downloading.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedPolicy ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-semibold text-green-900 mb-2">{generatedPolicy.title}</h3>
                          <p className="text-sm text-green-800">
                            Generated for {generatedPolicy.companyName} ({generatedPolicy.institutionType})
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Effective: {generatedPolicy.effectiveDate} | Review Due:{" "}
                            {generatedPolicy.nextReviewDate}
                          </p>
                        </div>

                        <ScrollArea className="h-[400px] rounded-md border p-4 bg-gray-50">
                          <h2 className="text-xl font-bold text-gray-900 mb-4">{generatedPolicy.title}</h2>
                          <div className="text-sm text-gray-700 space-y-3">
                            {generatedPolicy.sections.map((section: any) => (
                              <div key={section.number}>
                                <h3 className="font-semibold text-gray-800">
                                  SECTION {section.number}: {section.title}
                                </h3>
                                <p>{section.content}</p>
                                {section.items && (
                                  <ul className="list-disc pl-5">
                                    {section.items.map((item: string) => (
                                      <li key={item}>{item}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>

                        <div className="flex space-x-2">
                          <Button onClick={handleDownloadPolicy} className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Download className="mr-2 h-4 w-4" />
                            Download HTML
                          </Button>
                          <Button onClick={handleCopyPolicy} variant="outline" className="flex-1">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy to Clipboard
                          </Button>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                          <p className="text-sm text-amber-800 text-center">
                            ⚠️ This policy is AI-generated. Always review and customize with legal counsel.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4" />
                        <p>Your generated policy will appear here.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                      Policy Generator
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Policy Library
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
    </AuthGuard>
  )
}