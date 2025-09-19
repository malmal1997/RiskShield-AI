"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Edit3, FileCheck } from "lucide-react"
import { generatePolicy } from "./actions"
import { AuthGuard } from "@/components/auth-guard"
import PolicyForm from "@/components/policy-generator/PolicyForm"
import PolicyViewer from "@/components/policy-generator/PolicyViewer"
import PolicyEditor from "@/components/policy-generator/PolicyEditor"
import PolicyApproval from "@/components/policy-generator/PolicyApproval"

interface PolicyFormData {
  companyName: string
  institutionType: string
  selectedPolicy: string
  employeeCount: string
  assets: string
}

interface PolicyContent {
  title: string
  companyName: string
  effectiveDate: string
  institutionType: string
  employeeCount?: string
  assets?: string
  nextReviewDate: string
  sections: Array<{
    number: string
    title: string
    content?: string
    items?: string[]
  }>
}

interface ApprovalData {
  clientName: string
  role: string
  signature: string
  date: string
}

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

export default function PolicyGenerator() {
  const [formData, setFormData] = useState<PolicyFormData>({
    companyName: "",
    institutionType: "",
    selectedPolicy: "",
    employeeCount: "",
    assets: "",
  })
  const [generatedPolicy, setGeneratedPolicy] = useState<PolicyContent | null>(null)
  const [editedPolicy, setEditedPolicy] = useState<PolicyContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [approvalData, setApprovalData] = useState<ApprovalData>({
    clientName: "",
    role: "",
    signature: "",
    date: "",
  })
  const [currentStep, setCurrentStep] = useState<"form" | "generated" | "editing" | "approval" | "completed">("form")
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    const hasAuth = sessionStorage.getItem("demo_session")
    setIsPreviewMode(!hasAuth)
  }, [])

  const handleSubmitForm = async (data: PolicyFormData) => {
    setFormData(data)
    if (isPreviewMode) {
      alert("Preview Mode: Policy generated! Sign up to save, edit, and export your policies.")
      // Simulate policy generation for preview
      const selectedPolicyDetails = policyTypes.find((p) => p.id === data.selectedPolicy)
      if (selectedPolicyDetails) {
        const mockPolicy: PolicyContent = {
          title: selectedPolicyDetails.name,
          companyName: data.companyName,
          effectiveDate: new Date().toLocaleDateString(),
          institutionType: data.institutionType,
          employeeCount: data.employeeCount,
          assets: data.assets,
          nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          sections: [
            { number: "1", title: "Purpose", content: `This is a mock policy for ${data.companyName}.` },
            { number: "2", title: "Scope", items: ["All employees", "All systems"] },
          ],
        }
        setGeneratedPolicy(mockPolicy)
        setEditedPolicy(mockPolicy)
        setCurrentStep("generated")
      }
      return
    }

    setIsGenerating(true)
    try {
      const policy = await generatePolicy(data)
      setGeneratedPolicy(policy)
      setEditedPolicy(policy)
      setCurrentStep("generated")
    } catch (error) {
      console.error("Error generating policy:", error)
      alert("Failed to generate policy. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditPolicy = () => {
    setCurrentStep("editing")
  }

  const handleSaveEditedPolicy = (updatedPolicy: PolicyContent) => {
    setGeneratedPolicy(updatedPolicy)
    setEditedPolicy(updatedPolicy)
    setCurrentStep("generated")
  }

  const handleCancelEditPolicy = () => {
    setEditedPolicy(generatedPolicy) // Revert to generated version
    setCurrentStep("generated")
  }

  const handleApprovePolicy = () => {
    setCurrentStep("approval")
  }

  const handleApprovalDataChange = (field: keyof ApprovalData, value: string) => {
    setApprovalData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFinalizeApproval = () => {
    setApprovalData((prev) => ({
      ...prev,
      date: new Date().toLocaleDateString(),
    }))
    setIsApproved(true)
    setCurrentStep("completed")
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
          Generated by RiskShield AI Policy Generator<br>
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

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Generate policies for free! Sign up to save, edit, and export them."
    >
      <>
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
        <section className="py-8 bg-white">
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
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Step 1: Form */}
            {currentStep === "form" && (
              <div className="max-w-4xl mx-auto flex justify-center">
                <PolicyForm initialData={formData} onSubmit={handleSubmitForm} isGenerating={isGenerating} />
              </div>
            )}

            {/* Step 2: Generated Policy View */}
            {currentStep === "generated" && generatedPolicy && (
              <div className="max-w-6xl mx-auto">
                <PolicyViewer
                  policy={generatedPolicy}
                  companyName={formData.companyName}
                  selectedPolicyName={selectedPolicyDetails?.name || "Policy"}
                  onEdit={handleEditPolicy}
                  onApprove={handleApprovePolicy}
                  onReset={resetForm}
                  isPreviewMode={isPreviewMode}
                />
              </div>
            )}

            {/* Step 2.5: Editing Mode */}
            {currentStep === "editing" && editedPolicy && (
              <div className="max-w-6xl mx-auto">
                <PolicyEditor
                  policy={editedPolicy}
                  selectedPolicyName={selectedPolicyDetails?.name || "Policy"}
                  onSave={handleSaveEditedPolicy}
                  onCancel={handleCancelEditPolicy}
                />
              </div>
            )}

            {/* Step 3: Approval */}
            {(currentStep === "approval" || currentStep === "completed") && generatedPolicy && (
              <PolicyApproval
                policy={generatedPolicy}
                companyName={formData.companyName}
                selectedPolicyName={selectedPolicyDetails?.name || "Policy"}
                approvalData={approvalData}
                onApprovalDataChange={handleApprovalDataChange}
                onFinalizeApproval={handleFinalizeApproval}
                onBackToReview={() => setCurrentStep("generated")}
                isApproved={isApproved}
                onDownloadPdf={downloadAsPDF}
              />
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-blue-600">Complete Policy Management Workflow</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                From generation to approval, manage your entire policy lifecycle in one platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">AI Generation</h3>
                </div>
                <p className="text-gray-600">
                  Generate comprehensive policies tailored to your institution's specific requirements and regulations.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Edit3 className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Easy Editing</h3>
                </div>
                <p className="text-gray-600">
                  Make real-time edits to customize policies to match your organization's unique needs and preferences.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Digital Approval</h3>
                </div>
                <p className="text-gray-600">
                  Secure digital signature and approval process with full audit trail and compliance documentation.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Download className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Export & Share</h3>
                </div>
                <p className="text-gray-600">
                  Download approved policies as formatted documents ready for implementation and distribution.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    </AuthGuard>
  )
}
