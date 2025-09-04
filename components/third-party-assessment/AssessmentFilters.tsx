"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface AssessmentFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onForceRefresh: () => void;
  isRefreshing: boolean;
  onNewAssessmentClick: () => void;
}

export function AssessmentFilters({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  onForceRefresh,
  isRefreshing,
  onNewAssessmentClick,
}: AssessmentFiltersProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search vendors or assessments..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-4"
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button
            variant="outline"
            onClick={onForceRefresh}
            disabled={isRefreshing}
            title="Force refresh all assessment data"
            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Force Refresh"}
          </Button>
          <Button onClick={onNewAssessmentClick} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}