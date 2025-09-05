"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface VendorHeroProps {
  onAddVendorClick: () => void;
}

export function VendorHero({ onAddVendorClick }: VendorHeroProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="mt-2 text-gray-600">Manage your vendor relationships and track their risk profiles.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Vendors
          </Button>
          <Button onClick={onAddVendorClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>
    </div>
  );
}
