"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Shield, FileText, CheckCircle, AlertCircle, Info } from "lucide-react";
import type { AiAssessmentReport } from "@/lib/supabase";

interface AiReportDetailModalProps {
  report: AiAssessmentReport | null;
  isOpen: boolean;
  onClose: () => void;
}

const getRiskLevelColor = (level: string | null) => {
  switch (level?.toLowerCase()) {
    case "low":
      return "text-green-600 bg-green-100";
    case "medium":
      return "text-yellow-600 bg-yellow-100";
    case "medium-high":
      return "text-orange-600 bg-orange-100";
    case "high":
      return "text-red-600 bg-red-100";
    case "critical":
      return "text-red-800 bg-red-200";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export function AiReportDetailModal({ report, isOpen, onClose }: AiReportDetailModalProps) {
  if (!report) return null;

  const fullReportContent = report.full_report_content as any; // Cast to any for flexible access
  const analysisResults = fullReportContent?.analysisResults;
  const answers = fullReportContent?.answers;
  const questions = fullReportContent?.questions;
  const socInfo = fullReportContent?.socInfo;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <span>{report.report_title}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed AI Assessment Report for {report.assessment_type}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-6 -mr-6"> {/* Added pr-6 and -mr-6 to offset scrollbar */}
          <div className="py-4 space-y-6">
            {/* Report Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Report Overview</h3>
              <p className="text-sm text-blue-800">
                <strong>Assessment Type:</strong> {report.assessment_type}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Analysis Date:</strong> {new Date(report.analysis_date).toLocaleString()}
              </p>
              <p className="text-sm text-blue-800">
                <strong>AI Provider:</strong> {analysisResults?.aiProvider || 'N/A'}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Documents Analyzed:</strong> {analysisResults?.documentsAnalyzed || 0}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getRiskLevelColor(report.risk_level)}>
                  {report.risk_level} Risk
                </Badge>
                <span className="text-lg font-bold text-gray-900">{report.risk_score}/100</span>
              </div>
            </div>

            {/* SOC Info (if available) */}
            {socInfo && socInfo.companyName && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">SOC Assessment Details</h3>
                <p className="text-sm text-purple-800"><strong>Company:</strong> {socInfo.companyName}</p>
                <p className="text-sm text-purple-800"><strong>Product/Service:</strong> {socInfo.productService}</p>
                <p className="text-sm text-purple-800"><strong>SOC Type:</strong> {socInfo.socType}</p>
                {socInfo.reportType && <p className="text-sm text-purple-800"><strong>Report Type:</strong> {socInfo.reportType}</p>}
                {socInfo.auditor && <p className="text-sm text-purple-800"><strong>Auditor:</strong> {socInfo.auditor}</p>}
                {socInfo.auditorOpinion && <p className="text-sm text-purple-800"><strong>Auditor Opinion:</strong> {socInfo.auditorOpinion}</p>}
                {socInfo.auditorOpinionDate && <p className="text-sm text-purple-800"><strong>Opinion Date:</strong> {new Date(socInfo.auditorOpinionDate).toLocaleDateString()}</p>}
                {socInfo.socDateAsOf && <p className="text-sm text-purple-800"><strong>SOC Date As Of:</strong> {new Date(socInfo.socDateAsOf).toLocaleDateString()}</p>}
                {socInfo.socStartDate && <p className="text-sm text-purple-800"><strong>Period:</strong> {new Date(socInfo.socStartDate).toLocaleDateString()} - {new Date(socInfo.socEndDate).toLocaleDateString()}</p>}
                {socInfo.testedStatus && <p className="text-sm text-purple-800"><strong>Testing Status:</strong> {socInfo.testedStatus}</p>}
                {socInfo.subserviceOrganizations && <p className="text-sm text-purple-800"><strong>Subservice Orgs:</strong> {socInfo.subserviceOrganizations}</p>}
              </div>
            )}

            {/* Overall Analysis */}
            {analysisResults?.overallAnalysis && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Overall AI Analysis</h3>
                <p className="text-sm text-gray-700">{analysisResults.overallAnalysis}</p>
              </div>
            )}

            {/* Risk Factors */}
            {analysisResults?.riskFactors && analysisResults.riskFactors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Identified Risk Factors</h3>
                <ul className="text-sm text-red-800 list-disc pl-5 space-y-1">
                  {analysisResults.riskFactors.map((factor: string, index: number) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysisResults?.recommendations && analysisResults.recommendations.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Recommendations</h3>
                <ul className="text-sm text-green-800 list-disc pl-5 space-y-1">
                  {analysisResults.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Uploaded Documents Metadata */}
            {report.uploaded_documents_metadata && (report.uploaded_documents_metadata as any[]).length > 0 && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Uploaded Documents</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {(report.uploaded_documents_metadata as any[]).map((doc, index) => (
                    <li key={index}>
                      <FileText className="inline h-4 w-4 mr-1 text-gray-500" />
                      {doc.fileName} ({(doc.fileSize / 1024 / 1024).toFixed(2)} MB) - Label: {doc.label || 'Primary'}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Responses */}
            {questions && answers && (
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Responses</h2>
                {questions.map((question: any, index: number) => (
                  <div key={question.id} className="mb-6 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {index + 1}. {question.question}
                    </h3>
                    <p className="text-sm text-gray-700 ml-4">
                      <strong>Answer:</strong>{" "}
                      {typeof answers[question.id] === "boolean"
                        ? (answers[question.id] ? "Yes" : "No")
                        : Array.isArray(answers[question.id])
                          ? (answers[question.id] as string[]).join(", ")
                          : answers[question.id] || "N/A"}
                    </p>
                    {analysisResults?.confidenceScores?.[question.id] !== undefined && (
                      <p className="text-sm text-gray-600 ml-4">
                        <strong>AI Confidence:</strong> {Math.round(analysisResults.confidenceScores[question.id] * 100)}%
                      </p>
                    )}
                    {analysisResults?.documentExcerpts?.[question.id] &&
                      analysisResults.documentExcerpts[question.id].length > 0 && (
                        <div className="mt-3 text-xs text-gray-700 italic ml-4 p-2 bg-gray-50 border border-gray-100 rounded">
                          <Info className="inline h-3 w-3 mr-1" />
                          <strong>Evidence:</strong> "{analysisResults.documentExcerpts[question.id][0].excerpt}" (from{" "}
                          {analysisResults.documentExcerpts[question.id][0].fileName} -{" "}
                          {analysisResults.documentExcerpts[question.id][0].label})
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            <div className="disclaimer">
              <h3>Disclaimer:</h3>
              <p>This report is generated by RiskGuard AI based on the provided documents and AI analysis. It is intended for informational purposes only and should be reviewed and validated by human experts. RiskGuard AI is not responsible for any legal or compliance implications arising from the use of this report.</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}