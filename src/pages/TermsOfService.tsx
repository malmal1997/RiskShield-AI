"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to RiskShield AI. These Terms of Service govern your use of our website and services.
        </p>
        <p className="text-gray-600 mb-4">
          By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
        </p>
        <p className="text-gray-600">
          We reserve the right to update or change our Terms of Service at any time and you should check this page periodically. Your continued use of the Service after we post any modifications to the Terms of Service on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Terms of Service.
        </p>
      </div>
    </div>
  );
}