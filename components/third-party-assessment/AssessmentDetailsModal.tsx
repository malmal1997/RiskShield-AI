"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import type { Assessment } from "@/lib/supabase";

interface AssessmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment | null;
  getRiskLevelColor: (level: string) => string;
}

export function AssessmentDetailsModal({
  isOpen,
  onClose,
  assessment,
  getRiskLevelColor,
}: AssessmentDetailsModalProps) {
  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Assessment Results</h2>
              <p className="text-gray-600">
                {assessment.vendor_name} - {assessment.assessment_type}
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Show if this has real data */}
          {(assessment as any).responses && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Assessment Completed</h3>
              <p className="text-sm text-green-800">
                This assessment was completed on{" "}
                {new Date((assessment as any).responses.submitted_at).toLocaleString()}
              </p>
            </div>
          )}

          {/* Support Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                Support Reference
              </CardTitle>
              <CardDescription>
                Use this ID if you need to contact support regarding this assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
                <span className="font-mono text-sm text-gray-800">{assessment.id}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(assessment.id);
                    alert("Assessment ID copied to clipboard!");
                  }}
                >
                  Copy ID
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Risk Score Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Risk Assessment Summary</h3>
                <div className="flex items-center space-x-4">
                  <Badge className={getRiskLevelColor(assessment.risk_level)}>
                    {assessment.risk_level} Risk
                  </Badge>
                  {assessment.risk_score && (
                    <div className="text-2xl font-bold text-gray-900">{assessment.risk_score}/100</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Completed Date</p>
                  <p className="font-medium">
                    {assessment.completed_date
                      ? new Date(assessment.completed_date).toLocaleDateString()
                      : "Not completed"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assessment Type</p>
                  <p className="font-medium">{assessment.assessment_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-medium">{assessment.contact_person || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          {(assessment as any).responses && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Vendor Name</p>
                    <p className="font-medium">{assessment.vendor_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Person</p>
                    <p className="font-medium">{assessment.contact_person || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment Responses */}
          {(assessment as any).responses && (assessment as any).assessmentAnswers && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Assessment Responses</h3>
                <div className="space-y-4">
                  {Object.entries((assessment as any).assessmentAnswers).map(([questionId, answer]) => (
                    <div key={questionId} className="border-b border-gray-200 pb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {questionId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Array.isArray(answer) ? answer.join(", ") : String(answer)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}