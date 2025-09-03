"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import React from "react";

export function AppFooter() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">RiskShield AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered risk assessment platform helping organizations maintain compliance and mitigate risks across
              all industries.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/risk-assessment" className="hover:text-white">
                  Risk Assessment
                </Link>
              </li>
              <li>
                <Link href="/third-party-assessment" className="hover:text-white">
                  Third-Party Assessment
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white">
                  Compliance Monitoring
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-white">
                  Reporting
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/documentation" className="hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/system-status" className="hover:text-white">
                  Status Page
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about-us" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 RiskShield AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
