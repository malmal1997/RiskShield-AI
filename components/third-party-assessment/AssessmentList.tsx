"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, CheckCircle, Copy, Download, Eye, Trash2, Users, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Assessment } from "@/lib/supabase";

interface AssessmentListProps {
  assessments: Assessment[];
  searchTerm: string;
  statusFilter: string;
  copiedLink: string | null;
  onCopyLink: (id: string) => void;
  onViewDetails: (id: string) => void;
  onDeleteAssessment: (id: string) => void;
  onNewAssessmentClick: () => void;
}

export function AssessmentList({
  assessments,
  searchTerm,
  statusFilter,
  copiedLink,
  onCopyLink,
  onViewDetails,
  onDeleteAssessment,
  onNewAssessmentClick,
}: AssessmentListProps) {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskLevelColor = (level: string) => {
    const normalizedLevel = level?.toLowerCase() || "pending";
    switch (normalizedLevel) {
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

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.vendor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.assessment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.ticket_id?.toLowerCase().includes(searchTerm.toLowerCase()); // Search by ticket_id

    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {filteredAssessments.map((assessment) => (
        <Card key={assessment.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Building className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{assessment.vendor_name}</h3>
                  <p className="text-sm text-gray-600">{assessment.vendor_email}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    {getStatusBadge(assessment.status)}
                    <span className="text-sm text-gray-500">{assessment.assessment_type}</span>
                    {assessment.risk_level && assessment.risk_level !== "pending" && (
                      <Badge className={getRiskLevelColor(assessment.risk_level)}>
                        {assessment.risk_level} Risk
                      </Badge>
                    )}
                    {/* Assuming 'responses' is a property indicating if data exists */}
                    {(assessment as any).responses && <Badge className="bg-blue-100 text-blue-800">Has Data</Badge>}
                  </div>
                  {assessment.ticket_id && (
                    <p className="text-xs text-gray-500 mt-1">ID: {assessment.ticket_id}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    <div>
                      Sent: {assessment.sent_date ? new Date(assessment.sent_date).toLocaleDateString() : "N/A"}
                    </div>
                    {assessment.due_date && <div>Due: {new Date(assessment.due_date).toLocaleDateString()}</div>}
                    {assessment.completed_date && (
                      <div>Completed: {new Date(assessment.completed_date).toLocaleDateString()}</div>
                    )}
                  </div>
                  {assessment.risk_score && (
                    <div className="text-lg font-semibold text-gray-900 mt-1">{assessment.risk_score}/100</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyLink(assessment.id)}
                    title="Copy assessment link"
                  >
                    {copiedLink === assessment.id ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    title="View details"
                    onClick={() => onViewDetails(assessment.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Download report">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    title="Delete assessment"
                    onClick={() => onDeleteAssessment(assessment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by sending your first vendor assessment invitation."}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onNewAssessmentClick}>
            <Send className="mr-2 h-4 w-4" />
            Send First Assessment
          </Button>
        </div>
      )}
    </div>
  );
}
