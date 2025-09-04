"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Eye, X } from "lucide-react";

interface InviteForm {
  vendorName: string;
  vendorEmail: string;
  contactPerson: string;
  assessmentType: string;
  dueDate: string;
  customMessage: string;
}

interface InviteAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: InviteForm;
  onFormChange: (field: keyof InviteForm, value: string) => void;
  assessmentTypes: string[];
  onPreviewAssessment: () => void;
}

export function InviteAssessmentModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  onFormChange,
  assessmentTypes,
  onPreviewAssessment,
}: InviteAssessmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Send Assessment Invitation</h2>
            <Button variant="outline" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendorName">Vendor Company Name *</Label>
              <Input
                id="vendorName"
                value={form.vendorName}
                onChange={(e) => onFormChange("vendorName", e.target.value)}
                placeholder="Enter vendor company name"
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={form.contactPerson}
                onChange={(e) => onFormChange("contactPerson", e.target.value)}
                placeholder="Contact person name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vendorEmail">Vendor Email Address *</Label>
            <Input
              id="vendorEmail"
              type="email"
              value={form.vendorEmail}
              onChange={(e) => onFormChange("vendorEmail", e.target.value)}
              placeholder="vendor@company.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assessmentType">Assessment Type *</Label>
              <select
                id="assessmentType"
                value={form.assessmentType}
                onChange={(e) => onFormChange("assessmentType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select assessment type</option>
                {assessmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => onFormChange("dueDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customMessage">Custom Message (Optional)</Label>
            <Textarea
              id="customMessage"
              value={form.customMessage}
              onChange={(e) => onFormChange("customMessage", e.target.value)}
              placeholder="Add a custom message for the vendor..."
              rows={4}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>The vendor will receive an email with a secure assessment link</li>
              <li>They can complete the assessment at their convenience</li>
              <li>You'll receive notifications when the assessment is completed</li>
              <li>Risk scores and reports will be automatically generated</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800 text-center">
              ⚠️ RiskShield AI may make mistakes. Please use with discretion.
            </p>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
            <Button
              variant="outline"
              onClick={onPreviewAssessment}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Assessment Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}