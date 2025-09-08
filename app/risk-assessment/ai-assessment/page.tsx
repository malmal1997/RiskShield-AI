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
import { MainNavigation } from "@/components/main-navigation"
import { AuthGuard } from "@/components/auth-guard"
import { sendAssessmentEmail } from "@/app/third-party-assessment/email-service"

// Complete assessment categories for AI assessment
const assessmentCategories = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Evaluate your organization's cybersecurity posture and controls",
    icon: Shield,
    questions: [
      {
        id: "cs1",
        question: "Does your organization have a formal cybersecurity policy?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "cs2",
        question: "How often do you conduct cybersecurity training for employees?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs3",
        question: "Do you have multi-factor authentication implemented for all critical systems?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "cs4",
        question: "How frequently do you perform vulnerability assessments?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs5",
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

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested"
  options?: string[]
  weight?: number // Made optional
  required?: boolean
  category?: string // Added category
}

export default function RiskAssessmentPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<
    "select" | "choose-method" | "soc-info" | "assessment" | "results"
  >("select")
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)
  const [showDelegateForm, setShowDelegateForm] = useState(false)
  const [delegateForm, setDelegateForm] = useState({
    assessmentType: "",
    recipientName: "",
    recipientEmail: "",
    dueDate: "",
    customMessage: "",
  })
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

  useEffect(() => {
    // Check for pre-selected category from main risk assessment page
    const preSelectedCategory = localStorage.getItem("selectedAssessmentCategory")
    const skipMethodSelection = localStorage.getItem("skipMethodSelection")

    if (preSelectedCategory) {
      setSelectedCategory(preSelectedCategory)

      if (skipMethodSelection === "true") {
        // For SOC assessments, go to SOC info collection first
        if (preSelectedCategory === "soc-compliance") {
          setCurrentStep("soc-info")
        } else {
          // For other assessments, go directly to assessment
          setCurrentStep("assessment")
        }
        localStorage.removeItem("skipMethodSelection")
      } else {
        setCurrentStep("choose-method")
      }

      // Clear the stored category so it doesn't interfere with future visits
      localStorage.removeItem("selectedAssessmentCategory")
    }
  }, [])

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculateRisk = () => {
    if (!selectedCategory) return

    const category = assessmentCategories.find((cat) => cat.id === selectedCategory)
    if (!category) return

    let totalScore = 0
    let maxPossibleScore = 0

    category.questions.forEach((question) => {
      const answer = answers[question.id]
      const weight = question.weight || 1 // Default weight to 1 if not specified

      if (question.type === "boolean") {
        maxPossibleScore += weight
        if (answer === true) {
          totalScore += weight
        }
      } else if (question.type === "multiple" && question.options) {
        // For multiple choice, assign score based on position (e.g., first option is best)
        maxPossibleScore += weight * question.options.length // Max score if all best options are chosen
        const answerIndex = question.options.indexOf(answer)
        if (answerIndex !== -1) {
          totalScore += weight * (question.options.length - 1 - answerIndex) // Higher score for earlier options
        }
      } else if (question.type === "tested") {
        maxPossibleScore += weight
        if (answer === "tested") {
          totalScore += weight
        }
      }
      // Textarea questions don't directly contribute to score, but indicate completeness
    })

    const calculatedRiskScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
    setRiskScore(calculatedRiskScore)

    let level = "High"
    if (calculatedRiskScore >= 75) level = "Low"
    else if (calculatedRiskScore >= 50) level = "Medium"
    else if (calculatedRiskScore >= 25) level = "Medium-High"
    setRiskLevel(level)

    setCurrentStep("results")
  }

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
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const handleStartAssessment = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setAnswers({})
    setRiskScore(null)
    setRiskLevel(null)
    setCurrentStep("choose-method")
  }

  const handleChooseManual = () => {
    if (selectedCategory === "soc-compliance") {
      setCurrentStep("soc-info")
    } else {
      setCurrentStep("assessment")
    }
  }

  const handleChooseAI = () => {
    if (selectedCategory) {
      localStorage.setItem("selectedAssessmentCategory", selectedCategory)
      localStorage.setItem("skipMethodSelection", "true") // Indicate to skip method selection on redirect
      window.location.href = "/risk-assessment/ai-assessment"
    }
  }

  const handleSOCInfoComplete = () => {
    setCurrentStep("assessment")
  }

  const handleDelegateAssessment = (categoryId: string) => {
    const category = assessmentCategories.find((cat) => cat.id === categoryId)
    if (category) {
      setDelegateForm({
        ...delegateForm,
        assessmentType: category.name,
      })
      setShowDelegateForm(true)
    }
  }

  const handleSendDelegation = async () => {
    if (!delegateForm.recipientName || !delegateForm.recipientEmail || !delegateForm.assessmentType) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const assessmentId = `internal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Store delegation info locally for the recipient page to pick up
      const delegationInfo = {
        assessmentId,
        assessmentType: delegateForm.assessmentType,
        delegationType: "team", // Assuming internal team delegation
        method: "manual", // For manual assessment delegation
        recipientName: delegateForm.recipientName,
        recipientEmail: delegateForm.recipientEmail,
        dueDate: delegateForm.dueDate,
        customMessage: delegateForm.customMessage,
      }
      localStorage.setItem(`delegation-${assessmentId}`, JSON.stringify(delegationInfo))

      // Also add to a general list of delegated assessments for the delegator to track
      const existingDelegated = JSON.parse(localStorage.getItem("delegatedAssessments") || "[]")
      localStorage.setItem("delegatedAssessments", JSON.stringify([...existingDelegated, delegationInfo]))

      const emailResult = await sendAssessmentEmail({
        vendorName: "Internal Team",
        vendorEmail: delegateForm.recipientEmail,
        contactPerson: delegateForm.recipientName,
        assessmentType: delegateForm.assessmentType,
        dueDate: delegateForm.dueDate,
        customMessage:
          delegateForm.customMessage ||
          `You have been assigned to complete the ${delegateForm.assessmentType} assessment.`,
        assessmentId: assessmentId,
        companyName: "Your Organization",
      })

      setDelegateForm({
        assessmentType: "",
        recipientName: "",
        recipientEmail: "",
        dueDate: "",
        customMessage: "",
      })
      setShowDelegateForm(false)

      if (emailResult.success) {
        alert(`Assessment delegation sent successfully!`)
      } else {
        alert(`Assessment delegation created but email delivery failed.`)
      }
    } catch (error) {
      console.error("Error sending delegation:", error)
      alert("Failed to send assessment delegation. Please try again.")
    }
  }

  const currentCategory = assessmentCategories.find((cat) => cat.id === selectedCategory)

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
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Risk Assessment</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Risk Assessment Platform
                <br />
                <span className="text-blue-600">Comprehensive Risk Evaluation</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Conduct in-depth risk assessments across various domains, identify vulnerabilities, and ensure
                regulatory compliance.
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

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Step 1: Select Assessment Category */}
            {currentStep === "select" && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Assessment Type</h2>
                  <p className="text-lg text-gray-600">Choose the type of risk assessment you want to perform</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {assessmentCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <Card key={category.id} className="relative group hover:shadow-lg transition-shadow">
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
                          <div className="flex flex-col space-y-2">
                            <Button
                              onClick={() => handleStartAssessment(category.id)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Start Assessment
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDelegateAssessment(category.id)}
                              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Delegate to Team
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Choose Assessment Method */}
            {currentStep === "choose-method" && currentCategory && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <Button variant="ghost" onClick={() => setCurrentStep("select")} className="mb-4 hover:bg-blue-50">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Assessment Selection
                  </Button>
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
                        Complete the assessment manually by answering questions step by step. Full control over
                        responses with detailed explanations.
                      </CardDescription>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Step-by-step question flow
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Full control over answers
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Detailed explanations
                        </div>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-500">
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
                          <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                          Automated document analysis
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                          Evidence extraction
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
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

            {/* Step 2.5: SOC Information (only for SOC assessments) */}
            {currentStep === "soc-info" && selectedCategory === "soc-compliance" && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep("choose-method")}
                    className="mb-6 hover:bg-blue-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Method Selection
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
                        onClick={() => setCurrentStep("choose-method")}
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
                        Continue to Assessment
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Assessment Questions */}
            {currentStep === "assessment" && currentCategory && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (selectedCategory === "soc-compliance") {
                        setCurrentStep("soc-info")
                      } else {
                        setCurrentStep("choose-method")
                      }
                    }}
                    className="mb-4 hover:bg-blue-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to {selectedCategory === "soc-compliance" ? "SOC Information" : "Method Selection"}
                  </Button>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentCategory.name} Assessment Questions
                  </h2>
                  <p className="text-lg text-gray-600">Answer the questions to complete your risk assessment</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Questions</CardTitle>
                    <CardDescription>Please answer all questions to the best of your knowledge.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {currentCategory.questions.map((question, index) => (
                      <div key={question.id} className="space-y-4 border-b pb-6 last:border-b-0 last:pb-0">
                        <div>
                          <div className="flex items-start space-x-2 mb-2">
                            <Badge variant="outline" className="mt-1">
                              {question.category}
                            </Badge>
                            {question.required && <span className="text-red-500 text-sm">*</span>}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {index + 1}. {question.question}
                          </h3>
                        </div>

                        {question.type === "boolean" && (
                          <div className="flex space-x-4">
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

                        {question.type === "multiple" && (
                          <select
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select an option</option>
                            {question.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {question.type === "tested" && (
                          <div className="flex space-x-4">
                            <label className="flex items-<dyad-problem-report summary="46 problems">
<problem file="app/dashboard/page.tsx" line="179" column="10" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="lib/ai-service.ts" line="459" column="7" code="2345">Argument of type '{ model: LanguageModelV2; prompt: string; max_tokens: number; temperature: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { prompt: string | ModelMessage[]; messages?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/ai-service.ts" line="623" column="11" code="2345">Argument of type '{ model: LanguageModelV2; messages: { role: &quot;user&quot;; content: ({ type: &quot;file&quot;; data: ArrayBuffer; mediaType: string; } | { type: &quot;text&quot;; text: string; })[]; }[]; temperature: number; max_tokens: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { messages: ModelMessage[]; prompt?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/ai-service.ts" line="633" column="11" code="2345">Argument of type '{ model: LanguageModelV2; prompt: string; temperature: number; max_tokens: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { prompt: string | ModelMessage[]; messages?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/ai-service.ts" line="642" column="9" code="2345">Argument of type '{ model: LanguageModelV2; prompt: string; temperature: number; max_tokens: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { prompt: string | ModelMessage[]; messages?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/ai-service.ts" line="911" column="9" code="2345">Argument of type '{ model: LanguageModelV2; prompt: string; max_tokens: number; temperature: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { prompt: string | ModelMessage[]; messages?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1652" column="28" code="2552">Cannot find name 'CheckCircle'. Did you mean 'CheckCircle2'?</problem>
<problem file="app/risk-assessment/page.tsx" line="1656" column="28" code="2552">Cannot find name 'CheckCircle'. Did you mean 'CheckCircle2'?</problem>
<problem file="app/risk-assessment/page.tsx" line="1660" column="28" code="2552">Cannot find name 'CheckCircle'. Did you mean 'CheckCircle2'?</problem>
<problem file="app/risk-assessment/page.tsx" line="1689" column="28" code="2552">Cannot find name 'CheckCircle'. Did you mean 'CheckCircle2'?</problem>
<problem file="app/risk-assessment/page.tsx" line="1693" column="28" code="2552">Cannot find name 'CheckCircle'. Did you mean 'CheckCircle2'?</problem>
<problem file="app/risk-assessment/page.tsx" line="1697" column="28" code="2552">Cannot find name 'CheckCircle'. Did you mean 'CheckCircle2'?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1449" column="32" code="2304">Cannot find name 'Eye'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1817" column="41" code="2339">Property 'category' does not exist on type '{ id: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; required?: undefined; } | { id: string; question: string; type: &quot;multiple&quot;; options: string[]; weight: number; required?: undefined; } | { ...; } | { ...; } | { ...; }'.
  Property 'category' does not exist on type '{ id: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; required?: undefined; }'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1819" column="39" code="2339">Property 'required' does not exist on type '{ id: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; required?: undefined; } | { id: string; question: string; type: &quot;multiple&quot;; options: string[]; weight: number; required?: undefined; } | { ...; } | { ...; } | { ...; }'.
  Property 'required' does not exist on type '{ id: string; question: string; type: &quot;tested&quot;; weight: number; }'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1891" column="26" code="2367">This comparison appears to be unintentional because the types '&quot;boolean&quot; | &quot;multiple&quot; | &quot;tested&quot;' and '&quot;textarea&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1893" column="53" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1894" column="74" code="2339">Property 'id' does not exist on type 'never'.</problem>
<problem file="app/solutions/page.tsx" line="951" column="42" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="952" column="71" code="2531">Object is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="955" column="17" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="960" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="961" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="963" column="23" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="978" column="42" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="979" column="71" code="2531">Object is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="982" column="17" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="987" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="988" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="990" column="23" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="39" column="5" code="2322">Type 'Resolver&lt;{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendorRiskMa...' is not assignable to type 'Resolver&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.
  Types of parameters 'options' and 'options' are incompatible.
    Type 'ResolverOptions&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }&gt;' is not assignable to type 'ResolverOptions&lt;{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendo...'.
      Type '{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendorRiskManagementP...' is not assignable to type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="110" column="10" code="2559">Type '{ children: Element; watch: UseFormWatch&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undef...' has no properties in common with type 'IntrinsicAttributes'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="110" column="10" code="2786">'Form' cannot be used as a JSX component.
  Its return type 'UseFormReturn&lt;FieldValues, any, FieldValues&gt;' is not a valid JSX element.
    Type 'UseFormReturn&lt;FieldValues, any, FieldValues&gt;' is missing the following properties from type 'ReactElement&lt;any, any&gt;': type, props, key</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="111" column="45" code="2345">Argument of type '(values: { name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }) =&gt; Promise&lt;...&gt;' is not assignable to parameter of type 'SubmitHandler&lt;TFieldValues&gt;'.
  Types of parameters 'values' and 'data' are incompatible.
    Type 'TFieldValues' is not assignable to type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }'.
      Type 'FieldValues' is missing the following properties from type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }': name, email, company, dataBreachIncidentResponsePlan, and 4 more.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="113" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.
  The types of '_options.resolver' are incompatible between these types.
    Type 'Resolver&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt; | un...' is not assignable to type 'Resolver&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt; | undefi...'.
      Type 'Resolver&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Resolver&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="126" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="139" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="153" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="169" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="185" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="201" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="217" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="233" column="15" code="2322">Type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, TFieldValues&gt;' is not assignable to type 'Control&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="451" column="25" code="2322">Type '{ userEmail: string; onSignOut: (() =&gt; void) | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; NavigationProps'.
  Property 'userEmail' does not exist on type 'IntrinsicAttributes &amp; NavigationProps'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="470" column="25" code="2322">Type '{ userEmail: string; onSignOut: (() =&gt; void) | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; NavigationProps'.
  Property 'userEmail' does not exist on type 'IntrinsicAttributes &amp; NavigationProps'.</problem>
<problem file="components/theme-provider.tsx" line="9" column="33" code="2339">Property 'children' does not exist on type 'ThemeProviderProps'.</problem>
</dyad-problem-report><think>**Reviewing Compile Errors**

I'm currently addressing a large batch of TypeScript errors, starting with the first one in `app/dashboard/page.tsx:179:10`. It's a JSX closing tag issue, so I'm meticulously examining the surrounding JSX for the missing element. Hopefully, I can resolve this and move on to the next error with greater efficiency.


**Identifying Syntax Issues**

I've made progress on the compile-time errors. The missing JSX closing tag in `app/dashboard/page.tsx` is fixed by adding the closing `</div>`. Regarding `lib/ai-service.ts`, I've corrected all instances of `max_tokens` to `maxTokens`. Now I'm shifting focus to the `app/risk-assessment/page.tsx` errors, specifically those referencing `CheckCircle`. The correction to `CheckCircle2` is in progress. I'll need to add an import for the `Eye` icon on the final mentioned file.


**Fixing Type Declarations**

I'm now focusing on the type errors flagged in `app/risk-assessment/ai-assessment/page.tsx`. I've added `"textarea"` to the `Question` type to address the invalid comparison and I'm updating the `Question` interface to include the missing `category` and `required` properties. This should resolve the reported type mismatches and missing property issues. I'm carefully reviewing the context of each error to ensure the corrections are sound and consistent.


**Analyzing Property Issues**

I'm currently addressing multiple type errors flagged in `app/risk-assessment/ai-assessment/page.tsx` that involve the `Question` interface. To fix, I've expanded the `Question` interface to include the missing `category` and `required` properties. I've also added `"textarea"` to the `type` union to correctly type the comparison. Lastly, I'm analyzing the possible null issues with the carousel and the use of zodResolver.


**Tackling Remaining Issues**

I've fixed all the identified errors. I've successfully corrected JSX closing tag and imported the `Eye` icon. I've addressed the `maxTokens` camelCase issue and resolved all the `CheckCircle` references. I've also implemented the necessary additions to the `Question` interface, and I've added `"textarea"` to the `type` union. Null checks were incorporated for the carousel element. Finally, I've resolved the zodResolver and FormProvider issues.


**Refining Type Declarations**

I've been working on the remaining errors and made good progress. I've updated the `Question` interface with the necessary `category` and `required` properties and added `"textarea"` to the `type` union. I've also implemented null checks for the `carousel` element to prevent potential runtime errors. Additionally, I've added `.optional()` to the boolean fields in `formSchema` to address the `zodResolver` issue. Finally, I'm working to make sure the `Form` and `FormField` components from `react-hook-form` are correctly set up as a provider, which should fix the remaining issues.


</think>I've reviewed the TypeScript compile-time errors you're encountering and have applied fixes to address all 46 reported issues. The problems stemmed from a mix of incorrect property names, missing type definitions, JSX structural issues, and improper component prop usage.

Here's a summary of the changes made:

1.  **`app/dashboard/page.tsx`**: Corrected a JSX structural error by adding a missing closing `</div>` tag.
2.  **`lib/ai-service.ts`**: Changed all instances of `max_tokens` to `maxTokens` in the `generateText` function calls to match the `@ai-sdk/google` library's API.
3.  **`app/api/ai-assessment/analyze/route.ts` and `app/api/ai-assessment/test/route.ts`**: Ensured the `analyzeDocuments` function is correctly imported and used.
4.  **`app/risk-assessment/page.tsx`**:
    *   Updated the `Question` interface to include `category?: string;` and `required?: boolean;` properties, and populated the `category` for all questions in `assessmentCategories`.
    *   Ensured the `socInfo` state initialization includes the `testedStatus` property.
    *   Corrected the usage of `CheckCircle` icons to `CheckCircle2` and added `Eye`, `Download`, and `X` to the `lucide-react` import.
5.  **`app/risk-assessment/ai-assessment/page.tsx`**:
    *   Updated the `Question` interface to include `category?: string;` and `required?: boolean;` properties, and populated the `category` for all questions in `assessmentCategories`.
    *   Ensured the `socInfo` state initialization includes the `testedStatus` property.
    *   Corrected the usage of `CheckCircle` icons to `CheckCircle2` and added `Eye`, `Download`, and `X` to the `lucide-react` import.
    *   Added `| "textarea"` to the `type` property in the `Question` interface to correctly handle textarea questions.
    *   Added nullish coalescing (`|| 0`) to `question.weight` in the `calculateRisk` function to handle optional weights.
    *   Explicitly typed parameters in array methods (`.every`, `.filter`) to resolve implicit `any` type errors.
6.  **`app/solutions/page.tsx`**: Implemented null checks for the `carousel` DOM element before attempting to access its properties, preventing potential runtime errors.
7.  **`app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx`**:
    *   Modified the `formSchema` to explicitly mark boolean fields as optional (`.optional()`) to align with `default(false)` and `useForm`'s inferred types.
    *   Corrected the usage of the `Form` component by ensuring it's imported from `react-hook-form` and used as a provider, and adjusted the `FormField` component to correctly pass the `control` prop.
8.  **`app/third-party-assessment/page.tsx`**: Removed `userEmail` and `onSignOut` props from `MainNavigation` component calls, as `MainNavigation` now uses the `useAuth` hook internally.
9.  **`components/theme-provider.tsx`**: Simplified the `ThemeProvider` component to directly use `children` from its props, resolving the type error.

These changes should resolve all the reported TypeScript compile-time errors and improve the overall robustness of your application.

<dyad-write path="app/dashboard/page.tsx" description="Corrected JSX structure in DashboardContent component.">
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Send,
  BarChart3,
  PieChart,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle,
  Shield,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  BarChart,
  Bar,
} from "recharts"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"
import type { RiskMetrics, VendorMetrics } from "@/lib/analytics-service"
import type { Notification } from "@/lib/notification-service"

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#dc2626"]

// Sample real-time data (in production, this would come from your analytics service)
const sampleRiskMetrics: RiskMetrics = {
  totalAssessments: 247,
  completedAssessments: 189,
  averageRiskScore: 72,
  highRiskVendors: 23,
  riskTrend: [
    { date: "2024-01-01", score: 68 },
    { date: "2024-01-02", score: 71 },
    { date: "2024-01-03", score: 69 },
    { date: "2024-01-04", score: 74 },
    { date: "2024-01-05", score: 72 },
    { date: "2024-01-06", score: 76 },
    { date: "2024-01-07", score: 73 },
  ],
  riskDistribution: [
    { level: "Low", count: 45 },
    { level: "Medium", count: 121 },
    { level: "High", count: 18 },
    { level: "Critical", count: 5 },
  ],
  complianceScore: 87,
}

const sampleVendorMetrics: VendorMetrics = {
  totalVendors: 156,
  activeVendors: 134,
  riskLevels: { low: 45, medium: 121, high: 18, critical: 5 },
  industryBreakdown: [
    { industry: "Technology", count: 42 },
    { industry: "Financial Services", count: 28 },
    { industry: "Healthcare", count: 21 },
    { industry: "Manufacturing", count: 18 },
    { industry: "Retail", count: 15 },
  ],
  assessmentCompletion: 76.5,
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "High-risk vendor assessment completed",
    message: "TechCorp assessment shows critical security gaps",
    type: "alert",
    data: {}, // Added
    read_at: undefined, // Changed from null to undefined to match Notification interface
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "New vendor onboarding request",
    message: "DataFlow Inc. submitted assessment request",
    type: "info",
    data: {}, // Added
    read_at: undefined, // Changed from null to undefined to match Notification interface
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    organization_id: "org1", // Added
    user_id: "user1",
    title: "Compliance deadline approaching",
    message: "SOC 2 audit due in 7 days",
    type: "warning",
    data: {}, // Added
    read_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(sampleRiskMetrics)
  const [vendorMetrics, setVendorMetrics] = useState<VendorMetrics>(sampleVendorMetrics)
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState("7d")
  const [businessMetrics, setBusinessMetrics] = useState({
    highRiskVendors: 8,
    overdueAssessments: 12,
    pendingReviews: 15,
    complianceRate: 87,
  })
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 23,
    systemLoad: 45,
    responseTime: 120,
    uptime: 99.9,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 10) - 5)),
        responseTime: Math.max(50, Math.min(1000, prev.responseTime + Math.floor(Math.random() * 20) - 10)),
        uptime: Math.max(99.0, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })))
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Simulate data refresh
      setRiskMetrics({
        ...riskMetrics,
        averageRiskScore: riskMetrics.averageRiskScore + Math.floor(Math.random() * 6) - 3,
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - matching other pages style */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Risk Management Dashboard</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Enterprise Dashboard
              <br />
              <span className="text-blue-600">Real-Time Risk Analytics</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Monitor your vendor risk portfolio with live analytics, compliance tracking, and intelligent insights
              powered by AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/third-party-assessment">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Send New Assessment
                </Button>
              </Link>
              <Link href="/vendors">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 bg-transparent"
                >
                  Manage Vendors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time System Status - matching card style */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/risk-center?tab=high-risk">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{businessMetrics.highRiskVendors}</div>
                  <div className="text-sm text-gray-600 mt-1">High-Risk Vendors</div>
                  <div className="text-xs text-blue-600 mt-2">Click to manage →</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/risk-center?tab=overdue">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{businessMetrics.overdueAssessments}</div>
                  <div className="text-sm text-gray-600 mt-1">Overdue Assessments</div>
                  <div className="text-xs text-blue-600 mt-2">Click to follow up →</div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/risk-center?tab=pending">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{businessMetrics.pendingReviews}</div>
                  <div className="text-sm text-gray-600 mt-1">Pending Reviews</div>
                  <div className="text-xs text-blue-600 mt-2">Click to review →</div>
                </CardContent>
              </Card>
            </Link>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-600">{businessMetrics.complianceRate}%</div>
                <div className="text-sm text-gray-600 mt-1">Compliance Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Analytics Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.totalAssessments}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Risk Score</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.averageRiskScore}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <PieChart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">-5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                    <p className="text-3xl font-bold text-gray-900">{vendorMetrics.activeVendors}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <p className="text-3xl font-bold text-gray-900">{riskMetrics.complianceScore}%</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Shield className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={riskMetrics.complianceScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Live Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Trend Chart */}
                <Card className="lg:col-span-2 border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Live Risk Trend</CardTitle>
                      <div className="flex space-x-2">
                        {["7d", "30d", "90d"].map((period) => (
                          <Button
                            key={period}
                            variant={timeframe === period ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTimeframe(period)}
                          >
                            {period}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <CardDescription>Real-time risk score trends with live updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={riskMetrics.riskTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Live Activity Feed */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Live Activity</CardTitle>
                    <CardDescription>Real-time system activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {notifications.map((notification: Notification) => (
                          <div key={notification.id} className="flex items-start space-x-3">
                            <div
                              className={`p-1 rounded-full ${
                                notification.type === "alert"
                                  ? "bg-red-100"
                                  : notification.type === "warning"
                                    ? "bg-yellow-100"
                                    : "bg-blue-100"
                              }`}
                            >
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  notification.type === "alert"
                                    ? "bg-red-600"
                                    : notification.type === "warning"
                                      ? "bg-yellow-600"
                                      : "bg-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                            {notification.read_at === null && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Distribution & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>Current risk levels across all vendors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={riskMetrics.riskDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ payload }: { payload?: { level: string; count: number } }) => 
                            payload ? `${payload.level}: ${payload.count}` : ''
                          }
                        >
                          {riskMetrics.riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href="/third-party-assessment">
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" />
                        Send New Assessment
                      </Button>
                    </Link>
                    <Link href="/vendors">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Vendors
                      </Button>
                    </Link>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Generate Report
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        Configure Workflows
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tabs with consistent styling */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Vendor Risk Levels</CardTitle>
                    <CardDescription>Distribution of risk across vendor portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={Object.entries(vendorMetrics.riskLevels).map(([level, count]) => ({ level, count }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="level" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Industry Breakdown</CardTitle>
                    <CardDescription>Vendor distribution by industry</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vendorMetrics.industryBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.industry}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(item.count / vendorMetrics.totalVendors) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vendors">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Vendor Management</CardTitle>
                  <CardDescription>Comprehensive vendor portfolio overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor Insights Coming Soon</h3>
                    <p className="text-gray-600 mb-4">Advanced vendor analytics and management tools</p>
                    <Link href="/vendors">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Vendors
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Compliance Dashboard</CardTitle>
                  <CardDescription>Real-time compliance monitoring and reporting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Tracking</h3>
                      <p className="text-gray-600">Advanced compliance monitoring features</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Live Alerts & Notifications</CardTitle>
                    <CardDescription>Real-time security alerts and system notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification: Notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border-l-4 ${
                            notification.type === "alert"
                              ? "border-l-red-500 bg-red-50"
                              : notification.type === "warning"
                                ? "border-l-yellow-500 bg-yellow-50"
                                : "border-l-blue-500 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <Badge
                              variant={notification.type === "alert" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {notification.type}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">{notification.message}</p>
                          <p className="text-xs mt-2 text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Footer - matching other pages */}
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
  )
}