"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to RiskShield AI! We are dedicated to revolutionizing risk management and compliance for organizations of all sizes.
        </p>
        <p className="text-gray-600 mb-4">
          Our platform leverages cutting-edge artificial intelligence to automate risk assessments, streamline compliance processes, and provide actionable insights, helping businesses navigate the complex regulatory landscape with confidence.
        </p>
        <p className="text-gray-600">
          Founded in 2025, RiskShield AI is committed to innovation, security, and empowering our clients to build more resilient and compliant operations.
        </p>
      </div>
    </div>
  );
}