"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";

interface PolicyFormData {
  companyName: string;
  institutionType: string;
  selectedPolicy: string;
  employeeCount: string;
  assets: string;
}

interface PolicyFormProps {
  initialData: PolicyFormData;
  onSubmit: (data: PolicyFormData) => void;
  isGenerating: boolean;
}

const policyTypes = [
  {
    id: "cybersecurity",
    name: "Cybersecurity Policy",
    description:
      "Comprehensive cybersecurity framework including data protection, access controls, and incident response procedures.",
  },
  {
    id: "compliance",
    name: "Regulatory Compliance Policy",
    description: "FDIC, OCC, and regulatory compliance policies tailored to your institution type and size.",
  },
  {
    id: "third-party",
    name: "Third-Party Risk Management",
    description: "Vendor management and third-party risk assessment policies with due diligence frameworks.",
  },
  {
    id: "business-continuity",
    name: "Business Continuity Plan",
    description: "Disaster recovery and business continuity planning with crisis management procedures.",
  },
  {
    id: "privacy",
    name: "Privacy & Data Protection",
    description: "Customer privacy protection policies compliant with federal and state regulations.",
  },
  {
    id: "operational",
    name: "Operational Risk Policy",
    description: "Internal controls and operational risk management framework for daily operations.",
  },
];

const institutionTypes = [
  "Community Bank",
  "Regional Bank",
  "Credit Union",
  "Fintech Company",
  "Investment Firm",
  "Insurance Company",
  "Mortgage Company",
  "Payment Processor",
];

const PolicyForm: React.FC<PolicyFormProps> = ({ initialData, onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState<PolicyFormData>(initialData);

  const handleInputChange = (field: keyof PolicyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.institutionType || !formData.selectedPolicy) {
      alert("Please fill in all required fields: Company Name, Institution Type, and Policy Type.");
      return;
    }
    onSubmit(formData);
  };

  return (
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
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Institution Type *</label>
            <select
              required
              value={formData.institutionType}
              onChange={(e) => handleInputChange("institutionType", e.target.value)}
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
              onChange={(e) => handleInputChange("employeeCount", e.target.value)}
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
              onChange={(e) => handleInputChange("assets", e.target.value)}
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
                    onChange={(e) => handleInputChange("selectedPolicy", e.target.value)}
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
  );
};

export default PolicyForm;