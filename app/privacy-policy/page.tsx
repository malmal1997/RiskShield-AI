"use client";

// Removed: import { MainNavigation } from "@/components/main-navigation";
// Removed: import { AppFooter } from "@/components/app-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, FileText, Calendar } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 31, 2024";

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Legal & Compliance</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center mt-4 text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Policy Details */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-gray-200 p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Lock className="h-6 w-6 text-blue-600" />
                <span>Introduction</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                RiskShield AI ("we," "our," or "us") is committed to protecting the privacy of our users. This Privacy Policy describes how RiskShield AI collects, uses, and discloses information, and what choices you have with respect to the information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Information We Collect</span>
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect various types of information in connection with the services we provide, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>**Personal Information:** Such as your name, email address, phone number, and organizational details when you register for an account or contact us.</li>
                <li>**Usage Data:** Information about how you access and use our services, including IP addresses, browser type, operating system, and pages visited.</li>
                <li>**Assessment Data:** Information you provide when conducting risk assessments, including documents uploaded and responses to questionnaires.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>How We Use Your Information</span>
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>To provide, operate, and maintain our services.</li>
                <li>To improve, personalize, and expand our services.</li>
                <li>To understand and analyze how you use our services.</li>
                <li>To develop new products, services, features, and functionality.</li>
                <li>To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the service, and for marketing and promotional purposes.</li>
                <li>To process your transactions and manage your orders.</li>
                <li>To find and prevent fraud.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Data Security</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. These measures include encryption, access controls, and regular security audits.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Your Data Protection Rights</span>
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following data protection rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>The right to access, update or to delete the information we have on you.</li>
                <li>The right of rectification.</li>
                <li>The right to object.</li>
                <li>The right of restriction.</li>
                <li>The right to data portability.</li>
                <li>The right to withdraw consent.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                If you wish to exercise any of these rights, please contact us through our Help Center.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Changes to This Privacy Policy</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Contact Us</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li>By email: support@riskshield.ai</li>
                <li>By visiting this page on our website: <Link href="/help-center" className="text-blue-600 hover:underline">Help Center</Link></li>
              </ul>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}