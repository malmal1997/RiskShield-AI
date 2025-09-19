"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, User, Edit3, Calendar, Download, CheckCircle } from "lucide-react"

interface ApprovalData {
  clientName: string
  role: string
  signature: string
  date: string
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

interface PolicyApprovalProps {
  policy: PolicyContent
  companyName: string
  selectedPolicyName: string
  approvalData: ApprovalData
  onApprovalDataChange: (field: keyof ApprovalData, value: string) => void
  onFinalizeApproval: () => void
  onBackToReview: () => void
  isApproved: boolean
  onDownloadPdf: () => void
}

const PolicyApproval: React.FC<PolicyApprovalProps> = ({
  policy,
  companyName,
  selectedPolicyName,
  approvalData,
  onApprovalDataChange,
  onFinalizeApproval,
  onBackToReview,
  isApproved,
  onDownloadPdf,
}) => {
  const institutionRoles = [
    "Chief Information Security Officer (CISO)",
    "Chief Risk Officer (CRO)",
    "Chief Executive Officer (CEO)",
    "Chief Operating Officer (COO)",
    "Chief Compliance Officer (CCO)",
    "President",
    "Vice President",
    "Risk Manager",
    "Compliance Manager",
    "IT Director",
    "Operations Manager",
    "Board Member",
  ]

  const renderPolicyPreview = (policy: PolicyContent) => {
    if (!policy) return null
    return (
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="text-sm text-gray-600 mb-4">
          <strong>{companyName}</strong>
          <br />
          {selectedPolicyName}
          <br />
          Institution Type: {policy.institutionType}
        </div>
        <div className="text-xs text-gray-800">
          {policy.sections?.slice(0, 2).map((section: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="font-semibold text-blue-600">
                {section.number}. {section.title}
              </div>
              <div className="mt-1">{section.content?.substring(0, 200)}...</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isApproved) {
    return (
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
              Your {selectedPolicyName} has been approved and is ready for implementation.
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
              <Button onClick={onDownloadPdf} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Policy
              </Button>
              <Button variant="outline" onClick={onBackToReview}>
                {" "}
                {/* Changed to onBackToReview for consistency */}
                Generate New Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Client Name *
              </label>
              <input
                type="text"
                required
                value={approvalData.clientName}
                onChange={(e) => onApprovalDataChange("clientName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Title/Role *
              </label>
              <select
                required
                value={approvalData.role}
                onChange={(e) => onApprovalDataChange("role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your role</option>
                {institutionRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Edit3 className="inline h-4 w-4 mr-1" />
                Digital Signature *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={approvalData.signature}
                  onChange={(e) => onApprovalDataChange("signature", e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Approval Date
              </label>
              <input
                type="text"
                value={new Date().toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-amber-800 text-center">
                ⚠️ RiskShield AI may make mistakes. Please use with discretion.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={onBackToReview}>
                Back to Review
              </Button>
              <Button
                onClick={onFinalizeApproval}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!approvalData.clientName || !approvalData.role || !approvalData.signature}
              >
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
          <CardContent>{renderPolicyPreview(policy)}</CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PolicyApproval
