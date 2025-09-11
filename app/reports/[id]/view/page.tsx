"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getAiAssessmentReports, getAssessments } from '@/lib/assessment-service';
import type { AiAssessmentReport, Assessment, AssessmentResponse } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft, Printer } from 'lucide-react';
import { useAuth } from '@/components/auth-context';

type ReportType = 'ai' | 'manual';

export default function ReportViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const reportId = params.id as string;
  const reportType = searchParams.get('type') as ReportType;

  const { user, loading: authLoading, isDemo } = useAuth();
  const [reportData, setReportData] = useState<AiAssessmentReport | (Assessment & { responses?: AssessmentResponse[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      if (authLoading || !user) {
        // Wait for auth to load, or if no user, show error later
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (reportType === 'ai') {
          const aiReports = await getAiAssessmentReports();
          const foundReport = aiReports.find(r => r.id === reportId);
          if (foundReport) {
            setReportData(foundReport);
          } else {
            setError('AI Report not found.');
          }
        } else if (reportType === 'manual') {
          const manualAssessments = await getAssessments();
          const foundReport = manualAssessments.find(r => r.id === reportId);
          if (foundReport) {
            setReportData(foundReport);
          } else {
            setError('Manual Report not found.');
          }
        } else {
          setError('Invalid report type specified.');
        }
      } catch (err: any) {
        console.error('Error fetching report:', err);
        setError(err.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchReport();
    }
  }, [reportId, reportType, user, authLoading]);

  const getRiskLevelColorClass = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "medium-high": return "bg-orange-100 text-orange-800";
      case "high": return "bg-red-100 text-red-800";
      case "critical": return "bg-red-200 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderAiReport = (report: AiAssessmentReport) => {
    const fullReportContent = report.full_report_content as any;
    const analysisResults = fullReportContent?.analysisResults;
    const answers = fullReportContent?.answers;
    const questions = fullReportContent?.questions;
    const socInfo = fullReportContent?.socInfo;
    const uploadedDocumentsMetadata = report.uploaded_documents_metadata as any[] || [];

    // Helper function to render the evidence citation
    const renderEvidenceCitation = (excerptData: any) => {
      if (!excerptData || excerptData.excerpt === 'No directly relevant evidence found after comprehensive search') {
        return 'No directly relevant evidence found after comprehensive search.';
      }

      let citationParts = [];
      if (excerptData.fileName && excerptData.fileName !== 'N/A') {
        citationParts.push(`Source: "${excerptData.fileName}"`);
      }
      if (excerptData.pageNumber) {
        citationParts.push(`Page: ${excerptData.pageNumber}`);
      }
      // Only add '4th Party' if the label is explicitly '4th Party'
      if (excerptData.label === '4th Party') {
        citationParts.push(`4th Party`);
      }

      const citationString = citationParts.length > 0 ? ` (${citationParts.join(", ")})` : '';
      return `"${excerptData.excerpt}"${citationString}`;
    };

    return (
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6 border-b pb-4">
          {report.report_title} AI Assessment Report
        </h1>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Report Overview</h2>
          <p className="text-sm text-blue-700"><strong>Assessment Type:</strong> {report.assessment_type}</p>
          <p className="text-sm text-blue-700"><strong>Analysis Date:</strong> {new Date(report.analysis_date).toLocaleString()}</p>
          <p className="text-sm text-blue-700"><strong>AI Provider:</strong> {analysisResults?.aiProvider || 'N/A'}</p>
          <p className="text-sm text-blue-700"><strong>Documents Analyzed:</strong> {analysisResults?.documentsAnalyzed || 0}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColorClass(report.risk_level)}`}>
              {report.risk_level} Risk
            </span>
            <span className="text-lg font-bold text-gray-900">{report.risk_score}/100</span>
          </div>
        </div>

        {socInfo && socInfo.companyName && (
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6 rounded-md">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">SOC Assessment Details</h2>
            <p className="text-sm text-purple-700"><strong>Company:</strong> {socInfo.companyName}</p>
            <p className="text-sm text-purple-700"><strong>Product/Service:</strong> {socInfo.productService}</p>
            <p className="text-sm text-purple-700"><strong>SOC Type:</strong> {socInfo.socType}</p>
            {socInfo.reportType && <p className="text-sm text-purple-700"><strong>Report Type:</strong> {socInfo.reportType}</p>}
            {socInfo.auditor && <p className="text-sm text-purple-700"><strong>Auditor:</strong> {socInfo.auditor}</p>}
            {socInfo.auditorOpinion && <p className="text-sm text-purple-700"><strong>Auditor Opinion:</strong> {socInfo.auditorOpinion}</p>}
            {socInfo.auditorOpinionDate && <p className="text-sm text-purple-700"><strong>Opinion Date:</strong> {new Date(socInfo.auditorOpinionDate).toLocaleDateString()}</p>}
            {socInfo.socDateAsOf && <p className="text-sm text-purple-700"><strong>SOC Date As Of:</strong> {new Date(socInfo.socDateAsOf).toLocaleDateString()}</p>}
            {socInfo.socStartDate && <p className="text-sm text-purple-700"><strong>Period:</strong> {new Date(socInfo.socStartDate).toLocaleDateString()} - {new Date(socInfo.socEndDate).toLocaleDateString()}</p>}
            {socInfo.testedStatus && <p className="text-sm text-purple-700"><strong>Testing Status:</strong> {socInfo.testedStatus}</p>}
            {socInfo.subserviceOrganizations && <p className="text-sm text-purple-700"><strong>Subservice Orgs:</strong> {socInfo.subserviceOrganizations}</p>}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">AI Analysis Summary</h2>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Overall Analysis</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysisResults?.overallAnalysis || 'N/A'}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <h3 className="font-medium text-red-900 mb-2">Identified Risk Factors</h3>
            <ul className="text-sm text-red-800 list-disc pl-5 space-y-1">
              {analysisResults?.riskFactors?.map((factor: string, index: number) => (
                <li key={index} className="whitespace-pre-wrap">{factor}</li>
              )) || <li>No risk factors identified.</li>}
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="font-medium text-green-900 mb-2">Recommendations</h3>
            <ul className="text-sm text-green-800 list-disc pl-5 space-y-1">
              {analysisResults?.recommendations?.map((rec: string, index: number) => (
                <li key={index} className="whitespace-pre-wrap">{rec}</li>
              )) || <li>No recommendations provided.</li>}
            </ul>
          </div>
        </div>

        {uploadedDocumentsMetadata.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Uploaded Documents</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
              {uploadedDocumentsMetadata.map((doc, index) => (
                <li key={index} className="whitespace-pre-wrap">
                  {doc.fileName} ({(doc.fileSize / 1024 / 1024).toFixed(2)} MB) - Label: {doc.label || 'Primary'}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Detailed Responses</h2>
          <div className="space-y-4">
            {questions?.map((question: any, index: number) => (
              <div key={question.id} className="border p-4 rounded-md bg-white shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 whitespace-pre-wrap">
                  {index + 1}. {question.question}
                </h3>
                <p className="text-sm text-gray-700 ml-4 whitespace-pre-wrap">
                  <strong>Answer:</strong>{" "}
                  {typeof answers?.[question.id] === "boolean"
                    ? (answers[question.id] ? "Yes" : "No")
                    : Array.isArray(answers?.[question.id])
                      ? (answers[question.id] as string[]).join(", ")
                      : answers?.[question.id] || "N/A"}
                </p>
                {analysisResults?.confidenceScores?.[question.id] !== undefined && (
                  <p className="text-sm text-gray-600 ml-4 whitespace-pre-wrap">
                    <strong>AI Confidence:</strong> {Math.round(analysisResults.confidenceScores[question.id] * 100)}%
                  </p>
                )}
                {analysisResults?.documentExcerpts?.[question.id] && analysisResults.documentExcerpts[question.id].length > 0 && (
                  <div className="mt-3 text-xs text-gray-700 italic ml-4 p-2 bg-gray-100 border border-gray-200 rounded whitespace-pre-wrap">
                    <strong>Evidence:</strong> {renderEvidenceCitation(analysisResults.documentExcerpts[question.id][0])}
                  </div>
                )}
              </div>
            )) || <p className="text-gray-600">No detailed responses available.</p>}
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6 rounded-md">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Disclaimer:</h2>
          <p className="text-sm text-yellow-700 whitespace-pre-wrap">
            This report is generated by RiskGuard AI based on the provided documents and AI analysis. It is intended for informational purposes only and should be reviewed and validated by human experts. RiskGuard AI is not responsible for any legal or compliance implications arising from the use of this report.
          </p>
        </div>
      </div>
    );
  };

  const renderManualReport = (report: Assessment & { responses?: AssessmentResponse[] }) => {
    const responseData = report.responses?.[0];
    const vendorInfo = responseData?.vendor_info as any;
    const answers = responseData?.answers as any;

    return (
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6 border-b pb-4">
          {report.vendor_name} - {report.assessment_type} Manual Assessment Report
        </h1>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Report Overview</h2>
          <p className="text-sm text-blue-700"><strong>Assessment Type:</strong> {report.assessment_type}</p>
          <p className="text-sm text-blue-700"><strong>Sent Date:</strong> {new Date(report.sent_date).toLocaleDateString()}</p>
          {report.completed_date && <p className="text-sm text-blue-700"><strong>Completed Date:</strong> {new Date(report.completed_date).toLocaleString()}</p>}
          {report.due_date && <p className="text-sm text-blue-700"><strong>Due Date:</strong> {new Date(report.due_date).toLocaleDateString()}</p>}
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColorClass(report.risk_level)}`}>
              {report.risk_level} Risk
            </span>
            {report.risk_score !== null && <span className="text-lg font-bold text-gray-900">{report.risk_score}/100</span>}
          </div>
        </div>

        {vendorInfo && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Vendor Information</h2>
            <div className="bg-gray-50 p-4 rounded-md space-y-1 text-sm text-gray-700">
              <p><strong>Company Name:</strong> {vendorInfo.companyName || 'N/A'}</p>
              <p><strong>Contact Person:</strong> {vendorInfo.contactName || 'N/A'}</p>
              <p><strong>Email:</strong> {vendorInfo.email || 'N/A'}</p>
              {vendorInfo.phone && <p><strong>Phone:</strong> {vendorInfo.phone}</p>}
              {vendorInfo.website && <p><strong>Website:</strong> <a href={vendorInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{vendorInfo.website}</a></p>}
              {vendorInfo.industry && <p><strong>Industry:</strong> {vendorInfo.industry}</p>}
              {vendorInfo.employeeCount && <p><strong>Employees:</strong> {vendorInfo.employeeCount}</p>}
              {vendorInfo.description && <p><strong>Description:</strong> {vendorInfo.description}</p>}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Assessment Answers</h2>
          <div className="space-y-4">
            {answers && Object.keys(answers).length > 0 ? Object.entries(answers).map(([questionId, answer]: [string, any]) => (
              <div key={questionId} className="border p-4 rounded-md bg-white shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 whitespace-pre-wrap">
                  {questionId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </h3>
                <p className="text-sm text-gray-700 ml-4 whitespace-pre-wrap">
                  {typeof answer === "boolean"
                    ? (answer ? "Yes" : "No")
                    : Array.isArray(answer)
                      ? (answer as string[]).join(", ")
                      : answer || "N/A"}
                </p>
              </div>
            )) : <p className="text-gray-600">No answers available.</p>}
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6 rounded-md">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Disclaimer:</h2>
          <p className="text-sm text-yellow-700 whitespace-pre-wrap">
            This report reflects the responses provided by the vendor. It is intended for informational purposes only and should be reviewed and validated by human experts. RiskGuard AI is not responsible for any legal or compliance implications arising from the use of this report.
          </p>
        </div>
      </div>
    );
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Report</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Button onClick={() => window.history.back()} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!user && !isDemo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6">You must be logged in to view this report.</p>
          <Button onClick={() => window.location.href = '/auth/login'} className="bg-blue-600 hover:bg-blue-700">
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Report Not Found</h1>
          <p className="text-gray-700 mb-6">The requested report could not be found or you do not have permission to view it.</p>
          <Button onClick={() => window.history.back()} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center px-4">
        <Button onClick={() => window.history.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
          <Printer className="mr-2 h-4 w-4" /> Print Report
        </Button>
      </div>
      {reportType === 'ai' ? renderAiReport(reportData as AiAssessmentReport) : renderManualReport(reportData as (Assessment & { responses?: AssessmentResponse[] }))}
    </div>
  );
}