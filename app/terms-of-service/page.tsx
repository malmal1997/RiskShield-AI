"use client";

import { MainNavigation } from "@/components/main-navigation";
import { AppFooter } from "@/components/app-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Gavel } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const lastUpdated = "August 31, 2024";

  return (
    <div className="min-h-screen bg-white">
      <MainNavigation showAuthButtons={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Legal & Compliance</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              These terms govern your use of the RiskGuard AI platform and services.
            </p>
            <div className="flex items-center justify-center mt-4 text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Terms Details */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-gray-200 p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Gavel className="h-6 w-6 text-blue-600" />
                <span>Agreement to Terms</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using the RiskGuard AI platform and services (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Your Account</span>
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</li>
                <li>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Intellectual Property</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of RiskGuard AI and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of RiskGuard AI.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Links to Other Websites</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our Service may contain links to third-party web sites or services that are not owned or controlled by RiskGuard AI. RiskGuard AI has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that RiskGuard AI shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Termination</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Governing Law</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Changes to Terms</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Contact Us</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li>By email: support@riskguard.ai</li>
                <li>By visiting this page on our website: <Link href="/help-center" className="text-blue-600 hover:underline">Help Center</Link></li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
