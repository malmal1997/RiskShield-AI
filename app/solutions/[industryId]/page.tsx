"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building, Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IndustrySolutionDetailPage() {
  const params = useParams();
  const industryId = params.industryId as string;

  // Format the industry ID for display
  const formattedIndustryName = industryId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Mock data for the industry page (you can expand this later)
  const industryData: Record<string, { title: string; description: string; features: string[]; overview: string }> = {
    healthcare: {
      title: "Healthcare Risk Management",
      description: "Ensuring HIPAA compliance and robust data security for healthcare providers.",
      features: ["HIPAA Compliance", "Patient Data Security", "Supply Chain Risk", "Operational Resilience"],
      overview: "Our healthcare solutions are designed to address the unique regulatory and security challenges faced by hospitals, clinics, and other medical organizations. We help you protect sensitive patient information, manage complex supply chains, and maintain operational continuity.",
    },
    banks: {
      title: "Banking Risk & Compliance",
      description: "Comprehensive solutions for banks to streamline regulatory compliance and manage operational risks.",
      features: ["FDIC/NCUA Compliance", "AML/BSA Programs", "Credit Risk Management", "Cybersecurity for Financials"],
      overview: "For banks, navigating a stringent regulatory environment is paramount. Our platform provides tools to ensure compliance with financial regulations, enhance fraud detection, and manage credit and market risks effectively, safeguarding your assets and reputation.",
    },
    "credit-unions": {
      title: "Credit Union Risk Management",
      description: "Tailored risk management to maintain compliance with NCUA regulations and protect member data.",
      features: ["NCUA Compliance", "Member Data Privacy", "Operational Risk", "Fraud Prevention"],
      overview: "Credit unions require specialized attention to member-centric services while adhering to NCUA guidelines. Our solutions help you protect member data, streamline compliance reporting, and build resilience against operational disruptions and fraud.",
    },
    fintech: {
      title: "Fintech Risk & Innovation",
      description: "Innovative risk management solutions for fintech companies navigating evolving regulatory landscapes.",
      features: ["Emerging Tech Risk", "Data Privacy (GDPR/CCPA)", "API Security", "Regulatory Sandbox Compliance"],
      overview: "Fintech companies operate at the intersection of innovation and regulation. Our platform helps you manage risks associated with new technologies, ensure data privacy across global operations, and maintain agility while meeting compliance obligations.",
    },
    "real-estate": {
      title: "Real Estate Risk Management",
      description: "Risk management for property development, investment, and management firms.",
      features: ["Property Portfolio Risk", "Regulatory Compliance", "Cybersecurity for Operations", "Contractual Risk"],
      overview: "The real estate sector faces unique risks from market volatility to property-specific operational challenges. Our solutions assist firms in managing financial, legal, and operational risks across their portfolios, ensuring stability and growth.",
    },
    government: {
      title: "Government & Public Sector Risk",
      description: "Compliance and security solutions for public sector agencies and municipalities.",
      features: ["Data Sovereignty", "Cybersecurity Frameworks (NIST)", "Supply Chain Security", "Public Trust & Ethics"],
      overview: "Government entities handle vast amounts of sensitive data and critical infrastructure. Our platform supports public sector agencies in adhering to stringent security standards, managing supply chain vulnerabilities, and maintaining public trust through robust risk governance.",
    },
    education: {
      title: "Education Sector Risk Management",
      description: "Protecting student data and ensuring operational resilience for educational institutions.",
      features: ["Student Data Privacy (FERPA)", "Campus Security", "IT Infrastructure Risk", "Compliance Reporting"],
      overview: "Educational institutions are custodians of sensitive student and faculty data, and face unique operational challenges. Our solutions help manage data privacy regulations like FERPA, enhance campus security, and ensure the resilience of IT systems.",
    },
    retail: {
      title: "Retail & E-commerce Risk",
      description: "Managing cybersecurity and operational risks for e-commerce and brick-and-mortar retailers.",
      features: ["PCI DSS Compliance", "Customer Data Protection", "Supply Chain Resilience", "Fraud Detection"],
      overview: "The retail industry, especially e-commerce, is a prime target for cyber threats and operational disruptions. Our platform assists retailers in achieving PCI DSS compliance, protecting customer payment data, and building resilient supply chains.",
    },
    manufacturing: {
      title: "Manufacturing Risk Management",
      description: "Supply chain risk, operational technology security, and compliance for manufacturers.",
      features: ["Operational Technology (OT) Security", "Supply Chain Risk", "Product Liability", "Environmental Compliance"],
      overview: "Manufacturers face complex risks from their global supply chains to the security of their operational technology (OT) systems. Our solutions help manage these intricate risks, ensuring production continuity and compliance with industry standards.",
    },
  };

  const currentIndustry = industryData[industryId] || {
    title: formattedIndustryName,
    description: "No specific description available for this industry yet.",
    features: ["General Risk Assessment", "Compliance Tools"],
    overview: "Details for this industry solution are coming soon. RiskGuard AI provides adaptable tools to meet diverse industry needs.",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/solutions" passHref>
              <Button variant="ghost" className="mb-4 text-blue-600 hover:text-blue-800 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Solutions
              </Button>
            </Link>
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Industry Solution</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {currentIndustry.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {currentIndustry.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-gray-200 p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-600" />
                <span>Overview</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {currentIndustry.overview}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Key Features & Benefits</span>
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                {currentIndustry.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center pt-8">
              <Link href="/auth/register" passHref>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Get Started with {formattedIndustryName} Solutions
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}