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
  CheckCircle2,
} from "lucide-react"
// import { MainNavigation } from "@/components/main-navigation" // Removed import
import { AuthGuard } from "@/components/auth-guard"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { sendAssessmentEmail } from "@/app/third-party-assessment/email-service"
import { getCurrentUserWithProfile } from "@/lib/auth-service" // Import for server-side user context

// Assessment categories and questions
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
        type: "multiple",
        options: ["Yes, comprehensive policy", "Yes, basic policy", "In development", "No"],
        weight: 10,
      },
      {
        id: "cyber_2",
        question: "How do you manage user access to systems and data?",
        type: "multiple",
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
        type: "boolean",
        weight: 10,
      },
      {
        id: "cyber_4",
        question: "What encryption standards do you use for data at rest and in transit?",
        type: "multiple",
        options: ["AES-256 and TLS 1.3", "AES-128 and TLS 1.2", "Basic encryption", "No encryption"],
        weight: 10,
      },
      {
        id: "cyber_5",
        question: "How often do you conduct security awareness training?",
        type: "multiple",
        options: ["Monthly", "Quarterly", "Annually", "As needed", "Never"],
        weight: 10,
      },
      {
        id: "cyber_6",
        question: "Describe your vulnerability assessment and patch management process:",
        type: "boolean",
        weight: 10,
      },
      {
        id: "cyber_7",
        question: "Do you have a written Information Security Policy (ISP)?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_8",
        question: "How often do you review and update your Information Security Policy?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
      },
      {
        id: "cyber_9",
        question: "Do you have a designated person responsible for Information Security Policy?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_10",
        question: "Do you have data privacy compliance monitoring procedures in place?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_11",
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_12",
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_13",
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_14",
        question: "Do you have an IT asset management program?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_15",
        question: "Do you have restrictions on storage devices?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_16",
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_17",
        question: "Do you implement network segmentation?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_18",
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_19",
        question: "How frequently do you conduct vulnerability scanning?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 10,
      },
      {
        id: "cyber_20",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
      },
      {
        id: "cyber_21",
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "multiple",
        options: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST", "None"],
        weight: 10,
      },
      {
        id: "cyber_22",
        question: "Do you have a formal access control policy?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_23",
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_24",
        question: "Do you have defined password parameters and requirements?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_25",
        question: "Do you implement least privilege access principles?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_26",
        question: "How frequently do you conduct access reviews?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 10,
      },
      {
        id: "cyber_27",
        question: "Do you require device authentication for network access?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_28",
        question: "Do you have secure remote logical access controls?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_29",
        question: "Do you have a third-party oversight program?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_30",
        question: "Do you assess third-party security controls?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_31",
        question: "Do you verify third-party compliance controls?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_32",
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_33",
        question: "Do you provide information security training to employees?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_34",
        question: "Do you provide privacy training to employees?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_35",
        question: "Do you provide role-specific compliance training?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_36",
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_37",
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_38",
        question: "Do you have a data management program?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_39",
        question: "Do you have a published privacy policy?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_40",
        question: "Do you have consumer data retention policies?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_41",
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_42",
        question: "Do you have data breach protocols?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_43",
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean",
        options: ["Yes", "No"],
        weight: 10,
      },
      {
        id: "cyber_44",
        question: "Do you collect NPI, PII, or PHI data?",
        type: "boolean",
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
        type: "boolean",
        weight: 10,
      },
      {
        id: "rc2",
        question: "How often do you review and update compliance policies?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "rc3",
        question: "Do you have a dedicated compliance officer?",
        type: "boolean",
        weight: 7,
      },
      {
        id: "rc4",
        question: "How frequently do you conduct compliance audits?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "rc5",
        question: "Do you maintain proper documentation for all compliance activities?",
        type: "boolean",
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
        type: "boolean",
        weight: 8,
      },
      {
        id: "or2",
        question: "How often do you review and update operational procedures?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "or3",
        question: "Do you have adequate segregation of duties in place?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "or4",
        question: "How frequently do you conduct operational risk assessments?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 8,
      },
      {
        id: "or5",
        question: "Do you have a business continuity plan?",
        type: "boolean",
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
        type: "boolean",
        weight: 10,
      },
      {
        id: "bc2",
        question: "How frequently do you review and update your BCM program?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2-3 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "bc3",
        question: "Does your BCM program have executive oversight and sponsorship?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc4",
        question: "How often do you conduct BCM training for employees?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "bc5",
        question: "Do you monitor system capacity and availability on an ongoing basis?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc6",
        question: "Do you have adequate physical security controls for critical facilities?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc7",
        question: "Do you have environmental security controls (fire suppression, climate control, etc.)?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc8",
        question: "Do you have redundant telecommunications infrastructure to handle failures?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc9",
        question: "How frequently do you perform equipment maintenance and firmware updates?",
        type: "multiple",
        options: ["Never", "As needed only", "Annually", "Semi-annually", "Quarterly"],
        weight: 8,
      },
      {
        id: "bc10",
        question: "Do you have backup power systems (UPS/generators) for critical operations?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc11",
        question: "Do you have comprehensive data protection (firewall, anti-virus, encryption)?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc12",
        question: "Do you have contingency plans for failures of critical third-party providers?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc13",
        question: "Do you conduct background checks on employees with access to critical systems?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc14",
        question: "Do you have adequate staffing depth and cross-training for critical functions?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc15",
        question: "Do you have a documented Disaster Recovery Plan separate from your BCM?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc16",
        question: "Do you have established internal and external communication protocols for crisis management?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc17",
        question: "Do you have communication procedures for planned system outages?",
        type: "boolean",
        weight: 7,
      },
      {
        id: "bc18",
        question: "Do you have a cybersecurity incident management plan?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc19",
        question: "Do you maintain appropriate business continuity insurance coverage?",
        type: "boolean",
        weight: 7,
      },
      {
        id: "bc20",
        question: "Do you have pandemic/health emergency continuity plans?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc21",
        question: "Do you have remote administration contingencies for critical systems?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc22",
        question: "Do you have proper source code management and version control systems?",
        type: "boolean",
        weight: 7,
      },
      {
        id: "bc23",
        question: "Have you identified and addressed any outdated systems that pose continuity risks?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc24",
        question: "How frequently do you backup critical business data?",
        type: "multiple",
        options: ["Never", "Monthly", "Weekly", "Daily", "Real-time/Continuous"],
        weight: 10,
      },
      {
        id: "bc25",
        question: "Have you conducted a formal Business Impact Analysis (BIA)?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc26",
        question: "Have you defined Recovery Point Objectives (RPO) for critical systems?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc27",
        question: "Have you defined Recovery Time Objectives (RTO) for critical systems?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc28",
        question: "How frequently do you test your BCM/DR plans?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
      },
      {
        id: "bc29",
        question: "How frequently do you test your incident response procedures?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "bc30",
        question: "How frequently do you test your data backup and recovery procedures?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
      },
      {
        id: "bc31",
        question: "Do you document and analyze the results of your BC/DR testing?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc32",
        question: "Do you have independent audits of your BC/DR plan testing conducted?",
        type: "boolean",
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
        type: "boolean",
        weight: 10,
      },
      {
        id: "fs2",
        question: "How often do you conduct anti-money laundering (AML) training?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "fs3",
        question: "Do you have a comprehensive Know Your Customer (KYC) program?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "fs4",
        question: "How frequently do you review and update your credit risk policies?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "fs5",
        question: "Do you maintain adequate capital reserves as required by regulators?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "fs6",
        question: "Are you compliant with consumer protection regulations (e.g., CFPB guidelines)?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "fs7",
        question: "How often do you conduct stress testing on your financial portfolios?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
      },
      {
        id: "fs8",
        question: "Do you have proper segregation of client funds and assets?",
        type: "boolean",
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
        type: "boolean",
        weight: 10,
      },
      {
        id: "dp2",
        question: "How often do you conduct data privacy impact assessments?",
        type: "multiple",
        options: ["Never", "As needed only", "Annually", "Semi-annually", "For all new projects"],
        weight: 9,
      },
      {
        id: "dp3",
        question: "Do you have documented data retention and deletion policies?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "dp4",
        question: "How do you handle data subject access requests?",
        type: "multiple",
        options: ["No formal process", "Manual process", "Semi-automated", "Fully automated", "Comprehensive system"],
        weight: 8,
      },
      {
        id: "dp5",
        question: "Do you have a designated Data Protection Officer (DPO)?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "dp6",
        question: "Are all third-party data processors properly vetted and contracted?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "dp7",
        question: "How often do you provide data privacy training to employees?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "dp8",
        question: "Do you maintain records of all data processing activities?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "dp9",
        question: "Have you implemented privacy by design principles in your systems?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "dp10",
        question: "Do you have a written Information Security Policy (ISP)?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "dp11",
        question: "How often do you review and update your Information Security Policy?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "dp12",
        question: "Do you have a designated person responsible for Information Security Policy?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "dp13",
        question: "Do you have data privacy compliance monitoring procedures in place?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp14",
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp15",
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp16",
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp17",
        question: "Do you have an IT asset management program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp18",
        question: "Do you have restrictions on storage devices?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp19",
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp20",
        question: "Do you implement network segmentation?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp21",
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp22",
        question: "How frequently do you conduct vulnerability scanning?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp23",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        required: true,
      },
      {
        id: "dp24",
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "multiple",
        options: ["None", "ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST"],
        required: true,
      },
      {
        id: "dp25",
        question: "Do you have a formal access control policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp26",
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp27",
        question: "Do you have defined password parameters and requirements?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp28",
        question: "Do you implement least privilege access principles?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp29",
        question: "How frequently do you conduct access reviews?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp30",
        question: "Do you require device authentication for network access?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp31",
        question: "Do you have secure remote logical access controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp32",
        question: "Do you have a third-party oversight program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp33",
        question: "Do you assess third-party security controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp34",
        question: "Do you verify third-party compliance controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp35",
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp36",
        question: "Do you provide information security training to employees?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp37",
        question: "Do you provide privacy training to employees?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp38",
        question: "Do you provide role-specific compliance training?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp39",
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp40",
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp41",
        question: "Do you have a data management program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp42",
        question: "Do you have a published privacy policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp43",
        question: "Do you have consumer data retention policies?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp44",
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp45",
        question: "Do you have data breach protocols?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp46",
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp47",
        question: "Do you collect NPI, PII, or PHI data?",
        type: "boolean",
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
        type: "boolean",
        weight: 9,
      },
      {
        id: "is2",
        question: "How often do you update and patch your server infrastructure?",
        type: "multiple",
        options: ["Never", "As needed only", "Monthly", "Weekly", "Automated/Real-time"],
        weight: 10,
      },
      {
        id: "is3",
        question: "Do you have intrusion detection and prevention systems (IDS/IPS) deployed?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "is4",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "is5",
        question: "Are all administrative accounts protected with privileged access management?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "is6",
        question: "Do you have comprehensive logging and monitoring for all critical systems?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "is7",
        question: "How often do you review and update firewall rules?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "is8",
        question: "Do you have secure configuration standards for all infrastructure components?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "is9",
        question: "Are all data transmissions encrypted both in transit and at rest?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "is10",
        question: "Do you have a formal vulnerability management program?",
        type: "boolean",
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
        type: "tested",
        weight: 10,
      },
      {
        id: "soc2",
        question: "Are there documented policies and procedures for all SOC-relevant control activities?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc3",
        question: "Has management established a risk assessment process to identify and evaluate risks?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc4",
        question: "Are control objectives clearly defined and communicated throughout the organization?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc5",
        question: "Is there a formal process for monitoring and evaluating control effectiveness?",
        type: "tested",
        weight: 9,
      },

      // Security Controls
      {
        id: "soc6",
        question: "Are logical access controls implemented to restrict access to systems and data?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc7",
        question: "Is user access provisioning and deprovisioning performed in a timely manner?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc8",
        question: "Are privileged access rights regularly reviewed and approved?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc9",
        question: "Is multi-factor authentication implemented for all critical systems?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc10",
        question: "Are password policies enforced and regularly updated?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc11",
        question: "Is data encryption implemented for data at rest and in transit?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc12",
        question: "Are security incident response procedures documented and tested?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc13",
        question: "Is vulnerability management performed regularly with timely remediation?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc14",
        question: "Are network security controls (firewalls, IDS/IPS) properly configured and monitored?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc15",
        question: "Is physical access to data centers and facilities properly controlled?",
        type: "tested",
        weight: 8,
      },

      // Availability Controls
      {
        id: "soc16",
        question: "Are system capacity and performance monitored to ensure availability?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc17",
        question: "Is there a documented business continuity and disaster recovery plan?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc18",
        question: "Are backup and recovery procedures regularly tested?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc19",
        question: "Is system availability monitored with appropriate alerting mechanisms?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc20",
        question: "Are change management procedures in place for system modifications?",
        type: "tested",
        weight: 9,
      },

      // Processing Integrity Controls
      {
        id: "soc21",
        question: "Are data processing controls implemented to ensure completeness and accuracy?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc22",
        question: "Is data input validation performed to prevent processing errors?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc23",
        question: "Are automated controls in place to detect and prevent duplicate transactions?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc24",
        question: "Is data processing monitored for exceptions and errors?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc25",
        question: "Are reconciliation procedures performed to ensure data integrity?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc25a",
        question:
          "Are processing authorization controls in place to ensure only authorized transactions are processed?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc25b",
        question: "Are processing controls implemented to ensure processing completeness and accuracy?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc25c",
        question: "Are processing controls designed to ensure timely processing of transactions?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc25d",
        question: "Are processing issues properly escalated, tracked, and addressed in a timely manner?",
        type: "tested",
        weight: 9,
      },

      // Confidentiality Controls
      {
        id: "soc26",
        question: "Are confidentiality agreements in place with employees and third parties?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc27",
        question: "Is sensitive data classified and handled according to its classification?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc28",
        question: "Are data retention and disposal policies implemented and followed?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc29",
        question: "Is access to confidential information restricted on a need-to-know basis?",
        type: "tested",
        weight: 9,
      },

      // Privacy Controls
      {
        id: "soc30",
        question: "Are privacy policies and procedures documented and communicated?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc31",
        question: "Is personal information collected, used, and disclosed in accordance with privacy policies?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc32",
        question: "Are individuals provided with notice about data collection and use practices?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc33",
        question: "Is consent obtained for the collection and use of personal information where required?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc34",
        question: "Are data subject rights (access, correction, deletion) supported and processed?",
        type: "tested",
        weight: 9,
      },

      // Monitoring and Logging
      {
        id: "soc35",
        question: "Are system activities logged and monitored for security events?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc36",
        question: "Is log data protected from unauthorized access and modification?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc37",
        question: "Are logs regularly reviewed for suspicious activities?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc38",
        question: "Is there a centralized logging system for security monitoring?",
        type: "tested",
        weight: 8,
      },

      // Third-Party Management
      {
        id: "soc39",
        question: "Are third-party service providers evaluated for SOC compliance?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc40",
        question: "Are contracts with service providers reviewed for appropriate control requirements?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc41",
        question: "Is third-party performance monitored against contractual requirements?",
        type: "tested",
        weight: 8,
      },

      // Training and Awareness
      {
        id: "soc42",
        question: "Is security and compliance training provided to all relevant personnel?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc43",
        question: "Are employees made aware of their roles and responsibilities for SOC compliance?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc44",
        question: "Is ongoing training provided to keep personnel current with policies and procedures?",
        type: "tested",
        weight: 7,
      },

      // Management Review and Oversight
      {
        id: "soc45",
        question: "Does management regularly review control effectiveness and compliance status?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc46",
        question: "Are control deficiencies identified, documented, and remediated in a timely manner?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc47",
        question: "Is there a formal process for management to approve significant changes to controls?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc48",
        question: "Are internal audits performed to assess control effectiveness?",
        type: "tested",
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
                  <div style="background: white; padding: 10px; border<dyad-problem-report summary="2565 problems">
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2519" column="28" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2541" column="24" code="1005">';' expected.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2723" column="20" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2724" column="19" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2725" column="16" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="3296" column="15" code="17015">Expected corresponding closing tag for JSX fragment.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="3296" column="18" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="3299" column="9" code="17002">Expected corresponding JSX closing tag for 'AuthGuard'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="3300" column="5" code="1005">')' expected.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="3301" column="3" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="2507" column="28" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="2529" column="24" code="1005">';' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="2711" column="20" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="2712" column="19" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="2713" column="16" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3284" column="15" code="17015">Expected corresponding closing tag for JSX fragment.</problem>
<problem file="app/risk-assessment/page.tsx" line="3284" column="18" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3287" column="9" code="17002">Expected corresponding JSX closing tag for 'AuthGuard'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3288" column="5" code="1005">')' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3289" column="3" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="28" column="6" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="624" column="8" code="17008">JSX element 'section' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="625" column="10" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="633" column="12" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="635" column="14" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="636" column="16" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="783" column="18" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="784" column="20" code="17008">JSX element 'Card' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="785" column="22" code="17008">JSX element 'CardHeader' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="786" column="24" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="788" column="65" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="814" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="816" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="821" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="823" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="825" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="829" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="830" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="831" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="833" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="837" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="842" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="844" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="846" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="850" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="852" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="857" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="859" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="861" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="865" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="867" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="872" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="874" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="876" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="880" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="882" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="887" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="889" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="891" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="895" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="897" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="900" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="902" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="905" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="907" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="909" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="911" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="915" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="917" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="918" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="922" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="924" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="925" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="926" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="928" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="930" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="932" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="934" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="936" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="938" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="940" column="83" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="944" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="946" column="84" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1070" column="82" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1071" column="94" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1071" column="169" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1071" column="251" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1071" column="396" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1071" column="398" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1071" column="413" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1072" column="121" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="141" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="143" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1072" column="159" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="208" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1072" column="223" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="303" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="305" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1072" column="320" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1073" column="95" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="130" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="166" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="224" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1073" column="234" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="268" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1073" column="274" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1073" column="319" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1073" column="401" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="546" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="548" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1073" column="563" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1074" column="121" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="141" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="143" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1074" column="161" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="199" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1074" column="214" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="294" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="296" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1074" column="311" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1075" column="95" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1075" column="170" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1075" column="252" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1075" column="397" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1075" column="399" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1075" column="414" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1076" column="121" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="141" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="143" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1076" column="159" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="208" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1076" column="223" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="303" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="305" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1076" column="320" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1077" column="94" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1077" column="169" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1077" column="251" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1077" column="396" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1077" column="398" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1077" column="413" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1078" column="121" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="141" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="143" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1078" column="159" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="208" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1078" column="223" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="303" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="305" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1078" column="320" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1079" column="94" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1079" column="169" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1079" column="251" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1079" column="396" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1079" column="398" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1079" column="413" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1080" column="121" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="141" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="143" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1080" column="159" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="208" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1080" column="223" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="303" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="305" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1080" column="320" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1083" column="82" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1083" column="220" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1083" column="240" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1083" column="346" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1083" column="361" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1089" column="82" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1089" column="220" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1089" column="240" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1089" column="346" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1089" column="361" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1104" column="84" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1104" column="194" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1120" column="128" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1120" column="131" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1120" column="312" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1698" column="143" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="234" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1698" column="242" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="334" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1698" column="342" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="432" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1698" column="458" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="460" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1699" column="50" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1699" column="120" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1723" column="136" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1723" column="488" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1723" column="764" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1723" column="777" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1723" column="779" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1725" column="36" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1725" column="312" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1725" column="371" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1726" column="19" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1726" column="368" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1726" column="644" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1727" column="147" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1727" column="423" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1729" column="58" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1729" column="334" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1730" column="79" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1730" column="355" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1740" column="109" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1740" column="390" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1741" column="13" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1741" column="294" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1742" column="15" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1742" column="296" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1744" column="98" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1744" column="352" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1744" column="354" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1744" column="357" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1749" column="105" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1749" column="155" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1751" column="105" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1751" column="155" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1827" column="2" code="17008">JSX element 'dyad-write' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1834" column="20" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1834" column="33" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1841" column="23" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1842" column="24" code="17008">JSX element 'HTMLParagraphElement' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1843" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1843" column="17" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1843" column="26" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1843" column="35" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1844" column="3" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1854" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1858" column="38" code="1145">'{' or JSX element expected.</problem>
<problem file="app/solutions/page.tsx" line="1858" column="49" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1859" column="27" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1859" column="53" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1860" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1862" column="32" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1862" column="39" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1862" column="43" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1863" column="3" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1864" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1866" column="45" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1866" column="47" code="1005">'...' expected.</problem>
<problem file="app/solutions/page.tsx" line="1866" column="49" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1866" column="58" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1866" column="71" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1871" column="17" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1872" column="24" code="17008">JSX element 'HTMLDivElement' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1873" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1873" column="17" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1873" column="26" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1873" column="35" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1874" column="3" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1881" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1885" column="47" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1886" column="55" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1886" column="60" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1887" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1887" column="17" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1887" column="26" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1887" column="35" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1888" column="3" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1898" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1902" column="23" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1903" column="24" code="17008">JSX element 'HTMLParagraphElement' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1904" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1904" column="27" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1904" column="36" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1904" column="45" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1905" column="3" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1909" column="5" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1910" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1922" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1926" column="32" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1927" column="34" code="17008">JSX element 'typeof' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1928" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1928" column="24" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1929" column="3" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1942" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1946" column="38" code="1145">'{' or JSX element expected.</problem>
<problem file="app/solutions/page.tsx" line="1946" column="49" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1947" column="27" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1947" column="53" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1948" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1948" column="43" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1948" column="56" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1948" column="63" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1948" column="64" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1950" column="33" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1950" column="38" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1951" column="16" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1951" column="90" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1951" column="95" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1952" column="55" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1952" column="63" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1955" column="7" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1955" column="19" code="17008">JSX element 'FieldValues' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1959" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1962" column="5" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1963" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1965" column="26" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="1966" column="3" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1976" column="5" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="1976" column="58" code="17008">JSX element 'FormField' has no corresponding closing tag.</problem>
<problem file="app/solutions/page.tsx" line="1977" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1979" column="13" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1979" column="26" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1985" column="22" code="1005">'}' expected.</problem>
<problem file="app/solutions/page.tsx" line="1988" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1989" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/solutions/page.tsx" line="1991" column="68" code="1003">Identifier expected.</problem>
<problem file="app/solutions/page.tsx" line="1991" column="79" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/solutions/page.tsx" line="2004" column="1" code="1109">Expression expected.</problem>
<problem file="app/solutions/page.tsx" line="2004" column="2" code="1005">'&lt;/' expected.</problem>
<problem file="lib/usage-tracking.ts" line="87" column="13" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { onConflict?: string | undefined; ignoreDuplicates?: boolean | undefined; count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ ...; }, ... 5 more ..., &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ session_id: string; user_agent: string | undefined; referrer: string | undefined; utm_source: string | undefined; utm_medium: string | undefined; utm_campaign: string | undefined; last_activity: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { onConflict?: string | undefined; ignoreDuplicates?: boolean | undefined; count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;...&gt;', gave the following error.
    Argument of type '{ session_id: string; user_agent: string | undefined; referrer: string | undefined; utm_source: string | undefined; utm_medium: string | undefined; utm_campaign: string | undefined; last_activity: string; }' is not assignable to parameter of type 'never[]'.
      Object literal may only specify known properties, and 'session_id' does not exist in type 'never[]'.</problem>
<problem file="lib/usage-tracking.ts" line="125" column="54" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;page_views&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type 'PageViewData' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;page_views&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type 'PageViewData' is not assignable to parameter of type 'never[]'.
      Type 'PageViewData' is missing the following properties from type 'never[]': length, pop, push, concat, and 31 more.</problem>
<problem file="lib/usage-tracking.ts" line="145" column="64" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;feature_interactions&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type 'FeatureInteractionData' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;feature_interactions&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type 'FeatureInteractionData' is not assignable to parameter of type 'never[]'.
      Type 'FeatureInteractionData' is missing the following properties from type 'never[]': length, pop, push, concat, and 31 more.</problem>
<problem file="lib/usage-tracking.ts" line="161" column="57" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;preview_leads&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type 'LeadData' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;preview_leads&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type 'LeadData' is not assignable to parameter of type 'never[]'.
      Type 'LeadData' is missing the following properties from type 'never[]': length, pop, push, concat, and 31 more.</problem>
<problem file="lib/usage-tracking.ts" line="173" column="17" code="2345">Argument of type '{ converted_user_id: string; converted_at: string; }' is not assignable to parameter of type 'never'.</problem>
<problem file="lib/usage-tracking.ts" line="189" column="17" code="2345">Argument of type '{ time_on_page: number; }' is not assignable to parameter of type 'never'.</problem>
<problem file="lib/usage-tracking.ts" line="206" column="17" code="2345">Argument of type '{ last_activity: string; total_time_spent: number; }' is not assignable to parameter of type 'never'.</problem>
<problem file="lib/auth-service.ts" line="75" column="25" code="2339">Property 'organization_id' does not exist on type 'never'.</problem>
<problem file="lib/auth-service.ts" line="83" column="38" code="2339">Property 'organization_id' does not exist on type 'never'.</problem>
<problem file="lib/auth-service.ts" line="119" column="59" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;organizations&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ name: string; slug: string; subscription_plan: string; trial_ends_at: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;organizations&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ name: string; slug: string; subscription_plan: string; trial_ends_at: string; }' is not assignable to parameter of type 'never[]'.
      Object literal may only specify known properties, and 'name' does not exist in type 'never[]'.</problem>
<problem file="lib/auth-service.ts" line="135" column="43" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;user_profiles&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ user_id: string; organization_id: any; first_name: string; last_name: string; timezone: string; language: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;user_profiles&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ user_id: string; organization_id: any; first_name: string; last_name: string; timezone: string; language: string; }' is not assignable to parameter of type 'never[]'.
      Object literal may only specify known properties, and 'user_id' does not exist in type 'never[]'.</problem>
<problem file="lib/auth-service.ts" line="137" column="37" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="lib/auth-service.ts" line="149" column="40" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;user_roles&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ organization_id: any; user_id: string; role: string; permissions: { all: boolean; }; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;user_roles&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ organization_id: any; user_id: string; role: string; permissions: { all: boolean; }; }' is not assignable to parameter of type 'never[]'.
      Object literal may only specify known properties, and 'organization_id' does not exist in type 'never[]'.</problem>
<problem file="lib/auth-service.ts" line="150" column="37" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="lib/auth-service.ts" line="179" column="15" code="2345">Argument of type '{ updated_at: string; id?: string | undefined; user_id?: string | undefined; organization_id?: string | undefined; first_name?: string | undefined; last_name?: string | undefined; avatar_url?: string | undefined; ... 5 more ...; created_at?: string | undefined; }' is not assignable to parameter of type 'never'.</problem>
<problem file="lib/auth-service.ts" line="215" column="11" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;audit_logs&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ created_at: string; action: string; entity_type?: string | undefined; entity_id?: string | undefined; old_values?: Record&lt;string, any&gt; | undefined; new_values?: Record&lt;string, any&gt; | undefined; organization_id: string; user_id: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;audit_logs&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ created_at: string; action: string; entity_type?: string | undefined; entity_id?: string | undefined; old_values?: Record&lt;string, any&gt; | undefined; new_values?: Record&lt;string, any&gt; | undefined; organization_id: string; user_id: string; }' is not assignable to parameter of type 'never[]'.
      Object literal may only specify known properties, and 'created_at' does not exist in type 'never[]'.</problem>
<problem file="lib/analytics-service.ts" line="71" column="63" code="2339">Property 'status' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="72" column="53" code="2339">Property 'risk_score' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="72" column="78" code="2339">Property 'risk_score' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="78" column="59" code="2339">Property 'risk_level' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="79" column="62" code="2339">Property 'risk_level' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="80" column="60" code="2339">Property 'risk_level' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="81" column="64" code="2339">Property 'risk_level' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="116" column="52" code="2339">Property 'status' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="120" column="37" code="2339">Property 'risk_level' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="121" column="40" code="2339">Property 'risk_level' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="122" column="38" code="2339">Property 'risk_level' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="123" column="42" code="2339">Property 'risk_level' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="129" column="18" code="2339">Property 'industry' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="130" column="32" code="2339">Property 'industry' does not exist on type 'never'.</problem>
<problem file="lib/analytics-service.ts" line="130" column="66" code="2339">Property 'industry' does not exist on type 'never'.</problem>
<problem file="lib/assessment-service.ts" line="244" column="71" code="2345">Argument of type 'any' is not assignable to parameter of type 'never'.</problem>
<problem file="lib/notification-service.ts" line="28" column="29" code="2769">No overload matches this call.
  Overload 1 of 2, '(values: never, options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;notifications&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ data: Record&lt;string, any&gt;; user_id: string; type: string; title: string; message: string; organization_id: string; }' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(values: never[], options?: { count?: &quot;exact&quot; | &quot;planned&quot; | &quot;estimated&quot; | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder&lt;{ PostgrestVersion: string; }, never, never, null, &quot;notifications&quot;, never, &quot;POST&quot;&gt;', gave the following error.
    Argument of type '{ data: Record&lt;string, any&gt;; user_id: string; type: string; title: string; message: string; organization_id: string; }' is not assignable to parameter of type 'never[]'.
      Object literal may only specify known properties, and 'data' does not exist in type 'never[]'.</problem>
<problem file="lib/notification-service.ts" line="67" column="15" code="2345">Argument of type '{ read_at: string; }' is not assignable to parameter of type 'never'.</problem>
<problem file="lib/notification-service.ts" line="85" column="15" code="2345">Argument of type '{ read_at: string; }' is not assignable to parameter of type 'never'.</problem>
<problem file="components/auth-context.tsx" line="128" column="73" code="2339">Property 'organization_id' does not exist on type 'never'.</problem>
<problem file="components/auth-context.tsx" line="132" column="27" code="2339">Property 'organization_id' does not exist on type 'never'.</problem>
<problem file="components/auth-context.tsx" line="142" column="75" code="2339">Property 'organization_id' does not exist on type 'never'.</problem>
<problem file="components/auth-context.tsx" line="147" column="68" code="2339">Property 'name' does not exist on type 'never'.</problem>
<problem file="components/auth-context.tsx" line="150" column="108" code="2339">Property 'organization_id' does not exist on type 'never'.</problem>
<problem file="components/auth-context.tsx" line="155" column="40" code="2339">Property 'organization_id' does not exist on type 'never'.</problem>
<problem file="components/auth-context.tsx" line="170" column="61" code="2339">Property 'role' does not exist on type 'never'.</problem>
<problem file="app/analytics/page.tsx" line="95" column="28" code="2532">Object is possibly 'undefined'.</problem>
<problem file="app/analytics/page.tsx" line="95" column="66" code="2339">Property 'total_time_spent' does not exist on type 'never'.</problem>
<problem file="app/analytics/page.tsx" line="96" column="53" code="2339">Property 'converted_user_id' does not exist on type 'never'.</problem>
<problem file="app/analytics/page.tsx" line="141" column="13" code="2345">Argument of type '([, a]: [string, number], [, b]: [string, number]) =&gt; number' is not assignable to parameter of type '(a: [string, unknown], b: [string, unknown]) =&gt; number'.
  Types of parameters '__0' and 'a' are incompatible.
    Type '[string, unknown]' is not assignable to type '[string, number]'.
      Type at position 1 in source is not compatible with type at position 1 in target.
        Type 'unknown' is not assignable to type 'number'.</problem>
<problem file="app/analytics/page.tsx" line="157" column="13" code="2345">Argument of type '([, a]: [string, number], [, b]: [string, number]) =&gt; number' is not assignable to parameter of type '(a: [string, unknown], b: [string, unknown]) =&gt; number'.
  Types of parameters '__0' and 'a' are incompatible.
    Type '[string, unknown]' is not assignable to type '[string, number]'.</problem>
<problem file="app/analytics/page.tsx" line="388" column="50" code="2322">Type 'unknown' is not assignable to type 'ReactNode'.</problem>
<problem file="app/analytics/page.tsx" line="435" column="48" code="2322">Type 'unknown' is not assignable to type 'ReactNode'.</problem>
<problem file="app/dashboard/page.tsx" line="89" column="5" code="2322">Type 'null' is not assignable to type 'string | undefined'.</problem>
<problem file="app/dashboard/page.tsx" line="98" column="5" code="2322">Type 'null' is not assignable to type 'string | undefined'.</problem>
<problem file="app/dashboard/page.tsx" line="101" column="3" code="2739">Type '{ id: string; user_id: string; title: string; message: string; type: string; read_at: string; created_at: string; }' is missing the following properties from type 'Notification': organization_id, data</problem>
<problem file="app/policy-generator/page.tsx" line="907" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="910" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="911" column="26" code="2552">Cannot find name 'Input'. Did you mean 'oninput'?</problem>
<problem file="app/policy-generator/page.tsx" line="915" column="38" code="7006">Parameter 'e' implicitly has an 'any' type.</problem>
<problem file="app/policy-generator/page.tsx" line="922" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="925" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="951" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="954" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="956" column="28" code="2304">Cannot find name 'Input'.</problem>
<problem file="app/policy-generator/page.tsx" line="960" column="40" code="7006">Parameter 'e' implicitly has an 'any' type.</problem>
<problem file="app/policy-generator/page.tsx" line="973" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="976" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="977" column="26" code="2304">Cannot find name 'Input'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1664" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1666" column="25" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1671" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1672" column="23" code="2532">Object is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1674" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1677" column="23" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2716" column="16" code="2367">This comparison appears to be unintentional because the types '&quot;select&quot;' and '&quot;choose-method&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/page.tsx" line="2818" column="16" code="2367">This comparison appears to be unintentional because the types '&quot;select&quot;' and '&quot;manual-assessment&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/page.tsx" line="3075" column="16" code="2367">This comparison appears to be unintentional because the types '&quot;select&quot;' and '&quot;manual-assessment&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1683" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1684" column="23" code="2532">Object is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1686" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1689" column="23" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2555" column="28" code="2304">Cannot find name 'Eye'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2567" column="38" code="2552">Cannot find name 'Clock'. Did you mean 'Lock'?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2631" column="38" code="2552">Cannot find name 'Users'. Did you mean 'User'?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2715" column="34" code="2304">Cannot find name 'Eye'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2728" column="16" code="2367">This comparison appears to be unintentional because the types '&quot;select&quot;' and '&quot;choose-method&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2830" column="16" code="2367">This comparison appears to be unintentional because the types '&quot;select&quot;' and '&quot;manual-assessment&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="3087" column="16" code="2367">This comparison appears to be unintentional because the types '&quot;select&quot;' and '&quot;manual-assessment&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="3151" column="34" code="2552">Cannot find name 'Users'. Did you mean 'User'?</problem>
<problem file="app/solutions/page.tsx" line="788" column="65" code="2339">Property 'dyad-problem-report' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="789" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="789" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="790" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="790" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="791" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="791" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="792" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="792" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="793" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="793" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="794" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="794" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="795" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="795" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="796" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="796" column="151" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="797" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="797" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="798" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="798" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="799" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="799" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="800" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="800" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="801" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="801" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="802" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="802" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="803" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="803" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="804" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="804" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="805" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="805" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="806" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="806" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="807" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="807" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="808" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="808" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="809" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="809" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="810" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="810" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="811" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="811" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="812" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="812" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="813" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="813" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="814" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="814" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="815" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="815" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="816" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="816" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="817" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="817" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="818" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="818" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="819" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="819" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="820" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="820" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="821" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="821" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="822" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="822" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="823" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="823" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="824" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="824" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="825" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="825" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="826" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="826" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="827" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="827" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="828" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="828" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="829" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="829" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="830" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="830" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="831" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="831" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="832" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="832" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="833" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="833" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="834" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="834" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="835" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="835" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="836" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="836" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="837" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="837" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="838" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="838" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="839" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="839" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="840" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="840" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="841" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="841" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="842" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="842" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="843" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="843" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="844" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="844" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="845" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="845" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="846" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="846" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="847" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="847" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="848" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="848" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="849" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="849" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="850" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="850" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="851" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="851" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="852" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="852" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="853" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="853" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="854" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="854" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="855" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="855" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="856" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="856" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="857" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="857" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="858" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="858" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="859" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="859" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="860" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="860" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="861" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="861" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="862" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="862" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="863" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="863" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="864" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="864" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="865" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="865" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="866" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="866" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="867" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="867" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="868" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="868" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="869" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="869" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="870" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="870" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="871" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="871" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="872" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="872" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="873" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="873" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="874" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="874" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="875" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="875" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="876" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="876" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="877" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="877" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="878" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="878" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="879" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="879" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="880" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="880" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="881" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="881" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="882" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="882" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="883" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="883" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="884" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="884" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="885" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="885" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="886" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="886" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="887" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="887" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="888" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="888" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="889" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="889" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="890" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="890" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="891" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="891" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="892" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="892" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="893" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="893" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="894" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="894" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="895" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="895" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="896" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="896" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="897" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="897" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="898" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="898" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="899" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="899" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="900" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="900" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="901" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="901" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="902" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="902" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="903" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="903" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="904" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="904" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="905" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="905" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="906" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="906" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="907" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="907" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="908" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="908" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="909" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="909" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="910" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="910" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="911" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="911" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="912" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="912" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="913" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="913" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="914" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="914" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="915" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="915" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="916" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="916" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="917" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="917" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="918" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="918" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="919" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="919" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="920" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="920" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="921" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="921" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="922" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="922" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="923" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="923" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="924" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="924" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="925" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="925" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="926" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="926" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="927" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="927" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="928" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="928" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="929" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="929" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="930" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="930" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="931" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="931" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="932" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="932" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="933" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="933" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="934" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="934" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="935" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="935" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="936" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="936" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="937" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="937" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="938" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="938" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="939" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="939" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="940" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="940" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="941" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="941" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="942" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="942" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="943" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="943" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="944" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="944" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="945" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="945" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="946" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="946" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="947" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="947" column="140" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="948" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="948" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="949" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="949" column="94" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="950" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="950" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="951" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="951" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="952" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="952" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="953" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="953" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="954" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="954" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="955" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="955" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="956" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="956" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="957" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="957" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="958" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="958" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="959" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="959" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="960" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="960" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="961" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="961" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="962" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="962" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="963" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="963" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="964" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="964" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="965" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="965" column="114" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="966" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="966" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="967" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="967" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="968" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="968" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="969" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="969" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="970" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="970" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="971" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="971" column="165" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="972" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="972" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="973" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="973" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="974" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="974" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="975" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="975" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="976" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="976" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="977" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="977" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="978" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="978" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="979" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="979" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="980" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="980" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="981" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="981" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="982" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="982" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="983" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="983" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="984" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="984" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="985" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="985" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="986" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="986" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="987" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="987" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="988" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="988" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="989" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="989" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="990" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="990" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="991" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="991" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="992" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="992" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="993" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="993" column="165" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="994" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="994" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="995" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="995" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="996" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="996" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="997" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="997" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="998" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="998" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="999" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="999" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1000" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1000" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1001" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1001" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1002" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1002" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1003" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1003" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1004" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1004" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1005" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1005" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1006" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1006" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1007" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1007" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1008" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1008" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1009" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1009" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1010" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1010" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1011" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1011" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1012" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1012" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1013" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1013" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1014" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1014" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1015" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1015" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1016" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1016" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1017" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1017" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1018" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1018" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1019" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1019" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1020" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1020" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1021" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1021" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1022" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1022" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1023" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1023" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1024" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1024" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1025" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1025" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1026" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1026" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1027" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1027" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1028" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1028" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1029" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1029" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1030" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1030" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1031" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1031" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1032" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1032" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1033" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1033" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1034" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1034" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1035" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1035" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1036" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1036" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1037" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1037" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1038" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1038" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1039" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1039" column="96" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1040" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1040" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1041" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1041" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1042" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1042" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1043" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1043" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1044" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1044" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1045" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1045" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1046" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1046" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1047" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1047" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1048" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1048" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1049" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1049" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1050" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1050" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1051" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1051" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1052" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1052" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1053" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1053" column="114" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1054" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1054" column="114" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1055" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1055" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1056" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1056" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1057" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1057" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1058" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1058" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1059" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1059" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1060" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1060" column="137" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1061" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1061" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1062" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1062" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1063" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1063" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1064" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1064" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1065" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1065" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1066" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1066" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1067" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1067" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1068" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1068" column="95" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1069" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1069" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1070" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1070" column="94" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1071" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1071" column="89" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1071" column="246" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1071" column="391" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="114" code="2304">Cannot find name 'system'.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="123" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="132" code="18050">The value 'undefined' cannot be used here.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="218" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="298" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1072" column="323" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="90" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="126" code="2304">Cannot find name 'role'.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="162" code="2304">Cannot find name 'type'.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="230" code="2304">Cannot find name 'type'.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="396" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1073" column="541" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="114" code="2304">Cannot find name 'system'.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="123" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="132" code="18050">The value 'undefined' cannot be used here.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="153" code="2304">Cannot find name 'messages'.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="209" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="289" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1074" column="314" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1075" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1075" column="90" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1075" column="247" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1075" column="392" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="114" code="2304">Cannot find name 'system'.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="123" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="132" code="18050">The value 'undefined' cannot be used here.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="218" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="298" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1076" column="323" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1077" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1077" column="89" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1077" column="246" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1077" column="391" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="114" code="2304">Cannot find name 'system'.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="123" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="132" code="18050">The value 'undefined' cannot be used here.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="218" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="298" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1078" column="323" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1079" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1079" column="89" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1079" column="246" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1079" column="391" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="114" code="2304">Cannot find name 'system'.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="123" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="132" code="18050">The value 'undefined' cannot be used here.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="218" code="2304">Cannot find name 'model'.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="298" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1080" column="323" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1081" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1081" column="113" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1082" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1082" column="113" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1083" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1083" column="76" code="2304">Cannot find name 'method'.</problem>
<problem file="app/solutions/page.tsx" line="1083" column="214" code="2304">Cannot find name 'pages'.</problem>
<problem file="app/solutions/page.tsx" line="1083" column="222" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="app/solutions/page.tsx" line="1083" column="231" code="18050">The value 'undefined' cannot be used here.</problem>
<problem file="app/solutions/page.tsx" line="1086" column="60" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1087" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1087" column="114" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1088" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1088" column="114" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1089" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1089" column="76" code="2304">Cannot find name 'method'.</problem>
<problem file="app/solutions/page.tsx" line="1089" column="214" code="2304">Cannot find name 'pages'.</problem>
<problem file="app/solutions/page.tsx" line="1089" column="222" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="app/solutions/page.tsx" line="1089" column="231" code="18050">The value 'undefined' cannot be used here.</problem>
<problem file="app/solutions/page.tsx" line="1091" column="68" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1092" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1092" column="118" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1093" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1093" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1094" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1094" column="120" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1095" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1095" column="121" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1096" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1096" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1097" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1097" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1098" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1098" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1099" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1099" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1100" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1100" column="128" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1101" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1101" column="128" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1102" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1102" column="132" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1103" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1103" column="132" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1104" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1104" column="82" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1104" column="280" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1105" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1105" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1106" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1106" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1107" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1107" column="131" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1108" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1108" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1109" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1109" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1110" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1110" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1111" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1111" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1112" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1112" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1113" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1113" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1114" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1114" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1115" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1115" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1116" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1116" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1117" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1117" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1118" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1118" column="161" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1119" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1119" column="186" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1120" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1120" column="129" code="2304">Cannot find name 'lt'.</problem>
<problem file="app/solutions/page.tsx" line="1120" column="328" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1121" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1121" column="187" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1122" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1122" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1123" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1123" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1124" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1124" column="127" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1125" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1125" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1126" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1126" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1127" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1127" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1128" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1128" column="120" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1129" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1129" column="134" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1130" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1130" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1131" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1131" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1132" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1132" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1133" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1133" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1134" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1134" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1135" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1135" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1136" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1136" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1137" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1137" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1138" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1138" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1139" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1139" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1140" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1140" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1141" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1141" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1142" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1142" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1143" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1143" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1144" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1144" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1145" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1145" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1146" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1146" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1147" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1147" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1148" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1148" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1149" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1149" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1150" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1150" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1151" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1151" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1152" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1152" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1153" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1153" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1154" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1154" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1155" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1155" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1156" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1156" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1157" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1157" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1158" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1158" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1159" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1159" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1160" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1160" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1161" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1161" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1162" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1162" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1163" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1163" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1164" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1164" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1165" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1165" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1166" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1166" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1167" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1167" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1168" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1168" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1169" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1169" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1170" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1170" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1171" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1171" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1172" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1172" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1173" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1173" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1174" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1174" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1175" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1175" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1176" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1176" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1177" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1177" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1178" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1178" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1179" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1179" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1180" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1180" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1181" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1181" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1182" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1182" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1183" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1183" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1184" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1184" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1185" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1185" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1186" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1186" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1187" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1187" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1188" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1188" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1189" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1189" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1190" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1190" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1191" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1191" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1192" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1192" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1193" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1193" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1194" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1194" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1195" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1195" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1196" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1196" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1197" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1197" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1198" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1198" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1199" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1199" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1200" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1200" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1201" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1201" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1202" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1202" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1203" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1203" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1204" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1204" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1205" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1205" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1206" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1206" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1207" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1207" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1208" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1208" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1209" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1209" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1210" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1210" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1211" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1211" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1212" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1212" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1213" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1213" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1214" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1214" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1215" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1215" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1216" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1216" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1217" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1217" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1218" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1218" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1219" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1219" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1220" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1220" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1221" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1221" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1222" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1222" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1223" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1223" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1224" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1224" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1225" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1225" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1226" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1226" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1227" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1227" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1228" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1228" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1229" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1229" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1230" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1230" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1231" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1231" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1232" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1232" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1233" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1233" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1234" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1234" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1235" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1235" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1236" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1236" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1237" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1237" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1238" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1238" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1239" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1239" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1240" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1240" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1241" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1241" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1242" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1242" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1243" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1243" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1244" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1244" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1245" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1245" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1246" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1246" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1247" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1247" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1248" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1248" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1249" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1249" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1250" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1250" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1251" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1251" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1252" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1252" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1253" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1253" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1254" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1254" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1255" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1255" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1256" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1256" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1257" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1257" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1258" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1258" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1259" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1259" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1260" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1260" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1261" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1261" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1262" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1262" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1263" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1263" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1264" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1264" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1265" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1265" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1266" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1266" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1267" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1267" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1268" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1268" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1269" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1269" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1270" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1270" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1271" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1271" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1272" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1272" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1273" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1273" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1274" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1274" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1275" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1275" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1276" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1276" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1277" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1277" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1278" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1278" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1279" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1279" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1280" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1280" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1281" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1281" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1282" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1282" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1283" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1283" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1284" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1284" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1285" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1285" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1286" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1286" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1287" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1287" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1288" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1288" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1289" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1289" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1290" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1290" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1291" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1291" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1292" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1292" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1293" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1293" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1294" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1294" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1295" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1295" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1296" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1296" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1297" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1297" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1298" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1298" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1299" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1299" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1300" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1300" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1301" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1301" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1302" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1302" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1303" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1303" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1304" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1304" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1305" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1305" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1306" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1306" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1307" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1307" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1308" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1308" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1309" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1309" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1310" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1310" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1311" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1311" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1312" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1312" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1313" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1313" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1314" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1314" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1315" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1315" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1316" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1316" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1317" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1317" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1318" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1318" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1319" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1319" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1320" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1320" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1321" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1321" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1322" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1322" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1323" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1323" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1324" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1324" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1325" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1325" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1326" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1326" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1327" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1327" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1328" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1328" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1329" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1329" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1330" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1330" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1331" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1331" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1332" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1332" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1333" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1333" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1334" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1334" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1335" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1335" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1336" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1336" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1337" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1337" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1338" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1338" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1339" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1339" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1340" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1340" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1341" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1341" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1342" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1342" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1343" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1343" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1344" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1344" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1345" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1345" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1346" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1346" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1347" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1347" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1348" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1348" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1349" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1349" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1350" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1350" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1351" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1351" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1352" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1352" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1353" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1353" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1354" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1354" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1355" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1355" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1356" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1356" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1357" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1357" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1358" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1358" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1359" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1359" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1360" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1360" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1361" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1361" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1362" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1362" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1363" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1363" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1364" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1364" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1365" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1365" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1366" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1366" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1367" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1367" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1368" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1368" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1369" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1369" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1370" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1370" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1371" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1371" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1372" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1372" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1373" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1373" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1374" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1374" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1375" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1375" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1376" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1376" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1377" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1377" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1378" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1378" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1379" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1379" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1380" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1380" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1381" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1381" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1382" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1382" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1383" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1383" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1384" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1384" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1385" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1385" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1386" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1386" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1387" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1387" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1388" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1388" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1389" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1389" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1390" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1390" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1391" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1391" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1392" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1392" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1393" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1393" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1394" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1394" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1395" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1395" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1396" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1396" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1397" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1397" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1398" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1398" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1399" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1399" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1400" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1400" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1401" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1401" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1402" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1402" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1403" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1403" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1404" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1404" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1405" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1405" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1406" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1406" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1407" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1407" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1408" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1408" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1409" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1409" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1410" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1410" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1411" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1411" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1412" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1412" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1413" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1413" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1414" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1414" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1415" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1415" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1416" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1416" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1417" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1417" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1418" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1418" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1419" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1419" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1420" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1420" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1421" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1421" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1422" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1422" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1423" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1423" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1424" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1424" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1425" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1425" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1426" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1426" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1427" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1427" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1428" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1428" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1429" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1429" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1430" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1430" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1431" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1431" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1432" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1432" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1433" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1433" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1434" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1434" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1435" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1435" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1436" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1436" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1437" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1437" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1438" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1438" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1439" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1439" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1440" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1440" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1441" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1441" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1442" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1442" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1443" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1443" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1444" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1444" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1445" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1445" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1446" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1446" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1447" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1447" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1448" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1448" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1449" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1449" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1450" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1450" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1451" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1451" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1452" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1452" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1453" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1453" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1454" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1454" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1455" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1455" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1456" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1456" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1457" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1457" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1458" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1458" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1459" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1459" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1460" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1460" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1461" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1461" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1462" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1462" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1463" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1463" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1464" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1464" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1465" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1465" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1466" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1466" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1467" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1467" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1468" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1468" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1469" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1469" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1470" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1470" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1471" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1471" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1472" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1472" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1473" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1473" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1474" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1474" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1475" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1475" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1476" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1476" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1477" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1477" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1478" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1478" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1479" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1479" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1480" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1480" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1481" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1481" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1482" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1482" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1483" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1483" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1484" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1484" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1485" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1485" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1486" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1486" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1487" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1487" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1488" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1488" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1489" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1489" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1490" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1490" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1491" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1491" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1492" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1492" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1493" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1493" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1494" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1494" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1495" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1495" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1496" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1496" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1497" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1497" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1498" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1498" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1499" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1499" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1500" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1500" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1501" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1501" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1502" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1502" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1503" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1503" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1504" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1504" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1505" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1505" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1506" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1506" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1507" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1507" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1508" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1508" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1509" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1509" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1510" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1510" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1511" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1511" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1512" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1512" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1513" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1513" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1514" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1514" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1515" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1515" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1516" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1516" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1517" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1517" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1518" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1518" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1519" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1519" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1520" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1520" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1521" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1521" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1522" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1522" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1523" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1523" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1524" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1524" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1525" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1525" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1526" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1526" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1527" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1527" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1528" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1528" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1529" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1529" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1530" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1530" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1531" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1531" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1532" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1532" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1533" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1533" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1534" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1534" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1535" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1535" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1536" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1536" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1537" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1537" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1538" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1538" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1539" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1539" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1540" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1540" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1541" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1541" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1542" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1542" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1543" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1543" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1544" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1544" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1545" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1545" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1546" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1546" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1547" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1547" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1548" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1548" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1549" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1549" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1550" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1550" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1551" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1551" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1552" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1552" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1553" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1553" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1554" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1554" column="146" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1555" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1555" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1556" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1556" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1557" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1557" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1558" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1558" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1559" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1559" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1560" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1560" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1561" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1561" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1562" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1562" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1563" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1563" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1564" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1564" column="112" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1565" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1565" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1566" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1566" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1567" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1567" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1568" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1568" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1569" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1569" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1570" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1570" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1571" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1571" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1572" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1572" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1573" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1573" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1574" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1574" column="113" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1575" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1575" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1576" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1576" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1577" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1577" column="121" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1578" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1578" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1579" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1579" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1580" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1580" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1581" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1581" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1582" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1582" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1583" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1583" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1584" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1584" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1585" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1585" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1586" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1586" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1587" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1587" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1588" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1588" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1589" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1589" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1590" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1590" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1591" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1591" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1592" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1592" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1593" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1593" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1594" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1594" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1595" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1595" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1596" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1596" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1597" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1597" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1598" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1598" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1599" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1599" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1600" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1600" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1601" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1601" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1602" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1602" column="159" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1603" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1603" column="113" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1604" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1604" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1605" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1605" column="120" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1606" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1606" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1607" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1607" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1608" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1608" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1609" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1609" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1610" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1610" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1611" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1611" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1612" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1612" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1613" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1613" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1614" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1614" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1615" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1615" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1616" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1616" column="168" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1617" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1617" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1618" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1618" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1619" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1619" column="235" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1620" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1620" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1621" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1621" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1622" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1622" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1623" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1623" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1624" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1624" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1625" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1625" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1626" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1626" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1627" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1627" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1628" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1628" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1629" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1629" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1630" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1630" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1631" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1631" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1632" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1632" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1633" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1633" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1634" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1634" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1635" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1635" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1636" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1636" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1637" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1637" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1638" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1638" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1639" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1639" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1640" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1640" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1641" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1641" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1642" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1642" column="112" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1643" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1643" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1644" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1644" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1645" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1645" column="107" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1646" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1646" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1647" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1647" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1648" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1648" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1649" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1649" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1650" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1650" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1651" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1651" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1652" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1652" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1653" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1653" column="104" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1654" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1654" column="103" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1655" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1655" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1656" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1656" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1657" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1657" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1658" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1658" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1659" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1659" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1660" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1660" column="113" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1661" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1661" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1662" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1662" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1663" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1663" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1664" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1664" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1665" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1665" column="111" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1666" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1666" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1667" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1667" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1668" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1668" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1669" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1669" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1670" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1670" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1671" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1671" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1672" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1672" column="113" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1673" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1673" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1674" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1674" column="139" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1675" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1675" column="127" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1676" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1676" column="139" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1677" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1677" column="139" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1678" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1678" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1679" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1679" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1680" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1680" column="142" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1681" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1681" column="150" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1682" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1682" column="142" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1683" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1683" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1684" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1684" column="227" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1685" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1685" column="231" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1686" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1686" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1687" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1687" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1688" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1688" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1689" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1689" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1690" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1690" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1691" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1691" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1692" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1692" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1693" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1693" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1694" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1694" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1695" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1695" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1696" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1696" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1697" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1697" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="141" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="240" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="340" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1698" column="453" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1699" column="48" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1699" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1700" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1700" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1701" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1701" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1702" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1702" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1703" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1703" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1704" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1704" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1705" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1705" column="231" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1706" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1706" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1707" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1707" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1708" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1708" column="142" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1709" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1709" column="150" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1710" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1710" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1711" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1711" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1712" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1712" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1713" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1713" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1714" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1714" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1715" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1715" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1716" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1716" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1717" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1717" column="101" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1718" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1718" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1719" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1719" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1720" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1720" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1721" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1721" column="106" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1722" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1722" column="193" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1723" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1723" column="772" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1726" column="647" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1727" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1730" column="424" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1731" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1731" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1732" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1732" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1733" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1733" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1734" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1734" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1735" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1735" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1736" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1736" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1737" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1737" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1738" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1738" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1739" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1739" column="167" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1740" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1740" column="107" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1741" column="11" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1742" column="13" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1742" column="425" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1743" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1743" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1744" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1744" column="96" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1744" column="347" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1745" column="105" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1746" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1746" column="174" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1747" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1747" column="176" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1748" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1748" column="182" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1749" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1749" column="96" code="2304">Cannot find name 'userEmail'.</problem>
<problem file="app/solutions/page.tsx" line="1750" column="91" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1751" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1751" column="96" code="2304">Cannot find name 'userEmail'.</problem>
<problem file="app/solutions/page.tsx" line="1752" column="91" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1753" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1753" column="174" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1754" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1754" column="176" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1755" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1755" column="182" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1756" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1756" column="172" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1757" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1757" column="172" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1758" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1758" column="172" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1759" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1759" column="172" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1760" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1760" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1761" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1761" column="170" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1762" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1762" column="170" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1763" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1763" column="168" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1764" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1764" column="168" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1765" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1765" column="180" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1766" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1766" column="180" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1767" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1767" column="172" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1768" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1768" column="172" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1769" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1769" column="141" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1770" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1770" column="118" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1771" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1771" column="118" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1772" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1772" column="137" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1773" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1773" column="137" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1774" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1774" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1775" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1775" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1776" column="1" code="2339">Property 'dyad-problem-report' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1776" column="23" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1806" column="1" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1827" column="1" code="2339">Property 'dyad-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1832" column="10" code="2304">Cannot find name 'Slot'.</problem>
<problem file="app/solutions/page.tsx" line="1833" column="10" code="2304">Cannot find name 'Controller'.</problem>
<problem file="app/solutions/page.tsx" line="1833" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1833" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1833" column="22" code="2304">Cannot find name 'FormProvider'.</problem>
<problem file="app/solutions/page.tsx" line="1833" column="36" code="2304">Cannot find name 'useFormContext'.</problem>
<problem file="app/solutions/page.tsx" line="1834" column="10" code="2304">Cannot find name 'cva'.</problem>
<problem file="app/solutions/page.tsx" line="1834" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1834" column="15" code="2304">Cannot find name 'type'.</problem>
<problem file="app/solutions/page.tsx" line="1836" column="10" code="2304">Cannot find name 'cn'.</problem>
<problem file="app/solutions/page.tsx" line="1841" column="3" code="2786">'HTMLParagraphElement' cannot be used as a JSX component.
  Its instance type 'HTMLParagraphElement' is not a valid JSX element.
    Type 'HTMLParagraphElement' is missing the following properties from type 'ElementClass': render, context, setState, forceUpdate, and 3 more.</problem>
<problem file="app/solutions/page.tsx" line="1842" column="24" code="2786">'HTMLParagraphElement' cannot be used as a JSX component.
  Its instance type 'HTMLParagraphElement' is not a valid JSX element.</problem>
<problem file="app/solutions/page.tsx" line="1843" column="6" code="2304">Cannot find name 'className'.</problem>
<problem file="app/solutions/page.tsx" line="1843" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1844" column="11" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="app/solutions/page.tsx" line="1848" column="12" code="2304">Cannot find name 'ref'.</problem>
<problem file="app/solutions/page.tsx" line="1849" column="11" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="app/solutions/page.tsx" line="1850" column="18" code="2304">Cannot find name 'cn'.</problem>
<problem file="app/solutions/page.tsx" line="1850" column="54" code="2304">Cannot find name 'className'.</problem>
<problem file="app/solutions/page.tsx" line="1851" column="11" code="2304">Cannot find name 'props'.</problem>
<problem file="app/solutions/page.tsx" line="1858" column="3" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1859" column="27" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1859" column="53" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1860" column="3" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1861" column="6" code="2304">Cannot find name 'props'.</problem>
<problem file="app/solutions/page.tsx" line="1862" column="20" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1863" column="11" code="2304">Cannot find name 'Controller'.</problem>
<problem file="app/solutions/page.tsx" line="1863" column="26" code="2304">Cannot find name 'props'.</problem>
<problem file="app/solutions/page.tsx" line="1866" column="47" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1871" column="3" code="2786">'HTMLDivElement' cannot be used as a JSX component.
  Its instance type 'HTMLDivElement' is not a valid JSX element.
    Type 'HTMLDivElement' is missing the following properties from type 'ElementClass': render, context, setState, forceUpdate, and 3 more.</problem>
<problem file="app/solutions/page.tsx" line="1872" column="24" code="2786">'HTMLDivElement' cannot be used as a JSX component.
  Its instance type 'HTMLDivElement' is not a valid JSX element.</problem>
<problem file="app/solutions/page.tsx" line="1873" column="6" code="2304">Cannot find name 'className'.</problem>
<problem file="app/solutions/page.tsx" line="1873" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1877" column="6" code="2304">Cannot find name 'FormItemContext'.</problem>
<problem file="app/solutions/page.tsx" line="1877" column="40" code="18004">No value exists in scope for the shorthand property 'id'. Either declare one or provide an initializer.</problem>
<problem file="app/solutions/page.tsx" line="1878" column="17" code="2304">Cannot find name 'ref'.</problem>
<problem file="app/solutions/page.tsx" line="1878" column="33" code="2304">Cannot find name 'cn'.</problem>
<problem file="app/solutions/page.tsx" line="1878" column="49" code="2304">Cannot find name 'className'.</problem>
<problem file="app/solutions/page.tsx" line="1878" column="65" code="2304">Cannot find name 'props'.</problem>
<problem file="app/solutions/page.tsx" line="1879" column="7" code="2304">Cannot find name 'FormItemContext'.</problem>
<problem file="app/solutions/page.tsx" line="1885" column="3" code="2686">'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.</problem>
<problem file="app/solutions/page.tsx" line="1885" column="9" code="2339">Property 'ElementRef' does not exist on type 'typeof import(&quot;C:/Users/HP/dyad-apps/RiskShield-AI-main/1/node_modules/.pnpm/@types+react@18.0.0/node_modules/@types/react/index.d.ts&quot;)'.</problem>
<problem file="app/solutions/page.tsx" line="1885" column="27" code="2304">Cannot find name 'LabelPrimitive'.</problem>
<problem file="app/solutions/page.tsx" line="1886" column="33" code="2339">Property 'typeof' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1887" column="6" code="2304">Cannot find name 'className'.</problem>
<problem file="app/solutions/page.tsx" line="1887" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1888" column="11" code="2304">Cannot find name 'error'.</problem>
<problem file="app/solutions/page.tsx" line="1888" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1888" column="18" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="app/solutions/page.tsx" line="1891" column="6" code="2304">Cannot find name 'LabelPrimitive'.</problem>
<problem file="app/solutions/page.tsx" line="1892" column="12" code="2304">Cannot find name 'ref'.</problem>
<problem file="app/solutions/page.tsx" line="1893" column="18" code="2304">Cannot find name 'cn'.</problem>
<problem file="app/solutions/page.tsx" line="1893" column="21" code="2304">Cannot find name 'error'.</problem>
<problem file="app/solutions/page.tsx" line="1893" column="50" code="2304">Cannot find name 'className'.</problem>
<problem file="app/solutions/page.tsx" line="1894" column="16" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="app/solutions/page.tsx" line="1895" column="11" code="2304">Cannot find name 'props'.</problem>
<problem file="app/solutions/page.tsx" line="1902" column="3" code="2786">'HTMLParagraphElement' cannot be used as a JSX component.
  Its instance type 'HTMLParagraphElement' is not a valid JSX element.</problem>
<problem file="app/solutions/page.tsx" line="1903" column="24" code="2786">'HTMLParagraphElement' cannot be used as a JSX component.
  Its instance type 'HTMLParagraphElement' is not a valid JSX element.</problem>
<problem file="app/solutions/page.tsx" line="1904" column="6" code="2304">Cannot find name 'className'.</problem>
<problem file="app/solutions/page.tsx" line="1904" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1904" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1904" column="17" code="2304">Cannot find name 'children'.</problem>
<problem file="app/solutions/page.tsx" line="1905" column="11" code="2304">Cannot find name 'error'.</problem>
<problem file="app/solutions/page.tsx" line="1905" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1905" column="18" code="2304">Cannot find name 'formMessageId'.</problem>
<problem file="app/solutions/page.tsx" line="1914" column="12" code="2304">Cannot find name 'ref'.</problem>
<problem file="app/solutions/page.tsx" line="1915" column="11" code="2304">Cannot find name 'formMessageId'.</problem>
<problem file="app/solutions/page.tsx" line="1916" column="18" code="2304">Cannot find name 'cn'.</problem>
<problem file="app/solutions/page.tsx" line="1916" column="61" code="2304">Cannot find name 'className'.</problem>
<problem file="app/solutions/page.tsx" line="1917" column="11" code="2304">Cannot find name 'props'.</problem>
<problem file="app/solutions/page.tsx" line="1919" column="8" code="2304">Cannot find name 'body'.</problem>
<problem file="app/solutions/page.tsx" line="1926" column="3" code="2686">'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.</problem>
<problem file="app/solutions/page.tsx" line="1926" column="9" code="2339">Property 'ElementRef' does not exist on type 'typeof import(&quot;C:/Users/HP/dyad-apps/RiskShield-AI-main/1/node_modules/.pnpm/@types+react@18.0.0/node_modules/@types/react/index.d.ts&quot;)'.</problem>
<problem file="app/solutions/page.tsx" line="1926" column="27" code="2304">Cannot find name 'Slot'.</problem>
<problem file="app/solutions/page.tsx" line="1927" column="33" code="2339">Property 'typeof' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1928" column="4" code="2609">JSX spread child must be an array type.</problem>
<problem file="app/solutions/page.tsx" line="1928" column="9" code="2304">Cannot find name 'props'.</problem>
<problem file="app/solutions/page.tsx" line="1929" column="11" code="2304">Cannot find name 'error'.</problem>
<problem file="app/solutions/page.tsx" line="1929" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1929" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1929" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1929" column="18" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="app/solutions/page.tsx" line="1929" column="30" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="app/solutions/page.tsx" line="1929" column="49" code="2304">Cannot find name 'formMessageId'.</problem>
<problem file="app/solutions/page.tsx" line="1932" column="6" code="2304">Cannot find name 'Slot'.</problem>
<problem file="app/solutions/page.tsx" line="1933" column="12" code="2304">Cannot find name 'ref'.</problem>
<problem file="app/solutions/page.tsx" line="1934" column="11" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="app/solutions/page.tsx" line="1936" column="10" code="2304">Cannot find name 'error'.</problem>
<problem file="app/solutions/page.tsx" line="1936" column="21" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="app/solutions/page.tsx" line="1936" column="46" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="app/solutions/page.tsx" line="1936" column="67" code="2304">Cannot find name 'formMessageId'.</problem>
<problem file="app/solutions/page.tsx" line="1938" column="23" code="2304">Cannot find name 'error'.</problem>
<problem file="app/solutions/page.tsx" line="1939" column="11" code="2304">Cannot find name 'props'.</problem>
<problem file="app/solutions/page.tsx" line="1946" column="3" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1947" column="27" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1947" column="53" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1948" column="25" code="2339">Property 'typeof' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1948" column="44" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1950" column="26" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/solutions/page.tsx" line="1951" column="16" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1951" column="78" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1952" column="23" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1955" column="19" code="2304">Cannot find name 'FieldValues'.</problem>
<problem file="app/solutions/page.tsx" line="1962" column="3" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1968" column="11" code="2304">Cannot find name 'getFieldState'.</problem>
<problem file="app/solutions/page.tsx" line="1968" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1968" column="26" code="2304">Cannot find name 'formState'.</problem>
<problem file="app/solutions/page.tsx" line="1976" column="58" code="2304">Cannot find name 'FormField'.</problem>
<problem file="app/solutions/page.tsx" line="1979" column="11" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1982" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/solutions/page.tsx" line="1982" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1982" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1982" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1984" column="5" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="app/solutions/page.tsx" line="1985" column="5" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="app/solutions/page.tsx" line="1985" column="27" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="app/solutions/page.tsx" line="1986" column="23" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="app/solutions/page.tsx" line="1991" column="46" code="2304">Cannot find name 'FormFieldContextValue'.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2304">Cannot find name 'useFormField'.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1996" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/solutions/page.tsx" line="1997" column="3" code="2304">Cannot find name 'Form'.</problem>
<problem file="app/solutions/page.tsx" line="1998" column="3" code="2304">Cannot find name 'FormItem'.</problem>
<problem file="app/solutions/page.tsx" line="1999" column="3" code="2304">Cannot find name 'FormLabel'.</problem>
<problem file="app/solutions/page.tsx" line="2000" column="3" code="2304">Cannot find name 'FormControl'.</problem>
<problem file="app/solutions/page.tsx" line="2001" column="3" code="2304">Cannot find name 'FormDescription'.</problem>
<problem file="app/solutions/page.tsx" line="2002" column="3" code="2304">Cannot find name 'FormMessage'.</problem>
<problem file="app/solutions/page.tsx" line="2003" column="3" code="2304">Cannot find name 'FormField'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="7" column="80" code="2307">Cannot find module '@/components/ui/form' or its corresponding type declarations.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="39" column="5" code="2322">Type 'Resolver&lt;{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendorRiskMa...' is not assignable to type 'Resolver&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.
  Types of parameters 'options' and 'options' are incompatible.
    Type 'ResolverOptions&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }&gt;' is not assignable to type 'ResolverOptions&lt;{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendo...'.
      Type '{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendorRiskManagementP...' is not assignable to type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="111" column="45" code="2345">Argument of type '(values: { name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }) =&gt; Promise&lt;...&gt;' is not assignable to parameter of type 'SubmitHandler&lt;TFieldValues&gt;'.
  Types of parameters 'values' and 'data' are incompatible.
    Type 'TFieldValues' is not assignable to type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }'.
      Type 'FieldValues' is missing the following properties from type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }': name, email, company, dataBreachIncidentResponsePlan, and 4 more.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="115" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="128" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="141" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="155" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="171" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="187" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="203" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="219" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="235" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/page.tsx" line="90" column="22" code="2345">Argument of type '{ id: string; vendorName: string; vendorEmail: string; contactPerson: string | undefined; assessmentType: string; status: &quot;pending&quot; | &quot;in_progress&quot; | &quot;completed&quot; | &quot;overdue&quot;; sentDate: string; ... 10 more ...; organization_id: string; }[]' is not assignable to parameter of type 'SetStateAction&lt;Assessment[]&gt;'.
  Type '{ id: string; vendorName: string; vendorEmail: string; contactPerson: string | undefined; assessmentType: string; status: &quot;pending&quot; | &quot;in_progress&quot; | &quot;completed&quot; | &quot;overdue&quot;; sentDate: string; ... 10 more ...; organization_id: string; }[]' is not assignable to type 'Assessment[]'.
    Type '{ id: string; vendorName: string; vendorEmail: string; contactPerson: string | undefined; assessmentType: string; status: &quot;pending&quot; | &quot;in_progress&quot; | &quot;completed&quot; | &quot;overdue&quot;; sentDate: string; ... 10 more ...; organization_id: string; }' is missing the following properties from type 'Assessment': vendor_name, vendor_email, assessment_type, sent_date, and 3 more.</problem>
<problem file="app/third-party-assessment/page.tsx" line="121" column="11" code="2322">Type 'null' is not assignable to type 'number | undefined'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="149" column="11" code="2322">Type '{ id: string; vendor_name: string; vendor_email: string; contact_person: string; assessment_type: string; status: &quot;completed&quot;; sent_date: string; completed_date: string; due_date: string; risk_score: number; ... 8 more ...; assessmentAnswers: { ...; }; }' is not assignable to type 'Assessment'.
  Object literal may only specify known properties, and 'responses' does not exist in type 'Assessment'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="201" column="67" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="219" column="39" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="257" column="48" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="272" column="48" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="292" column="69" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="297" column="48" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="419" column="25" code="2322">Type '{ userEmail: string; onSignOut: (() =&gt; void) | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; NavigationProps'.
  Property 'userEmail' does not exist on type 'IntrinsicAttributes &amp; NavigationProps'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="438" column="25" code="2322">Type '{ userEmail: string; onSignOut: (() =&gt; void) | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; NavigationProps'.
  Property 'userEmail' does not exist on type 'IntrinsicAttributes &amp; NavigationProps'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="769" column="18" code="18046">'error' is of type 'unknown'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="770" column="16" code="18046">'error' is of type 'unknown'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="1333" column="47" code="7006">Parameter 'option' implicitly has an 'any' type.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="1344" column="47" code="7006">Parameter 'option' implicitly has an 'any' type.</problem>
<problem file="components/theme-provider.tsx" line="9" column="33" code="2339">Property 'children' does not exist on type 'ThemeProviderProps'.</problem>
</dyad-problem-report><think>**Examining Compile Errors**

I'm currently focused on the extensive list of 2565 TypeScript compile-time errors. My plan is to methodically address each file, beginning with `app/risk-assessment/ai-assessment/page.tsx` and the other identified files. I will identify and fix each error to get this project compiling again.


**Tackling JSX Issues**

I've been meticulously addressing the JSX syntax errors, carefully examining each file. I started with `app/risk-assessment/ai-assessment/page.tsx` and `app/risk-assessment/page.tsx`, fixing tag mismatches and syntax issues. Now, I'm focusing on `app/solutions/page.tsx`, resolving similar errors there and removing the incorrectly interpreted `dyad-problem-report` output. I've made steady progress, and am moving forward.


**Refining Supabase Types**

I'm now focusing on fixing the Supabase-related type errors. I've begun defining the necessary types for the `usage_tracking`, `profiles`, and `organizations` tables. The schema from `007-create-usage-tracking.sql` and the implied structures will inform these definitions. I'll integrate these types into the Supabase client in `lib/supabase.ts` to resolve the type mismatches and property access errors in `lib/usage-tracking.ts`, `lib/auth-service.ts`, and `lib/analytics-service.ts`.


**Analyzing Database Schemas**

I'm now diving into the Supabase database schema to define the required types for accurate client interaction. I've begun to infer the structures of the `usage_tracking`, `profiles`, and `organizations` tables. Based on the provided `007-create-usage-tracking.sql` script, I will create the appropriate interfaces to resolve the type errors. My primary focus is to define and integrate these table definitions into `lib/supabase.ts`. This effort will directly resolve the type mismatches and property access issues observed in `lib/usage-tracking.ts`, `lib/auth-service.ts`, and `lib/analytics-service.ts`.


**Defining Supabase Tables**

I'm now fully immersed in resolving the type errors, specifically those linked to Supabase interactions. I'm focusing on defining clear and accurate interfaces for `usage_tracking`, `profiles`, and `organizations` tables. These definitions will be guided by the schema in `007-create-usage-tracking.sql`, ensuring proper type safety. I'm prioritizing the integration of these refined types within `lib/supabase.ts`. This effort aims to eliminate the type mismatches and property access errors plaguing `lib/usage-tracking.ts`, `lib/auth-service.ts`, and `lib/analytics-service.ts`.


**Analyzing Code Errors**

I've made significant progress addressing the remaining errors. I've corrected issues related to both Supabase and UI components, updating interfaces for `Assessment`, fixing `AuthContext` type inference, and addressing form schema mismatches. The `ThemeProvider` component has been refined to correctly handle `children`. I've also addressed the final JSX error in `components/theme-provider.tsx`. I've now turned my focus to error handling within assessment-related components, correcting `unknown` type errors and adding type guards for the errors from Supabase queries. I am actively working on type hints.


**Defining Table Types**

I've started by defining the essential Supabase table types, specifically focusing on `preview_sessions`, `page_views`, `feature_interactions`, and `preview_leads`. These types, inferred from the database schema and queries, will be crucial in resolving the `never` and `unknown` type errors I've identified across the codebase. I will then work through the remaining files and type errors.


</think>Okay, I understand the critical nature of these authentication and data saving issues. I'll go through the codebase systematically, focusing on the authentication flow, data association, and all reported TypeScript errors. I'll also perform mock testing to ensure the core functionalities are working as expected.

Here's my plan to address the issues:

1.  **Define Supabase Table Types:** I'll start by defining the necessary TypeScript interfaces for your Supabase tables (`preview_sessions`, `page_views`, `feature_interactions`, `preview_leads`, `organizations`, `user_profiles`, `user_roles`, `notifications`, `assessments`, `assessment_responses`) in `lib/supabase.ts` and `lib/auth-service.ts`. This is crucial for resolving many `never` and `unknown` type errors.
2.  **Create Missing UI Components:** I'll create `components/ui/form.tsx` and `components/ui/sheet.tsx` as they are used but not defined.
3.  **Remove Redundant `MainNavigation` Imports:** The `MainNavigation` component is already in `RootLayout`, so I'll remove its imports from individual pages and adjust `app/layout.tsx` to handle its props correctly.
4.  **Fix JSX Syntax Errors:** I'll correct all reported JSX syntax errors (missing closing tags, unexpected tokens) in `app/risk-assessment/ai-assessment/page.tsx`, `app/risk-assessment/page.tsx`, and `app/solutions/page.tsx`. I will also remove the `dyad-problem-report` blocks.
5.  **Adjust `ai-sdk/google` Calls:** I'll remove the `maxTokens` property from `generateText` calls in `lib/ai-service.ts`.
6.  **Improve PDF Parsing Types:** I'll refine `PDFExtractionResult` and add type assertions in `lib/pdf-parser.ts` for `text` and metadata properties.
7.  **Correct Analytics Sorting:** I'll explicitly type `sort` function arguments in `app/analytics/page.tsx`.
8.  **Update `Notification` Interface and Mock Data:** I'll adjust the `Notification` interface and mock data in `app/dashboard/page.tsx` to match expected properties.
9.  **Add Missing UI Component Imports:** I'll add `Label` and `Input` imports to `app/policy-generator/page.tsx`.
10. **Refine Form Schema and Handlers:** I'll update `formSchema` in `app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx` for boolean fields and explicitly type `field` props.
11. **Standardize `Assessment` Interface:** I'll update the `Assessment` interface in `lib/supabase.ts` to match the transformed data structure used in `app/third-party-assessment/page.tsx`.
12. **Handle `unknown` Error Types:** I'll add type guards for `unknown` error objects in `app/vendor-assessment/[id]/page.tsx`.
13. **Type `map` Function Parameters:** I'll explicitly type parameters like `recommendation` and `option` in `map` functions.
14. **Add Null Checks for Carousel:** I'll add null checks for the `carousel` element in `app/solutions/page.tsx`.
15. **Fix `ThemeProviderProps`:** I'll adjust the `ThemeProvider` component in `components/theme-provider.tsx` to correctly handle the `children` prop.
16. **Enhance AuthContext Error Handling:** I'll add more detailed error logging to `refreshProfile` in `components/auth-context.tsx` and ensure `setLoading(false)` is always called.
17. **Review Assessment Service User Context:** I'll verify that `getCurrentUser` and assessment functions in `lib/assessment-service.ts` correctly use the authenticated user's ID and add more logging.

I will proceed with these changes now.

<dyad-write path="lib/supabase.ts" description="Defining TypeScript interfaces for Supabase tables to improve type safety across the application.">
import { createClient } from "@supabase/supabase-js"

// Safely get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Initialize client directly, assuming environment variables are set
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Typically false for server-side/API routes
    autoRefreshToken: false,
  },
})

console.log("✅ Supabase client initialized successfully")

export { supabase }

// Types for our database tables
export interface Assessment {
  id: string
  vendor_name: string
  vendor_email: string
  contact_person?: string | null
  assessment_type: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  sent_date: string
  completed_date?: string | null
  due_date?: string | null
  risk_score?: number | null
  risk_level: string
  company_size?: string | null
  custom_message?: string | null
  created_at: string
  updated_at: string
  user_id: string
  organization_id: string
  // Added properties for transformed data in third-party-assessment page
  responses?: any | null;
  completedVendorInfo?: any | null;
  assessmentAnswers?: Record<string, any> | null;
}

export interface AssessmentResponse {
  id: number
  assessment_id: string
  user_id: string
  organization_id: string
  vendor_info: {
    companyName: string
    contactName: string
    email: string
    phone?: string
    website?: string
    employeeCount?: string
    industry?: string
    description?: string
  }
  answers: Record<string, any>
  submitted_at: string
}

export interface PreviewSession {
  session_id: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  last_activity: string;
  total_time_spent?: number;
  converted_user_id?: string;
  converted_at?: string;
  created_at: string;
}

export interface PageView {
  id: number;
  session_id: string;
  page_path: string;
  page_title?: string;
  time_on_page?: number;
  created_at: string;
}

export interface FeatureInteraction {
  id: number;
  session_id: string;
  feature_name: string;
  action_type: string;
  feature_data?: any;
  created_at: string;
}

export interface PreviewLead {
  id: number;
  session_id: string;
  email?: string;
  name?: string;
  company?: string;
  phone?: string;
  interest_level: "high" | "medium" | "low";
  lead_source: string;
  notes?: string;
  followed_up?: boolean;
  created_at: string;
}

export interface Organization {
  id: string
  name: string
  slug: string
  domain?: string
  logo_url?: string
  settings: Record<string, any>
  subscription_plan: string
  subscription_status: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  organization_id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  phone?: string
  timezone: string
  language: string
  preferences: Record<string, any>
  last_active_at?: string
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  organization_id: string
  user_id: string
  role: "admin" | "manager" | "analyst" | "viewer"
  permissions: Record<string, any>
  created_at: string
}

export interface Notification {
  id: string
  organization_id: string
  user_id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read_at?: string
  created_at: string
}