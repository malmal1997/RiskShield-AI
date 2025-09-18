"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-lg text-gray-700 mb-4">
          Your privacy is important to us. This Privacy Policy explains how RiskShield AI collects, uses, and protects your personal information.
        </p>
        <p className="text-gray-600 mb-4">
          We are committed to safeguarding the privacy of our website visitors and service users. This policy applies where we are acting as a data controller with respect to the personal data of our website visitors and service users; in other words, where we determine the purposes and means of the processing of that personal data.
        </p>
        <p className="text-gray-600">
          For more detailed information, please contact our support team.
        </p>
      </div>
    </div>
  );
}