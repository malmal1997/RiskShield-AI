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
import { useAuth } from "@/components/auth-context"
import html2canvas from "html2canvas" // Import html2canvas
import ReportContent from "@/components/reports/ReportContent" // Import the new ReportContent component
import ReactDOM from 'react-dom/client'; // Import ReactDOM for client-side rendering

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
        weight: 9,
      },
      {
        id: "dp14",
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp15",
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "dp16",
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp17",
        question: "Do you have an IT asset management program?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp18",
        question: "Do you have restrictions on storage devices?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "dp19",
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp20",
        question: "Do you implement network segmentation?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp21",
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp22",
        question: "How frequently do you conduct vulnerability scanning?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 9,
      },
      {
        id: "dp23",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "dp24",
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "multiple" as const,
        options: ["None", "ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST"],
        weight: 10,
      },
      {
        id: "dp25",
        question: "Do you have a formal access control policy?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp26",
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "dp27",
        question: "Do you have defined password parameters and requirements?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp28",
        question: "Do you implement least privilege access principles?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp29",
        question: "How frequently do you conduct access reviews?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "dp30",
        question: "Do you require device authentication for network access?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp31",
        question: "Do you have secure remote logical access controls?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp32",
        question: "Do you have a third-party oversight program?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp33",
        question: "Do you assess third-party security controls?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp34",
        question: "Do you verify third-party compliance controls?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp35",
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp36",
        question: "Do you provide information security training to employees?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp37",
        question: "Do you provide privacy training to employees?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp38",
        question: "Do you provide role-specific compliance training?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "dp39",
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "dp40",
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp41",
        question: "Do you have a data management program?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp42",
        question: "Do you have a published privacy policy?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "dp43",
        question: "Do you have consumer data retention policies?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp44",
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "dp45",
        question: "Do you have data breach protocols?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "dp46",
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "dp47",
        question: "Do you collect NPI, PII, or PHI data?",
        type: "boolean" as const,
        weight: 10,
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
        question: "Are controls implemented to ensure processing completeness and accuracy?",
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

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested"
  options?: string[]
  weight: number
}

interface AIAnalysisResult {
  answers: Record<string, boolean | string>
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
      quote: string // Changed from excerpt
      relevance: string
      pageOrSection?: string
      pageNumber?: number // Added pageNumber
    }>
  >
}

export default function AIAssessmentPage() {
  const { signOut } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<
    "select" | "choose-method" | "soc-info" | "upload" | "processing" | "review" | "approve" | "results"
  >("select")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showDelegateForm, setShowDelegateForm] = useState(false)
  const [delegateForm, setDelegateForm] = useState({
    assessmentType: "",
    recipientName: "",
    recipientEmail: "",
    dueDate: "",
    customMessage: "",
  })
  const [approverInfo, setApproverInfo] = useState({
    name: "",
    title: "",
    role: "",
    signature: "",
  })
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    productName: "",
  })

  // SOC-specific state
  const [socInfo, setSocInfo] = useState({
    socType: "", // SOC 1, SOC 2, SOC 3
    reportType: "", // Type 1, Type 2
    auditor: "",
    auditorOpinion: "",
    auditorOpinionDate: "",
    socStartDate: "",
    socEndDate: "",
    socDateAsOf: "",
    testedStatus: "",
    exceptions: "",
    nonOperationalControls: "",
    companyName: "",
    productService: "",
    subserviceOrganizations: "",
    userEntityControls: "",
  })

  const [questionEditModes, setQuestionEditModes] = useState<Record<string, boolean>>({})
  const [questionUnsavedChanges, setQuestionUnsavedChanges] = useState<Record<string, boolean>>({})
  const [editedAnswers, setEditedAnswers] = useState<Record<string, boolean | string>>({})
  const [approvedQuestions, setApprovedQuestions] = useState<Set<string>>(new Set())
  const [editedReasoning, setEditedReasoning] = useState<Record<string, string>>({})
  const [editedEvidence, setEditedEvidence] = useState<
    Record<
      string,
      Array<{
        fileName: string
        quote: string // Changed from excerpt
        relevance: string
        pageOrSection?: string
        pageNumber?: number // Added pageNumber
      }>
    >
  >({})
  const [delegatedAssessments, setDelegatedAssessments] = useState<any[]>([])

  // Add these state variables after the existing state declarations
  const [isDelegatedAssessment, setIsDelegatedAssessment] = useState(false)
  const [delegatedAssessmentInfo, setDelegatedAssessmentInfo] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Add new state for SOC compliance dropdowns
  const [socTestingStatus, setSocTestingStatus] = useState<Record<string, "tested" | "un-tested">>({})
  const [socExceptionStatus, setSocExceptionStatus] = useState<Record<string, "exception" | "non-operational" | "">>({})

  const determineSOCStatus = (questionId: string, answer: any, reasoning: string, excerpts: any[]) => {
    const answerStr = String(answer).toLowerCase()
    const reasoningStr = reasoning.toLowerCase()
    const excerptText = excerpts
      .map((e) => e.quote || "") // Use excerpt.quote
      .join(" ")
      .toLowerCase()

    // Combine all text for analysis
    const allText = `${answerStr} ${reasoningStr} ${excerptText}`

    // Determine if tested based on keywords and context
    const testedKeywords = [
      "tested",
      "testing",
      "test",
      "verified",
      "validated",
      "audited",
      "reviewed",
      "assessed",
      "evaluated",
      "monitored",
      "checked",
    ]
    const untestedKeywords = [
      "not tested",
      "untested",
      "no testing",
      "not verified",
      "not validated",
      "not audited",
      "not reviewed",
      "not assessed",
      "not evaluated",
      "not monitored",
      "not checked",
    ]

    let status: "tested" | "un-tested" = "un-tested"
    let result: "operational" | "exception" | "non-operational" | "" = ""

    // Check for untested keywords first (more specific)
    if (untestedKeywords.some((keyword) => allText.includes(keyword))) {
      status = "un-tested"
    } else if (testedKeywords.some((keyword) => allText.includes(keyword))) {
      status = "tested"

      // If tested, determine the result
      const operationalKeywords = [
        "operational",
        "working",
        "functioning",
        "effective",
        "compliant",
        "adequate",
        "satisfactory",
        "implemented",
        "established",
        "documented",
      ]
      const exceptionKeywords = ["exception", "deficiency", "weakness", "gap", "issue", "problem", "concern", "finding"]
      const nonOperationalKeywords = [
        "non-operational",
        "not operational",
        "not working",
        "not functioning",
        "ineffective",
        "non-compliant",
        "inadequate",
        "unsatisfactory",
        "not implemented",
        "not established",
        "missing",
      ]

      if (nonOperationalKeywords.some((keyword) => allText.includes(keyword))) {
        result = "non-operational"
      } else if (exceptionKeywords.some((keyword) => allText.includes(keyword))) {
        result = "exception"
      } else if (
        operationalKeywords.some((keyword) => allText.includes(keyword)) ||
        answerStr === "yes" ||
        answerStr === "true"
      ) {
        result = "operational"
      } else {
        result = "operational" // Default to operational if tested but no clear indication
      }
    }

    return { status, result }
  }

  const handleSocExceptionStatusChange = (
    questionId: string,
    status: "operational" | "exception" | "non-operational" | "",
  ) => {
    setSocExceptionStatus((prev) => ({
      ...prev,
      [questionId]: status,
    }))
  }

  const handleSocTestingStatusChange = (questionId: string, status: "tested" | "un-tested") => {
    setSocTestingStatus((prev) => ({
      ...prev,
      [questionId]: status,
    }))
  }

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
          // For other assessments, go directly to upload
          setCurrentStep("upload")
        }
        localStorage.removeItem("skipMethodSelection")
      } else {
        setCurrentStep("choose-method")
      }

      // Clear the stored category so it doesn't interfere with future visits
      localStorage.removeItem("selectedAssessmentCategory")
    }
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
          }
        } catch (error) {
          console.error("Error parsing delegated assessment info:", error)
        }
      }
    }
  }, [])

  const handleAnswerEdit = (questionId: string, newAnswer: boolean | string) => {
    setEditedAnswers((prev) => ({
      ...prev,
      [questionId]: newAnswer,
    }))
    setQuestionUnsavedChanges((prev) => ({
      ...prev,
      [questionId]: true,
    }))
    // Remove approval when answer is edited
    setApprovedQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(questionId)
      return newSet
    })
  }

  const handleReasoningEdit = (questionId: string, newReasoning: string) => {
    setEditedReasoning((prev) => ({
      ...prev,
      [questionId]: newReasoning,
    }))
    setQuestionUnsavedChanges((prev) => ({
      ...prev,
      [questionId]: true,
    }))
    // Remove approval when reasoning is edited
    setApprovedQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(questionId)
      return newSet
    })
  }

  const handleEvidenceEdit = (
    questionId: string,
    newEvidence: Array<{
      fileName: string
      quote: string // Changed from excerpt
      relevance: string
      pageOrSection?: string
      pageNumber?: number // Added pageNumber
    }>,
  ) => {
    setEditedEvidence((prev) => ({
      ...prev,
      [questionId]: newEvidence,
    }))
    setQuestionUnsavedChanges((prev) => ({
      ...prev,
      [questionId]: true,
    }))
    // Remove approval when evidence is edited
    setApprovedQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(questionId)
      return newSet
    })
  }

  const addEvidenceItem = (questionId: string) => {
    const currentEvidence = editedEvidence[questionId] || aiAnalysisResult?.documentExcerpts?.[questionId] || []
    const newItem = {
      fileName: "",
      quote: "", // Changed from excerpt
      relevance: "",
      pageNumber: undefined, // Added pageNumber
    }
    handleEvidenceEdit(questionId, [...currentEvidence, newItem])
  }

  const removeEvidenceItem = (questionId: string, index: number) => {
    const currentEvidence = editedEvidence[questionId] || aiAnalysisResult?.documentExcerpts?.[questionId] || []
    const updatedEvidence = currentEvidence.filter((_, i) => i !== index)
    handleEvidenceEdit(questionId, updatedEvidence)
  }

  const updateEvidenceItem = (questionId: string, index: number, field: string, value: string | number) => {
    const currentEvidence = editedEvidence[questionId] || aiAnalysisResult?.documentExcerpts?.[question.id] || []
    const updatedEvidence = [...currentEvidence]
    updatedEvidence[index] = { ...updatedEvidence[index], [field]: value }
    handleEvidenceEdit(questionId, updatedEvidence)
  }

  const toggleQuestionEditMode = (questionId: string) => {
    setQuestionEditModes((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }))
  }

  const saveQuestionEdits = (questionId: string) => {
    setQuestionEditModes((prev) => ({
      ...prev,
      [questionId]: false,
    }))
    setQuestionUnsavedChanges((prev) => ({
      ...prev,
      [questionId]: false,
    }))
  }

  const cancelQuestionEdits = (questionId: string) => {
    // Remove any unsaved changes for this question
    setEditedAnswers((prev) => {
      const newAnswers = { ...prev }
      delete newAnswers[questionId]
      return newAnswers
    })
    setEditedReasoning((prev) => {
      const newReasoning = { ...prev }
      delete newReasoning[questionId]
      return newReasoning
    })
    setEditedEvidence((prev) => {
      const newEvidence = { ...prev }
      delete newEvidence[questionId]
      return newEvidence
    })
    setQuestionEditModes((prev) => ({
      ...prev,
      [questionId]: false,
    }))
    setQuestionUnsavedChanges((prev) => ({
      ...prev,
      [questionId]: false,
    }))
  }

  const handleQuestionApproval = (questionId: string) => {
    setApprovedQuestions((prev) => new Set([...prev, questionId]))
  }

  const handleQuestionUnapproval = (questionId: string) => {
    setApprovedQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(questionId)
      return newSet
    })
  }

  const saveEdits = () => {
    if (!aiAnalysisResult) return

    // Update the AI analysis result with edited answers, reasoning, and evidence
    const updatedResult = {
      ...aiAnalysisResult,
      answers: {
        ...aiAnalysisResult.answers,
        ...editedAnswers,
      },
      reasoning: {
        ...aiAnalysisResult.reasoning,
        ...editedReasoning,
      },
      documentExcerpts: {
        ...aiAnalysisResult.documentExcerpts,
        ...editedEvidence,
      },
    }

    // Recalculate risk score based on edited answers
    let totalScore = 0
    let maxScore = 0

    currentCategory?.questions.forEach((question) => {
      const answer = updatedResult.answers[question.id]

      if (question.type === "tested") {
        maxScore += question.weight
        if (answer === "tested") {
          totalScore += question.weight
        } else if (answer === "not_tested") {
          totalScore += 0
        }
      } else if (question.type === "boolean") {
        maxScore += question.weight
        totalScore += answer ? question.weight : 0
      } else if (question.type === "multiple" && question.options) {
        maxScore += question.weight * 4
        const optionIndex = question.options.indexOf(answer as string)
        if (optionIndex !== -1) {
          const scoreMultiplier = (question.options.length - 1 - optionIndex) / (question.options.length - 1)
          totalScore += question.weight * scoreMultiplier * 4
        }
      }
    })

    const newRiskScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    let newRiskLevel = "High"

    if (selectedCategory === "soc-compliance") {
      // SOC-specific risk levels
      if (newRiskScore >= 90) newRiskLevel = "Low"
      else if (newRiskScore >= 75) newRiskLevel = "Medium"
      else if (newRiskScore >= 50) newRiskLevel = "Medium-High"
      else newRiskLevel = "High"
    } else {
      // Standard risk levels
      if (newRiskScore >= 75) newRiskLevel = "Low"
      else if (newRiskScore >= 50) newRiskLevel = "Medium"
      else if (newRiskScore >= 25) newRiskLevel = "Medium-High"
    }

    updatedResult.riskScore = newRiskScore
    updatedResult.riskLevel = newRiskLevel

    setAiAnalysisResult(updatedResult)
    setIsEditMode(false)
    setHasUnsavedChanges(false)
    setEditedAnswers({})
    setEditedReasoning({})
    setEditedEvidence({})
  }

  const cancelEdits = () => {
    setEditedAnswers({})
    setEditedReasoning({})
    setEditedEvidence({})
    setIsEditMode(false)
    setHasUnsavedChanges(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || [])
    setUploadedFiles([...uploadedFiles, ...newFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const getFileStatusIcon = (file: File) => {
    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()

    // Fully supported formats
    if (
      fileType.includes("text/plain") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".csv") ||
      fileName.endsWith(".json") ||
      fileName.endsWith(".html") ||
      fileName.endsWith(".xml") ||
      fileName.endsWith(".js") ||
      fileName.endsWith(".ts") ||
      fileName.endsWith(".yml") ||
      fileName.endsWith(".yaml")
    ) {
      return <Check className="h-4 w-4 text-green-600" />
    }

    // Limited support (PDFs)
    if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }

    // Not supported
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getFileStatusText = (file: File) => {
    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()

    // Fully supported formats
    if (
      fileType.includes("text/plain") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".csv") ||
      fileName.endsWith(".json") ||
      fileName.endsWith(".html") ||
      fileName.endsWith(".xml") ||
      fileName.endsWith(".js") ||
      fileName.endsWith(".ts") ||
      fileName.endsWith(".yml") ||
      fileName.endsWith(".yaml")
    ) {
      return "Fully supported"
    }

    // Limited support (PDFs)
    if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
      return "Limited support - convert to .txt recommended"
    }

    // Not supported
    if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
      return "Not supported - copy content to .txt file"
    }

    if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
      return "Not supported - export as .csv file"
    }

    return "Unknown format - may not be supported"
  }

  const startAnalysis = async () => {
    if (!selectedCategory || uploadedFiles.length === 0) {
      alert("Please select files to analyze")
      return
    }

    if (!companyInfo.companyName.trim()) {
      alert("Please enter your company name")
      return
    }

    const category = assessmentCategories.find((cat) => cat.id === selectedCategory)
    if (!category) {
      alert("Invalid assessment category")
      return
    }

    setCurrentStep("processing")
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisError(null)
    setCompletedSteps([])

    try {
      const formData = new FormData()
      uploadedFiles.forEach((file) => {
        formData.append("files", file)
      })
      formData.append("questions", JSON.stringify(category.questions))
      formData.append("assessmentType", category.name)

      // Progress simulation
      const progressSteps = [
        { step: 0, progress: 25, delay: 1000 },
        { step: 1, progress: 50, delay: 1500 },
        { step: 2, progress: 75, delay: 1000 },
        { step: 3, progress: 90, delay: 500 },
      ]

      let currentStepIndex = 0
      const stepInterval = setInterval(() => {
        if (currentStepIndex < progressSteps.length) {
          const currentStepData = progressSteps[currentStepIndex]
          setCompletedSteps((prev) => [...prev, currentStepData.step])
          setAnalysisProgress(currentStepData.progress)
          currentStepIndex++
        } else {
          clearInterval(stepInterval)
        }
      }, 800)

      const response = await fetch("/api/ai-assessment/analyze", {
        method: "POST",
        body: formData,
      })

      clearInterval(stepInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Analysis failed: ${response.status}`)
      }

      const result: AIAnalysisResult = await response.json()
      setAnalysisProgress(100)
      setCompletedSteps([0, 1, 2, 3])
      setAiAnalysisResult(result)

      setTimeout(() => {
        setCurrentStep("review")
        setIsAnalyzing(false)
      }, 1000)
    } catch (error) {
      console.error("Error during AI analysis:", error)
      setAnalysisError(error instanceof Error ? error.message : "Analysis failed")
      setIsAnalyzing(false)
      setTimeout(() => {
        setCurrentStep("upload")
        setAnalysisProgress(0)
        setCompletedSteps([])
        setAnalysisError(null)
      }, 3000)
    }
  }

  const handleStartAssessment = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentStep("choose-method")
    setUploadedFiles([])
    setAiAnalysisResult(null)
    setAnalysisError(null)
    setAnalysisProgress(0)
    setCompletedSteps([])
  }

  const handleChooseManual = () => {
    const category = assessmentCategories.find((cat) => cat.id === selectedCategory)
    if (category) {
      localStorage.setItem("selectedAssessmentCategory", selectedCategory!)
      window.location.href = "/risk-assessment"
    }
  }

  const handleChooseAI = () => {
    if (selectedCategory === "soc-compliance") {
      setCurrentStep("soc-info")
    } else {
      setCurrentStep("upload")
    }
  }

  const handleSOCInfoComplete = () => {
    setCurrentStep("upload")
  }

  const handleDelegateAssessment = (categoryId: string) => {
    const category = assessmentCategories.find((cat) => cat.id === categoryId)
    if (category) {
      setDelegateForm({
        ...delegateForm,
        assessmentType: `${category.name} (AI-Powered)`,
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
      const assessmentId = `ai-internal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

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
        alert(`AI-Powered assessment delegation sent successfully!`)
      } else {
        alert(`Assessment delegation created but email delivery failed.`)
      }
    } catch (error) {
      console.error("Error sending AI delegation:", error)
      alert("Failed to send AI-powered assessment delegation. Please try again.")
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
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

  const analysisSteps = [
    {
      id: 0,
      title: "Document text extraction and preprocessing",
      description: "Extracting and cleaning text from uploaded documents",
    },
    {
      id: 1,
      title: "AI model analysis and question processing",
      description: "Processing questions through advanced language models",
    },
    {
      id: 2,
      title: "Evidence extraction and confidence scoring",
      description: "Identifying relevant excerpts and calculating confidence scores",
    },
    {
      id: 3,
      title: "Risk assessment and recommendations generation",
      description: "Generating final risk scores and actionable recommendations",
    },
  ]

  const currentCategory = assessmentCategories.find((cat) => cat.id === selectedCategory)
  const selectedFramework = assessmentCategories.find((cat) => cat.id === selectedCategory)

  const generateAndDownloadReport = async () => {
    if (!aiAnalysisResult || !currentCategory) return

    try {
      const { jsPDF } = await import("jspdf")

      // Create a temporary div to render the ReportContent component
      const reportContainer = document.createElement("div")
      reportContainer.style.position = "absolute"
      reportContainer.style.left = "-9999px" // Hide it off-screen
      reportContainer.style.width = "1200px" // Set a fixed width for consistent rendering
      document.body.appendChild(reportContainer)

      // Render the ReportContent component into the temporary div
      // We need to use ReactDOM.render or similar for React 18, but for simplicity,
      // we'll directly inject the HTML string from a virtual render.
      // A more robust solution would involve a dedicated server-side rendering or
      // a client-side render-to-string utility.
      // For now, we'll simulate by creating a React element and converting it to HTML.
      // This is a simplification and might not capture all React lifecycle effects.
      const root = ReactDOM.createRoot(reportContainer);
      root.render(
        <ReportContent
          aiAnalysisResult={aiAnalysisResult}
          currentCategory={currentCategory}
          approverInfo={approverInfo}
          companyInfo={companyInfo}
          socInfo={socInfo}
        />
      );

      // Wait for rendering to complete (a small delay might be needed for complex components)
      await new Promise(resolve => setTimeout(resolve, 100)); 

      const canvas = await html2canvas(reportContainer, {
        scale: 2, // Increase scale for better resolution
        useCORS: true,
        logging: false,
      })

      document.body.removeChild(reportContainer) // Clean up the temporary div

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      })

      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pdf.internal.pageSize.getHeight()
      }

      const fileName = `${currentCategory.name.replace(/\s+/g, "_")}_AI_Risk_Assessment_Report_${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF report. Please try again.")
    }
  }

  const allQuestionsApproved = currentCategory?.questions.every((q) => approvedQuestions.has(q.id)) || false

  // Add this function after the existing functions
  const handleDelegatedAssessmentCompletion = () => {
    if (isDelegatedAssessment && delegatedAssessmentInfo && aiAnalysisResult) {
      try {
        const existingDelegated = JSON.parse(localStorage.getItem("delegatedAssessments") || "[]")
        const updatedDelegated = existingDelegated.map((delegation: any) =>
          delegation.assessmentId === delegatedAssessmentInfo.assessmentId
            ? {
                ...delegation,
                status: "completed",
                completedDate: new Date().toISOString(),
                riskScore: aiAnalysisResult.riskScore,
                riskLevel: aiAnalysisResult.riskLevel,
              }
            : delegation,
        )
        localStorage.setItem("delegatedAssessments", JSON.stringify(updatedDelegated))
        console.log("✅ Delegated AI assessment marked as completed")
      } catch (error) {
        console.error("❌ Error updating delegated AI assessment:", error)
      }
    }
  }

  // Call this function when moving to results step
  const moveToResults = () => {
    setCurrentStep("results")
    handleDelegatedAssessmentCompletion()
  }

  useEffect(() => {
    if (aiAnalysisResult && selectedFramework?.id === "soc-compliance") {
      const newTestingStatus: Record<string, "tested" | "un-tested"> = {}
      const newExceptionStatus: Record<string, "operational" | "exception" | "non-operational" | ""> = {}

      selectedFramework.questions.forEach((question) => {
        const answer = aiAnalysisResult.answers[question.id]
        const reasoning = aiAnalysisResult.reasoning[question.id] || ""
        const excerpts = aiAnalysisResult.documentExcerpts?.[question.id] || []

        const { status, result } = determineSOCStatus(question.id, answer, reasoning, excerpts)
        newTestingStatus[question.id] = status
        if (status === "tested") {
          newExceptionStatus[question.id] = result
        }
      })

      setSocTestingStatus(newTestingStatus)
      setSocExceptionStatus(newExceptionStatus)
    }
  }, [aiAnalysisResult, selectedFramework])

  const [socManagementData, setSocManagementData] = useState({
    exceptions: [] as Array<{
      referencedControl: string
      controlDescription: string
      testingDescription: string
      auditorResponse: string
      managementResponse: string
    }>,
    deficiencies: [] as Array<{
      referencedControl: string
      controlDescription: string
      testingDescription: string
      auditorResponse: string
      managementResponse: string
    }>,
    userEntityControls: [] as Array<{
      commonCriteriaDescription: string
      description: string
    }>,
  })

  const addSOCItem = (type: "exceptions" | "deficiencies" | "userEntityControls") => {
    setSocManagementData((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        type === "userEntityControls"
          ? { commonCriteriaDescription: "", description: "" }
          : {
              referencedControl: "",
              controlDescription: "",
              testingDescription: "",
              auditorResponse: "",
              managementResponse: "",
            },
      ],
    }))
  }

  const removeSOCItem = (type: "exceptions" | "deficiencies" | "userEntityControls", index: number) => {
    setSocManagementData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const updateSOCItem = (
    type: "exceptions" | "deficiencies" | "userEntityControls",
    index: number,
    field: string,
    value: string,
  ) => {
    setSocManagementData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const handleSOCInfoSubmit = () => {
    setCurrentStep("upload")
  }

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Sign up to save assessments and access full AI features"
    >
      <div className="min-h-screen bg-white">
        <MainNavigation onSignOut={signOut} />

        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Brain className="mr-1 h-3 w-3" />
                {isDelegatedAssessment ? "Delegated AI Assessment" : "AI-Powered Assessment"}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                {isDelegatedAssessment ? "Complete Your AI-Powered" : "AI-Powered Risk Assessment"}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                {isDelegatedAssessment
                  ? `Complete the ${delegatedAssessmentInfo?.assessmentType} assessment using AI document analysis.`
                  : "Upload your documents and let our AI analyze them for security risks, compliance issues, and vulnerabilities"}
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
                      <strong>Method:</strong> AI-Powered Analysis
                    </p>
                  </div>
                </div>
              )}
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
                              <Bot className="mr-2 h-4 w-4" />
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
                <div className="mb-8">
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
                        Complete the assessment manually by answering questions step by step. Full control over responses
                        with detailed explanations.
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
                        onClick={handleSOCInfoSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                      >
                        Continue to Upload
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Upload Documents */}
            {currentStep === "upload" && currentCategory && (
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Documents for AI Analysis</h2>
                  <p className="text-lg text-gray-600">
                    Upload your documents for{" "}
                    <span className="font-semibold text-blue-600">{currentCategory?.name}</span>
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Company Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="mr-2 h-5 w-5" />
                        Company Information
                      </CardTitle>
                      <CardDescription>Provide basic information about your organization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={companyInfo.companyName}
                            onChange={(e) => setCompanyInfo((prev) => ({ ...prev, companyName: e.target.value }))}
                            placeholder="Enter your company name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="productName">Product/Service (Optional)</Label>
                          <Input
                            id="productName"
                            value={companyInfo.productName}
                            onChange={(e) => setCompanyInfo((prev) => ({ ...prev, productName: e.target.value }))}
                            placeholder="Main product or service"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* File Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Upload className="mr-2 h-5 w-5" />
                        Document Upload
                      </CardTitle>
                      <CardDescription>
                        Upload documents related to your {currentCategory?.name?.toLowerCase()} practices
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-900">Upload your documents</p>
                          <p className="text-sm text-gray-600">Drag and drop files here, or click to browse</p>
                          <p className="text-xs text-gray-500">
                            Supported: TXT, PDF, MD, CSV, JSON, HTML, XML, JS, TS, YML
                          </p>
                        </div>
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="mt-4"
                          accept=".txt,.pdf,.md,.csv,.json,.html,.xml,.js,.ts,.yml,.yaml"
                        />
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-900 mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <div className="flex items-center space-x-2">
                                      {getFileStatusIcon(file)}
                                      <p className="text-xs text-gray-500">{getFileStatusText(file)}</p>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex justify-between">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-2">File Support Status:</p>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                              <span>Fully supported: TXT, MD, CSV, JSON, HTML, XML, JS, TS, YML</span>
                            </div>
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                              <span>Limited support: PDF (convert to TXT for best results)</span>
                            </div>
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-red-600 mr-2" />
                              <span>Not supported: DOC, DOCX, XLS, XLSX</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={startAnalysis}
                          disabled={uploadedFiles.length === 0 || !companyInfo.companyName.trim()}
                          className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Cpu className="mr-2 h-4 w-4" />
                          Start AI Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: AI Processing */}
            {currentStep === "processing" && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Analysis in Progress</h2>
                  <p className="text-lg text-gray-600">
                    Our AI is analyzing your documents for {currentCategory?.name} assessment
                  </p>
                </div>

                <Card>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                          <Bot className="h-8 w-8 text-blue-600 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Documents</h3>
                        <p className="text-gray-600">This may take a few minutes depending on document size</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="w-full" />
                      </div>

                      <div className="space-y-4">
                        {analysisSteps.map((step) => (
                          <div key={step.id} className="flex items-center space-x-4">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                completedSteps.includes(step.id)
                                  ? "bg-green-600 border-green-600 text-white"
                                  : analysisProgress > step.id * 25
                                    ? "bg-blue-600 border-blue-600 text-white animate-pulse"
                                    : "bg-white border-gray-300 text-gray-500"
                              }`}
                            >
                              {completedSteps.includes(step.id) ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <span className="text-sm font-semibold">{step.id + 1}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{step.title}</p>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {analysisError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                            <p className="text-red-800 font-medium">Analysis Error</p>
                          </div>
                          <p className="text-red-700 mt-1">{analysisError}</p>
                          <p className="text-red-600 text-sm mt-2">Returning to upload step...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 5: Review Results */}
            {currentStep === "review" && aiAnalysisResult && currentCategory && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Analysis Results</h2>
                  <p className="text-lg text-gray-600">
                    Review the AI-generated assessment for {currentCategory?.name}
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{aiAnalysisResult.riskScore}%</div>
                        <p className="text-sm text-gray-600">Risk Score</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Badge className={`text-sm px-3 py-1 ${getRiskLevelColor(aiAnalysisResult.riskLevel)}`}>
                          {aiAnalysisResult.riskLevel} Risk
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">Risk Level</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {aiAnalysisResult.documentsAnalyzed}
                        </div>
                        <p className="text-sm text-gray-600">Documents Analyzed</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Questions and Answers */}
                  <div className="space-y-6">
                    {currentCategory.questions.map((question, index) => {
                      const answer = editedAnswers[question.id] ?? aiAnalysisResult.answers[question.id]
                      const reasoning =
                        editedReasoning[question.id] ??
                        aiAnalysisResult.reasoning[question.id] ??
                        "No reasoning provided"
                      const excerpts =
                        editedEvidence[question.id] ?? aiAnalysisResult.documentExcerpts?.[question.id] ?? []
                      const isApproved = approvedQuestions.has(question.id)

                      return (
                        <Card key={question.id} className={`${isApproved ? "border-green-500 bg-green-50" : ""}`}>
                          <CardContent className="p-6">
                            <div className="space-y-6">
                              {/* Edit Controls - Remove global edit mode, keep only approval counter */}
                              <div className="flex justify-end items-center">
                                <div className="text-sm text-gray-600">
                                  Approved: {approvedQuestions.size} / {currentCategory.questions.length}
                                </div>
                              </div>

                              {/* Question Header */}
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {index + 1}. {question.question}
                                  </h3>
                                  <div className="flex items-center space-x-4">
                                    <Badge variant="outline">Weight: {question.weight}</Badge>
                                    <Badge variant="outline">
                                      Confidence:{" "}
                                      {Math.round((aiAnalysisResult.confidenceScores[question.id] || 0) * 100)}%
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {questionEditModes[question.id] ? (
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() => saveQuestionEdits(question.id)}
                                        disabled={!questionUnsavedChanges[question.id]}
                                        className="bg-blue-600 hover:bg-blue-500 text-white"
                                      >
                                        <Save className="mr-1 h-4 w-4" />
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => cancelQuestionEdits(question.id)}
                                        className="hover:bg-gray-50"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => toggleQuestionEditMode(question.id)}
                                        className="hover:bg-blue-50"
                                      >
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                      </Button>
                                      {isApproved ? (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleQuestionUnapproval(question.id)}
                                          className="text-green-600 border-green-600 hover:bg-green-50"
                                        >
                                          <CheckCircle className="mr-1 h-4 w-4" />
                                          Approved
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          onClick={() => handleQuestionApproval(question.id)}
                                          className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                          <Check className="mr-1 h-4 w-4" />
                                          Approve
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Answer Section */}
                                <div className="space-y-4">
                                  <h4 className="font-medium text-gray-900">{isApproved ? "Answer" : "AI Answer"}</h4>
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    {questionEditModes[question.id] ? (
                                      question.type === "boolean" ? (
                                        <div className="flex space-x-4">
                                          <label className="flex items-center">
                                            <input
                                              type="radio"
                                              name={`question-${question.id}`}
                                              checked={answer === true}
                                              onChange={() => handleAnswerEdit(question.id, true)}
                                              className="mr-2"
                                            />
                                            Yes
                                          </label>
                                          <label className="flex items-center">
                                            <input
                                              type="radio"
                                              name={`question-${question.id}`}
                                              checked={answer === false}
                                              onChange={() => handleAnswerEdit(question.id, false)}
                                              className="mr-2"
                                            />
                                            No
                                          </label>
                                        </div>
                                      ) : question.type === "tested" ? (
                                        <div className="flex space-x-4">
                                          <label className="flex items-center">
                                            <input
                                              type="radio"
                                              name={`question-${question.id}`}
                                              checked={answer === "tested"}
                                              onChange={() => handleAnswerEdit(question.id, "tested")}
                                              className="mr-2"
                                            />
                                            Tested
                                          </label>
                                          <label className="flex items-center">
                                            <input
                                              type="radio"
                                              name={`question-${question.id}`}
                                              checked={answer === "not_tested"}
                                              onChange={() => handleAnswerEdit(question.id, "not_tested")}
                                              className="mr-2"
                                            />
                                            Not Tested
                                          </label>
                                        </div>
                                      ) : (
                                        <select
                                          value={answer as string}
                                          onChange={(e) => handleAnswerEdit(question.id, e.target.value)}
                                          className="w-full p-2 border border-gray-300 rounded"
                                        >
                                          {question.options?.map((option) => (
                                            <option key={option} value={option}>
                                              {option}
                                            </option>
                                          ))}
                                        </select>
                                      )
                                    ) : (
                                      <p className="font-semibold text-blue-800">
                                        {question.type === "boolean"
                                          ? typeof answer === "boolean"
                                            ? answer
                                              ? "Yes"
                                              : "No"
                                            : String(answer)
                                          : question.type === "tested"
                                            ? answer === "tested"
                                              ? "Tested"
                                              : answer === "not_tested"
                                                ? "Not Tested"
                                                : String(answer)
                                            : String(answer)}
                                      </p>
                                    )}
                                  </div>

                                  <h4 className="font-medium text-gray-900">
                                    {isApproved ? "Reasoning" : "AI Reasoning"}
                                  </h4>
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    {questionEditModes[question.id] ? (
                                      <textarea
                                        value={reasoning}
                                        onChange={(e) => handleReasoningEdit(question.id, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
                                      />
                                    ) : (
                                      <p className="text-gray-700">{reasoning}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Evidence Section - Show ALL evidence */}
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-gray-900">
                                      {isApproved ? "Document Evidence" : "Document Analysis"}
                                    </h4>
                                    {questionEditModes[question.id] && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addEvidenceItem(question.id)}
                                        className="hover:bg-blue-50"
                                      >
                                        Add Evidence
                                      </Button>
                                    )}
                                  </div>
                                  <div className="space-y-3">
                                    {excerpts.length > 0 ? (
                                      excerpts.map((excerpt, excerptIndex) => (
                                        <div
                                          key={excerptIndex}
                                          className="bg-green-50 border border-green-200 rounded-lg p-4"
                                        >
                                          {questionEditModes[question.id] ? (
                                            <div className="space-y-2">
                                              <div className="flex justify-between items-center">
                                                <input
                                                  type="text"
                                                  value={excerpt.fileName}
                                                  onChange={(e) =>
                                                    updateEvidenceItem(
                                                      question.id,
                                                      excerptIndex,
                                                      "fileName",
                                                      e.target.value,
                                                    )
                                                  }
                                                  placeholder="File name"
                                                  className="flex-1 p-1 border border-gray-300 rounded text-sm"
                                                />
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => removeEvidenceItem(question.id, excerptIndex)}
                                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                                                >
                                                  <X className="h-4 w-4" />
                                                </Button>
                                              </div>
                                              <textarea
                                                value={excerpt.quote} // Use excerpt.quote
                                                onChange={(e) =>
                                                  updateEvidenceItem(
                                                    question.id,
                                                    excerptIndex,
                                                    "quote", // Update 'quote' field
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder="Evidence quote"
                                                className="w-full p-2 border border-gray-300 rounded text-sm min-h-[60px]"
                                              />
                                              <input
                                                type="text"
                                                value={excerpt.relevance || ""}
                                                onChange={(e) =>
                                                  updateEvidenceItem(
                                                    question.id,
                                                    excerptIndex,
                                                    "relevance",
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder="Relevance explanation"
                                                className="w-full p-1 border border-gray-300 rounded text-sm"
                                              />
                                              <input
                                                type="number" // Input for page number
                                                value={excerpt.pageNumber || ""}
                                                onChange={(e) =>
                                                  updateEvidenceItem(
                                                    question.id,
                                                    excerptIndex,
                                                    "pageNumber",
                                                    Number(e.target.value),
                                                  )
                                                }
                                                placeholder="Page number"
                                                className="w-full p-1 border border-gray-300 rounded text-sm"
                                              />
                                            </div>
                                          ) : (
                                            <>
                                              <p className="text-sm text-green-800 italic mb-2">
                                                "{excerpt.quote}"{" "}
                                                {excerpt.fileName && `(Document: ${excerpt.fileName}`}
                                                {excerpt.pageNumber && `, Page ${excerpt.pageNumber}`}
                                                {(excerpt.fileName || excerpt.pageNumber) && `)`}
                                              </p>
                                              {excerpt.relevance && (
                                                <p className="text-xs text-green-600">Relevance: {excerpt.relevance}</p>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-sm text-yellow-800">
                                          No specific evidence found in documents
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {selectedCategory === "soc-compliance" && (
                                    <div className="flex justify-end mt-4">
                                      <div className="flex flex-col space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <label className="text-sm font-medium text-gray-700 min-w-[60px]">
                                            Status:
                                          </label>
                                          <select
                                            value={socTestingStatus[question.id] || ""}
                                            onChange={(e) =>
                                              handleSocTestingStatusChange(
                                                question.id,
                                                e.target.value as "tested" | "un-tested",
                                              )
                                            }
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          >
                                            <option value="">Select...</option>
                                            <option value="tested">Tested</option>
                                            <option value="un-tested">Un-tested</option>
                                          </select>
                                        </div>

                                        {socTestingStatus[question.id] === "tested" && (
                                          <div className="flex items-center space-x-2">
                                            <label className="text-sm font-medium text-gray-700 min-w-[60px]">
                                              Result:
                                            </label>
                                            <select
                                              value={socExceptionStatus[question.id] || ""}
                                              onChange={(e) =>
                                                handleSocExceptionStatusChange(
                                                  question.id,
                                                  e.target.value as
                                                    | "operational"
                                                    | "exception"
                                                    | "non-operational"
                                                    | "",
                                                )
                                              }
                                              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                              <option value="">Select...</option>
                                              <option value="operational">Operational</option>
                                              <option value="exception">Exception</option>
                                              <option value="non-operational">Non-Operational</option>
                                            </select>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {selectedCategory === "soc-compliance" && (
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="mr-2 h-5 w-5" />
                          SOC Compliance Management
                        </CardTitle>
                        <CardDescription>
                          Manage exceptions, deficiencies, and user entity controls for your SOC assessment
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {/* Exceptions Section */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Exceptions</h3>
                            <Button
                              size="sm"
                              onClick={() => addSOCItem("exceptions")}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="mr-1 h-4 w-4" />
                              Add Exception
                            </Button>
                          </div>
                          {socManagementData.exceptions.map((exception, index) => (
                            <Card key={index} className="border-orange-200 bg-orange-50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-medium text-gray-900">Exception {index + 1}</h4>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeSOCItem("exceptions", index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`exception-control-${index}`}>Referenced Control</Label>
                                    <Input
                                      id={`exception-control-${index}`}
                                      value={exception.referencedControl}
                                      onChange={(e) =>
                                        updateSOCItem("exceptions", index, "referencedControl", e.target.value)
                                      }
                                      placeholder="e.g., CC6.1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`exception-description-${index}`}>Control Description</Label>
                                    <Input
                                      id={`exception-description-${index}`}
                                      value={exception.controlDescription}
                                      onChange={(e) =>
                                        updateSOCItem("exceptions", index, "controlDescription", e.target.value)
                                      }
                                      placeholder="Brief description of the control"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label htmlFor={`exception-testing-${index}`}>Testing Description</Label>
                                    <Textarea
                                      id={`exception-testing-${index}`}
                                      value={exception.testingDescription}
                                      onChange={(e) =>
                                        updateSOCItem("exceptions", index, "testingDescription", e.target.value)
                                      }
                                      placeholder="Describe the testing performed"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label htmlFor={`exception-auditor-${index}`}>Auditor's Response</Label>
                                    <Textarea
                                      id={`exception-auditor-${index}`}
                                      value={exception.auditorResponse}
                                      onChange={(e) =>
                                        updateSOCItem("exceptions", index, "auditorResponse", e.target.value)
                                      }
                                      placeholder="Auditor's findings and response"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label htmlFor={`exception-mgmt-${index}`}>Management Response (if provided)</Label>
                                    <Textarea
                                      id={`exception-mgmt-${index}`}
                                      value={exception.managementResponse}
                                      onChange={(e) =>
                                        updateSOCItem("exceptions", index, "managementResponse", e.target.value)
                                      }
                                      placeholder="Management's response to the exception (optional)"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {socManagementData.exceptions.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              No exceptions added yet. Click "Add Exception" to get started.
                            </div>
                          )}
                        </div>

                        {/* Deficiencies/Non-Operational Controls Section */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Deficiencies/Non-Operational Controls
                            </h3>
                            <Button
                              size="sm"
                              onClick={() => addSOCItem("deficiencies")}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="mr-1 h-4 w-4" />
                              Add Deficiency
                            </Button>
                          </div>
                          {socManagementData.deficiencies.map((deficiency, index) => (
                            <Card key={index} className="border-red-200 bg-red-50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-medium text-gray-900">
                                    Deficiency/Non-Operational Control {index + 1}
                                  </h4>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeSOCItem("deficiencies", index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`deficiency-control-${index}`}>Referenced Control</Label>
                                    <Input
                                      id={`deficiency-control-${index}`}
                                      value={deficiency.referencedControl}
                                      onChange={(e) =>
                                        updateSOCItem("deficiencies", index, "referencedControl", e.target.value)
                                      }
                                      placeholder="e.g., CC6.1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`deficiency-description-${index}`}>Control Description</Label>
                                    <Input
                                      id={`deficiency-description-${index}`}
                                      value={deficiency.controlDescription}
                                      onChange={(e) =>
                                        updateSOCItem("deficiencies", index, "controlDescription", e.target.value)
                                      }
                                      placeholder="Brief description of the control"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label htmlFor={`deficiency-testing-${index}`}>Testing Description</Label>
                                    <Textarea
                                      id={`deficiency-testing-${index}`}
                                      value={deficiency.testingDescription}
                                      onChange={(e) =>
                                        updateSOCItem("deficiencies", index, "testingDescription", e.target.value)
                                      }
                                      placeholder="Describe the testing performed"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label htmlFor={`deficiency-auditor-${index}`}>Auditor's Response</Label>
                                    <Textarea
                                      id={`deficiency-auditor-${index}`}
                                      value={deficiency.auditorResponse}
                                      onChange={(e) =>
                                        updateSOCItem("deficiencies", index, "auditorResponse", e.target.value)
                                      }
                                      placeholder="Auditor's findings and response"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label htmlFor={`deficiency-mgmt-${index}`}>
                                      Management Response (if provided)
                                    </Label>
                                    <Textarea
                                      id={`deficiency-mgmt-${index}`}
                                      value={deficiency.managementResponse}
                                      onChange={(e) =>
                                        updateSOCItem("deficiencies", index, "managementResponse", e.target.value)
                                      }
                                      placeholder="Management's response to the deficiency (optional)"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {socManagementData.deficiencies.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              No deficiencies added yet. Click "Add Deficiency" to get started.
                            </div>
                          )}
                        </div>

                        {/* User Entity Controls Section */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">User Entity Controls</h3>
                            <Button
                              size="sm"
                              onClick={() => addSOCItem("userEntityControls")}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="mr-1 h-4 w-4" />
                              Add User Entity Control
                            </Button>
                          </div>
                          {socManagementData.userEntityControls.map((control, index) => (
                            <Card key={index} className="border-blue-200 bg-blue-50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-medium text-gray-900">User Entity Control {index + 1}</h4>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeSOCItem("userEntityControls", index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor={`uec-common-criteria-${index}`}>Common Criteria Description</Label>
                                    <Textarea
                                      id={`uec-common-criteria-${index}`}
                                      value={control.commonCriteriaDescription}
                                      onChange={(e) =>
                                        updateSOCItem(
                                          "userEntityControls",
                                          index,
                                          "commonCriteriaDescription",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Describe the common criteria that applies to this control"
                                      rows={3}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`uec-description-${index}`}>Control Description</Label>
                                    <Textarea
                                      id={`uec-description-${index}`}
                                      value={control.description}
                                      onChange={(e) =>
                                        updateSOCItem("userEntityControls", index, "description", e.target.value)
                                      }
                                      placeholder="Describe the specific control that user entities should implement"
                                      rows={4}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {socManagementData.userEntityControls.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              No user entity controls added yet. Click "Add User Entity Control" to get started.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Overall Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Overall Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <p className="text-blue-900">{aiAnalysisResult.overallAnalysis}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Important Disclaimer */}
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Disclaimer</h3>
                          <p className="text-yellow-700">
                            This assessment was generated using AI technology and should be reviewed by qualified
                            professionals. RiskGuard AI may make mistakes. Please use with discretion and verify results
                            with internal expertise.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Factors and Recommendations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {aiAnalysisResult.riskFactors.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-red-600">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            Risk Factors
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiAnalysisResult.riskFactors.map((factor, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                <span className="text-gray-700">{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {aiAnalysisResult.recommendations.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-green-600">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiAnalysisResult.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span className="text-gray-700">{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("upload")} className="hover:bg-gray-50">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Upload
                    </Button>
                    <Button
                      onClick={() => setCurrentStep("approve")}
                      disabled={!allQuestionsApproved}
                      className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Proceed to Approval
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Approval */}
            {currentStep === "approve" && aiAnalysisResult && currentCategory && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Approval</h2>
                  <p className="text-lg text-gray-600">
                    Provide approval information and download your assessment report
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Assessment Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Assessment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="text-3xl font-bold text-blue-600 mb-2">{aiAnalysisResult.riskScore}%</div>
                          <p className="text-sm text-gray-600">Risk Score</p>
                        </div>
                        <div>
                          <Badge className={`text-sm px-3 py-1 ${getRiskLevelColor(aiAnalysisResult.riskLevel)}`}>
                            {aiAnalysisResult.riskLevel} Risk
                          </Badge>
                          <p className="text-sm text-gray-600 mt-2">Risk Level</p>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            {currentCategory.questions.length}
                          </div>
                          <p className="text-sm text-gray-600">Questions Approved</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Approver Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileCheck className="mr-2 h-5 w-5" />
                        Approver Information
                      </CardTitle>
                      <CardDescription>Provide information about the person approving this assessment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="approverName">Full Name *</Label>
                          <Input
                            id="approverName"
                            value={approverInfo.name}
                            onChange={(e) => setApproverInfo((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="approverTitle">Job Title *</Label>
                          <Input
                            id="approverTitle"
                            value={approverInfo.title}
                            onChange={(e) => setApproverInfo((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Chief Risk Officer"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="approverRole">Role in Assessment *</Label>
                          <Input
                            id="approverRole"
                            value={approverInfo.role}
                            onChange={(e) => setApproverInfo((prev) => ({ ...prev, role: e.target.value }))}
                            placeholder="e.g., Assessment Reviewer"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="approverSignature">Digital Signature *</Label>
                          <Input
                            id="approverSignature"
                            value={approverInfo.signature}
                            onChange={(e) => setApproverInfo((prev) => ({ ...prev, signature: e.target.value }))}
                            placeholder="Type your name as signature"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("review")} className="hover:bg-gray-50">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Review
                    </Button>
                    <Button
                      onClick={moveToResults}
                      disabled={
                        !approverInfo.name || !approverInfo.title || !approverInfo.role || !approverInfo.signature
                      }
                      className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Complete Assessment
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Results */}
            {currentStep === "results" && aiAnalysisResult && currentCategory && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>
                  <p className="text-lg text-gray-600">Your {currentCategory.name} has been completed and approved</p>
                  {isDelegatedAssessment && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                      <p className="text-sm text-green-800">
                        ✅ This delegated assessment has been completed and the results have been saved.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  {/* Final Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Final Assessment Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div>
                          <div className="text-3xl font-bold text-blue-600 mb-2">{aiAnalysisResult.riskScore}%</div>
                          <p className="text-sm text-gray-600">Risk Score</p>
                        </div>
                        <div>
                          <Badge className={`text-sm px-3 py-1 ${getRiskLevelColor(aiAnalysisResult.riskLevel)}`}>
                            {aiAnalysisResult.riskLevel} Risk
                          </Badge>
                          <p className="text-sm text-gray-600 mt-2">Risk Level</p>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            {aiAnalysisResult.documentsAnalyzed}
                          </div>
                          <p className="text-sm text-gray-600">Documents Analyzed</p>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            {currentCategory.questions.length}
                          </div>
                          <p className="text-sm text-gray-600">Questions Assessed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Download Report */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Download className="mr-2 h-5 w-5" />
                        Download Assessment Report
                      </CardTitle>
                      <CardDescription>
                        Generate and download a comprehensive PDF report of your assessment results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={generateAndDownloadReport}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF Report
                        </Button>
                        <Button variant="outline" className="flex-1 hover:bg-gray-50 bg-transparent">
                          <Send className="mr-2 h-4 w-4" />
                          Email Report
                        </Button>
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">PDF Report Contents</p>
                            <p className="text-sm text-blue-700 mt-1">
                              The PDF report includes all assessment questions, AI-generated answers, evidence excerpts,
                              risk analysis, recommendations, and approval information in a professional format.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentStep("select")
                            setSelectedCategory(null)
                            setUploadedFiles([])
                            setAiAnalysisResult(null)
                            setApprovedQuestions(new Set())
                            setApproverInfo({ name: "", title: "", role: "", signature: "" })
                            setCompanyInfo({ companyName: "", productName: "" })
                            setSocInfo({
                              socType: "",
                              reportType: "",
                              auditor: "",
                              auditorOpinion: "",
                              auditorOpinionDate: "",
                              socStartDate: "",
                              socEndDate: "",
                              exceptions: "",
                              nonOperationalControls: "",
                              companyName: "",
                              productService: "",
                              subserviceOrganizations: "",
                              userEntityControls: "",
                              socDateAsOf: "",
                            })
                          }}
                          className="h-auto p-4 flex flex-col items-start hover:bg-gray-50"
                        >
                          <div className="font-medium mb-1">Start New Assessment</div>
                          <div className="text-sm text-gray-600">Begin another risk assessment</div>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => (window.location.href = "/dashboard")}
                          className="h-auto p-4 flex flex-col items-start hover:bg-gray-50"
                        >
                          <div className="font-medium mb-1">Go to Dashboard</div>
                          <div className="text-sm text-gray-600">View all your assessments</div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Delegate Assessment Modal */}
            {showDelegateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Delegate AI Assessment</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDelegateForm(false)}
                        className="hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Send an AI-powered assessment to a team member</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="assessmentType">Assessment Type</Label>
                      <Input id="assessmentType" value={delegateForm.assessmentType} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label htmlFor="recipientName">Recipient Name *</Label>
                      <Input
                        id="recipientName"
                        value={delegateForm.recipientName}
                        onChange={(e) => setDelegateForm((prev) => ({ ...prev, recipientName: e.target.value }))}
                        placeholder="Enter recipient's name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientEmail">Recipient Email *</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={delegateForm.recipientEmail}
                        onChange={(e) => setDelegateForm((prev) => ({ ...prev, recipientEmail: e.target.value }))}
                        placeholder="Enter recipient's email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date (Optional)</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={delegateForm.dueDate}
                        onChange={(e) => setDelegateForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                      <textarea
                        id="customMessage"
                        value={delegateForm.customMessage}
                        onChange={(e) => setDelegateForm((prev) => ({ ...prev, customMessage: e.target.value }))}
                        placeholder="Add any additional instructions..."
                        className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSendDelegation}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Assessment
                      </Button>
                      <Button variant="outline" onClick={() => setShowDelegateForm(false)} className="hover:bg-gray-50">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>
    </AuthGuard>
  )
}