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
          if (selectedTemplate?.id === "soc-compliance") { // Check if it's the SOC template
            setCurrentStep("soc-info");
          } else {
            setCurrentStep("upload-documents");
          }
        }
      } else if (selectedCategory) {
        const builtIn = builtInAssessmentCategories.find(cat => cat.id === selectedCategory);
        if (builtIn) {
          setCurrentQuestions(builtIn.questions.map(q => ({
            ...q,
            template_id: "builtin", // Indicate it's a built-in template
            order: 0, // Default order
            question_text: q.question,
            question_type: q.type,
            options: q.options || null,
            required: q.required || false,
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
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        label: 'Primary' as 'Primary' | '4th Party' // Default label
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  }

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const handleFileLabelChange = (index: number, label: 'Primary' | '4th Party') => {
    setUploadedFiles(prevFiles => 
      prevFiles.map((item, i) => 
        i === index ? { ...item, label } : item
      )
    );
  };

  const handleAnalyzeDocuments = async () => {
    if (!selectedCategory && !selectedTemplateId) {
      setError("Please select an assessment category or template.")
      return
    }
    if (uploadedFiles.length === 0) {
      setError("Please upload documents for analysis.")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisResults(null)
    setAnswers({})

    try {
      const formData = new FormData();
      uploadedFiles.forEach((item) => {
        formData.append('files', item.file);
      });
      formData.append('labels', JSON.stringify(uploadedFiles.map(item => item.label)));
      formData.append('questions', JSON.stringify(currentQuestions));
      formData.append('assessmentType', (customTemplates.find(t => t.id === selectedTemplateId)?.name || builtInAssessmentCategories.find(c => c.id === selectedCategory)?.name || "Custom Assessment"));

      const response = await fetch("/api/ai-assessment/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "AI analysis failed");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResults(result)
      setAnswers(result.answers) // Pre-fill answers with AI suggestions
      setRiskScore(result.riskScore)
      setRiskLevel(result.riskLevel)
      setCurrentStep("review-answers")
    } catch (err: any) {
      console.error("AI Analysis Failed:", err)
      setError(err.message || "Failed to perform AI analysis. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSOCInfoComplete = () => {
    setCurrentStep("upload-documents")
  }

  const handleFinalSubmit = () => {
    // Here you would typically save the final answers and risk score to your database
    // For this demo, we'll just transition to the results page.
    setCurrentStep("results")
  }

  const handleViewFullReport = (reportId: string) => {
    router.push(`/reports/${reportId}/view?type=ai`); // Navigate within the same tab
  };

  const handleSaveReport = async () => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Reports cannot be saved in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }

    if (!analysisResults || (!selectedCategory && !selectedTemplateId) || riskScore === null || riskLevel === null) {
      toast({
        title: "Error",
        description: "No complete report data available to save.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Saving Report...",
        description: "Your AI assessment report is being saved to your profile.",
      });

      const reportTitle = `${(customTemplates.find(t => t.id === selectedTemplateId)?.name || builtInAssessmentCategories.find(c => c.id === selectedCategory)?.name || "Custom Assessment")} AI Assessment`;
      const reportSummary = analysisResults.overallAnalysis.substring(0, 250) + "..."; // Truncate for summary

      const savedReport = await saveAiAssessmentReport({
        assessmentType: (customTemplates.find(t => t.id === selectedTemplateId)?.name || builtInAssessmentCategories.find(c => c.id === selectedCategory)?.name || "Custom Assessment"),
        reportTitle: reportTitle,
        riskScore: riskScore,
        riskLevel: riskLevel,
        reportSummary: reportSummary,
        fullReportContent: {
          analysisResults: analysisResults,
          answers: answers,
          questions: currentQuestions,
          socInfo: socInfo, // Include SOC info if available
        },
        uploadedDocumentsMetadata: uploadedFiles.map(item => ({
          fileName: item.file.name,
          fileSize: item.file.size,
          fileType: item.file.type,
          label: item.label,
        })),
        socInfo: socInfo,
      });

      if (savedReport) {
        setIsReportSaved(true);
        toast({
          title: "Report Saved!",
          description: "Your AI assessment report has been successfully saved to your profile.",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error("Error saving report:", err);
      toast({
        title: "Error Saving Report",
        description: err.message || "Failed to save the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRiskLevelColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "medium-high":
        return "text-orange-600 bg-orange-100"
      case "high":
        return "text-red-600 bg-red-100"
      case "critical":
        return "text-red-800 bg-red-200"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const calculateProgress = () => {
    let progress = 0
    if (currentStep === "select-category") progress = 10
    else if (currentStep === "soc-info") progress = 30
    else if (currentStep === "upload-documents") progress = 50
    else if (currentStep === "review-answers") progress = 75
    else if (currentStep === "results") progress = 100
    return progress
  }

  // Helper function to render the evidence citation
  const renderEvidenceCitation = (excerptData: any) => {
    if (!excerptData || excerptData.excerpt === 'No directly relevant evidence found after comprehensive search') {
      return 'No directly relevant evidence found after comprehensive search.';
    }

    let citationParts = [];
    const fileName = excerptData.fileName;
    const pageNumber = excerptData.pageNumber;
    const label = excerptData.label; // This will be '4th Party' or null

    if (fileName && String(fileName).trim() !== '' && fileName !== 'N/A') {
      citationParts.push(`"${fileName}"`);
    }

    // Explicitly add page number or 'N/A'
    if (pageNumber != null && String(pageNumber).trim() !== '') {
      citationParts.push(`Page: ${pageNumber}`);
    } else {
      citationParts.push(`Page: N/A`); // Explicitly show N/A if page number is missing
    }

    if (label === '4th Party') {
      citationParts.push('4th Party');
    }

    // Filter out any potentially empty or null parts before joining
    const filteredParts = citationParts.filter(part => part && String(part).trim() !== ''); // Ensure parts are non-empty strings

    // The excerpt is always the first part of the return string
    const excerptText = `"${excerptData.excerpt}"`;

    if (filteredParts.length === 0) {
      return excerptText;
    }

    // Join parts for the citation, ensuring the excerpt is first
    return `${excerptText} (from ${filteredParts.join(' - ')})`;
  };

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Sign up to save assessments and access full features"
    >
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">AI-Powered Risk Assessment</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                AI Assessment Platform
                <br />
                <span className="text-blue-600">Automated Risk Evaluation</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Upload your documents and let AI analyze them to automatically complete your risk assessments.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href="/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Dashboard
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Assessment Progress</span>
                <span className="text-sm text-gray-600">{Math.round(calculateProgress())}% Complete</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          </div>
        </div>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Step 1: Select Assessment Category */}
            {currentStep === "select-category" && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Select AI Assessment Type</h2>
                  <p className="text-lg text-gray-600">
                    Choose the type of risk assessment you want AI to perform for you.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Built-in Templates */}
                  {builtInAssessmentCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <Card
                        key={category.id}
                        className="relative group hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setSelectedTemplateId(null); // Clear custom template selection
                        }}
                      >
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">{category.description}</CardDescription>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <Bot className="mr-2 h-4 w-4" />
                            Select for AI Analysis
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {/* Custom Templates */}
                  {customTemplates.map((template) => {
                    const IconComponent = FileText; // Default icon for custom templates
                    return (
                      <Card
                        key={template.id}
                        className="relative group hover:shadow-lg transition-shadow cursor-pointer border-purple-300 bg-purple-50"
                        onClick={() => {
                          setSelectedTemplateId(template.id);
                          setSelectedCategory(null); // Clear built-in category selection
                        }}
                      >
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <IconComponent className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">{template.description}</CardDescription>
                          <Badge className="bg-purple-200 text-purple-800 mb-2">Custom Template</Badge>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            <Bot className="mr-2 h-4 w-4" />
                            Select for AI Analysis
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: SOC Information (only for SOC assessments) */}
            {currentStep === "soc-info" && (selectedCategory === "soc-compliance" || customTemplates.find(t => t.id === selectedTemplateId)?.type === "soc-compliance") && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep("select-category")}
                    className="mb-6 hover:bg-blue-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Category Selection
                  </Button>
                </div>

                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">SOC Assessment Information</h2>
                  <p className="text-lg text-gray-600">
                    Please provide information about your SOC assessment requirements
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      SOC Assessment Details
                    </CardTitle>
                    <CardDescription>
                      This information will be included in your assessment report and help tailor the AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="socType">SOC Type *</Label>
                        <select
                          id="socType"
                          value={socInfo.socType}
                          onChange={(e) => setSocInfo({ ...socInfo, socType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select SOC Type</option>
                          <option value="SOC 1">SOC 1 - Internal Controls over Financial Reporting</option>
                          <option value="SOC 2">
                            SOC 2 - Security, Availability, Processing Integrity, Confidentiality, Privacy
                          </option>
                          <option value="SOC 3">SOC 3 - General Use Report</option>
                        </select>
                      </div>
                      {socInfo.socType !== "SOC 3" && (
                        <div>
                          <Label htmlFor="reportType">Report Type *</Label>
                          <select
                            id="reportType"
                            value={socInfo.reportType}
                            onChange={(e) => setSocInfo({ ...socInfo, reportType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Report Type</option>
                            <option value="Type 1">Type 1 - Design and Implementation</option>
                            <option value="Type 2">Type 2 - Design, Implementation, and Operating Effectiveness</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="auditor">Auditor/CPA Firm</Label>
                        <Input
                          id="auditor"
                          value={socInfo.auditor}
                          onChange={(e) => setSocInfo({ ...socInfo, auditor: e.target.value })}
                          placeholder="Enter auditor or CPA firm name"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="auditorOpinion">Auditor Opinion</Label>
                        <select
                          id="auditorOpinion"
                          value={socInfo.auditorOpinion}
                          onChange={(e) => setSocInfo({ ...socInfo, auditorOpinion: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Opinion</option>
                          <option value="Unqualified">Unqualified</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Adverse">Adverse</option>
                          <option value="Disclaimer">Disclaimer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="auditorOpinionDate">Auditor Opinion Date</Label>
                        <Input
                          id="auditorOpinionDate"
                          type="date"
                          value={socInfo.auditorOpinionDate}
                          onChange={(e) => setSocInfo({ ...socInfo, auditorOpinionDate: e.target.value })}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {socInfo.socType &&
                        socInfo.reportType &&
                        (socInfo.reportType === "Type 1" || socInfo.socType === "SOC 3" ? (
                          <div>
                            <Label htmlFor="socDateAsOf">SOC Date as of</Label>
                            <Input
                              id="socDateAsOf"
                              type="date"
                              value={socInfo.socDateAsOf}
                              onChange={(e) => setSocInfo({ ...socInfo, socDateAsOf: e.target.value })}
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ) : (
                          <>
                            <div>
                              <Label htmlFor="socStartDate">SOC Start Date</Label>
                              <Input
                                id="socStartDate"
                                type="date"
                                value={socInfo.socStartDate}
                                onChange={(e) => setSocInfo({ ...socInfo, socStartDate: e.target.value })}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="socEndDate">SOC End Date</Label>
                              <Input
                                id="socEndDate"
                                type="date"
                                value={socInfo.socEndDate}
                                onChange={(e) => setSocInfo({ ...socInfo, socEndDate: e.target.value })}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="testedStatus">Testing Status</Label>
                        <select
                          id="testedStatus"
                          value={socInfo.testedStatus}
                          onChange={(e) => setSocInfo({ ...socInfo, testedStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Testing Status</option>
                          <option value="Tested">Tested</option>
                          <option value="Untested">Untested</option>
                        </select>
                      </div>
                      <div></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={socInfo.companyName}
                          onChange={(e) => setSocInfo({ ...socInfo, companyName: e.target.value })}
                          placeholder="Enter your company name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="productService">Product/Service Being Assessed *</Label>
                        <Input
                          id="productService"
                          value={socInfo.productService}
                          onChange={(e) => setSocInfo({ ...socInfo, productService: e.target.value })}
                          placeholder="Enter the product or service"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subserviceOrganizations">Subservice Organizations</Label>
                      <Textarea
                        id="subserviceOrganizations"
                        value={socInfo.subserviceOrganizations}
                        onChange={(e) => setSocInfo({ ...socInfo, subserviceOrganizations: e.target.value })}
                        placeholder="List any subservice organizations and their roles (e.g., cloud providers, data centers)..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep("select-category")}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSOCInfoComplete}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                      >
                        Continue to Document Upload
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Upload Documents */}
            {currentStep === "upload-documents" && (selectedCategory || selectedTemplateId) && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setCurrentStep((selectedCategory === "soc-compliance" || customTemplates.find(t => t.id === selectedTemplateId)?.type === "soc-compliance") ? "soc-info" : "select-category")
                    }
                    className="mb-6 hover:bg-blue-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to {(selectedCategory === "soc-compliance" || customTemplates.find(t => t.id === selectedTemplateId)?.type === "soc-compliance") ? "SOC Information" : "Category Selection"}
                  </Button>
                </div>

                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Documents for AI Analysis</h2>
                  <p className="text-lg text-gray-600">
                    Selected: <span className="font-semibold text-blue-600">{(customTemplates.find(t => t.id === selectedTemplateId)?.name || builtInAssessmentCategories.find(c => c.id === selectedCategory)?.name)}</span>
                  </p>
                  <p className="text-gray-600 mt-2">
                    Upload your policies, reports, and procedures. Our AI will analyze them to answer the assessment
                    questions.
                  </p>
                </div>

                <Card className="mb-8 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-6 w-6 text-blue-600" />
                      <span className="text-blue-900">Document Upload</span>
                      <Badge className="bg-green-100 text-green-700 text-xs">AI-POWERED</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-3">📄 Upload Your Documents</h4>
                        <p className="text-sm text-blue-800 mb-4">
                          Upload your security policies, SOC reports, compliance documents, and procedures. Our AI will
                          analyze them and automatically complete the assessment for you.
                        </p>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="document-upload" className="text-sm font-medium text-gray-700">
                              Upload Supporting Documents
                            </Label>
                            <div className="mt-2 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-blue-25">
                              <input
                                id="document-upload"
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <label htmlFor="document-upload" className="cursor-pointer">
                                <Upload className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                                <p className="text-lg font-medium text-blue-900 mb-1">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-blue-700">
                                  PDF, DOC, DOCX, TXT, CSV, XLSX, PPT, PPTX up to 10MB each
                                </p>
                                <p className="text-xs text-blue-600 mt-2">
                                  💡 Recommended: Security policies, SOC reports, compliance certificates, procedures
                                </p>
                              </label>
                            </div>

                            {uploadedFiles.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h5 className="font-medium text-blue-900">Uploaded Files ({uploadedFiles.length}):</h5>
                                {uploadedFiles.map((item: UploadedFileWithLabel, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                      <span className="text-sm text-gray-700">{item.file.name}</span>
                                      <span className="text-xs text-gray-500">
                                        ({(item.file.size / 1024 / 1024).toFixed(1)} MB)
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Select
                                        value={item.label}
                                        onValueChange={(value: 'Primary' | '4th Party') => handleFileLabelChange(index, value)}
                                      >
                                        <SelectTrigger className="w-[120px] h-8 text-xs">
                                          <SelectValue placeholder="Select label" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Primary">Primary</SelectItem>
                                          <SelectItem value="4th Party">4th Party</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button variant="outline" size="sm" onClick={() => handleRemoveFile(index)}>
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {uploadedFiles.length > 0 && (
                            <Button
                              onClick={handleAnalyzeDocuments}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                              disabled={isAnalyzing}
                            >
                              {isAnalyzing ? (
                                <>
                                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                                  Analyzing Documents... This may take a few moments
                                </>
                              ) : (
                                <>
                                  <Bot className="mr-2 h-5 w-5" />
                                  🚀 Analyze Documents with AI
                                </>
                              )}
                            </Button>
                          )}

                          {isAnalyzing && (
                            <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                                <div>
                                  <h4 className="font-semibold text-blue-900">AI Analysis in Progress</h4>
                                  <p className="text-sm text-blue-800">
                                    Processing {uploadedFiles.length} documents and generating assessment responses...
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <p className="text-sm text-red-800">
                                  <strong>Error:</strong> {error}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          <p className="text-sm text-amber-800">
                            <strong>Note:</strong> AI-generated responses are suggestions based on your documents.
                            Please review and verify all answers before submission.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Review AI-Generated Answers */}
            {currentStep === "review-answers" && (selectedCategory || selectedTemplateId) && analysisResults && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep("upload-documents")}
                    className="mb-6 hover:bg-blue-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Document Upload
                  </Button>
                </div>

                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Review AI-Generated Answers</h2>
                  <p className="text-lg text-gray-600">
                    Selected: <span className="font-semibold text-blue-600">{(customTemplates.find(t => t.id === selectedTemplateId)?.name || builtInAssessmentCategories.find(c => c.id === selectedCategory)?.name)}</span>
                  </p>
                  <p className="text-gray-600 mt-2">
                    The AI has analyzed your documents and provided suggested answers. Please review and edit as needed.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <span>AI-Suggested Responses</span>
                      {!isReportSaved && analysisResults.confidenceScores && (
                        <Badge className="bg-green-100 text-green-700">
                          Confidence: {Math.round(Object.values(analysisResults.confidenceScores).reduce((sum: number, val: number) => sum + val, 0) / Object.values(analysisResults.confidenceScores).length * 100)}%
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Review the AI's answers and make any necessary adjustments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {currentQuestions.map((question: TemplateQuestion, index: number) => (
                      <div key={question.id} className="space-y-4 border-b pb-6 last:border-b-0 last:pb-0">
                        <div>
                          <div className="flex items-start space-x-2 mb-2">
                            <Badge variant="outline" className="mt-1">
                              {question.category}
                            </Badge>
                            {question.required && <span className="text-red-500 text-sm">*</span>}
                            {!isReportSaved && analysisResults.confidenceScores?.[question.id] !== undefined && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                AI Confidence: {Math.round(analysisResults.confidenceScores[question.id] * 100)}%
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {index + 1}. {question.question_text}
                          </h3>
                        </div>

                        {/* AI Suggested Answer Display */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 mb-2">
                            <Bot className="inline h-4 w-4 mr-1" />
                            AI Suggestion:
                          </p>
                          <p className="text-sm font-medium text-blue-900">
                            {typeof analysisResults.answers[question.id] === "boolean"
                              ? (analysisResults.answers[question.id] ? "Yes" : "No")
                              : Array.isArray(analysisResults.answers[question.id])
                                ? (analysisResults.answers[question.id] as string[]).join(", ")
                                : analysisResults.answers[question.id] || "N/A"}
                          </p>
                          {analysisResults.documentExcerpts?.[question.id] &&
                            analysisResults.documentExcerpts[question.id].length > 0 && (
                              <div className="mt-3 text-xs text-gray-700 italic ml-4 p-2 bg-gray-50 border border-gray-100 rounded">
                                <Info className="inline h-3 w-3 mr-1" />
                                <strong>Evidence:</strong> {renderEvidenceCitation(analysisResults.documentExcerpts[question.id][0])}
                              </div>
                            )}
                        </div>

                        {/* Editable Answer Field */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Label htmlFor={`answer-${question.id}`} className="text-sm font-medium text-gray-700">
                            Your Final Answer (Edit if needed)
                          </Label>
                          {question.question_type === "boolean" && (
                            <div className="flex space-x-4 mt-2">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={answers[question.id] === true}
                                  onChange={() => handleAnswerChange(question.id, true)}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={answers[question.id] === false}
                                  onChange={() => handleAnswerChange(question.id, false)}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                          )}
                          {question.question_type === "multiple" && (
                            <>
                              <select
                                value={
                                  (question.options?.includes(answers[question.id]) || !answers[question.id])
                                    ? answers[question.id]
                                    : "Other"
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "Other") {
                                    setShowOtherInput(prev => ({ ...prev, [question.id]: true }));
                                    handleAnswerChange(question.id, ""); // Clear answer when "Other" is selected
                                  } else {
                                    setShowOtherInput(prev => ({ ...prev, [question.id]: false }));
                                    handleAnswerChange(question.id, value);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                              >
                                <option value="">Select an option</option>
                                {question.options?.map((option: string) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                                <option value="Other">Other (please specify)</option>
                              </select>
                              {showOtherInput[question.id] && (
                                <Input
                                  id={`other-answer-${question.id}`}
                                  value={answers[question.id] || ""}
                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                  placeholder="Please specify..."
                                  className="mt-2"
                                />
                              )}
                            </>
                          )}
                          {question.question_type === "tested" && (
                            <div className="flex space-x-4 mt-2">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={answers[question.id] === "tested"}
                                  onChange={() => handleAnswerChange(question.id, "tested")}
                                  className="mr-2"
                                />
                                Tested
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={answers[question.id] === "not_tested"}
                                  onChange={() => handleAnswerChange(question.id, "not_tested")}
                                  className="mr-2"
                                />
                                Not Tested
                              </label>
                            </div>
                          )}
                          {question.question_type === "textarea" && (
                            <Textarea
                              id={`answer-${question.id}`}
                              value={answers[question.id] || ""}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              placeholder="Provide your detailed response here..."
                              rows={4}
                              className="mt-2"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("upload-documents")}
                    className="hover:bg-gray-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Upload
                  </Button>
                  <Button onClick={handleFinalSubmit} className="bg-green-600 hover:bg-green-700 text-white">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Finalize Assessment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Results */}
            {currentStep === "results" && (selectedCategory || selectedTemplateId) && analysisResults && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Assessment Complete!</h2>
                  <p className="text-lg text-gray-600">
                    Your {(customTemplates.find(t => t.id === selectedTemplateId)?.name || builtInAssessmentCategories.find(c => c.id === selectedCategory)?.name)} risk assessment has been finalized.
                  </p>
                </div>

                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Risk Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-4">{riskScore}%</div>
                      <Badge className={`text-lg px-4 py-2 ${getRiskLevelColor(riskLevel)}`}>
                        {riskLevel} Risk
                      </Badge>
                      <p className="text-sm text-gray-600 mt-4">
                        This score reflects your current posture based on the AI analysis and your review.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-900 mb-2">Overall Analysis</h3>
                          <p className="text-sm text-blue-800">{analysisResults.overallAnalysis}</p>
                          <p className="text-xs text-blue-700 mt-2">
                            AI Provider: {analysisResults.aiProvider} | Documents Analyzed:{" "}
                            {analysisResults.documentsAnalyzed}
                          </p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h3 className="font-semibold text-red-900 mb-2">Identified Risk Factors</h3>
                          <ul className="text-sm text-red-800 list-disc pl-5 space-y-1">
                            {analysisResults.riskFactors.map((factor: string, index: number) => (
                              <li key={index}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-semibold text-green-900 mb-2">Recommendations</h3>
                          <ul className="text-sm text-green-800 list-disc pl-5 space-y-1">
                            {analysisResults.recommendations.map((rec: string, index: number) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("review-answers")}
                      className="hover:bg-gray-50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Review
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveReport}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isReportSaved || isDemo}
                      >
                        {isReportSaved ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Report Saved
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Report
                          </>
                        )}
                      </Button>
                      <Button onClick={() => handleViewFullReport(user?.id || 'demo-user-id')} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="mr-2 h-4 w-4" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <span className="text-lg font-bold">RiskShield AI</span>
                </div>
                <p className="text-gray-400 text-sm">
                  AI-powered risk assessment platform helping financial institutions maintain compliance and mitigate
                  risks.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Risk Assessment
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Compliance Monitoring
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Policy Generator
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Integrations
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Status Page
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 RiskShield AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}