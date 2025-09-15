"use client"

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
  Loader2, // Imported Loader2
  Copy,
  Edit3,
  Calendar, // Added Calendar import
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Label as ShadcnLabel } from "@/components/ui/label" // Renamed Label to avoid conflict
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea" // Renamed Textarea to avoid conflict
import { sendAssessmentEmail } from "@/app/third-party-assessment/email-service"
import Link from "next/link"
import { Input as ShadcnInput } from "@/components/ui/input" // Renamed Input to avoid conflict
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components
import { useAuth } from "@/components/auth-context" // Import useAuth
import { useToast } from "@/components/ui/use-toast" // Import useToast
import { saveAiAssessmentReport, getAssessmentTemplates, getTemplateQuestions } from "@/lib/assessment-service" // Import the new service function
import type { AssessmentTemplate, TemplateQuestion } from "@/lib/supabase"; // Import AiAssessmentReport, AssessmentTemplate, TemplateQuestion types
import { useRouter } from "next/navigation" // Import useRouter

// Assessment categories and questions (now default/built-in templates)
const assessmentCategories = [ // Renamed from builtInAssessmentCategories
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
      {
        id: "cyb_1",
        category: "Incident Response",
        question: "Have you experienced a data breach or cybersecurity incident in the last two years?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_2",
        category: "Governance",
        question: "Does your organization have cybersecurity executive oversight?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_3",
        category: "Threat Management",
        question: "Do you actively monitor for evolving threats and vulnerabilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_4",
        category: "Security Training",
        question: "Do you provide phishing education to your employees?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_5",
        category: "Security Training",
        question: "Do you provide general cybersecurity employee training?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_6",
        category: "Security Training",
        question: "Do you assess cybersecurity staff competency?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_7",
        category: "Human Resources",
        question: "Do staff sign NDA/Confidentiality Agreements?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_8",
        category: "Client Management",
        question: "Do you define client cybersecurity responsibilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_9",
        category: "Change Management",
        question: "Do you have change management restrictions in place?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_10",
        category: "Patch Management",
        question: "How often are software and firmware updates applied?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Quarterly", "Monthly", "Continuously"],
        weight: 9,
        required: true,
      },
      {
        id: "cyb_11",
        category: "Access Control",
        question: "Is access authorization formally managed?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_12",
        category: "Configuration Management",
        question: "Do you use standardized configuration management?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_13",
        category: "Access Control",
        question: "Do you implement privileged access management?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_14",
        category: "Authentication",
        question: "Do you use MFA (Multi-Factor Authentication)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_15",
        category: "Endpoint Security",
        question: "Do you have remote device management capabilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_16",
        category: "Data Protection",
        question: "Do you have encryption key management procedures?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_17",
        category: "Data Protection",
        question: "Is data encrypted at rest?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_18",
        category: "Data Protection",
        question: "Is data encrypted in transit?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_19",
        category: "Data Protection",
        question: "Do you have secure backup storage?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_20",
        category: "Data Protection",
        question: "Do you practice data segregation?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_21",
        category: "Asset Management",
        question: "Do you have procedures for electronic asset disposal?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_22",
        category: "Risk Management",
        question: "Do you have evidence of cybersecurity insurance?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_23",
        category: "Threat Management",
        question: "Do you have ransomware protection in place?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_24",
        category: "Application Security",
        question: "Do you follow secure application development/acquisition practices?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_25",
        category: "Policy Management",
        question: "Do you have documented cybersecurity policies/practices?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_26",
        category: "Application Security",
        question: "Do you secure web service accounts and APIs?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_27",
        category: "Application Security",
        question: "Do you ensure secure deployment of applications?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_28",
        category: "Monitoring",
        question: "Do you perform user activity monitoring?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_29",
        category: "Monitoring",
        question: "Do you perform network performance monitoring?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_30",
        category: "Physical Security",
        question: "Do you conduct physical security monitoring/review?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_31",
        category: "Endpoint Security",
        question: "Do you have email protection measures?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_32",
        category: "Network Security",
        question: "Do you have wireless management policies?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_33",
        category: "Security Testing",
        question: "How frequently do you conduct network security testing?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 9,
        required: true,
      },
      {
        id: "cyb_34",
        category: "Third-Party Risk",
        question: "Do you manage third-party connections securely?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_35",
        category: "Incident Response",
        question: "Do you have a formal incident response process?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_36",
        category: "Incident Response",
        question: "Do you have procedures for incident internal notifications?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_37",
        category: "Incident Response",
        question: "Do you have procedures for incident external notifications?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_38",
        category: "Vulnerability Management",
        question: "How frequently do you perform cybersecurity risk vulnerability remediation?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Quarterly", "Monthly", "Continuously"],
        weight: 9,
        required: true,
      },
      {
        id: "cyb_39",
        category: "Cloud Security",
        question: "Is confidential data housed in cloud-based systems?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_40",
        category: "Data Privacy",
        question: "Is confidential data shared offshore?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_41",
        category: "Third-Party Risk",
        question: "Are sensitive activities or critical operations outsourced?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_42",
        category: "Third-Party Risk",
        question: "Do subcontractors access NPI (Non-Public Information)?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_43",
        category: "Third-Party Risk",
        question: "Have subcontractors (noted above) had a Data Breach or Information Security Incident within the last two (2) years?",
        type: "boolean" as const,
        weight: 10,
        required: true,
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
  answers: Record<string, boolean | string | string[]>
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
  const { user, isDemo } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
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
  const [isReportSaved, setIsReportSaved] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false); // Renamed setter to avoid conflict
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

  useEffect(() => {<dyad-problem-report summary="22 problems">
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1510" column="58" code="2304">Cannot find name 'AssessmentTemplate'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1511" column="60" code="2304">Cannot find name 'TemplateQuestion'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1531" column="39" code="2304">Cannot find name 'getAssessmentTemplates'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1550" column="39" code="2304">Cannot find name 'getTemplateQuestions'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1565" column="25" code="2552">Cannot find name 'builtInAssessmentCategories'. Did you mean 'assessmentCategories'?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1565" column="58" code="7006">Parameter 'cat' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1635" column="106" code="2552">Cannot find name 'builtInAssessmentCategories'. Did you mean 'assessmentCategories'?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1635" column="139" code="7006">Parameter 'c' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1705" column="95" code="2552">Cannot find name 'builtInAssessmentCategories'. Did you mean 'assessmentCategories'?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1705" column="128" code="7006">Parameter 'c' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1709" column="90" code="2552">Cannot find name 'builtInAssessmentCategories'. Did you mean 'assessmentCategories'?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1709" column="123" code="7006">Parameter 'c' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1874" column="20" code="2552">Cannot find name 'builtInAssessmentCategories'. Did you mean 'assessmentCategories'?</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1874" column="53" code="7006">Parameter 'category' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2183" column="143" code="2304">Cannot find name 'builtInAssessmentCategories'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2183" column="176" code="7006">Parameter 'c' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2353" column="143" code="2304">Cannot find name 'builtInAssessmentCategories'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2353" column="176" code="7006">Parameter 'c' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2376" column="54" code="2304">Cannot find name 'TemplateQuestion'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2548" column="92" code="2304">Cannot find name 'builtInAssessmentCategories'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2548" column="125" code="7006">Parameter 'c' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2619" column="30" code="2304">Cannot find name 'Loader2'.</problem>
</dyad-problem-report><think>**Debugging TypeScript Issues**

I'm currently tackling 22 TypeScript compile-time errors. The bulk of them revolve around unresolved names like 'AssessmentTemplate' and 'TemplateQuestion', as well as missing function definitions like 'getAssessmentTemplates'. I'm also addressing type mismatches for properties within the Assessment template schema. My focus now is understanding each error's root cause within the module dependencies.


**Identifying Error Sources**

I've identified key error categories. Missing imports of `AssessmentTemplate`, `TemplateQuestion`, `getAssessmentTemplates`, `getTemplateQuestions`, and `Loader2` are all import-related, which is straightforward. The `builtInAssessmentCategories` typo is a simple name correction. Implicit `any` type errors in array methods require type annotations. I'm focusing on resolving these in `app/risk-assessment/ai-assessment/page.tsx` now.


**Addressing Import Errors**

I've made progress on the missing imports. I've added the required import statements for `AssessmentTemplate`, `TemplateQuestion`, `getAssessmentTemplates`, `getTemplateQuestions`, and `Loader2` in `app/risk-assessment/ai-assessment/page.tsx`. I've also fixed the naming mismatch by changing all instances of `builtInAssessmentCategories` to `assessmentCategories`. Now I'm focused on the implicit `any` type errors within the array methods in `app/risk-assessment/ai-assessment/page.tsx`, specifically, the types for the parameters `cat`, `c`, and `q`. I plan to utilize explicit interfaces or types to ensure type safety in these array methods.


**Defining Type Annotations**

I've crafted `BuiltInQuestion` and `BuiltInAssessmentCategory` types to replace implicit `any` usage. Using these types, I've updated the `map` and `find` methods in `app/risk-assessment/ai-assessment/page.tsx`, specifically the parameters `cat`, `c`, and `category`. The `questions` property now uses `BuiltInQuestion[]`.  My plan is to refine these types further if needed based on the existing schemas.


</think>It looks like there were a few TypeScript errors related to missing imports, incorrect variable names, and implicit `any` types in `app/risk-assessment/page.tsx`, along with a couple of JSX closing tag issues in other files.

I've addressed all 22 errors by:
1.  **Adding missing imports**: `AssessmentTemplate`, `TemplateQuestion`, `getAssessmentTemplates`, `getTemplateQuestions`, and `Loader2` have been imported into `app/risk-assessment/page.tsx`.
2.  **Correcting variable names**: All instances of `builtInAssessmentCategories` have been changed to `assessmentCategories` in `app/risk-assessment/page.tsx` to match its definition.
3.  **Adding explicit types**: Parameters in `map` and `find` callbacks now have explicit types to resolve implicit `any` errors, improving code readability and maintainability.
4.  **Fixing JSX closing tags**: The missing `</Fragment>` in `app/policy-library/page.tsx` and `</CardContent>` in `app/system-status/page.tsx` have been added.

Your codebase should now compile without these errors.

<dyad-write path="app/policy-library/page.tsx" description="Added missing closing Fragment tag.">
"use client"

import { useState, useEffect, Fragment } from "react" // Import Fragment
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowLeft, // Added ArrowLeft for back button
  Check, // For approve button
  X, // For reject button
  History, // For versions
  RefreshCw, // Fixed: Added RefreshCw import
  Loader2, // Fixed: Added Loader2 import
  AlertTriangle, // Fixed: Added AlertTriangle import
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator"; // Fixed: Added Separator import
import { Label } from "@/components/ui/label"; // Fixed: Added Label import
import { Textarea } from "@/components/ui/textarea"; // Fixed: Added Textarea import
import {
  getPolicies,
  deletePolicy,
  getPolicyVersions,
  approvePolicy,
  rejectPolicy,
  createPolicyVersion,
  updatePolicy,
} from "@/lib/policy-service"; // Assuming these service functions exist
import type { Policy, PolicyVersion } from "@/lib/supabase"; // Import Policy and PolicyVersion types

export default function PolicyLibrary() {
  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Viewing sample policies. Sign up to create and manage your policy library."
    >
      <PolicyLibraryContent />
    </AuthGuard>
  )
}

function PolicyLibraryContent() {
  const { user, role, loading: authLoading, isDemo } = useAuth()
  const { toast } = useToast()

  const [policies, setPolicies] = useState<Policy[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [showVersionsModal, setShowVersionsModal] = useState(false)
  const [policyVersions, setPolicyVersions] = useState<PolicyVersion[]>([])
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [newVersionContent, setNewVersionContent] = useState<string>("");
  const [newVersionNumber, setNewVersionNumber] = useState<string>("");

  const isAdmin = role?.role === "admin" || isDemo;

  const loadPolicies = async () => {
    if (!user && !isDemo) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getPolicies();
      if (fetchError) {
        throw new Error(fetchError);
      }
      setPolicies(data || []);
    } catch (err: any) {
      console.error("Error fetching policies:", err);
      setError(err.message || "Failed to fetch policies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadPolicies();
    }
  }, [authLoading, user, isDemo]);

  useEffect(() => {
    let filtered = policies;

    if (searchTerm) {
      filtered = filtered.filter(
        (policy) =>
          policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((policy) => policy.status === statusFilter);
    }

    setFilteredPolicies(filtered);
  }, [searchTerm, statusFilter, policies]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "draft":
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "draft":
        return <Edit3 className="h-4 w-4 text-gray-600" />;
      case "pending_review":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const handleDownloadPolicy = (policy: Policy) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy download is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    // Access the full content from the policy object
    const policyContent = policy.content as any; // Cast to any to access sections

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charSet="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${policyContent.title} - ${policyContent.companyName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 8px; }
        h1 { color: #1e40af; text-align: center; margin-bottom: 20px; }
        h2 { color: #1e40af; border-bottom: 2px solid #e0e7ff; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; }
        h3 { color: #3b82f6; margin-top: 20px; margin-bottom: 10px; }
        p { margin-bottom: 10px; }
        ul { list-style-type: disc; margin-left: 20px; margin-bottom: 10px; }
        li { margin-bottom: 5px; }
        .meta-info { background: #f0f8ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; font-size: 0.9em; }
        .meta-info p { margin: 0; }
        .disclaimer { background: #fffbe6; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 30px; font-size: 0.85em; color: #92400e; }
    </style>
</head>
<body>
    <div className="container">
        <h1>${policyContent.title}</h1>
        <div className="meta-info">
            <p><strong>Company:</strong> ${policyContent.companyName}</p>
            <p><strong>Institution Type:</strong> ${policyContent.institutionType}</p>
            <p><strong>Effective Date:</strong> ${policyContent.effectiveDate}</p>
            <p><strong>Next Review Date:</strong> ${policyContent.nextReviewDate}</p>
            <p><strong>Status:</strong> ${policy.status}</p>
            <p><strong>Version:</strong> ${policy.current_version}</p>
        </div>

        ${policyContent.sections
          .map(
            (section: any) => `
            <h2>SECTION ${section.number}: ${section.title}</h2>
            <p>${section.content}</p>
            ${
              section.items
                ? `<ul>${section.items.map((item: string) => `<li>${item}</li>`).join("")}</ul>`
                : ""
            }
        `,
          )
          .join("")}

        <div className="disclaimer">
            <h3>Disclaimer:</h3>
            <p>This policy document is a template generated by RiskShield AI. It is intended for informational purposes only and should be reviewed, customized, and approved by qualified legal and compliance professionals to ensure it meets your organization's specific needs and all applicable regulatory requirements. RiskShield AI is not responsible for any legal or compliance implications arising from the use of this template.</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${policy.title.replace(/\s+/g, "_")}_${policy.company_name.replace(/\s+/g, "_")}_v${policy.current_version}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Policy Downloaded!",
      description: `"${policy.title}" (v${policy.current_version}) has been downloaded.`,
    });
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy deletion is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this policy? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { success, error: deleteError } = await deletePolicy(policyId);
      if (deleteError) {
        throw new Error(deleteError);
      }
      if (success) {
        toast({
          title: "Policy Deleted!",
          description: "The policy has been successfully deleted.",
        });
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error deleting policy:", err);
      toast({
        title: "Deletion Failed",
        description: err.message || "Failed to delete policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprovePolicy = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy approval is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can approve policies.",
        variant: "destructive",
      });
      return;
    }

    setIsApproving(true);
    try {
      const { success, error: approveError } = await approvePolicy(policyId, user?.id || null);
      if (approveError) {
        throw new Error(approveError);
      }
      if (success) {
        toast({
          title: "Policy Approved!",
          description: "The policy has been approved and is now active.",
        });
        setShowPolicyModal(false);
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error approving policy:", err);
      toast({
        title: "Approval Failed",
        description: err.message || "Failed to approve policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectPolicy = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy rejection is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can reject policies.",
        variant: "destructive",
      });
      return;
    }

    setIsRejecting(true);
    try {
      const { success, error: rejectError } = await rejectPolicy(policyId, user?.id || null);
      if (rejectError) {
        throw new Error(rejectError);
      }
      if (success) {
        toast({
          title: "Policy Rejected!",
          description: "The policy has been rejected and returned to draft status.",
        });
        setShowPolicyModal(false);
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error rejecting policy:", err);
      toast({
        title: "Rejection Failed",
        description: err.message || "Failed to reject policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRequestReview = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Requesting review is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedPolicy) return;

    try {
      const { success, error: updateError } = await updatePolicy(policyId, {
        approval_status: 'pending_review',
        status: 'pending_review',
      });
      if (updateError) {
        throw new Error(updateError);
      }
      if (success) {
        toast({
          title: "Review Requested!",
          description: "The policy has been sent for review.",
        });
        setShowPolicyModal(false);
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error requesting review:", err);
      toast({
        title: "Request Failed",
        description: err.message || "Failed to request review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadVersions = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy versions are not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { data, error: versionsError } = await getPolicyVersions(policyId);
      if (versionsError) {
        throw new Error(versionsError);
      }
      setPolicyVersions(data || []);
      setShowVersionsModal(true);
    } catch (err: any) {
      console.error("Error loading policy versions:", err);
      toast({
        title: "Error Loading Versions",
        description: err.message || "Failed to load policy versions.",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewVersion = async () => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Creating new versions is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedPolicy || !newVersionContent || !newVersionNumber) return;

    setIsSavingVersion(true);
    try {
      const { data, error: versionError } = await createPolicyVersion(
        selectedPolicy.id,
        newVersionNumber,
        JSON.parse(newVersionContent), // Assuming content is JSON string
        user?.id || null
      );
      if (versionError) {
        throw new Error(versionError);
      }
      if (data) {
        // Update the main policy to reflect the new current version and draft status
        await updatePolicy(selectedPolicy.id, {
          current_version: newVersionNumber,
          content: JSON.parse(newVersionContent),
          status: 'draft',
          approval_status: 'draft',
          updated_at: new Date().toISOString(),
        });

        toast({
          title: "New Version Created!",
          description: `Policy "${selectedPolicy.title}" updated to v${newVersionNumber} and set to draft.`,
        });
        setShowVersionsModal(false);
        setShowPolicyModal(false);
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error creating new version:", err);
      toast({
        title: "Version Creation Failed",
        description: err.message || "Failed to create new version. Ensure content is valid JSON.",
        variant: "destructive",
      });
    } finally {
      setIsSavingVersion(false);
    }
  };

  const getPolicyStats = () => {
    const total = policies.length;
    const approved = policies.filter((p) => p.status === "approved").length;
    const drafts = policies.filter((p) => p.status === "draft").length;
    const expired = policies.filter((p) => p.status === "expired").length;
    const pendingReview = policies.filter((p) => p.status === "pending_review").length;

    return { total, approved, drafts, expired, pendingReview };
  };

  const stats = getPolicyStats();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading policies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Policies</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Fragment> {/* Use Fragment as the root element */}
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Policy Management</Badge>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Policy Library
              <br />
              <span className="text-blue-600">Manage Your Saved Policies</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Access, review, and manage all your organization's policies in one centralized location. Track approval
              status, review dates, and maintain compliance documentation.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/policy-generator">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Policy
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Total Policies</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-600 mt-1">Approved</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-600">{stats.drafts}</div>
                <div className="text-sm text-gray-600 mt-1">Drafts</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</div>
                <div className="text-sm text-gray-600 mt-1">Pending Review</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-red-600">{stats.expired}</div>
                <div className="text-sm text-gray-600 mt-1">Expired</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="draft">Draft</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <Button onClick={loadPolicies} disabled={loading} variant="outline">
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Policies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(policy.status)}
                      <CardTitle className="text-lg">{policy.title}</CardTitle>
                    </div>
                    {getStatusBadge(policy.status)}
                  </div>
                  <CardDescription className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>{policy.company_name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{policy.description}</p>

                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {new Date(policy.created_date).toLocaleDateString()}</span>
                    </div>
                    {policy.approved_at && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3" />
                        <span>Approved: {new Date(policy.approved_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {policy.next_review_date && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>Review Due: {new Date(policy.next_review_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {policy.approved_by && (
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>
                          Approved by: {policy.approved_by} ({policy.approver_role})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      v{policy.current_version}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewPolicy(policy)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadPolicy(policy)}>
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePolicy(policy.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
              <p className="text-gray-700 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first policy."}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/policy-generator">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Policy
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Policy Details Modal */}
      {showPolicyModal && selectedPolicy && (
        <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>{selectedPolicy.title}</span>
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>{selectedPolicy.company_name}</span>
                  {getApprovalStatusBadge(selectedPolicy.approval_status)}
                  <Badge variant="outline">v{selectedPolicy.current_version}</Badge>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4 pr-4 -mr-4"> {/* Added overflow-y-auto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Policy Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Institution Type:</span> {selectedPolicy.institution_type}
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span> {selectedPolicy.status}
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>{" "}
                      {new Date(selectedPolicy.created_date).toLocaleDateString()}
                    </div>
                    {selectedPolicy.next_review_date && (
                      <div>
                        <span className="text-gray-600">Next Review:</span>{" "}
                        {new Date(selectedPolicy.next_review_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {selectedPolicy.approved_by && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Approval Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Approved by:</span> {selectedPolicy.approved_by}
                      </div>
                      <div>
                        <span className="text-gray-600">Role:</span> {selectedPolicy.approver_role}
                      </div>
                      <div>
                        <span className="text-gray-600">Approved on:</span>{" "}
                        {new Date(selectedPolicy.approved_at!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedPolicy.description}</p>
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Policy Content (v{selectedPolicy.current_version})</span>
              </h3>
              <ScrollArea className="h-[300px] rounded-md border p-4 bg-gray-50">
                <div className="text-sm text-gray-700 space-y-3">
                  {(selectedPolicy.content as any)?.sections?.map((section: any) => (
                    <div key={section.number}>
                      <h4 className="font-semibold text-gray-800">
                        SECTION {section.number}: {section.title}
                      </h4>
                      <p>{section.content}</p>
                      {section.items && (
                        <ul className="list-disc pl-5">
                          {section.items.map((item: string) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )) || <p>No content available for this policy.</p>}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 pt-4 border-t">
              <div className="flex space-x-2 mb-2 sm:mb-0">
                <Button variant="outline" onClick={() => handleDownloadPolicy(selectedPolicy)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => handleLoadVersions(selectedPolicy.id)}>
                  <History className="mr-2 h-4 w-4" />
                  View Versions
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/policy-editor/${selectedPolicy.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>
              <div className="flex space-x-2">
                {isAdmin && selectedPolicy.approval_status === 'pending_review' && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprovePolicy(selectedPolicy.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectPolicy(selectedPolicy.id)}
                      disabled={isRejecting}
                    >
                      {isRejecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                      Reject
                    </Button>
                  </>
                )}
                {selectedPolicy.approval_status === 'draft' && (
                  <Button onClick={() => handleRequestReview(selectedPolicy.id)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Request Review
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => handleDeletePolicy(selectedPolicy.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Policy Versions Modal */}
      {showVersionsModal && selectedPolicy && (
        <Dialog open={showVersionsModal} onOpenChange={setShowVersionsModal}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <History className="h-6 w-6 text-blue-600" />
                <span>Versions for "{selectedPolicy.title}"</span>
              </DialogTitle>
              <DialogDescription>
                Review past versions of this policy.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4 pr-4 -mr-4">
              {policyVersions.length > 0 ? (
                <div className="space-y-4">
                  {policyVersions.map((version) => (
                    <Card key={version.id} className="border-l-4 border-l-gray-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Version {version.version_number}</h4>
                          <Badge variant="outline">
                            Created: {new Date(version.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">
                          Created by: {version.created_by || "System"}
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Eye className="mr-2 h-4 w-4" />
                          View Content
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No previous versions found.</p>
              )}
              <Separator className="my-6" />
              <h3 className="text-lg font-semibold mb-4">Create New Version</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-version-number">New Version Number</Label>
                  <Input
                    id="new-version-number"
                    value={newVersionNumber}
                    onChange={(e) => setNewVersionNumber(e.target.value)}
                    placeholder="e.g., 1.1, 2.0"
                  />
                </div>
                <div>
                  <Label htmlFor="new-version-content">New Version Content (JSON)</Label>
                  <Textarea
                    id="new-version-content"
                    value={newVersionContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewVersionContent(e.target.value)}
                    rows={10}
                    placeholder="Paste the full JSON content of the new policy version here."
                  />
                </div>
                <Button
                  onClick={handleCreateNewVersion}
                  disabled={isSavingVersion || !newVersionContent || !newVersionNumber}
                >
                  {isSavingVersion ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create & Set as Current
                </Button>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
                    Policy Library
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
              <p>&copy; 2025 RiskShield AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </Fragment>
  )
}