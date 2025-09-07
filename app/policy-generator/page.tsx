"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label" // Added import
import { Input } from "@/components/ui/input" // Added import
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
            border-left: 4px solid #2563eb; 
            padding-left: 15px; 
            margin-bottom: 10px; 
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
<dyad-problem-report summary="109 problems">
<problem file="app/dashboard/page.tsx" line="179" column="10" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="lib/pdf-parser.ts" line="32" column="7" code="2322">Type '{ success: true; text: string; method: string; confidence: number; issues?: string[] | undefined; metadata?: { pages?: number | undefined; fileSize?: number | undefined; hasImages?: boolean | undefined; ... 4 more ...; producer?: string | undefined; } | undefined; }' is not assignable to type 'PDFExtractionResult'.
  Types of property 'issues' are incompatible.
    Type 'string[] | undefined' is not assignable to type 'string[]'.
      Type 'undefined' is not assignable to type 'string[]'.</problem>
<problem file="lib/pdf-parser.ts" line="47" column="7" code="2322">Type '{ success: true; text: string; method: string; confidence: number; issues?: string[] | undefined; metadata?: { pages?: number | undefined; fileSize?: number | undefined; hasImages?: boolean | undefined; ... 4 more ...; producer?: string | undefined; } | undefined; }' is not assignable to type 'PDFExtractionResult'.
  Types of property 'issues' are incompatible.
    Type 'string[] | undefined' is not assignable to type 'string[]'.
      Type 'undefined' is not assignable to type 'string[]'.</problem>
<problem file="app/policy-generator/page.tsx" line="907" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="910" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="911" column="26" code="2552">Cannot find name 'Input'. Did you mean 'oninput'?</problem>
<problem file="app/policy-generator/page.tsx" line="915" column="38" code="7006">Parameter 'e' implicitly has an 'any' type.</problem>
<problem file="app/policy-generator/page.tsx" line="922" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="925" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="951" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="954" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="956" column="28" code="2304">Cannot find name 'Input'.</problem>
<problem file="app/policy-generator/page.tsx" line="960" column="40" code="7006">Parameter 'e' implicitly has an 'any' type.</problem>
<problem file="app/policy-generator/page.tsx" line="973" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="976" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="977" column="26" code="2304">Cannot find name 'Input'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1383" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1385" column="25" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1390" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1391" column="23" code="2532">Object is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1393" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1396" column="23" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2129" column="24" code="7006">Parameter 'recommendation' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/page.tsx" line="2727" column="51" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2730" column="28" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2733" column="50" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2734" column="61" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2739" column="50" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2740" column="61" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2745" column="31" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2748" column="50" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2749" column="61" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2754" column="50" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2755" column="61" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2766" column="32" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2769" column="52" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2770" column="63" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2782" column="49" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2783" column="64" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2826" column="58" code="7006">Parameter 'recommendation' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/page.tsx" line="2826" column="74" code="7006">Parameter 'index' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1374" column="27" code="2345">Argument of type '(prev: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; { [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to parameter of type 'SetStateAction&lt;Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;&gt;'.
  Type '(prev: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; { [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to type '(prevState: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;'.
    Type '{ [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to type 'Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;'.
      'string' index signatures are incompatible.
        Type '&quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;' is not assignable to type '&quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;'.
          Type '&quot;operational&quot;' is not assignable to type '&quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1630" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1631" column="23" code="2532">Object is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1633" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1637" column="25" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1682" column="22" code="2345">Argument of type '(UploadedFileWithDesignation | { designation: string; lastModified: number; name: string; webkitRelativePath: string; size: number; type: string; arrayBuffer(): Promise&lt;...&gt;; slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob; stream(): ReadableStream&lt;...&gt;; text(): Pr...' is not assignable to parameter of type 'SetStateAction&lt;UploadedFileWithDesignation[]&gt;'.
  Type '(UploadedFileWithDesignation | { designation: string; lastModified: number; name: string; webkitRelativePath: string; size: number; type: string; arrayBuffer(): Promise&lt;...&gt;; slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob; stream(): ReadableStream&lt;...&gt;; text(): Pr...' is not assignable to type 'UploadedFileWithDesignation[]'.
    Type 'UploadedFileWithDesignation | { designation: string; lastModified: number; name: string; webkitRelativePath: string; size: number; type: string; arrayBuffer(): Promise&lt;...&gt;; slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob; stream(): ReadableStream&lt;...&gt;; text(): Pro...' is not assignable to type 'UploadedFileWithDesignation'.
      Type '{ designation: string; lastModified: number; name: string; webkitRelativePath: string; size: number; type: string; arrayBuffer(): Promise&lt;ArrayBuffer&gt;; slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob; stream(): ReadableStream&lt;...&gt;; text(): Promise&lt;...&gt;; }' is not assignable to type 'UploadedFileWithDesignation'.
        Type '{ designation: string; lastModified: number; name: string; webkitRelativePath: string; size: number; type: string; arrayBuffer(): Promise&lt;ArrayBuffer&gt;; slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob; stream(): ReadableStream&lt;...&gt;; text(): Promise&lt;...&gt;; }' is not assignable to type '{ designation: &quot;primary&quot; | &quot;fourth-party&quot;; }'.
          Types of property 'designation' are incompatible.
            Type 'string' is not assignable to type '&quot;primary&quot; | &quot;fourth-party&quot;'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2398" column="59" code="2349">This expression is not callable.
  Each member of the union type '{ &lt;S extends { id: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; required?: undefined; } | { id: string; question: string; type: &quot;multiple&quot;; options: string[]; weight: number; required?: undefined; } | { ...; } | { ...; }&gt;(predicate: (value: { ...; } | ... 2 more ... | { ...; }, ind...' has signatures, but none of those signatures are compatible with each other.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2398" column="66" code="7006">Parameter 'q' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2448" column="29" code="2345">Argument of type 'Record&lt;string, &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;' is not assignable to parameter of type 'SetStateAction&lt;Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;&gt;'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2494" column="26" code="2349">This expression is not callable.
  Each member of the union type '{ &lt;S extends { referencedControl: string; controlDescription: string; testingDescription: string; auditorResponse: string; managementResponse: string; }&gt;(predicate: (value: { referencedControl: string; controlDescription: string; testingDescription: string; auditorResponse: string; managementResponse: string; }, ind...' has signatures, but none of those signatures are compatible with each other.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2494" column="34" code="7006">Parameter '_' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2494" column="37" code="7006">Parameter 'i' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="4172" column="40" code="2345">Argument of type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; exceptions: string; nonOperationalControls: string; companyName: string; productService: string; userEntityControls: string; socDateAsOf: string; }' is not assignable to parameter of type 'SetStateAction&lt;{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; socDateAsOf: string; testedStatus: string; ... 5 more ...; userEntityControls: string; }&gt;'.
  Type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; exceptions: string; nonOperationalControls: string; companyName: string; productService: string; userEntityControls: string; socDateAsOf: string; }' is missing the following properties from type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; socDateAsOf: string; testedStatus: string; ... 5 more ...; userEntityControls: string; }': testedStatus, subserviceOrganizations</problem>
<problem file="app/solutions/page.tsx" line="951" column="42" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="952" column="71" code="2531">Object is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="955" column="17" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="960" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="961" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="963" column="23" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="978" column="42" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="979" column="71" code="2531">Object is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="982" column="17" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="987" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="988" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="990" column="23" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="7" column="80" code="2307">Cannot find module '@/components/ui/form' or its corresponding type declarations.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="39" column="5" code="2322">Type 'Resolver&lt;{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendorRiskMa...' is not assignable to type 'Resolver&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.
  Types of parameters 'options' and 'options' are incompatible.
    Type 'ResolverOptions&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }&gt;' is not assignable to type 'ResolverOptions&lt;{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendo...'.
      Type '{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendorRiskManagementP...' is not assignable to type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="111" column="45" code="2345">Argument of type '(values: { name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }) =&gt; Promise&lt;...&gt;' is not assignable to parameter of type 'SubmitHandler&lt;TFieldValues&gt;'.
  Types of parameters 'values' and 'data' are incompatible.
    Type 'TFieldValues' is not assignable to type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }'.
      Type 'FieldValues' is missing the following properties from type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }': name, email, company, dataBreachIncidentResponsePlan, and 4 more.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="115" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="128" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="141" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="155" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="171" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="187" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="203" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="219" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="235" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/page.tsx" line="88" column="22" code="2345">Argument of type '{ id: any; vendorName: any; vendorEmail: any; contactPerson: any; assessmentType: any; status: any; sentDate: any; completedDate: any; dueDate: any; riskScore: any; riskLevel: any; companySize: any; customMessage: any; responses: any; completedVendorInfo: any; assessmentAnswers: any; }[]' is not assignable to parameter of type 'SetStateAction&lt;Assessment[]&gt;'.
  Type '{ id: any; vendorName: any; vendorEmail: any; contactPerson: any; assessmentType: any; status: any; sentDate: any; completedDate: any; dueDate: any; riskScore: any; riskLevel: any; companySize: any; customMessage: any; responses: any; completedVendorInfo: any; assessmentAnswers: any; }[]' is not assignable to type 'Assessment[]'.
    Type '{ id: any; vendorName: any; vendorEmail: any; contactPerson: any; assessmentType: any; status: any; sentDate: any; completedDate: any; dueDate: any; riskScore: any; riskLevel: any; companySize: any; customMessage: any; responses: any; completedVendorInfo: any; assessmentAnswers: any; }' is missing the following properties from type 'Assessment': vendor_name, vendor_email, assessment_type, sent_date, and 3 more.</problem>
<problem file="app/third-party-assessment/page.tsx" line="119" column="11" code="2322">Type 'null' is not assignable to type 'number | undefined'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="143" column="11" code="2322">Type '{ id: string; vendor_name: string; vendor_email: string; contact_person: string; assessment_type: string; status: &quot;completed&quot;; sent_date: string; completed_date: string; due_date: string; risk_score: number; ... 6 more ...; assessmentAnswers: { ...; }; }' is not assignable to type 'Assessment'.
  Object literal may only specify known properties, and 'responses' does not exist in type 'Assessment'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="381" column="18" code="2551">Property 'vendorName' does not exist on type 'Assessment'. Did you mean 'vendor_name'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="382" column="18" code="2551">Property 'vendorEmail' does not exist on type 'Assessment'. Did you mean 'vendor_email'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="383" column="18" code="2551">Property 'assessmentType' does not exist on type 'Assessment'. Did you mean 'assessment_type'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="413" column="25" code="2322">Type '{ userEmail: string; onSignOut: (() =&gt; void) | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; NavigationProps'.
  Property 'userEmail' does not exist on type 'IntrinsicAttributes &amp; NavigationProps'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="432" column="25" code="2322">Type '{ userEmail: string; onSignOut: (() =&gt; void) | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; NavigationProps'.
  Property 'userEmail' does not exist on type 'IntrinsicAttributes &amp; NavigationProps'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="561" column="83" code="2551">Property 'vendorName' does not exist on type 'Assessment'. Did you mean 'vendor_name'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="562" column="76" code="2551">Property 'vendorEmail' does not exist on type 'Assessment'. Did you mean 'vendor_email'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="565" column="81" code="2551">Property 'assessmentType' does not exist on type 'Assessment'. Did you mean 'assessment_type'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="566" column="41" code="2551">Property 'riskLevel' does not exist on type 'Assessment'. Did you mean 'risk_level'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="566" column="65" code="2551">Property 'riskLevel' does not exist on type 'Assessment'. Did you mean 'risk_level'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="567" column="78" code="2551">Property 'riskLevel' does not exist on type 'Assessment'. Did you mean 'risk_level'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="568" column="45" code="2551">Property 'riskLevel' does not exist on type 'Assessment'. Did you mean 'risk_level'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="571" column="41" code="2339">Property 'responses' does not exist on type 'Assessment'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="579" column="49" code="2551">Property 'sentDate' does not exist on type 'Assessment'. Did you mean 'sent_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="579" column="80" code="2551">Property 'sentDate' does not exist on type 'Assessment'. Did you mean 'sent_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="581" column="41" code="2551">Property 'dueDate' does not exist on type 'Assessment'. Did you mean 'due_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="581" column="83" code="2551">Property 'dueDate' does not exist on type 'Assessment'. Did you mean 'due_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="582" column="41" code="2551">Property 'completedDate' does not exist on type 'Assessment'. Did you mean 'completed_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="583" column="68" code="2551">Property 'completedDate' does not exist on type 'Assessment'. Did you mean 'completed_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="586" column="39" code="2551">Property 'riskScore' does not exist on type 'Assessment'. Did you mean 'risk_score'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="587" column="99" code="2551">Property 'riskScore' does not exist on type 'Assessment'. Did you mean 'risk_score'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="870" column="31" code="2322">Type 'unknown' is not assignable to type 'ReactNode'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="769" column="18" code="18046">'error' is of type 'unknown'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="770" column="16" code="18046">'error' is of type 'unknown'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="1333" column="47" code="7006">Parameter 'option' implicitly has an 'any' type.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="1344" column="47" code="7006">Parameter 'option' implicitly has an 'any' type.</problem>
<problem file="components/mobile-nav.tsx" line="5" column="51" code="2307">Cannot find module '@/components/ui/sheet' or its corresponding type declarations.</problem>
<problem file="components/theme-provider.tsx" line="9" column="33" code="2339">Property 'children' does not exist on type 'ThemeProviderProps'.</problem>
</dyad-problem-report><think>**Examining Errors Strategically**

I've begun dissecting the 109 TypeScript errors. Starting with the first, a JSX syntax issue in `app/dashboard/page.tsx`, I'm methodically working through the list. My strategy is to prioritize syntax errors and then tackle type-related issues. I'll document each fix to maintain a clear track of progress.


**Prioritizing & Fixing Errors**

I'm systematically tackling the TypeScript errors, beginning with the JSX syntax issue in `app/dashboard/page.tsx`, which I've fixed by adding the missing closing tag. Next, I'll address the `pdf-parser.ts` errors, making sure the `issues` property is consistently an array. I'll then move on to correcting the import and implicit any issues in `app/policy-generator/page.tsx` and the `undefined` and implicit any issues in `app/risk-assessment/page.tsx`, followed by the `map` callback implicit type in the same file. I'm focusing on ensuring data integrity and explicitly typing parameters.


**Implementing the Planned Fixes**

I've fixed the JSX syntax error in `app/dashboard/page.tsx` and updated `lib/pdf-parser.ts` to ensure the `issues` property is consistently an array. Moving forward, I'll address the import errors and implicit any types in `app/policy-generator/page.tsx`, making sure to explicitly type the event parameters. Afterward, I'll turn my focus on resolving the `undefined` and implicit any issues in `app/risk-assessment/page.tsx`, employing non-null assertions and explicit typing.


**Implementing Remaining Solutions**

I've fixed the initial JSX syntax and `pdf-parser.ts` errors. Now I'm focusing on the `policy-generator` and `risk-assessment` pages. I will explicitly type event parameters and use non-null assertions to handle `undefined` values. Specifically, I'm working to explicitly type the `answer` and `option` parameters and adding null checks for `currentCategory`. I am updating the `socExceptionStatus` and `socInfo` types as well. I'll then move on to ensuring proper typing for `UploadedFileWithDesignation`.


**Tackling Remaining Issues**

I've fixed the initial JSX error and addressed the `pdf-parser.ts` file. Now, I'm working through the `policy-generator` and `risk-assessment` files, explicitly typing event parameters and addressing potentially `undefined` values with non-null assertions and adding checks. I've updated the `socExceptionStatus` and `socInfo` types as needed. I have also resolved the typing errors associated with the uploaded files and will soon move on to ensuring proper typing for `UploadedFileWithDesignation`.


**Continuing Error Resolution**

I'm now methodically addressing the remaining errors, systematically working through `app/policy-generator/page.tsx` and `app/risk-assessment/page.tsx`. Specifically, I'm focusing on ensuring robust type safety for parameters, employing non-null assertions where necessary, and updating types like `socExceptionStatus` and `socInfo`. The goal is to establish type integrity and prevent future run-time issues. I have made the necessary adjustments to include the `"operational"` value to the `socExceptionStatus` and add `testedStatus` and `subserviceOrganizations` to `socInfo`. I am also working to ensure the correct typing for `UploadedFileWithDesignation` to fix the `newFiles` typing issue. I have now turned my focus to the `third-party-assessment` folder.


</think>It looks like there are a lot of TypeScript errors, primarily due to type mismatches, missing imports, and incorrect usage of `useState` and component props. I'll go through each category of errors and apply the necessary fixes.

Here's a summary of the changes I'll make:

1.  **`app/dashboard/page.tsx`**: Fix a missing closing `</div>` tag.
2.  **`lib/pdf-parser.ts`**: Ensure the `issues` property is always an array in `PDFExtractionResult` and add explicit types for metadata.
3.  **`app/policy-generator/page.tsx`**: Add missing `Label` and `Input` imports and explicitly type event parameters.
4.  **`app/risk-assessment/page.tsx`**: Add non-null assertions (`!`) where properties are guaranteed to exist and explicitly type `map` callback parameters.
5.  **`app/risk-assessment/ai-assessment/page.tsx`**:
    *   Correct the initialization of `approvedQuestions` state.
    *   Update the type definition for `socExceptionStatus` to include `"operational"`.
    *   Ensure `UploadedFileWithDesignation` is correctly typed when updating state.
    *   Add null checks for `currentCategory` and explicitly type `map` callback parameters.
    *   Correct the initial `socInfo` state to include `testedStatus` and `subserviceOrganizations`.
6.  **`app/solutions/page.tsx`**: Add null checks for the `carousel` DOM element before accessing its properties.
7.  **`app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx`**:
    *   **Crucially**, the `Form`, `FormControl`, `FormField`, `FormItem`, `FormLabel`, and `FormMessage` components from `@/components/ui/form` are not defined in the provided codebase. To resolve these compile errors, I will comment out these imports and the usage of `Form` and `FormField`. If you intend to use `shadcn/ui` forms, you would need to generate these components first.
    *   Adjust `zodResolver` and `onSubmit` typing to correctly handle optional boolean fields.
    *   Explicitly type the `field` parameter in `FormField` render props.
8.  **`app/third-party-assessment/page.tsx`**:
    *   Update the `Assessment` interface in `lib/supabase.ts` to match the camelCase properties (`vendorName`, `vendorEmail`, `assessmentType`, `sentDate`, `completedDate`, `dueDate`, `riskScore`, `riskLevel`) used in the component, and add `responses?: any;`.
    *   Remove `userEmail` and `onSignOut` props from `MainNavigation` as it manages authentication internally.
9.  **`app/vendor-assessment/[id]/page.tsx`**: Cast the `error` object to `Error` and explicitly type `map` callback parameters.
10. **`components/mobile-nav.tsx`**:
    *   **Crucially**, the `Sheet`, `SheetContent`, and `SheetTrigger` components from `@/components/ui/sheet` are not defined in the provided codebase. To resolve these compile errors, I will comment out these imports and the usage of these components.
11. **`components/theme-provider.tsx`**: Add `children: React.ReactNode` to `ThemeProviderProps`.

Let's apply these fixes.

<dyad-write path="app/dashboard/page.tsx" description="Adding a missing closing div tag.">
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Send,
  BarChart3,
  PieChart,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle,
  Shield,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  BarChart,
  Bar,
} from "recharts"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"
import type { RiskMetrics, VendorMetrics } from "@/lib/analytics-service"
import type { Notification } from "@/lib/notification-service"

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#dc2626"]

// Sample real-time data (in production, this would come from your analytics service)
const sampleRiskMetrics: RiskMetrics = {
  totalAssessments: 247,
  completedAssessments: 189,
  averageRiskScore: 72,
  highRiskVendors: 23,
  riskTrend: [
    { date: "2024-01-01", score: 68 },
    { date: "2024-01-02", score: 71 },
    { date: "2024-01-03", score: 69 },
    { date: "2024-01-04", score: 74 },
    { date: "2024-01-05", score: 72 },
    { date: "2024-01-06", score: 76 },
    { date: "2024-01-07", score: 73 },
  ],
  riskDistribution: [
    { level: "Low", count: 45 },
    { level: "Medium", count: 121 },
    { level: "High", count: 18 },
    { level: "Critical", count: 5 },
  ],
  complianceScore: 87,
}

const sampleVendorMetrics: VendorMetrics = {
  totalVendors: 156,
  activeVendors: 134,
  riskLevels: { low: 45, medium: 121, high: 18, critical: 5 },
  industryBreakdown: [
    { industry: "Technology", count: 42 },
    { industry: "Financial Services", count: 28 },
    { industry: "Healthcare", count: 21 },
    { industry: "Manufacturing", count: 18 },
    { industry: "Retail", count: 15 },
  ],
  assessmentCompletion: 76.5,
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "High-risk vendor assessment completed",
    message: "TechCorp assessment shows critical security gaps",
    type: "alert",
    data: {}, // Added
    read_at: undefined, // Changed from null
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "New vendor onboarding request",
    message: "DataFlow Inc. submitted assessment request",
    type: "info",
    data: {}, // Added
    read_at: undefined, // Changed from null
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "Compliance deadline approaching",
    message: "SOC 2 audit due in 7 days",
    type: "warning",
    data: {}, // Added
    read_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(sampleRiskMetrics)
  const [vendorMetrics, setVendorMetrics] = useState<VendorMetrics>(sampleVendorMetrics)
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState("7d")
  const [businessMetrics, setBusinessMetrics] = useState({
    highRiskVendors: 8,
    overdueAssessments: 12,
    pendingReviews: 15,
    complianceRate: 87,
  })
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 23,
    systemLoad: 45,
    responseTime: 120,
    uptime: 99.9,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 10) - 5)),
        responseTime: Math.max(50, Math.min(1000, prev.responseTime + Math.floor(Math.random() * 20) - 10)),
        uptime: Math.max(99.0, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })))
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Simulate data refresh
      setRiskMetrics({
        ...riskMetrics,
        averageRiskScore: riskMetrics.averageRiskScore + Math.floor(Math.random() * 6) - 3,
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - matching other pages style */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Risk Management Dashboard</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Enterprise Dashboard
              <br />
              <span className="text-blue-600">Real-Time Risk Analytics</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Monitor your vendor risk portfolio with live analytics, compliance tracking, and intelligent insights
              powered by AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/third-party-assessment">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Send New Assessment
                </Button>
              </Link>
              <Link href="/vendors">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 bg-transparent"
                >
                  Manage Vendors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time System Status - matching card style */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/risk-center?tab=high-risk">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{businessMetrics.highRiskVendors}</div>
                  <div className="text-sm text-gray-600 mt-1">High-Risk Vendors</div>
                  <div className="text-xs text-blue-600 mt-2">Click to manage →</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/risk-center?tab=overdue">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{businessMetrics.overdueAssessments}</div>
                  <div className="text-sm text-gray-600 mt-1">Overdue Assessments</div>
                  <div className="text-xs text-blue-600 mt-2">Click to follow up →</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/risk-center?tab=pending">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{businessMetrics.pendingReviews}</div>
                  <div className="text-sm text-gray-600 mt-1">Pending Reviews</div>
                  <div className="text-xs text-blue-600 mt-2">Click to review →</div>
                </CardContent>
              </Card>
            </Link>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-600">{businessMetrics.complianceRate}%</div>
                <div className="text-sm text-gray-600 mt-1">Compliance Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Analytics Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.totalAssessments}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Risk Score</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.averageRiskScore}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <PieChart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">-5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                    <p className="text-3xl font-bold text-gray-900">{vendorMetrics.activeVendors}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.complianceScore}%</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Shield className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={riskMetrics.complianceScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Live Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Trend Chart */}
                <Card className="lg:col-span-2 border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Live Risk Trend</CardTitle>
                      <div className="flex space-x-2">
                        {["7d", "30d", "90d"].map((period) => (
                          <Button
                            key={period}
                            variant={timeframe === period ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTimeframe(period)}
                          >
                            {period}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <CardDescription>Real-time risk score trends with live updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={riskMetrics.riskTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Live Activity Feed */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Live Activity</CardTitle>
                    <CardDescription>Real-time system activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start space-x-3">
                            <div
                              className={`p-1 rounded-full ${
                                notification.type === "alert"
                                  ? "bg-red-100"
                                  : notification.type === "warning"
                                    ? "bg-yellow-100"
                                    : "bg-blue-100"
                              }`}
                            >
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  notification.type === "alert"
                                    ? "bg-red-600"
                                    : notification.type === "warning"
                                      ? "bg-yellow-600"
                                      : "bg-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                            {!notification.read_at && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Distribution & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>Current risk levels across all vendors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={riskMetrics.riskDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ level, count }) => `${level}: ${count}`}
                        >
                          {riskMetrics.riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href="/third-party-assessment">
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" />
                        Send New Assessment
                      </Button>
                    </Link>
                    <Link href="/vendors">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Vendors
                      </Button>
                    </Link>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      Configure Workflows
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tabs with consistent styling */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Vendor Risk Levels</CardTitle>
                    <CardDescription>Distribution of risk across vendor portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={Object.entries(vendorMetrics.riskLevels).map(([level, count]) => ({ level, count }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="level" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Industry Breakdown</CardTitle>
                    <CardDescription>Vendor distribution by industry</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vendorMetrics.industryBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.industry}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(item.count / vendorMetrics.totalVendors) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vendors">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Vendor Management</CardTitle>
                  <CardDescription>Comprehensive vendor portfolio overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor Insights Coming Soon</h3>
                    <p className="text-gray-600 mb-4">Advanced vendor analytics and management tools</p>
                    <Link href="/vendors">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Vendors
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Compliance Dashboard</CardTitle>
                  <CardDescription>Real-time compliance monitoring and reporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Tracking</h3>
                    <p className="text-gray-600">Advanced compliance monitoring features</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Live Alerts & Notifications</CardTitle>
                  <CardDescription>Real-time security alerts and system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          notification.type === "alert"
                            ? "border-l-red-500 bg-red-50"
                            : notification.type === "warning"
                              ? "border-l-yellow-500 bg-yellow-50"
                              : "border-l-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <Badge
                            variant={notification.type === "alert" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1 text-gray-600">{notification.message}</p>
                        <p className="text-xs mt-2 text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer - matching other pages */}
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
  )
}