"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  FileText,
  Bot,
  Send,
  ArrowLeft,
  X,
  Brain,
  Cpu,
  BarChart3,
  Upload,
  CheckCircle,
  AlertCircle,
  Download,
  Check,
  XCircle,
  Info,
  Edit,
  Save,
  Building,
  Lock,
  Server,
  User,
  FileCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
} from "lucide-react"
// import { MainNavigation } from "@/components/main-navigation"
import { AuthGuard } from "@/components/auth-guard"
import { sendAssessmentEmail } from "@/app/third-party-assessment/email-service"
import { getCurrentUserWithProfile } from "@/lib/auth-service" // Import for server-side user context

// Complete assessment categories for AI assessment
const assessmentCategories = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Evaluate your organization's cybersecurity posture and controls",
    icon: Shield,
    questions: [
      {
        id: "cyber_1",
        question: "Does your organization have a formal information security policy?",
        type: "multiple" as const,
        options: ["Yes, comprehensive policy", "Yes, basic policy", "In development", "No"],
        weight: 10,
      },
      {
        id: "cyber_2",
        question: "How do you manage user access to systems and data?",
        type: "multiple" as const,
        options: [
          "Multi-factor authentication",
          "Role-based access control",
          "Regular access reviews",
          "Privileged access management",
          "Single sign-on (SSO)",
        ],
        weight: 10,
      },
      {
        id: "cyber_3",
        question: "Describe your incident response procedures:",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "cyber_4",
        question: "What encryption standards do you use for data at rest and in transit?",
        type: "multiple" as const,
        options: ["AES-256 and TLS 1.3", "AES-128 and TLS 1.2", "Basic encryption", "No encryption"],
        weight: 10,
      },
      {
        id: "cyber_5",
        question: "How often do you conduct security awareness training?",
        type: "multiple" as const,
        options: ["Monthly", "Quarterly", "Annually", "As needed", "Never"],
        weight: 10,
      },
      {
        id: "cyber_6",
        question: "Describe your vulnerability assessment and patch management process:",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "cyber_7",
        question: "Do you have a written Information Security Policy (ISP)?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_8",
        question: "How often do you review and update your Information Security Policy?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
      },
      {
        id: "cyber_9",
        question: "Do you have a designated person responsible for Information Security Policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_10",
        question: "Do you have data privacy compliance monitoring procedures in place?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_11",
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_12",
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_13",
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_14",
        question: "Do you have an IT asset management program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_15",
        question: "Do you have restrictions on storage devices?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_16",
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_17",
        question: "Do you implement network segmentation?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_18",
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_19",
        question: "How frequently do you conduct vulnerability scanning?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 10,
      },
      {
        id: "cyber_20",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
      },
      {
        id: "cyber_21",
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "multiple" as const,
        options: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST", "None"],
        weight: 10,
      },
      {
        id: "cyber_22",
        question: "Do you have a formal access control policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_23",
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_24",
        question: "Do you have defined password parameters and requirements?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_25",
        question: "Do you implement least privilege access principles?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_26",
        question: "How frequently do you conduct access reviews?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 10,
      },
      {
        id: "cyber_27",
        question: "Do you require device authentication for network access?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_28",
        question: "Do you have secure remote logical access controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_29",
        question: "Do you have a third-party oversight program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_30",
        question: "Do you assess third-party security controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_31",
        question: "Do you verify third-party compliance controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_32",
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_33",
        question: "Do you provide information security training to employees?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_34",
        question: "Do you provide privacy training to employees?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_35",
        question: "Do you provide role-specific compliance training?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_36",
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_37",
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_38",
        question: "Do you have a data management program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_39",
        question: "Do you have a published privacy policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_40",
        question: "Do you have consumer data retention policies?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_41",
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_42",
        question: "Do you have data breach protocols?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_43",
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_44",
        question: "Do you collect NPI, PII, or PHI data?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        weight: 10,
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
        question: "Are you compliant with current FDIC regulations?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "rc2",
        question: "How often do you review and update compliance policies?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "rc3",
        question: "Do you have a dedicated compliance officer?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "rc4",
        question: "How frequently do you conduct compliance audits?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "rc5",
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
        question: "Do you have documented operational procedures for all critical processes?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "or2",
        question: "How often do you review and update operational procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "or3",
        question: "Do you have adequate segregation of duties in place?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "or4",
        question: "How frequently do you conduct operational risk assessments?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 8,
      },
      {
        id: "or5",
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
        question: "Do you have a documented Business Continuity Management (BCM) program in place?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "bc2",
        question: "How frequently do you review and update your BCM program?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2-3 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "bc3",
        question: "Does your BCM program have executive oversight and sponsorship?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc4",
        question: "How often do you conduct BCM training for employees?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "bc5",
        question: "Do you monitor system capacity and availability on an ongoing basis?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc6",
        question: "Do you have adequate physical security controls for critical facilities?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc7",
        question: "Do you have environmental security controls (fire suppression, climate control, etc.)?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc8",
        question: "Do you have redundant telecommunications infrastructure to handle failures?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "bc9",
        question: "How frequently do you perform equipment maintenance and firmware updates?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Annually", "Semi-annually", "Quarterly"],
        weight: 8,
      },
      {
        id: "bc10",
        question: "Do you have backup power systems (UPS/generators) for critical operations?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "bc11",
        question: "Do you have comprehensive data protection (firewall, anti-virus, encryption)?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "bc12",
        question: "Do you have contingency plans for failures of critical third-party providers?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc13",
        question: "Do you conduct background checks on employees with access to critical systems?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc14",
        question: "Do you have adequate staffing depth and cross-training for critical functions?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc15",
        question: "Do you have a documented Disaster Recovery Plan separate from your BCM?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "bc16",
        question: "Do you have established internal and external communication protocols for crisis management?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc17",
        question: "Do you have communication procedures for planned system outages?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "bc18",
        question: "Do you have a cybersecurity incident management plan?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "bc19",
        question: "Do you maintain appropriate business continuity insurance coverage?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "bc20",
        question: "Do you have pandemic/health emergency continuity plans?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc21",
        question: "Do you have remote administration contingencies for critical systems?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc22",
        question: "Do you have proper source code management and version control systems?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "bc23",
        question: "Have you identified and addressed any outdated systems that pose continuity risks?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc24",
        question: "How frequently do you backup critical business data?",
        type: "multiple" as const,
        options: ["Never", "Monthly", "Weekly", "Daily", "Real-time/Continuous"],
        weight: 10,
      },
      {
        id: "bc25",
        question: "Have you conducted a formal Business Impact Analysis (BIA)?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "bc26",
        question: "Have you defined Recovery Point Objectives (RPO) for critical systems?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "bc27",
        question: "Have you defined Recovery Time Objectives (RTO) for critical systems?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "bc28",
        question: "How frequently do you test your BCM/DR plans?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
      },
      {
        id: "bc29",
        question: "How frequently do you test your incident response procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "bc30",
        question: "How frequently do you test your data backup and recovery procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
      },
      {
        id: "bc31",
        question: "Do you document and analyze the results of your BC/DR testing?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "bc32",
        question: "Do you have independent audits of your BC/DR plan testing conducted?",
        type: "boolean" as const,
        weight: 8,
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
        question: "Are you compliant with current banking regulations (e.g., Basel III, Dodd-Frank)?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "fs2",
        question: "How often do you conduct anti-money laundering (AML) training?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "fs3",
        question: "Do you have a comprehensive Know Your Customer (KYC) program?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "fs4",
        question: "How frequently do you review and update your credit risk policies?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "fs5",
        question: "Do you maintain adequate capital reserves as required by regulators?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "fs6",
        question: "Are you compliant with consumer protection regulations (e.g., CFPB guidelines)?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "fs7",
        question: "How often do you conduct stress testing on your financial portfolios?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
      },
      {
        id: "fs8",
        question: "Do you have proper segregation of client funds and assets?",
        type: "boolean" as const,
        weight: 10,
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
        question: "Are you compliant with applicable data privacy regulations (GDPR, CCPA, etc.)?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "dp2",
        question: "How often do you conduct data privacy impact assessments?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Annually", "Semi-annually", "For all new projects"],
        weight: 9,
      },
      {
        id: "dp3",
        question: "Do you have documented data retention and deletion policies?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp4",
        question: "How do you handle data subject access requests?",
        type: "multiple" as const,
        options: ["No formal process", "Manual process", "Semi-automated", "Fully automated", "Comprehensive system"],
        weight: 8,
      },
      {
        id: "dp5",
        question: "Do you have a designated Data Protection Officer (DPO)?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp6",
        question: "Are all third-party data processors properly vetted and contracted?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp7",
        question: "How often do you provide data privacy training to employees?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "dp8",
        question: "Do you maintain records of all data processing activities?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp9",
        question: "Have you implemented privacy by design principles in your systems?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp10",
        question: "Do you have a written Information Security Policy (ISP)?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp11",
        question: "How often do you review and update your Information Security Policy?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "dp12",
        question: "Do you have a designated person responsible for Information Security Policy?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp13",
        question: "Do you have data privacy compliance monitoring procedures in place?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp14",
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp15",
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp16",
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp17",
        question: "Do you have an IT asset management program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp18",
        question: "Do you have restrictions on storage devices?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp19",
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp20",
        question: "Do you implement network segmentation?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp21",
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp22",
        question: "How frequently do you conduct vulnerability scanning?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp23",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        required: true,
      },
      {
        id: "dp24",
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "multiple" as const,
        options: ["None", "ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST"],
        required: true,
      },
      {
        id: "dp25",
        question: "Do you have a formal access control policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp26",
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp27",
        question: "Do you have defined password parameters and requirements?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp28",
        question: "Do you implement least privilege access principles?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp29",
        question: "How frequently do you conduct access reviews?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp30",
        question: "Do you require device authentication for network access?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp31",
        question: "Do you have secure remote logical access controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp32",
        question: "Do you have a third-party oversight program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp33",
        question: "Do you assess third-party security controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp34",
        question: "Do you verify third-party compliance controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp35",
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp36",
        question: "Do you provide information security training to employees?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp37",
        question: "Do you provide privacy training to employees?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp38",
        question: "Do you provide role-specific compliance training?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp39",
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp40",
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp41",
        question: "Do you have a data management program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp42",
        question: "Do you have a published privacy policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp43",
        question: "Do you have consumer data retention policies?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp44",
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp45",
        question: "Do you have data breach protocols?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp46",
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp47",
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
        question: "Do you have network segmentation implemented for critical systems?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "is2",
        question: "How often do you update and patch your server infrastructure?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Monthly", "Weekly", "Automated/Real-time"],
        weight: 10,
      },
      {
        id: "is3",
        question: "Do you have intrusion detection and prevention systems (IDS/IPS) deployed?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "is4",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "is5",
        question: "Are all administrative accounts protected with privileged access management?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "is6",
        question: "Do you have comprehensive logging and monitoring for all critical systems?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "is7",
        question: "How often do you review and update firewall rules?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "is8",
        question: "Do you have secure configuration standards for all infrastructure components?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "is9",
        question: "Are all data transmissions encrypted both in transit and at rest?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "is10",
        question: "Do you have a formal vulnerability management program?",
        type: "boolean" as const,
        weight: 9,
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
        question:
          "Has management established a governance structure with clear roles and responsibilities for SOC compliance?",
        type: "tested" as const,
        weight: 10,
      },
      {
        id: "soc2",
        question: "Are there documented policies and procedures for all SOC-relevant control activities?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc3",
        question: "Has management established a risk assessment process to identify and evaluate risks?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc4",
        question: "Are control objectives clearly defined and communicated throughout the organization?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc5",
        question: "Is there a formal process for monitoring and evaluating control effectiveness?",
        type: "tested" as const,
        weight: 9,
      },

      // Security Controls
      {
        id: "soc6",
        question: "Are logical access controls implemented to restrict access to systems and data?",
        type: "tested" as const,
        weight: 10,
      },
      {
        id: "soc7",
        question: "Is user access provisioning and deprovisioning performed in a timely manner?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc8",
        question: "Are privileged access rights regularly reviewed and approved?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc9",
        question: "Is multi-factor authentication implemented for all critical systems?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc10",
        question: "Are password policies enforced and regularly updated?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc11",
        question: "Is data encryption implemented for data at rest and in transit?",
        type: "tested" as const,
        weight: 10,
      },
      {
        id: "soc12",
        question: "Are security incident response procedures documented and tested?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc13",
        question: "Is vulnerability management performed regularly with timely remediation?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc14",
        question: "Are network security controls (firewalls, IDS/IPS) properly configured and monitored?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc15",
        question: "Is physical access to data centers and facilities properly controlled?",
        type: "tested" as const,
        weight: 8,
      },

      // Availability Controls
      {
        id: "soc16",
        question: "Are system capacity and performance monitored to ensure availability?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc17",
        question: "Is there a documented business continuity and disaster recovery plan?",
        type: "tested" as const,
        weight: 10,
      },
      {
        id: "soc18",
        question: "Are backup and recovery procedures regularly tested?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc19",
        question: "Is system availability monitored with appropriate alerting mechanisms?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc20",
        question: "Are change management procedures in place for system modifications?",
        type: "tested" as const,
        weight: 9,
      },

      // Processing Integrity Controls
      {
        id: "soc21",
        question: "Are data processing controls implemented to ensure completeness and accuracy?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc22",
        question: "Is data input validation performed to prevent processing errors?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc23",
        question: "Are automated controls in place to detect and prevent duplicate transactions?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc24",
        question: "Is data processing monitored for exceptions and errors?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc25",
        question: "Are reconciliation procedures performed to ensure data integrity?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc25a",
        question:
          "Are processing authorization controls in place to ensure only authorized transactions are processed?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc25b",
        question: "Are processing controls implemented to ensure processing completeness and accuracy?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc25c",
        question: "Are processing controls designed to ensure timely processing of transactions?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc25d",
        question: "Are processing issues properly escalated, tracked, and addressed in a timely manner?",
        type: "tested" as const,
        weight: 9,
      },

      // Confidentiality Controls
      {
        id: "soc26",
        question: "Are confidentiality agreements in place with employees and third parties?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc27",
        question: "Is sensitive data classified and handled according to its classification?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc28",
        question: "Are data retention and disposal policies implemented and followed?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc29",
        question: "Is access to confidential information restricted on a need-to-know basis?",
        type: "tested" as const,
        weight: 9,
      },

      // Privacy Controls
      {
        id: "soc30",
        question: "Are privacy policies and procedures documented and communicated?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc31",
        question: "Is personal information collected, used, and disclosed in accordance with privacy policies?",
        type: "tested" as const,
        weight: 10,
      },
      {
        id: "soc32",
        question: "Are individuals provided with notice about data collection and use practices?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc33",
        question: "Is consent obtained for the collection and use of personal information where required?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc34",
        question: "Are data subject rights (access, correction, deletion) supported and processed?",
        type: "tested" as const,
        weight: 9,
      },

      // Monitoring and Logging
      {
        id: "soc35",
        question: "Are system activities logged and monitored for security events?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc36",
        question: "Is log data protected from unauthorized access and modification?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc37",
        question: "Are logs regularly reviewed for suspicious activities?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc38",
        question: "Is there a centralized logging system for security monitoring?",
        type: "tested" as const,
        weight: 8,
      },

      // Third-Party Management
      {
        id: "soc39",
        question: "Are third-party service providers evaluated for SOC compliance?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc40",
        question: "Are contracts with service providers reviewed for appropriate control requirements?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc41",
        question: "Is third-party performance monitored against contractual requirements?",
        type: "tested" as const,
        weight: 8,
      },

      // Training and Awareness
      {
        id: "soc42",
        question: "Is security and compliance training provided to all relevant personnel?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc43",
        question: "Are employees made aware of their roles and responsibilities for SOC compliance?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc44",
        question: "Is ongoing training provided to keep personnel current with policies and procedures?",
        type: "tested" as const,
        weight: 7,
      },

      // Management Review and Oversight
      {
        id: "soc45",
        question: "Does management regularly review control effectiveness and compliance status?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc46",
        question: "Are control deficiencies identified, documented, and remediated in a timely manner?",
        type: "tested" as const,
        weight: 9,
      },
      {
        id: "soc47",
        question: "Is there a formal process for management to approve significant changes to controls?",
        type: "tested" as const,
        weight: 8,
      },
      {
        id: "soc48",
        question: "Are internal audits performed to assess control effectiveness?",
        type: "tested" as const,
        weight: 9,
      },
    ],
  },
]

// Mock existing assessments
const mockAssessments = [
  {
    id: "1",
    name: "Q4 2024 Cybersecurity Assessment",
    category: "cybersecurity",
    status: "completed",
    riskScore: 75,
    riskLevel: "Medium",
    completedDate: "2024-01-15",
    recommendations: 3,
    implementedRecommendations: 1,
  },
  {
    id: "2",
    name: "Annual Compliance Review 2024",
    category: "compliance",
    status: "in_progress",
    riskScore: 0,
    riskLevel: "Pending",
    completedDate: null,
    recommendations: 0,
    implementedRecommendations: 0,
  },
  {
    id: "3",
    name: "Operational Risk Assessment",
    category: "operational",
    status: "completed",
    riskScore: 85,
    riskLevel: "Low",
    completedDate: "2024-01-10",
    recommendations: 2,
    implementedRecommendations: 2,
  },
]

export default function RiskAssessmentPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<"select" | "choose-method" | "manual-assessment" | "soc-info">(
    "select",
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [assessmentStarted, setAssessmentStarted] = useState(false)
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)
  const [riskResults, setRiskResults] = useState<any>(null)

  // SOC Information state
  const [socInfo, setSocInfo] = useState({
    socType: "",
    reportType: "",
    auditor: "",
    auditorOpinion: "",
    testedStatus: "",
    companyName: "",
    productService: "",
    subserviceOrganizations: "",
    trustServiceCriteria: [] as string[],
  })

  // New state management for saving/loading assessments
  const [savedAssessments, setSavedAssessments] = useState<any[]>([])
  const [showSavedAssessments, setShowSavedAssessments] = useState(false)

  // Updated delegation states
  const [showDelegateForm, setShowDelegateForm] = useState(false)
  const [delegateStep, setDelegateStep] = useState<"choose-type" | "choose-method" | "form">("choose-type")
  const [delegationType, setDelegationType] = useState<"team" | "third-party" | null>(null)
  const [delegateMethod, setDelegateMethod] = useState<"manual" | "ai" | null>(null)
  const [delegateForm, setDelegateForm] = useState({
    assessmentType: "",
    recipientName: "",
    recipientEmail: "",
    companyName: "",
    dueDate: "",
    customMessage: "",
  })
  const [delegatedAssessments, setDelegatedAssessments] = useState<any[]>([])

  // Add these state variables after the existing state declarations
  const [isDelegatedAssessment, setIsDelegatedAssessment] = useState(false)
  const [delegatedAssessmentInfo, setDelegatedAssessmentInfo] = useState<any>(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedAssessments") || "[]")
    setSavedAssessments(saved)
  }, [])

  useEffect(() => {
    const delegated = JSON.parse(localStorage.getItem("delegatedAssessments") || "[]")
    setDelegatedAssessments(delegated)
  }, [])

  // Add this useEffect after the existing useEffects
  useEffect(() => {
    // Check if this is a delegated assessment
    const urlParams = new URLSearchParams(window.location.search)
    const isDelegated = urlParams.get("delegated") === "true"
    const delegatedId = urlParams.get("id")
    const delegatedToken = urlParams.get("token")

    if (isDelegated && delegatedId && delegatedToken) {
      setIsDelegatedAssessment(true)

      // Get the stored assessment info
      const storedInfo = localStorage.getItem("internalAssessmentInfo")
      if (storedInfo) {
        try {
          const assessmentInfo = JSON.parse(storedInfo)
          setDelegatedAssessmentInfo(assessmentInfo)

          // Find the matching category
          const matchingCategory = assessmentCategories.find(
            (cat) => cat.name === assessmentInfo.assessmentType || assessmentInfo.assessmentType.includes(cat.name),
          )

          if (matchingCategory) {
            setSelectedCategory(matchingCategory.id)
            setCurrentStep("choose-method")
            setAssessmentStarted(true)
            setCurrentQuestion(0)
            setAnswers({})
            setAssessmentCompleted(false)
          }
        } catch (error) {
          console.error("Error parsing delegated assessment info:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (assessmentStarted && selectedCategory) {
      const assessmentData = {
        id: `draft-${selectedCategory}-${Date.now()}`,
        category: selectedCategory,
        currentQuestion,
        answers,
        socInfo: selectedCategory === "soc-compliance" ? socInfo : undefined,
        timestamp: new Date().toISOString(),
        categoryName: assessmentCategories.find((cat) => cat.id === selectedCategory)?.name,
      }

      // Save current progress
      const saved = JSON.parse(localStorage.getItem("savedAssessments") || "[]")
      const existingIndex = saved.findIndex((s: any) => s.category === selectedCategory)

      if (existingIndex >= 0) {
        saved[existingIndex] = assessmentData
      } else {
        saved.push(assessmentData)
      }

      localStorage.setItem("savedAssessments", JSON.stringify(saved))
      setSavedAssessments(saved)
    }
  }, [assessmentStarted, selectedCategory, currentQuestion, answers, socInfo])

  const handleStartAssessment = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentStep("choose-method")
  }

  const handleChooseManual = () => {
    setCurrentStep("manual-assessment")
    setAssessmentStarted(true)
    setCurrentQuestion(0)
    setAnswers({})
    setAssessmentCompleted(false)
  }

  const handleChooseAI = () => {
    const category = assessmentCategories.find((cat) => cat.id === selectedCategory)
    if (category) {
      // Store both the selected category and skip method selection
      localStorage.setItem("selectedAssessmentCategory", selectedCategory!)
      localStorage.setItem("skipMethodSelection", "true")
      window.location.href = "/risk-assessment/ai-assessment"
    }
  }

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleNextQuestion = () => {
    const category = assessmentCategories.find((cat) => cat.id === selectedCategory)
    if (category && currentQuestion < category.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeAssessment()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Update the completeAssessment function to handle delegated assessments
  const completeAssessment = () => {
    // Remove from saved assessments when completing
    const saved = savedAssessments.filter((s) => s.category !== selectedCategory)
    localStorage.setItem("savedAssessments", JSON.stringify(saved))
    setSavedAssessments(saved)

    const category = assessmentCategories.find((cat) => cat.id === selectedCategory)
    if (!category) return

    // Calculate risk score
    let totalScore = 0
    let maxScore = 0

    category.questions.forEach((question) => {
      const answer = answers[question.id]

      if (question.type === "tested") {
        // For SOC assessments, "tested" is better than "not tested"
        maxScore += question.weight
        if (answer === "tested") {
          totalScore += question.weight
        } else if (answer === "not_tested") {
          totalScore += 0
        }
      } else if (question.type === "boolean") {
        maxScore += question.weight
        totalScore += answer ? question.weight : 0
      } else if (question.type === "multiple") {
        maxScore += question.weight * 4 // Max score for multiple choice is 4
        const optionIndex = question.options?.indexOf(answer) || 0
        const scoreMultiplier = (question.options!.length - 1 - optionIndex) / (question.options!.length - 1)
        totalScore += question.weight * scoreMultiplier * 4
      }
    })

    const riskScore = Math.round((totalScore / maxScore) * 100)
    let riskLevel = "High"
    let recommendations: string[] = []

    if (selectedCategory === "soc-compliance") {
      // SOC-specific risk levels and recommendations
      if (riskScore >= 90) {
        riskLevel = "Low"
        recommendations = [
          "Maintain current SOC compliance practices",
          "Continue regular monitoring and testing of controls",
          "Consider pursuing higher SOC certification levels",
        ]
      } else if (riskScore >= 75) {
        riskLevel = "Medium"
        recommendations = [
          "Address any non-tested controls identified",
          "Strengthen documentation for all control activities",
          "Implement additional monitoring for key controls",
          "Consider third-party validation of control effectiveness",
        ]
      } else if (riskScore >= 50) {
        riskLevel = "Medium-High"
        recommendations = [
          "Immediate remediation required for critical control gaps",
          "Implement comprehensive testing program for all controls",
          "Engage SOC auditor for readiness assessment",
          "Establish formal control monitoring and reporting processes",
        ]
      } else {
        riskLevel = "High"
        recommendations = [
          "Comprehensive SOC compliance program implementation required",
          "Engage qualified SOC consultant or auditor immediately",
          "Establish formal governance and risk management framework",
          "Implement and test all required SOC controls",
          "Consider delaying SOC audit until readiness is achieved",
        ]
      }
    } else {
      // Standard risk levels for other assessments
      if (riskScore >= 80) {
        riskLevel = "Low"
        recommendations = ["Continue current security practices", "Consider advanced security measures"]
      } else if (riskScore >= 60) {
        riskLevel = "Medium"
        recommendations = [
          "Implement additional security controls",
          "Increase training frequency",
          "Review and update policies",
        ]
      } else {
        riskLevel = "High"
        recommendations = [
          "Immediate security improvements required",
          "Implement comprehensive security framework",
          "Conduct thorough security audit",
          "Establish incident response procedures",
        ]
      }
    }

    setRiskResults({
      score: riskScore,
      level: riskLevel,
      recommendations,
      category: category.name,
      socInfo: selectedCategory === "soc-compliance" ? socInfo : undefined,
    })
    setAssessmentCompleted(true)

    // If this is a delegated assessment, mark it as completed
    if (isDelegatedAssessment && delegatedAssessmentInfo) {
      try {
        const existingDelegated = JSON.parse(localStorage.getItem("delegatedAssessments") || "[]")
        const updatedDelegated = existingDelegated.map((delegation: any) =>
          delegation.assessmentId === delegatedAssessmentInfo.assessmentId
            ? {
                ...delegation,
                status: "completed",
                completedDate: new Date().toISOString(),
                riskScore: riskScore,
                riskLevel: riskLevel,
              }
            : delegation,
        )
        localStorage.setItem("delegatedAssessments", JSON.stringify(updatedDelegated))
        console.log("✅ Delegated assessment marked as completed")
      } catch (error) {
        console.error("❌ Error updating delegated assessment:", error)
      }
    }
  }

  const loadSavedAssessment = (savedAssessment: any) => {
    setSelectedCategory(savedAssessment.category)
    setCurrentQuestion(savedAssessment.currentQuestion)
    setAnswers(savedAssessment.answers)
    if (savedAssessment.socInfo) {
      setSocInfo(savedAssessment.socInfo)
    }
    setAssessmentStarted(true)
    if (savedAssessment.category === "soc-compliance" && savedAssessment.currentQuestion === 0) {
      setCurrentStep("soc-info")
    } else {
      setCurrentStep("manual-assessment")
    }
    setShowSavedAssessments(false)
  }

  const deleteSavedAssessment = (categoryId: string) => {
    const saved = savedAssessments.filter((s) => s.category !== categoryId)
    localStorage.setItem("savedAssessments", JSON.stringify(saved))
    setSavedAssessments(saved)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "Medium-High":
        return "text-orange-600 bg-orange-100"
      case "High":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "in_progress":
        return "text-blue-600 bg-blue-100"
      case "pending":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const currentCategory = assessmentCategories.find((cat) => cat.id === selectedCategory)
  const currentQuestionData = currentCategory?.questions[currentQuestion]
  const progress = currentCategory ? ((currentQuestion + 1) / currentCategory.questions.length) * 100 : 0

  const handleDelegateAssessment = (categoryId: string) => {
    const category = assessmentCategories.find((cat) => cat.id === categoryId)
    if (category) {
      setDelegateForm({
        ...delegateForm,
        assessmentType: category.name,
      })
      setShowDelegateForm(true)
      setDelegateStep("choose-type")
      setDelegationType(null)
      setDelegateMethod(null)
    }
  }

  const handleDelegateTypeSelection = (type: "team" | "third-party") => {
    setDelegationType(type)
    setDelegateStep("choose-method")
  }

  const handleDelegateMethodSelection = (method: "manual" | "ai") => {
    setDelegateMethod(method)
    setDelegateStep("form")
  }

  const handleSendDelegation = async () => {
    if (!delegateForm.recipientName || !delegateForm.recipientEmail || !delegateForm.assessmentType) {
      alert("Please fill in all required fields")
      return
    }

    if (delegationType === "third-party" && !delegateForm.companyName) {
      alert("Please enter the company name for third-party delegation")
      return
    }

    try {
      // Generate a unique assessment ID for the delegation
      const assessmentId = `internal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create assessment type with method indicator
      const assessmentTypeWithMethod =
        delegateMethod === "ai" ? `${delegateForm.assessmentType} (AI-Powered)` : delegateForm.assessmentType

      // Store delegation info
      const delegationInfo = {
        assessmentId: assessmentId,
        assessmentType: assessmentTypeWithMethod,
        isAiPowered: delegateMethod === "ai",
        recipientEmail: delegateForm.recipientEmail,
        recipientName: delegateForm.recipientName,
        companyName: delegateForm.companyName,
        dueDate: delegateForm.dueDate,
        customMessage: delegateForm.customMessage,
        createdAt: new Date().toISOString(),
        delegationType: delegationType,
        method: delegateMethod,
      }

      // Store in localStorage for the vendor assessment page to access
      const delegationKey = `delegation-${assessmentId}`
      localStorage.setItem(delegationKey, JSON.stringify(delegationInfo))

      // Send the actual email using the existing email service
      const emailResult = await sendAssessmentEmail({
        vendorName: delegationType === "third-party" ? delegateForm.companyName : "Internal Team",
        vendorEmail: delegateForm.recipientEmail,
        contactPerson: delegateForm.recipientName,
        assessmentType: assessmentTypeWithMethod,
        dueDate: delegateForm.dueDate,
        customMessage:
          delegateForm.customMessage ||
          `You have been assigned to complete the ${assessmentTypeWithMethod} assessment${
            delegationType === "third-party" ? " for your organization" : " for our organization"
          }.`,
        assessmentId: assessmentId,
        companyName: delegationType === "third-party" ? "Your Organization" : "Your Organization",
      })

      const newDelegation = {
        id: `delegation-${Date.now()}`,
        assessmentType: assessmentTypeWithMethod,
        recipientName: delegateForm.recipientName,
        recipientEmail: delegateForm.recipientEmail,
        companyName: delegateForm.companyName,
        dueDate: delegateForm.dueDate,
        customMessage: delegateForm.customMessage,
        status: "pending",
        sentDate: new Date().toISOString(),
        delegatedBy: "Current User",
        assessmentId: assessmentId,
        emailResult: emailResult,
        delegationType: delegationType,
        method: delegateMethod,
      }

      const delegated = [...delegatedAssessments, newDelegation]
      localStorage.setItem("delegatedAssessments", JSON.stringify(delegated))
      setDelegatedAssessments(delegated)

      setDelegateForm({
        assessmentType: "",
        recipientName: "",
        recipientEmail: "",
        companyName: "",
        dueDate: "",
        customMessage: "",
      })
      setShowDelegateForm(false)
      setDelegateStep("choose-type")
      setDelegationType(null)
      setDelegateMethod(null)

      // Show the actual email result message
      const alertMessage = `Assessment delegation created successfully!

${emailResult.message}`

      if (emailResult.success) {
        alert(alertMessage)
      } else {
        alert(`Assessment delegation created but email delivery failed:

${emailResult.message}`)
      }
    } catch (error) {
      console.error("Error sending delegation:", error)
      alert("Failed to send assessment delegation. Please try again.")
    }
  }

  const downloadRegularReport = () => {
    if (!riskResults || !currentCategory) return

    const getRiskLevelColorForReport = (level: string) => {
      switch (level.toLowerCase()) {
        case "low":
          return "#16a34a" // green-600
        case "medium":
          return "#ca8a04" // yellow-600
        case "medium-high":
          return "#ea580c" // orange-600
        case "high":
          return "#dc2626" // red-600
        default:
          return "#4b5563" // gray-600
      }
    }

    const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${riskResults.category} Risk Assessment Report</title>
  <style>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
      }
      
      body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: #f9fafb;
          padding: 20px;
      }
      
      .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
      }
      
      .header {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          padding: 40px;
          text-align: center;
      }
      
      .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
      }
      
      .header .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
      }
      
      .content {
          padding: 40px;
      }
      
      .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
      }
      
      .summary-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
      }
      
      .summary-card h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
      }
      
      .summary-card .value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
      }
      
      .risk-score {
          font-size: 3rem !important;
          color: ${getRiskLevelColorForReport(riskResults.level)};
      }
      
      .risk-level {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          color: white;
          background-color: ${getRiskLevelColorForReport(riskResults.level)};
      }
      
      .section {
          margin-bottom: 40px;
      }
      
      .section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
      }
      
      .question-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      }
      
      .question-header {
          margin-bottom: 20px;
      }
      
      .question-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
      }
      
      .question-meta {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
      }
      
      .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid;
      }
      
      .badge-outline {
          background: white;
          color: #6b7280;
          border-color: #d1d5db;
      }
      
      .answer-section {
          background: #f8fafc;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 16px;
      }
      
      .section-title {
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 0.875rem;
      }
      
      .user-answer {
          background: #dbeafe;
          border: 1px solid #3b82f6;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
      }
      
      .user-answer .answer-text {
          font-weight: 600;
          color: #1e40af;
      }
      
      .additional-info {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 12px;
      }
      
      .additional-info-text {
          font-size: 0.875rem;
          color: #374151;
          font-style: italic.
      }
      
      .recommendations-list {
          list-style: none;
          padding: 0;
      }
      
      .recommendations-list li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          padding: 12px;
          border-radius: 6px;
          background: #f0fdf4;
          border: 1px solid #16a34a;
      }
      
      .list-icon {
          margin-right: 12px;
          margin-top: 2px;
          flex-shrink: 0;
          color: #16a34a;
      }
      
      .disclaimer {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin-top: 40px;
      }
      
      .disclaimer h3 {
          color: #92400e;
          margin-bottom: 10px;
      }
      
      .disclaimer p {
          color: #92400e;
          font-size: 0.875rem;
      }
      
      .soc-info {
          background: #eff6ff;
          border: 1px solid #3b82f6;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 40px;
      }
      
      .soc-info h3 {
          color: #1e40af;
          margin-bottom: 15px;
      }
      
      .soc-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
      }
      
      .soc-info-item {
          background: white;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #bfdbfe;
      }
      
      .soc-info-item strong {
          color: #1e40af;
          font-size: 0.875rem;
      }
      
      @media print {
          body {
              background: white;
              padding: 0;
          }
          
          .container {
              box-shadow: none;
              border-radius: 0;
          }
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <h1>${riskResults.category} Risk Assessment Report</h1>
          <div class="subtitle">Manual Risk Assessment • Generated ${new Date().toLocaleDateString()}</div>
      </div>
      
      <div class="content">
          <!-- Summary Section -->
          <div class="summary-grid">
              <div class="summary-card">
                  <h3>Risk Score</h3>
                  <div class="value risk-score">${riskResults.score}%</div>
              </div>
              <div class="summary-card">
                  <h3>Risk Level</h3>
                  <div class="value">
                      <span class="risk-level">${riskResults.level} Risk</span>
                  </div>
              </div>
              <div class="summary-card">
                  <h3>Assessment Type</h3>
                  <div class="value">${riskResults.category}</div>
              </div>
              <div class="summary-card">
                  <h3>Completion Date</h3>
                  <div class="value">${new Date().toLocaleDateString()}</div>
              </div>
          </div>
          
          ${
            riskResults.socInfo
              ? `
          <!-- SOC Information Section -->
          <div class="soc-info">
              <h3>SOC Assessment Information</h3>
              <div class="soc-info-grid">
                  <div class="soc-info-item">
                      <strong>SOC Type:</strong><br>${riskResults.socInfo.socType}
                  </div>
                  <div class="soc-info-item">
                      <strong>Report Type:</strong><br>${riskResults.socInfo.reportType}
                  </div>
                  <div class="soc-info-item">
                      <strong>Auditor:</strong><br>${riskResults.socInfo.auditor}
                  </div>
                  <div class="soc-info-item">
                      <strong>Auditor Opinion:</strong><br>${riskResults.socInfo.auditorOpinion}
                  </div>
                  <div class="soc-info-item">
                      <strong>Company:</strong><br>${riskResults.socInfo.companyName}
                  </div>
                  <div class="soc-info-item">
                      <strong>Product/Service:</strong><br>${riskResults.socInfo.productService}
                  </div>
              </div>
              ${
                riskResults.socInfo.trustServiceCriteria && riskResults.socInfo.trustServiceCriteria.length > 0
                  ? `
              <div style="margin-top: 15px;">
                  <strong>Trust Service Criteria Included:</strong><br>
                  <div style="background: white; padding: 10px; border-radius: 4px; border: 1px solid #bfdbfe; margin-top: 5px;">
                      ${riskResults.socInfo.trustServiceCriteria.join(", ")}
                  </div>
              </div>
              `
                  : ""
              }
              ${
                riskResults.socInfo.subserviceOrganizations
                  ? `
              <div style="margin-top: 15px;">
                  <strong>Subservice Organizations:</strong><br>
                  <div style="background: white; padding: 10px; border-radius: 4px; border: 1px solid #bfdbfe; margin-top: 5px;">
                      ${riskResults.socInfo.subserviceOrganizations}
                  </div>
              </div>
              `
                  : ""
              }
          </div>
          `
              : ""
          }
          
          <!-- Assessment Questions -->
          <div class="section">
              <h2>Assessment Questions & Responses</h2>
              ${currentCategory.questions
                .map((question, index) => {
                  const answer = answers[question.id]
                  const additionalInfo = answers[`${question.id}_additional`]

                  return `
                  <div class="question-card">
                      <div class="question-header">
                          <div class="question-title">${index + 1}. ${question.question}</div>
                          <div class="question-meta">
                              <span class="badge badge-outline">Weight: ${question.weight}</span>
                              <span class="badge badge-outline">Type: ${question.type === "boolean" ? "Yes/No" : question.type === "tested" ? "Tested/Not Tested" : "Multiple Choice"}</span>
                          </div>
                      </div>
                      
                      <div class="answer-section">
                          <div class="section-title">Your Answer</div>
                          <div class="user-answer">
                              <div class="answer-text">
                                  ${
                                    question.type === "boolean"
                                      ? answer
                                        ? "Yes"
                                        : "No"
                                      : question.type === "tested"
                                        ? (
                                            answer === "tested"
                                              ? "Tested"
                                              : answer === "not_tested"
                                                ? "Not Tested"
                                                : "Not answered"
                                          )
                                        : answer || "Not answered"
                                  }
                              </div>
                          </div>
                          
                          ${
                            additionalInfo
                              ? `
                              <div class="section-title">Additional Information</div>
                              <div class="additional-info">
                                  <div class="additional-info-text">${additionalInfo}</div>
                              </div>
                          `
                              : ""
                          }
                      </div>
                  </div>
              `
                })
                .join("")}
          </div>
          
          <!-- Recommendations -->
          <div class="section">
              <h2>Recommendations</h2>
              <ul class="recommendations-list">
                  ${riskResults.recommendations
                    .map(
                      (recommendation: string, index: number) => `
                      <li>
                          <span class="list-icon">✅</span>
                          <span>${recommendation}</span>
                      </li>
                  `,
                    )
                    .join("")}
              </ul>
          </div>
          
          <!-- Disclaimer -->
          <div class="disclaimer">
              <h3>⚠️ Important Disclaimer</h3>
              <p>This assessment should be reviewed by qualified professionals and used as part of a comprehensive risk management program.</p>
          </div>
      </div>
      
      <div class="footer">
          <div>Report generated by RiskGuard AI - Risk Assessment Platform</div>
          <div>Assessment ID: ${Date.now()} • Generation Date: ${new Date().toISOString()}</div>
      </div>
  </div>
</body>
</html>
  `.trim()

    const blob = new Blob([htmlReport], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${riskResults.category.replace(/\s+/g, "_")}_Risk_Assessment_Report_${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Sign up to save assessments and access full AI features"
    >
      <div className="min-h-screen bg-white">
        {/* Header - Removed */}

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                {isDelegatedAssessment ? "Delegated Assessment" : "Risk Assessment"}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                {isDelegatedAssessment ? "Complete Your" : "Internal Risk"}
                <br />
                <span className="text-blue-600">{isDelegatedAssessment ? "Assigned Assessment" : "Assessment"}</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                {isDelegatedAssessment
                  ? `Complete the ${delegatedAssessmentInfo?.assessmentType} assessment that was assigned to you.`
                  : "Comprehensive internal risk assessment tools for your organization."}
              </p>
              {isDelegatedAssessment && delegatedAssessmentInfo && (
                <div className="mt-6 max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-800">
                    <p>
                      <strong>Assessment Type:</strong> {delegatedAssessmentInfo.assessmentType}
                    </p>
                    <p>
                      <strong>Delegation Type:</strong>{" "}
                      {delegatedAssessmentInfo.delegationType === "team" ? "Team Member" : "Third-Party"}
                    </p>
                    <p>
                      <strong>Method:</strong> {delegatedAssessmentInfo.method === "ai" ? "AI-Powered" : "Manual"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Step 1: Select Assessment Category */}
          {currentStep === "select" && (
            <>
              {/* Assessment Categories */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Assessments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assessmentCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Card key={category.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                          </div>
                          <CardDescription>{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-sm text-gray-600">
                              <strong>{category.questions.length}</strong> questions
                            </div>
                            <div className="space-y-2">
                              <Button
                                onClick={() => handleStartAssessment(category.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Start Assessment
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleDelegateAssessment(category.id)}
                                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Delegate Assessment
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Saved Assessments */}
                  {savedAssessments.length > 0 && (
                    <div className="mb-12">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Saved Assessments</h2>
                        <Button
                          variant="outline"
                          onClick={() => setShowSavedAssessments(!showSavedAssessments)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {showSavedAssessments ? "Hide" : "Show"} Saved ({savedAssessments.length})
                        </Button>
                      </div>

                      {showSavedAssessments && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {savedAssessments.map((saved) => (
                            <Card key={saved.id} className="border border-yellow-200 bg-yellow-50">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                    <CardTitle className="text-lg text-yellow-900">{saved.categoryName}</CardTitle>
                                  </div>
                                  <Badge className="bg-yellow-200 text-yellow-800">Draft</Badge>
                                </div>
                                <CardDescription className="text-yellow-700">
                                  Progress: {saved.currentQuestion + 1} of{" "}
                                  {assessmentCategories.find((cat) => cat.id === saved.category)?.questions.length}{" "}
                                  questions
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <Progress
                                    value={
                                      ((saved.currentQuestion + 1) /
                                        (assessmentCategories.find((cat) => cat.id === saved.category)?.questions.length ||
                                          1)) *
                                      100
                                    }
                                    className="h-2"
                                  />
                                  <div className="text-sm text-yellow-700">
                                    Last saved: {new Date(saved.timestamp).toLocaleString()}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => loadSavedAssessment(saved)}
                                      size="sm"
                                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                                    >
                                      Continue
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteSavedAssessment(saved.category)}
                                      className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delegated Assessments */}
                  {delegatedAssessments.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Delegated Assessments</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {delegatedAssessments.map((delegation) => (
                          <Card key={delegation.id} className="border border-purple-200 bg-purple-50">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {delegation.delegationType === "third-party" ? (
                                    <Building className="h-5 w-5 text-purple-600" />
                                  ) : (
                                    <Users className="h-5 w-5 text-purple-600" />
                                  )}
                                  <CardTitle className="text-lg text-purple-900">{delegation.assessmentType}</CardTitle>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                  <Badge className="bg-purple-200 text-purple-800">
                                    {delegation.status === "pending" ? "Pending" : "Completed"}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {delegation.method === "ai" ? "AI" : "Manual"}
                                  </Badge>
                                </div>
                              </div>
                              <CardDescription className="text-purple-700">
                                {delegation.delegationType === "third-party" ? "Third-Party" : "Team Member"}:{" "}
                                {delegation.recipientName}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-sm text-purple-700">
                                <div>Email: {delegation.recipientEmail}</div>
                                {delegation.companyName && <div>Company: {delegation.companyName}</div>}
                                {delegation.dueDate && <div>Due: {new Date(delegation.dueDate).toLocaleDateString()}</div>}
                                <div>Sent: {new Date(delegation.sentDate).toLocaleDateString()}</div>
                                {delegation.emailResult && (
                                  <div className="text-xs">
                                    Email Status:{" "}
                                    <span className={delegation.emailResult.success ? "text-green-600" : "text-red-600"}>
                                      {delegation.emailResult.success ? "Delivered" : "Failed"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Assessments */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Assessments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockAssessments.map((assessment) => (
                        <Card key={assessment.id} className="border border-gray-200">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{assessment.name}</CardTitle>
                              <Badge className={`${getStatusColor(assessment.status)}`}>
                                {assessment.status === "completed" ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                            <CardDescription>
                              {assessmentCategories.find((cat) => cat.id === assessment.category)?.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {assessment.status === "completed" && (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Risk Score:</span>
                                    <span className="font-semibold">{assessment.riskScore}%</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Risk Level:</span>
                                    <Badge className={`${getRiskLevelColor(assessment.riskLevel)}`}>
                                      {assessment.riskLevel}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Completed:</span>
                                    <span className="text-sm">{assessment.completedDate}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Recommendations:</span>
                                    <span className="text-sm">
                                      {assessment.implementedRecommendations}/{assessment.recommendations} implemented
                                    </span>
                                  </div>
                                </>
                              )}
                              <Button variant="outline" className="w-full bg-transparent">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Choose Assessment Method */}
              {currentStep === "choose-method" && currentCategory && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep("select")
                        setSelectedCategory(null)
                      }}
                      className="mb-6"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Assessment Selection
                    </Button>
                  </div>

                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Assessment Method</h2>
                    <p className="text-lg text-gray-600">
                      Selected: <span className="font-semibold text-blue-600">{currentCategory.name}</span>
                    </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={handleChooseManual}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <User className="h-8 w-8 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">Manual Assessment</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-6 text-base">
                          Complete the assessment manually by answering questions step by step. Full control over responses
                          with detailed explanations.
                        </CardDescription>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Step-by-step question flow
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Full control over answers
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Detailed explanations
                          </div>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <User className="mr-2 h-4 w-4" />
                          Start Manual Assessment
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={handleChooseAI}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Bot className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">AI Assessment</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-6 text-base">
                          Upload your documents and let AI analyze them automatically. Fast, comprehensive analysis with
                          evidence extraction.
                        </CardDescription>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Automated document analysis
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Evidence extraction
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Fast and comprehensive
                          </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Bot className="mr-2 h-4 w-4" />
                          Start AI Assessment
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 3: Manual Assessment in Progress */}
              {currentStep === "manual-assessment" && !assessmentCompleted && (
                <>
                  {/* SOC Information Collection - Show before questions if SOC assessment and not filled */}
                  {selectedCategory === "soc-compliance" && !socInfo.socType && (
                    <div className="max-w-3xl mx-auto mt-8">
                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle>SOC Assessment Information</CardTitle>
                          <CardDescription>
                            Please provide information about your SOC assessment requirements before proceeding
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="socType">SOC Type *</Label>
                                <select
                                  id="socType"
                                  className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:text-muted-foreground file:h-10 file:w-40"
                                  value={socInfo.socType}
                                  onChange={(e) => setSocInfo({ ...socInfo, socType: e.target.value })}
                                >
                                  <option value="">Select SOC Type</option>
                                  <option value="SOC 1 - Internal Controls over Financial Reporting">
                                    SOC 1 - Internal Controls over Financial Reporting
                                  </option>
                                  <option value="SOC 2 - Security, Availability, Processing Integrity, Confidentiality, Privacy">
                                    SOC 2 - Security, Availability, Processing Integrity, Confidentiality, Privacy
                                  </option>
                                  <option value="SOC 3 - General Use Report">SOC 3 - General Use Report</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="reportType">Report Type *</Label>
                                <select
                                  id="reportType"
                                  className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:text-muted-foreground file:h-10 file:w-40"
                                  value={socInfo.reportType}
                                  onChange={(e) => setSocInfo({ ...socInfo, reportType: e.target.value })}
                                >
                                  <option value="">Select Report Type</option>
                                  <option value="Type 1 - Design and Implementation">
                                    Type 1 - Design and Implementation
                                  </option>
                                  <option value="Type 2 - Design, Implementation, and Operating Effectiveness">
                                    Type 2 - Design, Implementation, and Operating Effectiveness
                                  </option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="auditor">Auditor/CPA Firm</Label>
                                <Input
                                  type="text"
                                  id="auditor"
                                  value={socInfo.auditor}
                                  onChange={(e) => setSocInfo({ ...socInfo, auditor: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="auditorOpinion">Expected Auditor Opinion</Label>
                                <select
                                  id="auditorOpinion"
                                  className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:text-muted-foreground file:h-10 file:w-40"
                                  value={socInfo.auditorOpinion}
                                  onChange={(e) => setSocInfo({ ...socInfo, auditorOpinion: e.target.value })}
                                >
                                  <option value="">Select Expected Opinion</option>
                                  <option value="Unqualified (Clean Opinion)">Unqualified (Clean Opinion)</option>
                                  <option value="Qualified">Qualified</option>
                                  <option value="Adverse">Adverse</option>
                                  <option value="Disclaimer">Disclaimer</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="testedStatus">Testing Status</Label>
                                <select
                                  id="testedStatus"
                                  className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:text-muted-foreground file:h-10 file:w-40"
                                  value={socInfo.testedStatus}
                                  onChange={(e) => setSocInfo({ ...socInfo, testedStatus: e.target.value })}
                                >
                                  <option value="">Select Testing Status</option>
                                  <option value="Tested">Tested</option>
                                  <option value="Untested">Untested</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="companyName">Company Name *</Label>
                              <Input
                                type="text"
                                id="companyName"
                                value={socInfo.companyName}
                                onChange={(e) => setSocInfo({ ...socInfo, companyName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="productService">Product/Service Being Assessed *</Label>
                              <Input
                                type="text"
                                id="productService"
                                value={socInfo.productService}
                                onChange={(e) => setSocInfo({ ...socInfo, productService: e.target.value })}
                              />
                            </div>

                            <div>
                              <Label>Trust Service Criteria Included in Report *</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {["Security", "Availability", "Processing Integrity", "Confidentiality", "Privacy"].map(
                                  (criteria) => (
                                    <label key={criteria} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={socInfo.trustServiceCriteria.includes(criteria)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSocInfo({
                                              ...socInfo,
                                              trustServiceCriteria: [...socInfo.trustServiceCriteria, criteria],
                                            })
                                          } else {
                                            setSocInfo({
                                              ...socInfo,
                                              trustServiceCriteria: socInfo.trustServiceCriteria.filter(
                                                (c) => c !== criteria,
                                              ),
                                            })
                                          }
                                        }}
                                        className="rounded border-gray-300"
                                      />
                                      <span className="text-sm">{criteria}</span>
                                    </label>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <Label htmlFor="subserviceOrganizations">Subservice Organizations</Label>
                            <Textarea
                              id="subserviceOrganizations"
                              value={socInfo.subserviceOrganizations}
                              onChange={(e) => setSocInfo({ ...socInfo, subserviceOrganizations: e.target.value })}
                            />
                          </div>

                          <div className="mt-6">
                            <Button onClick={() => setCurrentStep("manual-assessment")}>Continue to Questions</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Regular Assessment Questions - Show if not SOC or SOC info is filled */}
                  {(selectedCategory !== "soc-compliance" || socInfo.socType) && (
                    <div className="max-w-3xl mx-auto mt-8">
                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle>{currentCategory?.name} Assessment</CardTitle>
                          <CardDescription>
                            Question {currentQuestion + 1} of {currentCategory?.questions.length}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={Math.round(progress)} />
                          <div className="mt-4">
                            <Label htmlFor="question">
                              {currentQuestion + 1}. {currentQuestionData?.question}
                            </Label>
                            <div className="mt-2">
                              {currentQuestionData?.type === "boolean" ? (
                                <div className="flex space-x-4">
                                  <Button
                                    variant={answers[currentQuestionData.id] === true ? "default" : "outline"}
                                    onClick={() => handleAnswer(currentQuestionData.id, true)}
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    variant={answers[currentQuestionData.id] === false ? "default" : "outline"}
                                    onClick={() => handleAnswer(currentQuestionData.id, false)}
                                  >
                                    No
                                  </Button>
                                </div>
                              ) : currentQuestionData?.type === "tested" ? (
                                <div className="flex space-x-4">
                                  <Button
                                    variant={answers[currentQuestionData.id] === "tested" ? "default" : "outline"}
                                    onClick={() => handleAnswer(currentQuestionData.id, "tested")}
                                  >
                                    Tested
                                  </Button>
                                  <Button
                                    variant={answers[currentQuestionData.id] === "not_tested" ? "default" : "outline"}
                                    onClick={() => handleAnswer(currentQuestionData.id, "not_tested")}
                                  >
                                    Not Tested
                                  </Button>
                                  <p className="text-sm text-gray-500 mt-1">
                                    <strong>Tested</strong> means the control has been implemented and its effectiveness has
                                    been verified through testing.
                                  </p>
                                </div>
                              ) : (
                                <div className="grid gap-2">
                                  {currentQuestionData?.options?.map((option: string) => (
                                    <Button
                                      key={option}
                                      variant={answers[currentQuestionData.id] === option ? "default" : "outline"}
                                      onClick={() => handleAnswer(currentQuestionData.id, option)}
                                    >
                                      {option}
                                    </Button>
                                  ))}
                                </div>
                              )}

                              <div className="mt-4">
                                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                                <Textarea
                                  id="additionalInfo"
                                  value={answers[`${currentQuestionData?.id}_additional`] || ""}
                                  onChange={(e) => handleAnswer(`${currentQuestionData?.id}_additional`, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex justify-between">
                            <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                              Previous
                            </Button>
                            <Button onClick={handleNextQuestion}>
                              {currentQuestion === (currentCategory?.questions.length || 0) - 1 ? "Complete" : "Next"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
              )}

              {/* Assessment Completed */}
              {currentStep === "manual-assessment" && assessmentCompleted && (
                <div className="max-w-3xl mx-auto mt-12">
                  <Card className="border border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle>
                        <CheckCircle2 className="mr-2 h-6 w-6 inline-block align-middle" />
                        Assessment Complete!
                      </CardTitle>
                      <CardDescription>Your {riskResults?.category} has been completed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-700">{riskResults?.recommendations.length}</div>
                          <div className="text-sm text-gray-600">Recommendations</div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h3>
                        <ul className="list-disc pl-5">
                          {riskResults?.recommendations.map((recommendation: string, index: number) => (
                            <li key={index} className="text-gray-700">
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-center">
                        <Button onClick={downloadRegularReport} className="mr-4">
                          Download Report
                        </Button>
                        <Button variant="outline" onClick={() => setCurrentStep("select")}>
                          Start New Assessment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Delegate Assessment Modal */}
              {showDelegateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                      <CardTitle>Delegate Assessment</CardTitle>
                      <CardDescription>
                        {delegateStep === "choose-type" && "Choose who will complete this assessment"}
                        {delegateStep === "choose-method" && "Choose the assessment method"}
                        {delegateStep === "form" && "Enter delegation details"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {delegateStep === "choose-type" && (
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <Button
                              variant="outline"
                              className="p-6 h-auto flex flex-col items-start space-y-2 bg-transparent"
                              onClick={() => handleDelegateTypeSelection("team")}
                            >
                              <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold">Team Member</span>
                              </div>
                              <span className="text-sm text-gray-600">Delegate to someone within your organization</span>
                            </Button>
                            <Button
                              variant="outline"
                              className="p-6 h-auto flex flex-col items-start space-y-2 bg-transparent"
                              onClick={() => handleDelegateTypeSelection("third-party")}
                            >
                              <div className="flex items-center space-x-2">
                                <Building className="h-5 w-5 text-purple-600" />
                                <span className="font-semibold">Third-Party</span>
                              </div>
                              <span className="text-sm text-gray-600">Delegate to an external vendor or partner</span>
                            </Button>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowDelegateForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {delegateStep === "choose-method" && (
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <Button
                              variant="outline"
                              className="p-6 h-auto flex flex-col items-start space-y-2 bg-transparent"
                              onClick={() => handleDelegateMethodSelection("manual")}
                            >
                              <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-green-600" />
                                <span className="font-semibold">Manual Assessment</span>
                              </div>
                              <span className="text-sm text-gray-600">Traditional question-by-question assessment</span>
                            </Button>
                            <Button
                              variant="outline"
                              className="p-6 h-auto flex flex-col items-start space-y-2 bg-transparent"
                              onClick={() => handleDelegateMethodSelection("ai")}
                            >
                              <div className="flex items-center space-x-2">
                                <Bot className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold">AI Assessment</span>
                              </div>
                              <span className="text-sm text-gray-600">AI-powered document analysis and assessment</span>
                            </Button>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setDelegateStep("choose-type")}>
                              Back
                            </Button>
                            <Button variant="outline" onClick={() => setShowDelegateForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {delegateStep === "form" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="recipientName">Recipient Name *</Label>
                            <Input
                              id="recipientName"
                              value={delegateForm.recipientName}
                              onChange={(e) => setDelegateForm({ ...delegateForm, recipientName: e.target.value })}
                              placeholder="Enter recipient's full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="recipientEmail">Recipient Email *</Label>
                            <Input
                              id="recipientEmail"
                              type="email"
                              value={delegateForm.recipientEmail}
                              onChange={(e) => setDelegateForm({ ...delegateForm, recipientEmail: e.target.value })}
                              placeholder="Enter recipient's email address"
                            />
                          </div>
                          {delegationType === "third-party" && (
                            <div>
                              <Label htmlFor="companyName">Company Name *</Label>
                              <Input
                                id="companyName"
                                value={delegateForm.companyName}
                                onChange={(e) => setDelegateForm({ ...delegateForm, companyName: e.target.value })}
                                placeholder="Enter company name"
                              />
                            </div>
                          )}
                          <div>
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={delegateForm.dueDate}
                              onChange={(e) => setDelegateForm({ ...delegateForm, dueDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="customMessage">Custom Message</Label>
                            <Textarea
                              id="customMessage"
                              value={delegateForm.customMessage}
                              onChange={(e) => setDelegateForm({ ...delegateForm, customMessage: e.target.value })}
                              placeholder="Add any additional instructions or context..."
                              rows={3}
                            />
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Assessment Details</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                              <p>
                                <strong>Type:</strong> {delegateForm.assessmentType}
                              </p>
                              <p>
                                <strong>Method:</strong> {delegateMethod === "ai" ? "AI-Powered" : "Manual"}
                              </p>
                              <p>
                                <strong>Delegation:</strong> {delegationType === "team" ? "Team Member" : "Third-Party"}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setDelegateStep("choose-method")}>
                              Back
                            </Button>
                            <Button variant="outline" onClick={() => setShowDelegateForm(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSendDelegation}>
                              <Send className="mr-2 h-4 w-4" />
                              Send Delegation
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}