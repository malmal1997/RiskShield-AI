"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CareersPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Careers at RiskShield AI</h1>
        <p className="text-lg text-gray-700 mb-4">
          Join our innovative team and help us shape the future of AI-powered risk management.
        </p>
        <p className="text-gray-600 mb-4">
          At RiskShield AI, we're always looking for talented individuals who are passionate about technology, security, and making a real impact. We offer a dynamic work environment, opportunities for growth, and a culture that values collaboration and creativity.
        </p>
        <p className="text-gray-600">
          Check back soon for open positions!
        </p>
      </div>
    </div>
  );
}
