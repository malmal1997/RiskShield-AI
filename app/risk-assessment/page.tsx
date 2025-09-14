"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  FileText,
  BarChart3,
  Eye,
  Bot,
  Clock,
  Building,
  Lock,
  Server,
  Send,
  Users,
  User,
  ArrowLeft,
  Building2,
  CheckCircle2, // Corrected import to CheckCircle2
  Download,
  X,
  ArrowRight, // Added ArrowRight import
  Upload, // Added Upload import
  AlertCircle, // Added AlertCircle import
  Check, // Added Check import
  Save, // Added Save import
  Info, // Added Info import
  FileCheck, // Added FileCheck import
  Loader2, // Added Loader2 import
  Copy, // Added Copy import
  Edit3, // Added Edit3 import
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { sendAssessmentEmail } from "@/app/third-party-assessment/email-service"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components
import { useAuth } from "@/components/auth-context" // Import useAuth
import { useToast } from "@/components/ui/use-toast" // Import useToast
import { saveAiAssessmentReport, getAssessmentTemplates, getTemplateQuestions } from "@/lib/assessment-service" // Import the new service function
import type { AssessmentTemplate, TemplateQuestion } from "@/lib/supabase"; // Import types
import { useRouter } from "next/navigation" // Import useRouter

// Assessment categories and questions (now default/built-in templates)
const builtInAssessmentCategories = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Evaluate your organization's cybersecurity posture and controls",
    icon: Shield,
    questions: [
      {
        id: "cs1",
        category: "Security Policies",
        question: "Does your organization have a formal cybersecurity policy?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "cs2",
        category: "Security Training",
        question: "How often do you conduct cybersecurity training for employees?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs3",
        category: "Access Control",
        question: "Do you have multi-factor authentication implemented for all critical systems?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "cs4",
        category: "Vulnerability Management",
        question: "How frequently do you perform vulnerability assessments?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs5",
        category: "Incident Response",
        question: "Do you have an incident response plan in place?",
        type: "boolean" as const,
        weight: 9,
      },
    ],
  },
  {
    id: "compliance",
    name: "Regulatory Compliance",
    description: "Assess compliance with financial regulations and standards",
    icon: FileText,
    questions: [
      {
        id: "rc1",
        category: "Regulatory Adherence",
        question: "Are you compliant with current FDIC regulations?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "rc2",
        category: "Policy Management",
        question: "How often do you review and update compliance policies?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "rc3",
        category: "Governance",
        question: "Do you have a dedicated compliance officer?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "rc4",
        category: "Audits",
        question: "How frequently do you conduct compliance audits?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "rc5",
        category: "Documentation",
        question: "Do you maintain proper documentation for all compliance activities?",
        type: "boolean" as const,
        weight: 8,
      },
    ],
  },
  {
    id: "operational",
    name: "Operational Risk",
    description: "Evaluate operational processes and internal controls",
    icon: BarChart3,
    questions: [
      {
        id: "or1",
        category: "Procedures",
        question: "Do you have documented operational procedures for all critical processes?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "or2",
        category: "Procedures",
        question: "How often do you review and update operational procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "or3",
        category: "Internal Controls",
        question: "Do you have adequate segregation of duties in place?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "or4",
        category: "Risk Assessment",
        question: "How frequently do you conduct operational risk assessments?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 8,
      },
      {
        id: "or5",
        category: "Business Continuity",
        question: "Do you have a business continuity plan?",
        type: "boolean" as const,
        weight: 9,
      },
    ],
  },
  {
    id: "business-continuity",
    name: "Business Continuity",
    description: "Assess your organization's business continuity and disaster recovery preparedness",
    icon: Shield,
    questions: [
      {
        id: "bc1",
        category: "BCM Program",
        question: "Do you have a documented Business Continuity Management (BCM) program in place?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "bc2",
        category: "BCM Program",
        question: "How frequently do you review and update your BCM program?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2-3 years", "Annually", "Semi-annually"],
        weight: 9,
        required: true,
      },
      {
        id: "bc3",
        category: "Governance",
        question: "Does your BCM program have executive oversight and sponsorship?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc4",
        category: "Training",
        question: "How often do you conduct BCM training for employees?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
        required: true,
      },
      {
        id: "bc5",
        category: "System Availability",
        question: "Do you monitor system capacity and availability on an ongoing basis?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc6",
        category: "Physical Security",
        question: "Do you have adequate physical security controls for critical facilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc7",
        category: "Environmental Controls",
        question: "Do you have environmental security controls (fire suppression, climate control, etc.)?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc8",
        category: "Infrastructure Redundancy",
        question: "Do you have redundant telecommunications infrastructure to handle failures?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc9",
        category: "Maintenance",
        question: "How frequently do you perform equipment maintenance and firmware updates?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Annually", "Semi-annually", "Quarterly"],
        weight: 8,
        required: true,
      },
      {
        id: "bc10",
        category: "Power Systems",
        question: "Do you have backup power systems (UPS/generators) for critical operations?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc11",
        category: "Data Protection",
        question: "Do you have comprehensive data protection (firewall, anti-virus, encryption)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc12",
        category: "Third-Party Risk",
        question: "Do you have contingency plans for failures of critical third-party providers?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc13",
        category: "Personnel Security",
        question: "Do you conduct background checks on employees with access to critical systems?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc14",
        category: "Staffing",
        question: "Do you have adequate staffing depth and cross-training for critical functions?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc15",
        category: "Disaster Recovery",
        question: "Do you have a documented Disaster Recovery Plan separate from your BCM?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc16",
        category: "Crisis Communication",
        question: "Do you have established internal and external communication protocols for crisis management?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc17",
        category: "Communication",
        question: "Do you have communication procedures for planned system outages?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "bc18",
        category: "Incident Management",
        question: "Do you have a cybersecurity incident management plan?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc19",
        category: "Insurance",
        question: "Do you maintain appropriate business continuity insurance coverage?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "bc20",
        category: "Emergency Planning",
        question: "Do you have pandemic/health emergency continuity plans?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc21",
        category: "Remote Access",
        question: "Do you have remote administration contingencies for critical systems?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc22",
        category: "Software Development",
        question: "Do you have proper source code management and version control systems?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "bc23",
        category: "System Obsolescence",
        question: "Have you identified and addressed any outdated systems that pose continuity risks?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc24",
        category: "Data Backup",
        question: "How frequently do you backup critical business data?",
        type: "multiple" as const,
        options: ["Never", "Monthly", "Weekly", "Daily", "Real-time/Continuous"],
        weight: 10,
        required: true,
      },
      {
        id: "bc25",
        category: "Impact Analysis",
        question: "Have you conducted a formal Business Impact Analysis (BIA)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc26",
        category: "Recovery Objectives",
        question: "Have you defined Recovery Point Objectives (RPO) for critical systems?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc27",
        category: "Recovery Objectives",
        question: "Have you defined Recovery Time Objectives (RTO) for critical systems?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc28",
        category: "Testing",
        question: "How frequently do you test your BCM/DR plans?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
        required: true,
      },
      {
        id: "bc29",
        category: "Testing",
        question: "How frequently do you test your incident response procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
        required: true,
      },
      {
        id: "bc30",
        category: "Testing",
        question: "How frequently do you test your data backup and recovery procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
        required: true,
      },
      {
        id: "bc31",
        category: "Testing Documentation",
        question: "Do you document and analyze the results of your BC/DR testing?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc32",
        category: "Audits",
        question: "Do you have independent audits of your BC/DR plan testing conducted?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
    ],
  },
  {
    id: "financial-services",
    name: "Financial Services Assessment",
    description: "Evaluate compliance with financial industry regulations and standards",
    icon: Building,
    questions: [
      {
        id: "fs1",
        category: "Regulatory Compliance",
        question: "Are you compliant with current banking regulations (e.g., Basel III, Dodd-Frank)?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "fs2",
        category: "AML/KYC",
        question: "How often do you conduct anti-money laundering (AML) training?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
        required: true,
      },
      {
        id: "fs3",
        category: "AML/KYC",
        question: "Do you have a comprehensive Know Your Customer (KYC) program?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "fs4",
        category: "Credit Risk",
        question: "How frequently do you review and update your credit risk policies?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
        required: true,
      },
      {
        id: "fs5",
        category: "Capital Management",
        question: "Do you maintain adequate capital reserves as required by regulators?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "fs6",
        category: "Consumer Protection",
        question: "Are you compliant with consumer protection regulations (e.g., CFPB guidelines)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "fs7",
        category: "Stress Testing",
        question: "How often do you conduct stress testing on your financial portfolios?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
        required: true,
      },
      {
        id: "fs8",
        category: "Client Asset Segregation",
        question: "Do you have proper segregation of client funds and assets?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
    ],
  },
  {
    id: "data-privacy",
    name: "Data Privacy Assessment",
    description: "Assess your organization's data privacy controls and regulatory compliance",
    icon: Lock,
    questions: [
      {
        id: "dp1",
        category: "Regulatory Compliance",
        question: "Are you compliant with applicable data privacy regulations (GDPR, CCPA, etc.)?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "dp2",
        category: "Privacy Impact Assessment",
        question: "How often do you conduct data privacy impact assessments?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Annually", "Semi-annually", "For all new projects"],
        weight: 9,
        required: true,
      },
      {
        id: "dp3",
        category: "Data Retention",
        question: "Do you have documented data retention and deletion policies?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "dp4",
        category: "Data Subject Rights",
        question: "How do you handle data subject access requests?",
        type: "multiple" as const,
        options: ["No formal process", "Manual process", "Semi-automated", "Fully automated", "Comprehensive system"],
        weight: 8,
        required: true,
      },
      {
        id: "dp5",
        category: "Governance",
        question: "Do you have a designated Data Protection Officer (DPO)?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "dp6",
        category: "Third-Party Data Processors",
        question: "Are all third-party data processors properly vetted and contracted?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "dp7",
        category: "Training",
        question: "How often do you provide data privacy training to employees?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
        required: true,
      },
      {
        id: "dp8",
        category: "Data Processing Records",
        question: "Do you maintain records of all data processing activities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "dp9",
        category: "Privacy by Design",
        question: "Have you implemented privacy by design principles in your systems?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "dp10",
        category: "Information Security Policy",
        question: "Do you have a written Information Security Policy (ISP)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "dp11",
        category: "Information Security Policy",
        question: "How often do you review and update your Information Security Policy?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
        required: true,
      },
      {
        id: "dp12",
        category: "Information Security Policy",
        question: "Do you have a designated person responsible for Information Security Policy?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "dp13",
        category: "Compliance Monitoring",
        question: "Do you have data privacy compliance monitoring procedures in place?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp14",
        category: "Physical Security",
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp15",
        category: "Physical Security",
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp16",
        category: "Audits & Assessments",
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp17",
        category: "Asset Management",
        question: "Do you have an IT asset management program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp18",
        category: "Asset Management",
        question: "Do you have restrictions on storage devices?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp19",
        category: "Endpoint Protection",
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp20",
        category: "Network Security",
        question: "Do you implement network segmentation?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp21",
        category: "Network Security",
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp22",
        category: "Security Testing",
        question: "How frequently do you conduct vulnerability scanning?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp23",
        category: "Security Testing",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        required: true,
      },
      {
        id: "dp24",
        category: "Regulatory Compliance",
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "multiple" as const,
        options: ["None", "ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST"],
        required: true,
      },
      {
        id: "dp25",
        category: "Access Control",
        question: "Do you have a formal access control policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp26",
        category: "Wireless Security",
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp27",
        category: "Access Control",
        question: "Do you have defined password parameters and requirements?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp28",
        category: "Access Control",
        question: "Do you implement least privilege access principles?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp29",
        category: "Access Control",
        question: "How frequently do you conduct access reviews?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp30",
        category: "Network Access",
        question: "Do you require device authentication for network access?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp31",
        category: "Remote Access",
        question: "Do you have secure remote logical access controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp32",
        category: "Third-Party Management",
        question: "Do you have a third-party oversight program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp33",
        category: "Third-Party Management",
        question: "Do you assess third-party security controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp34",
        category: "Third-Party Management",
        question: "Do you verify third-party compliance controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp35",
        category: "Human Resources",
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp36",
        category: "Training",
        question: "Do you provide information security training to employees?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp37",
        category: "Training",
        question: "Do you provide privacy training to employees?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp38",
        category: "Training",
        question: "Do you provide role-specific compliance training?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp39",
        category: "Policy Management",
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp40",
        category: "Human Resources",
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp41",
        category: "Data Management",
        question: "Do you have a data management program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp42",
        category: "Privacy Policy",
        question: "Do you have a published privacy policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp43",
        category: "Data Retention",
        question: "Do you have consumer data retention policies?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp44",
        category: "Data Protection",
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp45",
        category: "Incident Response",
        question: "Do you have data breach protocols?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp46",
        category: "Consumer Rights",
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp47",
        category: "Data Collection",
        question: "Do you collect NPI, PII, or PHI data?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
    ],
  },
  {
    id: "infrastructure-security",
    name: "Infrastructure Security",
    description: "Evaluate the security of your IT infrastructure and network systems",
    icon: Server,
    questions: [
      {
        id: "is1",
        category: "Network Segmentation",
        question: "Do you have network segmentation implemented for critical systems?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "is2",
        category: "Patch Management",
        question: "How often do you update and patch your server infrastructure?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Monthly", "Weekly", "Automated/Real-time"],
        weight: 10,
        required: true,
      },
      {
        id: "is3",
        category: "Intrusion Detection",
        question: "Do you have intrusion detection and prevention systems (IDS/IPS) deployed?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "is4",
        category: "Penetration Testing",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
        required: true,
      },
      {
        id: "is5",
        category: "Access Management",
        question: "Are all administrative accounts protected with privileged access management?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "is6",
        category: "Logging & Monitoring",
        question: "Do you have comprehensive logging and monitoring for all critical systems?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "is7",
        category: "Firewall Management",
        question: "How often do you review and update firewall rules?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
        required: true,
      },
      {
        id: "is8",
        category: "Configuration Management",
        question: "Do you have secure configuration standards for all infrastructure components?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "is9",
        category: "Data Encryption",
        question: "Are all data transmissions encrypted both in transit and at rest?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "is10",
        category: "Vulnerability Management",
        question: "Do you have a formal vulnerability management program?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
    ],
  },
  {
    id: "soc-compliance",
    name: "SOC Compliance Assessment",
    description: "Evaluate SOC 1, SOC 2, and SOC 3 compliance readiness and control effectiveness",
    icon: CheckCircle2,
    questions: [
      // Organization and Governance
      {
        id: "soc1",
        category: "Governance",
        question:
          "Has management established a governance structure with clear roles and responsibilities for SOC compliance?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc2",
        category: "Policies & Procedures",
        question: "Are there documented policies and procedures for all SOC-relevant control activities?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc3",
        category: "Risk Assessment",
        question: "Has management established a risk assessment process to identify and evaluate risks?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc4",
        category: "Control Objectives",
        question: "Are control objectives clearly defined and communicated throughout the organization?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc5",
        category: "Control Monitoring",
        question: "Is there a formal process for monitoring and evaluating control effectiveness?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Security Controls
      {
        id: "soc6",
        category: "Logical Access",
        question: "Are logical access controls implemented to restrict access to systems and data?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc7",
        category: "User Access Management",
        question: "Is user access provisioning and deprovisioning performed in a timely manner?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc8",
        category: "Privileged Access",
        question: "Are privileged access rights regularly reviewed and approved?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc9",
        category: "Authentication",
        question: "Is multi-factor authentication implemented for all critical systems?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc10",
        category: "Password Management",
        question: "Are password policies enforced and regularly updated?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc11",
        category: "Data Encryption",
        question: "Is data encryption implemented for data at rest and in transit?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc12",
        category: "Incident Response",
        question: "Are security incident response procedures documented and tested?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc13",
        category: "Vulnerability Management",
        question: "Is vulnerability management performed regularly with timely remediation?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc14",
        category: "Network Security",
        question: "Are network security controls (firewalls, IDS/IPS) properly configured and monitored?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc15",
        category: "Physical Security",
        question: "Is physical access to data centers and facilities properly controlled?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },

      // Availability Controls
      {
        id: "soc16",
        category: "System Monitoring",
        question: "Are system capacity and performance monitored to ensure availability?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc17",
        category: "Business Continuity",
        question: "Is there a documented business continuity and disaster recovery plan?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc18",
        category: "Backup & Recovery",
        question: "Are backup and recovery procedures regularly tested?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc19",
        category: "System Availability",
        question: "Is system availability monitored with appropriate alerting mechanisms?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc20",
        category: "Change Management",
        question: "Are change management procedures in place for system modifications?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Processing Integrity Controls
      {
        id: "soc21",
        category: "Data Processing",
        question: "Are data processing controls implemented to ensure completeness and accuracy?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc22",
        category: "Data Input Validation",
        question: "Is data input validation performed to prevent processing errors?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc23",
        category: "Automated Controls",
        question: "Are automated controls in place to detect and prevent duplicate transactions?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc24",
        category: "Error Monitoring",
        question: "Is data processing monitored for exceptions and errors?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc25",
        category: "Data Reconciliation",
        question: "Are reconciliation procedures performed to ensure data integrity?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Confidentiality Controls
      {
        id: "soc26",
        category: "Confidentiality Agreements",
        question: "Are confidentiality agreements in place with employees and third parties?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc27",
        category: "Data Classification",
        question: "Is sensitive data classified and handled according to its classification?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc28",
        category: "Data Retention & Disposal",
        question: "Are data retention and disposal policies implemented and followed?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc29",
        category: "Access to Confidential Info",
        question: "Is access to confidential information restricted on a need-to-know basis?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Privacy Controls
      {
        id: "soc30",
        category: "Privacy Policies",
        question: "Are privacy policies and procedures documented and communicated?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc31",
        category: "Personal Information Handling",
        question: "Is personal information collected, used, and disclosed in accordance with privacy policies?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc32",
        category: "Data Subject Notice",
        question: "Are individuals provided with notice about data collection and use practices?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc33",
        category: "Consent Management",
        question: "Is consent obtained for the collection and use of personal information where required?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc34",
        category: "Data Subject Rights",
        question: "Are data subject rights (access, correction, deletion) supported and processed?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Monitoring and Logging
      {
        id: "soc35",
        category: "System Activity Logging",
        question: "Are system activities logged and monitored for security events?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc36",
        category: "Log Protection",
        question: "Is log data protected from unauthorized access and modification?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc37",
        category: "Log Review",
        question: "Are logs regularly reviewed for suspicious activities?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc38",
        category: "Centralized Logging",
        question: "Is there a centralized logging system for security monitoring?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },

      // Third-Party Management
      {
        id: "soc39",
        category: "Third-Party Evaluation",
        question: "Are third-party service providers evaluated for SOC compliance?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc40",
        category: "Contract Review",
        question: "Are contracts with service providers reviewed for appropriate control requirements?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc41",
        category: "Third-Party Monitoring",
        question: "Is third-party performance monitored against contractual requirements?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },

      // Training and Awareness
      {
        id: "soc42",
        category: "Security & Compliance Training",
        question: "Is security and compliance training provided to all relevant personnel?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc43",
        category: "Role & Responsibility Awareness",
        question: "Are employees made aware of their roles and responsibilities for SOC compliance?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc44",
        category: "Ongoing Training",
        question: "Is ongoing training provided to keep personnel current with policies and procedures?",
        type: "tested" as const,
        weight: 7,
        required: true,
      },

      // Management Review and Oversight
      {
        id: "soc45",
        category: "Management Review",
        question: "Does management regularly review control effectiveness and compliance status?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc46",
        category: "Deficiency Remediation",
        question: "Are control deficiencies identified, documented, and remediated in a timely manner?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc47",
        category: "Control Change Approval",
        question: "Is there a formal process for management to approve significant changes to controls?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc48",
        category: "Internal Audits",
        question: "Are internal audits performed to assess control effectiveness?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
    ],
  },
]

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested" | "textarea"
  options?: string[]
  weight?: number
  required?: boolean
  category?: string
}

interface AnalysisResult {
  answers: Record<string, boolean | string | string[]> // Added string[] to answers type
  confidenceScores: Record<string, number>
  reasoning: Record<string, string>
  overallAnalysis: string
  riskFactors: string[]
  recommendations: string[]
  riskScore: number
  riskLevel: string
  analysisDate: string
  documentsAnalyzed: number
  aiProvider?: string
  documentExcerpts?: Record<
    string,
    Array<{
      fileName: string
      excerpt: string
      relevance: string
      pageOrSection?: string
      quote?: string
      pageNumber?: number
      lineNumber?: number
      label?: 'Primary' | '4th Party';
    }>
  >
  directUploadResults?: Array<{
    fileName: string
    success: boolean
    fileSize: number
    fileType: string
    processingMethod: string
  }>
}

interface UploadedFileWithLabel {
  file: File;
  label: 'Primary' | '4th Party';
}

export default function AIAssessmentPage() {
  const { user, isDemo } = useAuth(); // Get user and isDemo from AuthContext
  const { toast } = useToast(); // Initialize useToast
  const router = useRouter(); // Initialize useRouter
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null); // New state for custom template ID
  const [currentStep, setCurrentStep] = useState<
    "select-category" | "upload-documents" | "soc-info" | "review-answers" | "results"
  >("select-category")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileWithLabel[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReportSaved, setIsReportSaved] = useState(false); // New state to track if report is saved
  const [socInfo, setSocInfo] = useState({
    socType: "", // SOC 1, SOC 2, SOC 3
    reportType: "", // Type 1, Type 2
    auditor: "",
    auditorOpinion: "",
    auditorOpinionDate: "",
    socStartDate: "",
    socEndDate: "",
    socDateAsOf: "",
    testedStatus: "", // Added testedStatus
    exceptions: "",
        nonOperationalControls: "",
    companyName: "",
    productService: "",
    subserviceOrganizations: "",
    userEntityControls: "",
  })
  const [showOtherInput, setShowOtherInput] = useState<Record<string, boolean>>({});
  const [customTemplates, setCustomTemplates] = useState<AssessmentTemplate[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<TemplateQuestion[]>([]);


  useEffect(() => {
    // Check for pre-selected category from main risk assessment page
    const preSelectedCategory = localStorage.getItem("selectedAssessmentCategory")
    if (preSelectedCategory) {
      setSelectedCategory(preSelectedCategory)
      if (preSelectedCategory === "soc-compliance") {
        setCurrentStep("soc-info")
      } else {
        setCurrentStep("upload-documents")
      }
      localStorage.removeItem("selectedAssessmentCategory") // Clear it after use
    }
  }, [])

  useEffect(() => {
    async function fetchTemplates() {
      if (user) {
        const { data, error } = await getAssessmentTemplates();
        if (error) {
          console.error("Failed to fetch custom templates:", error);
          toast({
            title: "Error",
            description: "Failed to load custom assessment templates.",
            variant: "destructive",
          });
        } else {
          setCustomTemplates(data || []);
        }
      }
    }
    fetchTemplates();
  }, [user, toast]);

  useEffect(() => {
    async function loadQuestions() {
      if (selectedTemplateId) {
        const { data, error } = await getTemplateQuestions(selectedTemplateId);
        if (error) {
          console.error("Failed to load template questions:", error);
          setError("Failed to load questions for the selected template.");
          setCurrentQuestions([]);
        } else {
          setCurrentQuestions(data || []);
          const selectedTemplate = customTemplates.find(t => t.id === selectedTemplateId);
          if (selectedTemplate?.type === "soc-compliance") { // Check if it's the SOC template
            setCurrentStep("soc-info");
          } else {
            setCurrentStep("upload-documents");
          }
        }
      } else if (selectedCategory) {
        const builtIn = builtInAssessmentCategories.find(cat => cat.id === selectedCategory);
        if (builtIn) {
          setCurrentQuestions(builtIn.questions.map(q => ({
            id: q.id,
            template_id: "builtin", // Indicate it's a built-in template
            order: 0, // Default order
            question_text: q.question,
            question_type: q.type,
            options: q.options || null,
            required: q.required || false,
            category: q.category || null,
            weight: q.weight || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })));
          if (selectedCategory === "soc-compliance") {
            setCurrentStep("soc-info");
          } else {
            setCurrentStep("upload-documents");
          }
        }
      }
    }
    loadQuestions();
  }, [selectedCategory, selectedTemplateId, customTemplates, user]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({<dyad-problem-report summary="3 problems">
<problem file="lib/assessment-service.ts" line="562" column="14" code="2740">Type '{ id: any; }' is missing the following properties from type '{ created_at: string; created_by: string | null; description: string | null; id: string; name: string; organization_id: string; status: string; type: string; updated_at: string; }': created_at, created_by, description, name, and 4 more.</problem>
<problem file="app/risk-assessment/page.tsx" line="1573" column="24" code="2339">Property 'options' does not exist on type '{ id: string; category: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; } | { id: string; category: string; question: string; type: &quot;multiple&quot;; options: string[]; weight: number; } | ... 4 more ... | { ...; }'.
  Property 'options' does not exist on type '{ id: string; category: string; question: string; type: &quot;tested&quot;; weight: number; required: boolean; }'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1574" column="25" code="2339">Property 'required' does not exist on type '{ id: string; category: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; } | { id: string; category: string; question: string; type: &quot;multiple&quot;; options: string[]; weight: number; } | ... 4 more ... | { ...; }'.
  Property 'required' does not exist on type '{ id: string; category: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; }'.</problem>
</dyad-problem-report>You're absolutely right! My apologies for these persistent TypeScript errors. It seems I missed a detail in the `getAssessmentTemplateById` function and the mapping of built-in questions.

I've addressed all 3 errors with the following concise fixes:

1.  **`lib/assessment-service.ts`**:
    *   In `getAssessmentTemplateById`, the `select('id')` was too restrictive. I've changed it to `select('*')` to fetch all properties required by the `AssessmentTemplate` type.
2.  **`app/risk-assessment/page.tsx`**:
    *   Refined the mapping of `builtIn.questions` to `TemplateQuestion` objects. I've added explicit type assertions and optional chaining to safely access `options` and `required` properties, ensuring they are correctly assigned with fallbacks.

Here are the updated files:

<dyad-write path="lib/assessment-service.ts" description="Fetching all properties for AssessmentTemplate in getAssessmentTemplateById.">
import { supabaseClient } from "./supabase-client"
import { supabaseAdmin } from "@/src/integrations/supabase/admin" // Import supabaseAdmin
import { getCurrentUserWithProfile, logAuditEvent } from "./auth-service" // Import getCurrentUserWithProfile and logAuditEvent
import type { User } from "@supabase/supabase-js" // Import User type
import type { AiAssessmentReport, Assessment, AssessmentResponse, AssessmentTemplate, TemplateQuestion } from "./supabase" // Import AiAssessmentReport, AssessmentTemplate, TemplateQuestion types

// Get current user with comprehensive error handling
export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log("🔍 Getting current user...")

    // First check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("⚠️ Server-side rendering, no user available")
      return null
    }

    // Try to get the current session
    console.log("🔐 Checking Supabase session...")
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession()

    if (sessionError) {
      console.error("❌ Session error:", sessionError.message)
      return null
    }

    if (!sessionData?.session?.user) {
      console.log("ℹ️ No active Supabase session")
      return null
    }

    console.log("✅ Supabase user found:", sessionData.session.user.email)
    return sessionData.session.user
  } catch (error) {
    console.error("💥 Error in getCurrentUser:", error)
    // Don't throw the error, just return null
    return null
  }
}

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabaseClient.from("assessments").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Database connection test failed:", error)
      return false
    }

    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

// Function to calculate risk score based on responses
function calculateRiskScore(answers: Record<string, any>): number {
  // Simple risk scoring algorithm
  let score = 100 // Start with perfect score
  const totalQuestions = Object.keys(answers).length

  if (totalQuestions === 0) return 50 // Default score if no answers

  Object.entries(answers).forEach(([questionId, answer]) => {
    if (questionId.includes("cyber")) {
      // Cybersecurity questions
      if (typeof answer === "string") {
        if (answer.includes("No") || answer.includes("Never") || answer.includes("Basic")) {
          score -= 15
        } else if (answer.includes("comprehensive") || answer.includes("AES-256")) {
          score += 5
        }
      } else if (Array.isArray(answer)) {
        // More security measures = better score
        if (answer.length < 2) score -= 10
        else if (answer.length >= 4) score += 5
      }
    } else if (questionId.includes("privacy")) {
      // Privacy questions
      if (typeof answer === "string") {
        if (answer.includes("Never") || answer.includes("Regularly")) {
          if (answer.includes("Never"))
            score += 5 // Good for data sharing
          else score -= 10 // Bad for regular sharing
        }
      }
    }
  })

  return Math.max(0, Math.min(100, score))
}

function getRiskLevel(score: number): string {
  if (score >= 80) return "low"
  if (score >= 60) return "medium"
  if (score >= 40) return "high"
  return "critical"
}

// Get all assessments for the current user
export async function getAssessments(): Promise<(Assessment & { responses?: AssessmentResponse[] })[]> {
  try {
    console.log("📋 Getting assessments...")

    const user = await getCurrentUser()
    console.log("👤 Current user:", user ? user.email : "None")

    if (!user) {
      console.log("📝 No authenticated user, returning empty array")
      return []
    }

    console.log("🔍 Fetching assessments from Supabase...")
    const { data, error } = await supabaseClient
      .from("assessments")
      .select(
        `
        *,
        responses:assessment_responses (
          id,
          vendor_info,
          answers,
          submitted_at
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Supabase query error:", error)
      throw new Error(`Failed to fetch assessments: ${error.message}`)
    }

    if (!data || data.length === 0) {
      console.log("📝 No assessments found in database")
      return []
    }

    console.log(`✅ Successfully fetched ${data.length} assessments from database`)
    return data
  } catch (error) {
    console.error("💥 Error in getAssessments:", error)
    throw error
  }
}

// Get assessment by ID (public access for vendors)
export async function getAssessmentById(id: string): Promise<Assessment | null> { // Changed to Assessment | null
  try {
    console.log("🔍 Getting assessment by ID:", id)

    const { data, error } = await supabaseClient.from("assessments").select("*").eq("id", id).single()

    if (error) {
      console.error("❌ Supabase error:", error)
      throw new Error(`Failed to fetch assessment: ${error.message}`) // Corrected error variable name
    }

    console.log("✅ Found assessment:", data?.vendor_name)
    return data
  } catch (error) {
    console.error("💥 Error fetching assessment:", error)
    throw error
  }
}

// Create a new assessment for the current user
export async function createAssessment(assessmentData: {
  vendorName: string
  vendorEmail: string
  contactPerson?: string
  assessmentType: string
  dueDate?: string
  customMessage?: string
}) {
  try {
    console.log("📝 Creating assessment with data:", assessmentData)

    // Validate required fields
    if (!assessmentData.vendorName || !assessmentData.vendorEmail || !assessmentData.assessmentType) {
      throw new Error("Missing required assessment data")
    }

    const { user, organization } = await getCurrentUserWithProfile()
    if (!user || !organization) {
      throw new Error("User not authenticated or organization not found. Cannot create assessment.")
    }

    const assessmentId = `assessment-${Date.now()}`
    console.log("📝 Generated assessment ID:", assessmentId)

    const insertData: any = {
      id: assessmentId,
      user_id: user.id,
      organization_id: organization.id, // Include organization_id here
      vendor_name: assessmentData.vendorName,
      vendor_email: assessmentData.vendorEmail,
      contact_person: assessmentData.contactPerson || null,
      assessment_type: assessmentData.assessmentType,
      status: "pending",
      sent_date: new Date().toISOString().split("T")[0],
      due_date: assessmentData.dueDate || null,
      custom_message: assessmentData.customMessage || null,
      risk_level: "pending",
    }

    console.log("📝 Inserting data:", insertData)

    const { data, error } = await supabaseClient.from("assessments").insert(insertData).select().single()

    if (error) {
      console.error("❌ Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!data) {
      throw new Error("No data returned from database")
    }

    // Log audit event
    await logAuditEvent({
      action: 'assessment_created',
      entity_type: 'assessment',
      entity_id: data.id,
      new_values: data,
      old_values: undefined, 
    });

    console.log("✅ Assessment created successfully:", data)
    return data
  } catch (error) {
    console.error("💥 Error in createAssessment:", error)
    throw error
  }
}

// Update assessment status (only for the owner)
export async function updateAssessmentStatus(id: string, status: string, riskScore?: number, riskLevel?: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated. Cannot update assessment.")
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('assessments').select('*').eq('id', id).single();

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "completed") {
      updateData.completed_date = new Date().toISOString()
    }

    if (riskScore !== undefined) {
      updateData.risk_score = riskScore
    }

    if (riskLevel) {
      updateData.risk_level = riskLevel
    }

    const { error, data: updatedData } = await supabaseClient.from("assessments").update(updateData).eq("id", id).eq("user_id", user.id).select().single();

    if (error) {
      console.error("Error updating assessment:", error)
      throw error
    }

    // Log audit event
    await logAuditEvent({
      action: 'assessment_status_updated',
      entity_type: 'assessment',
      entity_id: id,
      old_values: oldData,
      new_values: updatedData,
    });

    return true
  } catch (error) {
    console.error("Error updating assessment status:", error)
    throw error
  }
}

// Submit assessment response (public access for vendors)
export async function submitAssessmentResponse(
  assessmentId: string,
  vendorInfo: any,
  answers: Record<string, any>,
): Promise<void> {
  try {
    console.log("🔄 Submitting assessment response for ID:", assessmentId)
    console.log("📊 Vendor info:", vendorInfo)
    console.log("📝 Answers:", answers)

    // Calculate risk score first
    const riskScore = calculateRiskScore(answers)
    const riskLevel = getRiskLevel(riskScore)
    console.log("📈 Calculated risk score:", riskScore, "level:", riskLevel)

    // Get the assessment to find the owner and organization_id
    const { data: assessment, error: assessmentError } = await supabaseClient
      .from("assessments")
      .select("user_id, organization_id, status") // Select status for old_values
      .eq("id", assessmentId)
      .single()

    if (assessmentError) {
      console.error("❌ Error fetching assessment:", assessmentError)
      throw new Error(`Failed to find assessment: ${assessmentError.message}`)
    }

    // Insert the response into assessment_responses table
    const { error: responseError, data: newResponse } = await supabaseClient.from("assessment_responses").insert([
      {
        assessment_id: assessmentId,
        user_id: assessment.user_id, // Link to the assessment owner
        organization_id: assessment.organization_id, // Include organization_id here
        vendor_info: vendorInfo,
        answers: answers,
        submitted_at: new Date().toISOString(),
      },
    ]).select().single();

    if (responseError) {
      console.error("❌ Error inserting assessment response:", responseError)
      throw new Error(`Failed to save assessment response: ${responseError.message}`)
    }

    // Log audit event for response submission
    await logAuditEvent({
      action: 'assessment_response_submitted',
      entity_type: 'assessment_response',
      entity_id: newResponse.id.toString(),
      new_values: newResponse,
      old_values: undefined, // Fixed: Changed null to undefined
    });

    console.log("✅ Assessment response saved successfully")

    // Update the assessment status to completed with proper data
    const { error: updateError, data: updatedAssessment } = await supabaseClient
      .from("assessments")
      .update({
        status: "completed",
        completed_date: new Date().toISOString(),
        risk_score: riskScore,
        risk_level: riskLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Error updating assessment status:", updateError)
      throw new Error(`Failed to update assessment status: ${updateError.message}`)
    }

    // Log audit event for assessment completion
    await logAuditEvent({
      action: 'assessment_completed',
      entity_type: 'assessment',
      entity_id: assessmentId,
      old_values: { status: assessment.status, risk_score: null, risk_level: 'pending' }, // Assuming initial state
      new_values: { status: updatedAssessment.status, risk_score: updatedAssessment.risk_score, risk_level: updatedAssessment.risk_level },
    });

    console.log("✅ Assessment status updated to completed")
  } catch (error) {
    console.error("💥 Error submitting assessment response:", error)
    throw error
  }
}

// Delete assessment (only for the owner)
export async function deleteAssessment(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated. Cannot delete assessment.")
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('assessments').select('*').eq('id', id).single();

    const { error } = await supabaseClient.from("assessments").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      console.error("Error deleting assessment:", error)
      throw new Error(`Failed to delete assessment: ${error.message}`)
    }

    // Log audit event
    await logAuditEvent({
      action: 'assessment_deleted',
      entity_type: 'assessment',
      entity_id: id,
      old_values: oldData,
      new_values: undefined, 
    });

  } catch (error) {
    console.error("Error in deleteAssessment:", error)
    throw error
  }
}

// New function to save AI assessment reports
export async function saveAiAssessmentReport(reportData: {
  assessmentType: string;
  reportTitle: string;
  riskScore: number;
  riskLevel: string;
  reportSummary: string;
  fullReportContent: any; // JSON object containing all details
  uploadedDocumentsMetadata: any[];
  socInfo?: any; // Optional SOC-specific info
}) {
  try {
    console.log("💾 Attempting to save AI assessment report...");
    const { user, organization, profile } = await getCurrentUserWithProfile();

    if (!user || !organization || !profile) {
      throw new Error("User not authenticated or organization not found. Cannot save report.");
    }

    const insertData = {
      user_id: user.id,
      organization_id: organization.id,
      assessment_type: reportData.assessmentType,
      report_title: reportData.reportTitle,
      risk_score: reportData.riskScore,
      risk_level: reportData.riskLevel,
      analysis_date: new Date().toISOString(),
      report_summary: reportData.reportSummary,
      full_report_content: reportData.fullReportContent,
      uploaded_documents_metadata: reportData.uploadedDocumentsMetadata,
      soc_info: reportData.socInfo || null,
    };

    console.log("📝 Inserting AI assessment report data:", insertData);

    const { data, error } = await supabaseClient
      .from("ai_assessment_reports")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error saving AI assessment report:", error);
      throw new Error(`Failed to save AI assessment report: ${error.message}`);
    }

    // Log audit event
    await logAuditEvent({
      action: 'ai_assessment_report_saved',
      entity_type: 'ai_assessment_report',
      entity_id: data.id,
      new_values: data,
      old_values: undefined, 
    });

    console.log("✅ AI assessment report saved successfully:", data);
    return data;
  } catch (error) {
    console.error("💥 Error in saveAiAssessmentReport:", error);
    throw error;
  }
}

// New function to get AI assessment reports for the current user
export async function getAiAssessmentReports(): Promise<AiAssessmentReport[]> {
  try {
    console.log("📋 Getting AI assessment reports...");

    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      console.log("📝 No authenticated user or organization, returning empty array for AI reports.");
      return [];
    }

    console.log("🔍 Fetching AI assessment reports from Supabase for user:", user.id, "org:", organization.id);
    const { data, error } = await supabaseClient
      .from("ai_assessment_reports")
      .select("*")
      .eq("user_id", user.id)
      .eq("organization_id", organization.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase query error fetching AI assessment reports:", error);
      throw new Error(`Failed to fetch AI assessment reports: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log("📝 No AI assessment reports found in database.");
      return [];
    }

    console.log(`✅ Successfully fetched ${data.length} AI assessment reports.`);
    return data;
  } catch (error) {
    console.error("💥 Error in getAiAssessmentReports:", error);
    throw error;
  }
}

// --- New functions for Assessment Templates and Questions ---

// Get all assessment templates for the current organization
export async function getAssessmentTemplates(): Promise<{ data: AssessmentTemplate[] | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    const { data, error } = await supabaseClient
      .from('assessment_templates')
      .select('*')
      .eq('organization_id', organization.id)
      .order('name', { ascending: true });

    if (error) {
      console.error("getAssessmentTemplates: Supabase query error:", error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error("getAssessmentTemplates: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Get a specific assessment template by ID
export async function getAssessmentTemplateById(templateId: string): Promise<{ data: AssessmentTemplate | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    const { data, error } = await supabaseClient
      .from('assessment_templates')
      .select('*') // Fixed: Select all columns
      .eq('id', templateId)
      .eq('organization_id', organization.id)
      .single();

    if (error) {
      console.error("getAssessmentTemplateById: Supabase query error:", error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error("getAssessmentTemplateById: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Create a new assessment template
export async function createAssessmentTemplate(templateData: Omit<AssessmentTemplate, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<{ data: AssessmentTemplate | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    const { data, error } = await supabaseClient
      .from('assessment_templates')
      .insert({
        ...templateData,
        organization_id: organization.id,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("createAssessmentTemplate: Supabase insert error:", error);
      return { data: null, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'assessment_template_created',
      entity_type: 'assessment_template',
      entity_id: data.id,
      new_values: data,
      old_values: undefined, 
    });

    return { data, error: null };
  } catch (error) {
    console.error("createAssessmentTemplate: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Update an existing assessment template
export async function updateAssessmentTemplate(templateId: string, updates: Partial<Omit<AssessmentTemplate, 'id' | 'organization_id' | 'created_by' | 'created_at'>>): Promise<{ data: AssessmentTemplate | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('assessment_templates').select('*').eq('id', templateId).single();

    const { data, error } = await supabaseClient
      .from('assessment_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', templateId)
      .eq('organization_id', organization.id)
      .select()
      .single();

    if (error) {
      console.error("updateAssessmentTemplate: Supabase update error:", error);
      return { data: null, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'assessment_template_updated',
      entity_type: 'assessment_template',
      entity_id: data.id,
      old_values: oldData,
      new_values: data,
    });

    return { data, error: null };
  } catch (error) {
    console.error("updateAssessmentTemplate: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Delete an assessment template
export async function deleteAssessmentTemplate(templateId: string): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { success: false, error: "User not authenticated or organization not found." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('assessment_templates').select('*').eq('id', templateId).single();

    const { error } = await supabaseClient
      .from('assessment_templates')
      .delete()
      .eq('id', templateId)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("deleteAssessmentTemplate: Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'assessment_template_deleted',
      entity_type: 'assessment_template',
      entity_id: templateId,
      old_values: oldData,
      new_values: undefined, 
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("deleteAssessmentTemplate: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Get all questions for a specific template
export async function getTemplateQuestions(templateId: string): Promise<{ data: TemplateQuestion[] | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    // Verify template belongs to organization
    const { data: template, error: templateError } = await supabaseClient
      .from('assessment_templates')
      .select('id')
      .eq('id', templateId)
      .eq('organization_id', organization.id)
      .single();

    if (templateError || !template) {
      return { data: null, error: "Template not found or not accessible." };
    }

    const { data, error } = await supabaseClient
      .from('template_questions')
      .select('*')
      .eq('template_id', templateId)
      .order('order', { ascending: true });

    if (error) {
      console.error("getTemplateQuestions: Supabase query error:", error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error("getTemplateQuestions: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Create a new question for a template
export async function createTemplateQuestion(questionData: Omit<TemplateQuestion, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: TemplateQuestion | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    // Verify template belongs to organization
    const { data: template, error: templateError } = await supabaseClient
      .from('assessment_templates')
      .select('id')
      .eq('id', questionData.template_id)
      .eq('organization_id', organization.id)
      .single();

    if (templateError || !template) {
      return { data: null, error: "Template not found or not accessible." };
    }

    const { data, error } = await supabaseClient
      .from('template_questions')
      .insert(questionData)
      .select()
      .single();

    if (error) {
      console.error("createTemplateQuestion: Supabase insert error:", error);
      return { data: null, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'template_question_created',
      entity_type: 'template_question',
      entity_id: data.id,
      new_values: data,
      old_values: undefined, 
    });

    return { data, error: null };
  } catch (error) {
    console.error("createTemplateQuestion: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Update an existing question for a template
export async function updateTemplateQuestion(questionId: string, updates: Partial<Omit<TemplateQuestion, 'id' | 'template_id' | 'created_at'>>): Promise<{ data: TemplateQuestion | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    // Verify question's template belongs to organization
    const { data: question, error: questionError } = await supabaseClient
      .from('template_questions')
      .select('template_id')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return { data: null, error: "Question not found." };
    }

    const { data: template, error: templateError } = await supabaseClient
      .from('assessment_templates')
      .select('id')
      .eq('id', question.template_id)
      .eq('organization_id', organization.id)
      .single();

    if (templateError || !template) {
      return { data: null, error: "Template not found or not accessible." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('template_questions').select('*').eq('id', questionId).single();

    const { data, error } = await supabaseClient
      .from('template_questions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', questionId)
      .select()
      .single();

    if (error) {
      console.error("updateTemplateQuestion: Supabase update error:", error);
      return { data: null, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'template_question_updated',
      entity_type: 'template_question',
      entity_id: data.id,
      old_values: oldData,
      new_values: data,
    });

    return { data, error: null };
  } catch (error) {
    console.error("updateTemplateQuestion: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Delete a question from a template
export async function deleteTemplateQuestion(questionId: string): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { success: false, error: "User not authenticated or organization not found." };
    }

    // Verify question's template belongs to organization
    const { data: question, error: questionError } = await supabaseClient
      .from('template_questions')
      .select('template_id')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return { success: false, error: "Question not found." };
    }

    const { data: template, error: templateError } = await supabaseClient
      .from('assessment_templates')
      .select('id')
      .eq('id', question.template_id)
      .eq('organization_id', organization.id)
      .single();

    if (templateError || !template) {
      return { success: false, error: "Template not found or not accessible." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('template_questions').select('*').eq('id', questionId).single();

    const { error } = await supabaseClient
      .from('template_questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      console.error("deleteTemplateQuestion: Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'template_question_deleted',
      entity_type: 'template_question',
      entity_id: questionId,
      old_values: oldData,
      new_values: undefined, 
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("deleteTemplateQuestion: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}