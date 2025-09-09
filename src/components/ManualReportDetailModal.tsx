"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Building, User, Mail, Phone, Globe, Info } from "lucide-react";
import type { Assessment, AssessmentResponse } from "@/lib/supabase";

interface ManualReportDetailModalProps {
  report: (Assessment & { responses?: AssessmentResponse[] }) | null;
  isOpen: boolean;
  onClose: () => void;
}

const getRiskLevelColor = (level: string | null) => {
  switch (level?.toLowerCase()) {
    case "low":
      return "text-green-600 bg-green-100";
    case "medium":
      return "text-yellow-600 bg-yellow-100";
    case "high":
      return "text-red-600 bg-red-100";
    case "critical":
      return "text-red-800 bg-red-200";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export function ManualReportDetailModal({ report, isOpen, onClose }: ManualReportDetailModalProps) {
  if (!report) return null;

  const responseData = report.responses?.[0];
  const vendorInfo = responseData?.vendor_info as any;
  const answers = responseData?.answers as any;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col"> {/* Removed sm:max-w-[1200px] */}
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>{report.vendor_name} - {report.assessment_type}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed Manual Assessment Report
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1"> {/* Removed pr-6 -mr-6 */}
          <div className="py-4 space-y-6">
            {/* Report Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Report Overview</h3>
              <p className="text-sm text-blue-800">
                <strong>Assessment Type:</strong> {report.assessment_type}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Sent Date:</strong> {new Date(report.sent_date).toLocaleDateString()}
              </p>
              {report.completed_date && (
                <p className="text-sm text-blue-800">
                  <strong>Completed Date:</strong> {new Date(report.completed_date).toLocaleString()}
                </p>
              )}
              {report.due_date && (
                <p className="text-sm text-blue-800">
                  <strong>Due Date:</strong> {new Date(report.due_date).toLocaleDateString()}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getRiskLevelColor(report.risk_level)}>
                  {report.risk_level} Risk
                </Badge>
                {report.risk_score !== null && (
                  <span className="text-lg font-bold text-gray-900">{report.risk_score}/100</span>
                )}
              </div>
            </div>

            {/* Vendor Information */}
            {vendorInfo && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Vendor Information</h3>
                <p className="text-sm text-gray-700"><strong>Company Name:</strong> {vendorInfo.companyName}</p>
                <p className="text-sm text-gray-700"><strong>Contact Person:</strong> {vendorInfo.contactName}</p>
                <p className="text-sm text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-500" />
                  {vendorInfo.email}
                </p>
                {vendorInfo.phone && (
                  <p className="text-sm text-gray-700 flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-gray-500" />
                    {vendorInfo.phone}
                  </p>
                )}
                {vendorInfo.website && (
                  <p className="text-sm text-gray-700 flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-gray-500" />
                    <a href={vendorInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {vendorInfo.website}
                    </a>
                  </p>
                )}
                {vendorInfo.industry && <p className="text-sm text-gray-700"><strong>Industry:</strong> {vendorInfo.industry}</p>}
                {vendorInfo.employeeCount && <p className="text-sm text-gray-700"><strong>Employees:</strong> {vendorInfo.employeeCount}</p>}
                {vendorInfo.description && <p className="text-sm text-gray-700"><strong>Description:</strong> {vendorInfo.description}</p>}
              </div>
            )}

            {/* Assessment Answers */}
            {answers && Object.keys(answers).length > 0 && (
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment Answers</h2>
                {Object.entries(answers).map(([questionId, answer]: [string, any]) => (
                  <div key={questionId} className="mb-6 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {questionId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-700 ml-4">
                      {typeof answer === "boolean"
                        ? (answer ? "Yes" : "No")
                        : Array.isArray(answer)
                          ? (answer as string[]).join(", ")
                          : answer || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="disclaimer">
              <h3>Disclaimer:</h3>
              <p>This report reflects the responses provided by the vendor. It is intended for informational purposes only and should be reviewed and validated by human experts. RiskGuard AI is not responsible for any legal or compliance implications arising from the use of this report.</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}