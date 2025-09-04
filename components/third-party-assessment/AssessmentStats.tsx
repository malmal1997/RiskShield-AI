"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Building, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";

interface AssessmentStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
  };
}

export function AssessmentStats({ stats }: AssessmentStatsProps) {
  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">Total Assessments</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600 mt-1">In Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-gray-600 mt-1">Overdue</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}