"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Building, Plus } from "lucide-react";

export interface Vendor {
  id: string;
  ticket_id?: string; // Added for Salesforce-like ID
  name: string;
  email: string;
  website?: string;
  industry: string;
  size: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  risk_level: string;
  status: string;
  tags: string[];
  last_assessment_date?: string;
  next_assessment_date?: string;
  total_assessments: number;
  completed_assessments: number;
  average_risk_score: number;
  created_at: string;
}

interface VendorListProps {
  vendors: Vendor[];
  searchTerm: string;
  statusFilter: string;
  riskFilter: string;
  onVendorClick: (vendor: Vendor) => void;
  onAddFirstVendorClick: () => void;
}

export function VendorList({
  vendors,
  searchTerm,
  statusFilter,
  riskFilter,
  onVendorClick,
  onAddFirstVendorClick,
}: VendorListProps) {

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "under_review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Review</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.ticket_id?.toLowerCase().includes(searchTerm.toLowerCase()); // Search by ticket_id

    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    const matchesRisk = riskFilter === "all" || vendor.risk_level === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
        <CardDescription>Manage your vendor relationships and track their compliance status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onVendorClick(vendor)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {vendor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">
                      {vendor.industry} • {vendor.size}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      {getStatusBadge(vendor.status)}
                      <Badge className={getRiskLevelColor(vendor.risk_level)}>{vendor.risk_level} Risk</Badge>
                      <span className="text-sm text-gray-500">Score: {vendor.average_risk_score}/100</span>
                    </div>
                    {vendor.ticket_id && (
                      <p className="text-xs text-gray-500 mt-1">ID: {vendor.ticket_id}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">
                      {vendor.completed_assessments}/{vendor.total_assessments} assessments
                    </span>
                  </div>
                  <Progress
                    value={(vendor.completed_assessments / vendor.total_assessments) * 100}
                    className="w-32 h-2"
                  />
                  {vendor.next_assessment_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Next: {new Date(vendor.next_assessment_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {vendor.tags.length > 0 && (
                <div className="flex items-center space-x-2 mt-4">
                  {vendor.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || riskFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first vendor."}
            </p>
            <Button onClick={onAddFirstVendorClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Vendor
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
