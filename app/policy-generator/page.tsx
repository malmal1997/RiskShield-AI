"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
    description: "FDIC, OCC, and regulatory compliance policies tailored to your institution type and size.",
    features: ["FDIC Compliance", "BSA/AML Requirements", "Consumer Protection", "Audit Procedures"],
  },
  {
    id: "third-party",
    name: "Third-Party Risk Management",
    description: "Vendor management and third-party risk assessment policies with due diligence frameworks.",
    features: ["Vendor Due Diligence", "Risk Assessment", "Contract Management", "Ongoing Monitoring"],
  },
  {
    id: "business-continuity",
    name: "Business Continuity Plan",
    description: "Disaster recovery and business continuity planning with crisis management procedures.",
    features: ["Disaster Recovery", "Crisis Management", "Communication Plans", "Recovery Procedures"],
  },
  {
    id: "privacy",
    name: "Privacy & Data Protection",
    description: "Customer privacy protection policies compliant with federal and state regulations.",
    features: ["Data Privacy", "Customer Rights", "Data Retention", "Breach Notification"],
  },
  {
    id: "operational",
    name: "Operational Risk Policy",
    description: "Internal controls and operational risk management framework for daily operations.",
    features: ["Internal Controls", "Risk Assessment", "Process Management", "Quality Assurance"],
  },
]

const institutionTypes = [
  "Community Bank",
  "Regional Bank",
  "Credit Union",
  "Fintech Company",
  "Investment Firm",
  "Insurance Company",
  "Mortgage Company",
  "Payment Processor",
]

export default function PolicyGenerator() {
  const [formData, setFormData] = useState({
    companyName: "",
    institutionType: "",
    selectedPolicy: "",
    employeeCount: "",
    assets: "",
  })
  const [generatedPolicy, setGeneratedPolicy] = useState<any>(null)
  const [editedPolicy, setEditedPolicy] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [approvalData, setApprovalData] = useState({
    clientName: "",
    role: "",
    signature: "",
    date: "",
  })
  const [copied, setCopied] = useState(false)
  const [currentStep, setCurrentStep] = useState<"form" | "generated" | "editing" | "approval" | "completed">("form")
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    const hasAuth = localStorage.getItem("demo_session")
    setIsPreviewMode(!hasAuth)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.companyName || !formData.institutionType || !formData.selectedPolicy) {
      return
    }

    if (isPreviewMode) {
      alert("Preview Mode: Policy generated! Sign up to save, edit, and export your policies.")
    }

    setIsGenerating(true)
    try {
      const policy = await generatePolicy(formData)
      setGeneratedPolicy(policy)
      setEditedPolicy(policy)
      setCurrentStep("generated")
    } catch (error) {
      console.error("Error generating policy:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setCurrentStep("editing")
  }

  const handleSaveEdit = () => {
    setGeneratedPolicy(editedPolicy)
    setIsEditing(false)
    setCurrentStep("generated")
  }

  const handleCancelEdit = () => {
    setEditedPolicy(generatedPolicy)
    setIsEditing(false)
    setCurrentStep("generated")
  }

  const handleApprove = () => {
    setCurrentStep("approval")
  }

  const handleFinalApproval = () => {
    if (!approvalData.clientName || !approvalData.role || !approvalData.signature) {
      alert("Please fill in all approval fields including your role")
      return
    }

    setApprovalData({
      ...approvalData,
      date: new Date().toLocaleDateString(),
    })
    setIsApproved(true)
    setCurrentStep("completed")
  }

  const copyToClipboard = async () => {
    const textContent = convertPolicyToText(editedPolicy)
    await navigator.clipboard.writeText(textContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const convertPolicyToText = (policy: any) => {
    if (!policy) return ""

    let text = `${policy.title}\n${policy.companyName}\n\n`
    text += `Effective Date: ${policy.effectiveDate}\n`
    text += `Institution Type: ${policy.institutionType}\n`
    if (policy.employeeCount) text += `Employee Count: ${policy.employeeCount}\n`
    if (policy.assets) text += `Total Assets: ${policy.assets}\n\n`

    policy.sections.forEach((section: any) => {
      text += `${section.number}. ${section.title}\n`
      if (section.content) {
        text += `${section.content}\n\n`
      }
      if (section.items) {
        section.items.forEach((item: string) => {
          text += `- ${item}\n`
        })
        text += "\n"
      }
    })

    return text
  }

  const downloadAsPDF = async () => {
    if (isPreviewMode) {
      alert("Preview Mode: Sign up to download and save your policies. This feature requires an account.")
      return
    }
    try {
      // Create HTML content for PDF
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${editedPolicy?.title} - ${formData.companyName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .company-name { 
            font-size: 28px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px; 
          }
          .policy-title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1f2937; 
            margin-bottom: 20px; 
          }
          .meta-info { 
            background: #f8fafc; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 30px; 
          }
          .section { 
            margin-bottom: 25px; 
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px; 
            border-left: 4px solid #2563eb; 
            padding-left: 15px; 
          }
          .section-content { 
            margin-left: 20px; 
            margin-bottom: 15px; 
          }
          .section-items { 
            margin-left: 40px; 
          }
          .section-items li { 
            margin-bottom: 5px; 
          }
          .approval-section { 
            margin-top: 50px; 
            padding-top: 30px; 
            border-top: 2px solid #e5e7eb; 
          }
          .signature-container {
            margin: 20px 0;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
          }
          .signature-line { 
            font-family: 'Dancing Script', cursive;
            font-size: 24px;
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding: 10px 0;
            margin: 10px 0;
            text-align: center;
            font-weight: 700;
          }
          .approver-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${formData.companyName}</div>
          <div class="policy-title">${editedPolicy?.title}</div>
        </div>
        
        <div class="meta-info">
          <strong>Effective Date:</strong> ${editedPolicy?.effectiveDate}<br>
          <strong>Institution Type:</strong> ${editedPolicy?.institutionType}<br>
          ${editedPolicy?.employeeCount ? `<strong>Employee Count:</strong> ${editedPolicy.employeeCount}<br>` : ""}
          ${editedPolicy?.assets ? `<strong>Total Assets:</strong> ${editedPolicy.assets}<br>` : ""}
          <strong>Document Status:</strong> ${isApproved ? "APPROVED" : "DRAFT"}
        </div>
        
        ${editedPolicy?.sections
          .map(
            (section: any) => `
          <div class="section">
            <div class="section-title">${section.number}. ${section.title}</div>
            ${section.content ? `<div class="section-content">${section.content}</div>` : ""}
            ${
              section.items
                ? `
              <ul class="section-items">
                ${section.items.map((item: string) => `<li>${item}</li>`).join("")}
              </ul>
            `
                : ""
            }
          </div>
        `,
          )
          .join("")}
        
        ${
          isApproved
            ? `
          <div class="approval-section">
            <h3>POLICY APPROVAL</h3>
            <div class="approver-info">
              <div>
                <p><strong>Approved by:</strong> ${approvalData.clientName}</p>
                <p><strong>Title/Role:</strong> ${approvalData.role}</p>
                <p><strong>Date:</strong> ${approvalData.date}</p>
              </div>
              <div>
                <p><strong>Digital Signature:</strong></p>
                <div class="signature-container">
                  <div class="signature-line">${approvalData.signature}</div>
                </div>
              </div>
            </div>
            <p style="text-align: center; margin-top: 20px;"><strong>Status: APPROVED</strong></p>
          </div>
        `
            : ""
        }
        
        <div class="footer">
          Generated by RiskGuard AI Policy Generator<br>
          ${new Date().toLocaleDateString()} - Confidential Document
        </div>
      </body>
      </html>
    `

      // Create blob and download
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.companyName}-${formData.selectedPolicy}-policy-${isApproved ? "APPROVED" : "DRAFT"}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Note: For true PDF generation, you would need a library like jsPDF or Puppeteer
      // This creates an HTML file that can be printed to PDF by the browser
      alert('Policy downloaded as HTML file. Use your browser\'s "Print to PDF" feature to convert to PDF.')
    } catch (error) {
      console.error("Error downloading policy:", error)
      alert("Error downloading policy. Please try again.")
    }
  }

  const resetForm = () => {
    setFormData({
      companyName: "",
      institutionType: "",
      selectedPolicy: "",
      employeeCount: "",
      assets: "",
    })
    setGeneratedPolicy(null)
    setEditedPolicy(null)
    setIsApproved(false)
    setApprovalData({
      clientName: "",
      role: "",
      signature: "",
      date: "",
    })
    setCurrentStep("form")
  }

  const selectedPolicyDetails = policyTypes.find((p) => p.id === formData.selectedPolicy)

  // Render policy in a professional format
  const renderPolicy = (policy: any) => {
    if (!policy) return null

    return (
      <div className="bg-white">
        {/* Policy Header */}
        <div className="text-center border-b-4 border-blue-600 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">{formData.companyName}</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{policy.title}</h2>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Effective Date:</strong> {policy.effectiveDate}
              </div>
              <div>
                <strong>Institution Type:</strong> {policy.institutionType}
              </div>
              {policy.employeeCount && (
                <div>
                  <strong>Employee Count:</strong> {policy.employeeCount}
                </div>
              )}
              {policy.assets && (
                <div>
                  <strong>Total Assets:</strong> {policy.assets}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {policy.sections.map((section: any, index: number) => (
            <div key={index} className="border-l-4 border-blue-200 pl-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                {section.number}. {section.title}
              </h3>
              {section.content && (
                <div className="text-gray-700 mb-4 leading-relaxed">
                  {section.content.split("\n").map((paragraph: string, pIndex: number) => (
                    <p key={pIndex} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {section.items && (
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  {section.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Next Review Date: {policy.nextReviewDate}</p>
          <p className="mt-2">Generated by RiskGuard AI Policy Generator</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Generate policies for free! Sign up to save, edit, and export them."
    >
      <div className="min-h-screen bg-white">
        {/* Header - Removed */}

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">AI-Powered</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                AI Policy Generator
                <br />
                <span className="text-blue-600">for All Organizations</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Generate, edit, approve, and export all types of policies - from cybersecurity and compliance to
                operational and privacy policies for any organization.
              </p>
            </div>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-8 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-8">
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "form"
                    ? "text-blue-600"
                    : currentStep === "generated" ||
                        currentStep === "editing" ||
                        currentStep === "approval" ||
                        currentStep === "completed"
                      ? "text-green-600"
                      : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === "form"
                      ? "bg-blue-600 text-white"
                      : currentStep === "generated" ||
                          currentStep === "editing" ||
                          currentStep === "approval" ||
                          currentStep === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-gray-300"
                  }`}
                >
                  1
                </div>
                <span className="font-medium">Generate</span>
              </div>
              <div
                className={`w-16 h-1 ${
                  currentStep === "generated" ||
                  currentStep === "editing" ||
                  currentStep === "approval" ||
                  currentStep === "completed"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "generated" || currentStep === "editing"
                    ? "text-blue-600"
                    : currentStep === "approval" || currentStep === "completed"
                      ? "text-green-600"
                      : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === "generated" || currentStep === "editing"
                      ? "bg-blue-600 text-white"
                      : currentStep === "approval" || currentStep === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-gray-300"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Review & Edit</span>
              </div>
              <div
                className={`w-16 h-1 ${
                  currentStep === "approval" || currentStep === "completed" ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "approval"
                    ? "text-blue-600"
                    : currentStep === "completed"
                      ? "text-green-600"
                      : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === "approval"
                      ? "bg-blue-600 text-white"
                      : currentStep === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-gray-300"
                  }`}
                >
                  3
                </div>
                <span className="font-medium">Approve & Export</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Step 1: Form */}
            {currentStep === "form" && (
              <div className="max-w-4xl mx-auto flex justify-center">
                {/* Form */}
                <div>
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-2xl">Generate Your Custom Policy</CardTitle>
                      <CardDescription>
                        Provide your company details and select the type of policy you need. Our AI will generate a
                        comprehensive, tailored policy document.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your company name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Institution Type *</label>
                          <select
                            required
                            value={formData.institutionType}
                            onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select institution type</option>
                            {institutionTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
                          <select
                            value={formData.employeeCount}
                            onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select employee count</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="500+">500+ employees</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Assets (Optional)
                          </label>
                          <select
                            value={formData.assets}
                            onChange={(e) => setFormData({ ...formData, assets: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select asset range</option>
                            <option value="Under $100M">Under $100M</option>
                            <option value="$100M - $1B">$100M - $1B</option>
                            <option value="$1B - $10B">$1B - $10B</option>
                            <option value="Over $10B">Over $10B</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Policy Type *</label>
                          <div className="grid grid-cols-1 gap-3">
                            {policyTypes.map((policy) => (
                              <div key={policy.id} className="relative">
                                <input
                                  type="radio"
                                  id={policy.id}
                                  name="policyType"
                                  value={policy.id}
                                  checked={formData.selectedPolicy === policy.id}
                                  onChange={(e) => setFormData({ ...formData, selectedPolicy: e.target.value })}
                                  className="sr-only"
                                />
                                <label
                                  htmlFor={policy.id}
                                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                                    formData.selectedPolicy === policy.id
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="font-medium text-gray-900">{policy.name}</div>
                                  <div className="text-sm text-gray-600 mt-1">{policy.description}</div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={
                            isGenerating ||
                            !formData.companyName ||
                            !formData.institutionType ||
                            !formData.selectedPolicy
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Policy...
                            </>
                          ) : (
                            <>
                              <FileText className="mr-2 h-4 w-4" />
                              Generate Policy
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 2: Generated Policy View */}
            {currentStep === "generated" && (
              <div className="max-w-6xl mx-auto">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span>
                            {selectedPolicyDetails?.name} - {formData.companyName}
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Generated on {new Date().toLocaleDateString()} • Ready for review
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          {copied ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-8 max-h-96 overflow-y-auto mb-6">
                      {renderPolicy(generatedPolicy)}
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                      <p className="text-sm text-amber-800 text-center">
                        ⚠️ RiskGuard AI may make mistakes. Please use with discretion.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={resetForm}>
                        Start Over
                      </Button>
                      <Button onClick={handleApprove} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Approve Policy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2.5: Editing Mode */}
            {currentStep === "editing" && (
              <div className="max-w-6xl mx-auto">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Edit3 className="h-5 w-5 text-blue-600" />
                          <span>Editing: {selectedPolicyDetails?.name}</span>
                        </CardTitle>
                        <CardDescription>Make any necessary changes to the policy content</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Policy Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Policy Title</label>
                        <input
                          type="text"
                          value={editedPolicy?.title || ""}
                          onChange={(e) => setEditedPolicy({ ...editedPolicy, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Policy Sections */}
                      {editedPolicy?.sections?.map((section: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Section {section.number}: {section.title}
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => {
                                const newSections = [...editedPolicy.sections]
                                newSections[index].title = e.target.value
                                setEditedPolicy({ ...editedPolicy, sections: newSections })
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {section.content && (
                            <div className="mb-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                              <Textarea
                                value={section.content}
                                onChange={(e) => {
                                  const newSections = [...editedPolicy.sections]
                                  newSections[index].content = e.target.value
                                  setEditedPolicy({ ...editedPolicy, sections: newSections })
                                }}
                                className="min-h-24"
                              />
                            </div>
                          )}
                          {section.items && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                              {section.items.map((item: string, itemIndex: number) => (
                                <div key={itemIndex} className="mb-2">
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                      const newSections = [...editedPolicy.sections]
                                      newSections[index].items[itemIndex] = e.target.value
                                      setEditedPolicy({ ...editedPolicy, sections: newSections })
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Approval */}
            {currentStep === "approval" && (
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileCheck className="h-5 w-5 text-blue-600" />
                        <span>Policy Approval</span>
                      </CardTitle>
                      <CardDescription>Please review and approve the final policy document</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="inline h-4 w-4 mr-1" />
                          Client Name *
                        </Label>
                        <Input
                          type="text"
                          required
                          value={approvalData.clientName}
                          onChange={(e) => setApprovalData({ ...approvalData, clientName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="inline h-4 w-4 mr-1" />
                          Title/Role *
                        </Label>
                        <select
                          required
                          value={approvalData.role}
                          onChange={(e) => setApprovalData({ ...approvalData, role: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select your role</option>
                          <option value="Chief Information Security Officer (CISO)">
                            Chief Information Security Officer (CISO)
                          </option>
                          <option value="Chief Risk Officer (CRO)">Chief Risk Officer (CRO)</option>
                          <option value="Chief Executive Officer (CEO)">Chief Executive Officer (CEO)</option>
                          <option value="Chief Operating Officer (COO)">Chief Operating Officer (COO)</option>
                          <option value="Chief Compliance Officer (CCO)">Chief Compliance Officer (CCO)</option>
                          <option value="President">President</option>
                          <option value="Vice President">Vice President</option>
                          <option value="Risk Manager">Risk Manager</option>
                          <option value="Compliance Manager">Compliance Manager</option>
                          <option value="IT Director">IT Director</option>
                          <option value="Operations Manager">Operations Manager</option>
                          <option value="Board Member">Board Member</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
                          <Edit3 className="inline h-4 w-4 mr-1" />
                          Digital Signature *
                        </Label>
                        <div className="relative">
                          <Input
                            type="text"
                            required
                            value={approvalData.signature}
                            onChange={(e) => setApprovalData({ ...approvalData, signature: e.target.value })}
                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif text-lg italic bg-blue-50"
                            placeholder="Type your signature here"
                            style={{ fontFamily: "Brush Script MT, cursive" }}
                          />
                          <div className="absolute bottom-0 left-3 right-3 h-px bg-gray-400"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          By typing your name, you agree to digitally sign this policy document
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="approvalDate" className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Approval Date
                        </Label>
                        <Input
                          type="text"
                          value={new Date().toLocaleDateString()}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                        <p className="text-sm text-amber-800 text-center">
                          ⚠️ RiskGuard AI may make mistakes. Please use with discretion.
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <Button variant="outline" onClick={() => setCurrentStep("generated")}>
                          Back to Review
                        </Button>
                        <Button onClick={handleFinalApproval} className="bg-green-600 hover:bg-green-700 text-white">
                          <FileCheck className="mr-2 h-4 w-4" />
                          Approve & Finalize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>Policy Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <div className="text-sm text-gray-600 mb-4">
                          <strong>{formData.companyName}</strong>
                          <br />
                          {selectedPolicyDetails?.name}
                          <br />
                          Institution Type: {formData.institutionType}
                        </div>
                        <div className="text-xs text-gray-800">
                          {editedPolicy?.sections?.slice(0, 2).map((section: any, index: number) => (
                            <div key={index} className="mb-4">
                              <div className="font-semibold text-blue-600">
                                {section.number}. {section.title}
                              </div>
                              <div className="mt-1">{section.content?.substring(0, 200)}...</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Completed */}
            {currentStep === "completed" && (
              <div className="max-w-6xl mx-auto text-center">
                <Card className="border border-green-200 bg-green-50">
                  <CardContent className="p-12">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-green-800 mb-4">Policy Approved Successfully!</h2>
                    <p className="text-green-700 mb-8">
                      Your {selectedPolicyDetails?.name} has been approved and is ready for implementation.
                    </p>

                    <div className="bg-white rounded-lg p-6 mb-8 text-left">
                      <h3 className="font-semibold text-gray-900 mb-4">Approval Details:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Approved by:</span>
                          <div className="font-medium">{approvalData.clientName}</div>
                          <div className="text-sm text-gray-500">{approvalData.role}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Digital Signature:</span>
                          <div
                            className="font-serif text-lg italic text-blue-600 border-b border-gray-300 pb-1 mt-1"
                            style={{ fontFamily: "Brush Script MT, cursive" }}
                          >
                            {approvalData.signature}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <div className="font-medium">{approvalData.date}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button onClick={downloadAsPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Download Policy
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        Generate New Policy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-blue-600">Complete Policy Management Workflow</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                From generation to approval, manage your entire policy lifecycle in one platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <CardTitle>AI Generation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Generate comprehensive policies tailored to your institution's specific requirements and
                    regulations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Edit3 className="h-6 w-6 text-blue-600" />
                    <CardTitle>Easy Editing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Make real-time edits to customize policies to match your organization's unique needs and
                    preferences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                    <CardTitle>Digital Approval</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Secure digital signature and approval process with full audit trail and compliance documentation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Download className="h-6 w-6 text-blue-600" />
                    <CardTitle>Export & Share</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Download approved policies as formatted documents ready for implementation and distribution.
                  </p>
                </CardContent>
              </Card>
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
    </AuthGuard>
  )
}