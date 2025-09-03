"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DataPrivacyAssessmentPage() {
  const solutionData = {
    title: "Data Privacy Assessment",
    description: "Evaluate data protection practices and privacy compliance requirements.",
    features: [
      "GDPR compliance review",
      "Data handling procedures",
      "Privacy impact assessments",
      "Data breach response",
    ],
    overview: "Our Data Privacy Assessment solution helps organizations ensure compliance with global data protection regulations like GDPR and CCPA. Conduct thorough privacy impact assessments, review data handling procedures, and strengthen your data breach response plans. Protect sensitive information and build trust with your customers.",
    benefits: [
      "Achieve and maintain compliance with key privacy regulations",
      "Minimize risks associated with data breaches and privacy violations",
      "Enhance customer trust and brand reputation",
      "Streamline privacy audits and reporting",
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/solutions" passHref>
              <Button variant="ghost" className="mb-4 text-blue-600 hover:text-blue-800 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Solutions
              </Button>
            </Link>
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Specialized Assessment</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {solutionData.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {solutionData.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-gray-200 p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Lock className="h-6 w-6 text-blue-600" />
                <span>Overview</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {solutionData.overview}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Key Features</span>
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                {solutionData.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                <span>Benefits</span>
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                {solutionData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center pt-8">
              <Link href="/auth/register" passHref>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Get Started with Data Privacy Assessment
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}