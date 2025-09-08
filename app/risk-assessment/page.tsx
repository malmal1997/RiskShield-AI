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
  Download, // Added Download import
  X, // Added X import
} from "lucide-react"
// import { MainNavigation } from "@/components/main-navigation" // Removed import
import { AuthGuard } from "@/components/auth-guard"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { sendAssessmentEmail } from "@/app/third-party-assessment/email-service"

// Assessment categories and questions
const assessmentCategories = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Evaluate your organization's cybersecurity posture and controls",
    icon: Shield,
    questions: [
      {
        id: "cs1",
        category: "Security Policies", // Added category
        question: "Does your organization have a formal cybersecurity policy?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "cs2",
        category: "Security Training", // Added category
        question: "How often do you conduct cybersecurity training for employees?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs3",
        category: "Access Control", // Added category
        question: "Do you have multi-factor authentication implemented for all critical systems?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "cs4",
        category: "Vulnerability Management", // Added category
        question: "How frequently do you perform vulnerability assessments?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs5",
        category: "Incident Response", // Added category
        question: "Do you have an incident response plan in place?",
        type: "boolean",
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
        category: "Regulatory Adherence", // Added category
        question: "Are you compliant with current FDIC regulations?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "rc2",
        category: "Policy Management", // Added category
        question: "How often do you review and update compliance policies?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "rc3",
        category: "Governance", // Added category
        question: "Do you have a dedicated compliance officer?",
        type: "boolean",
        weight: 7,
      },
      {
        id: "rc4",
        category: "Audits", // Added category
        question: "How frequently do you conduct compliance audits?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "rc5",
        category: "Documentation", // Added category
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
        category: "Procedures", // Added category
        question: "Do you have documented operational procedures for all critical processes?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "or2",
        category: "Procedures", // Added category
        question: "How often do you review and update operational procedures?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "or3",
        category: "Internal Controls", // Added category
        question: "Do you have adequate segregation of duties in place?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "or4",
        category: "Risk Assessment", // Added category
        question: "How frequently do you conduct operational risk assessments?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 8,
      },
      {
        id: "or5",
        category: "Business Continuity", // Added category
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
        category: "BCM Program", // Added category
        question: "Do you have a documented Business Continuity Management (BCM) program in place?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "bc2",
        category: "BCM Program", // Added category
        question: "How frequently do you review and update your BCM program?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2-3 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "bc3",
        category: "Governance", // Added category
        question: "Does your BCM program have executive oversight and sponsorship?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc4",
        category: "Training", // Added category
        question: "How often do you conduct BCM training for employees?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "bc5",
        category: "System Availability", // Added category
        question: "Do you monitor system capacity and availability on an ongoing basis?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc6",
        category: "Physical Security", // Added category
        question: "Do you have adequate physical security controls for critical facilities?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc7",
        category: "Environmental Controls", // Added category
        question: "Do you have environmental security controls (fire suppression, climate control, etc.)?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc8",
        category: "Infrastructure Redundancy", // Added category
        question: "Do you have redundant telecommunications infrastructure to handle failures?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc9",
        category: "Maintenance", // Added category
        question: "How frequently do you perform equipment maintenance and firmware updates?",
        type: "multiple",
        options: ["Never", "As needed only", "Annually", "Semi-annually", "Quarterly"],
        weight: 8,
      },
      {
        id: "bc10",
        category: "Power Systems", // Added category
        question: "Do you have backup power systems (UPS/generators) for critical operations?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc11",
        category: "Data Protection", // Added category
        question: "Do you have comprehensive data protection (firewall, anti-virus, encryption)?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc12",
        category: "Third-Party Risk", // Added category
        question: "Do you have contingency plans for failures of critical third-party providers?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc13",
        category: "Personnel Security", // Added category
        question: "Do you conduct background checks on employees with access to critical systems?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc14",
        category: "Staffing", // Added category
        question: "Do you have adequate staffing depth and cross-training for critical functions?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc15",
        category: "Disaster Recovery", // Added category
        question: "Do you have a documented Disaster Recovery Plan separate from your BCM?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc16",
        category: "Crisis Communication", // Added category
        question: "Do you have established internal and external communication protocols for crisis management?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc17",
        category: "Communication", // Added category
        question: "Do you have communication procedures for planned system outages?",
        type: "boolean",
        weight: 7,
      },
      {
        id: "bc18",
        category: "Incident Management", // Added category
        question: "Do you have a cybersecurity incident management plan?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc19",
        category: "Insurance", // Added category
        question: "Do you maintain appropriate business continuity insurance coverage?",
        type: "boolean",
        weight: 7,
      },
      {
        id: "bc20",
        category: "Emergency Planning", // Added category
        question: "Do you have pandemic/health emergency continuity plans?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc21",
        category: "Remote Access", // Added category
        question: "Do you have remote administration contingencies for critical systems?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc22",
        category: "Software Development", // Added category
        question: "Do you have proper source code management and version control systems?",
        type: "boolean",
        weight: 7,
      },
      {
        id: "bc23",
        category: "System Obsolescence", // Added category
        question: "Have you identified and addressed any outdated systems that pose continuity risks?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc24",
        category: "Data Backup", // Added category
        question: "How frequently do you backup critical business data?",
        type: "multiple",
        options: ["Never", "Monthly", "Weekly", "Daily", "Real-time/Continuous"],
        weight: 10,
      },
      {
        id: "bc25",
        category: "Impact Analysis", // Added category
        question: "Have you conducted a formal Business Impact Analysis (BIA)?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc26",
        category: "Recovery Objectives", // Added category
        question: "Have you defined Recovery Point Objectives (RPO) for critical systems?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc27",
        category: "Recovery Objectives", // Added category
        question: "Have you defined Recovery Time Objectives (RTO) for critical systems?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "bc28",
        category: "Testing", // Added category
        question: "How frequently do you test your BCM/DR plans?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
      },
      {
        id: "bc29",
        category: "Testing", // Added category
        question: "How frequently do you test your incident response procedures?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "bc30",
        category: "Testing", // Added category
        question: "How frequently do you test your data backup and recovery procedures?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
      },
      {
        id: "bc31",
        category: "Testing Documentation", // Added category
        question: "Do you document and analyze the results of your BC/DR testing?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "bc32",
        category: "Audits", // Added category
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
        category: "Regulatory Compliance", // Added category
        question: "Are you compliant with current banking regulations (e.g., Basel III, Dodd-Frank)?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "fs2",
        category: "AML/KYC", // Added category
        question: "How often do you conduct anti-money laundering (AML) training?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "fs3",
        category: "AML/KYC", // Added category
        question: "Do you have a comprehensive Know Your Customer (KYC) program?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "fs4",
        category: "Credit Risk", // Added category
        question: "How frequently do you review and update your credit risk policies?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "fs5",
        category: "Capital Management", // Added category
        question: "Do you maintain adequate capital reserves as required by regulators?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "fs6",
        category: "Consumer Protection", // Added category
        question: "Are you compliant with consumer protection regulations (e.g., CFPB guidelines)?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "fs7",
        category: "Stress Testing", // Added category
        question: "How often do you conduct stress testing on your financial portfolios?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
      },
      {
        id: "fs8",
        category: "Client Asset Segregation", // Added category
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
        category: "Regulatory Compliance", // Added category
        question: "Are you compliant with applicable data privacy regulations (GDPR, CCPA, etc.)?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "dp2",
        category: "Privacy Impact Assessment", // Added category
        question: "How often do you conduct data privacy impact assessments?",
        type: "multiple",
        options: ["Never", "As needed only", "Annually", "Semi-annually", "For all new projects"],
        weight: 9,
      },
      {
        id: "dp3",
        category: "Data Retention", // Added category
        question: "Do you have documented data retention and deletion policies?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "dp4",
        category: "Data Subject Rights", // Added category
        question: "How do you handle data subject access requests?",
        type: "multiple",
        options: ["No formal process", "Manual process", "Semi-automated", "Fully automated", "Comprehensive system"],
        weight: 8,
      },
      {
        id: "dp5",
        category: "Governance", // Added category
        question: "Do you have a designated Data Protection Officer (DPO)?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "dp6",
        category: "Third-Party Data Processors", // Added category
        question: "Are all third-party data processors properly vetted and contracted?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "dp7",
        category: "Training", // Added category
        question: "How often do you provide data privacy training to employees?",
        type: "multiple",
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "dp8",
        category: "Data Processing Records", // Added category
        question: "Do you maintain records of all data processing activities?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "dp9",
        category: "Privacy by Design", // Added category
        question: "Have you implemented privacy by design principles in your systems?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "dp10",
        category: "Information Security Policy", // Added category
        question: "Do you have a written Information Security Policy (ISP)?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "dp11",
        category: "Information Security Policy", // Added category
        question: "How often do you review and update your Information Security Policy?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "dp12",
        category: "Information Security Policy", // Added category
        question: "Do you have a designated person responsible for Information Security Policy?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "dp13",
        category: "Compliance Monitoring", // Added category
        question: "Do you have data privacy compliance monitoring procedures in place?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp14",
        category: "Physical Security", // Added category
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp15",
        category: "Physical Security", // Added category
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp16",
        category: "Audits & Assessments", // Added category
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp17",
        category: "Asset Management", // Added category
        question: "Do you have an IT asset management program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp18",
        category: "Asset Management", // Added category
        question: "Do you have restrictions on storage devices?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp19",
        category: "Endpoint Protection", // Added category
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp20",
        category: "Network Security", // Added category
        question: "Do you implement network segmentation?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp21",
        category: "Network Security", // Added category
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp22",
        category: "Security Testing", // Added category
        question: "How frequently do you conduct vulnerability scanning?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp23",
        category: "Security Testing", // Added category
        question: "How frequently do you conduct penetration testing?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        required: true,
      },
      {
        id: "dp24",
        category: "Regulatory Compliance", // Added category
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "multiple",
        options: ["None", "ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST"],
        required: true,
      },
      {
        id: "dp25",
        category: "Access Control", // Added category
        question: "Do you have a formal access control policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp26",
        category: "Wireless Security", // Added category
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp27",
        category: "Access Control", // Added category
        question: "Do you have defined password parameters and requirements?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp28",
        category: "Access Control", // Added category
        question: "Do you implement least privilege access principles?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp29",
        category: "Access Control", // Added category
        question: "How frequently do you conduct access reviews?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp30",
        category: "Network Access", // Added category
        question: "Do you require device authentication for network access?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp31",
        category: "Remote Access", // Added category
        question: "Do you have secure remote logical access controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp32",
        category: "Third-Party Management", // Added category
        question: "Do you have a third-party oversight program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp33",
        category: "Third-Party Management", // Added category
        question: "Do you assess third-party security controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp34",
        category: "Third-Party Management", // Added category
        question: "Do you verify third-party compliance controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp35",
        category: "Human Resources", // Added category
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp36",
        category: "Training", // Added category
        question: "Do you provide information security training to employees?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp37",
        category: "Training", // Added category
        question: "Do you provide privacy training to employees?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp38",
        category: "Training", // Added category
        question: "Do you provide role-specific compliance training?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp39",
        category: "Policy Management", // Added category
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp40",
        category: "Human Resources", // Added category
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp41",
        category: "Data Management", // Added category
        question: "Do you have a data management program?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp42",
        category: "Privacy Policy", // Added category
        question: "Do you have a published privacy policy?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp43",
        category: "Data Retention", // Added category
        question: "Do you have consumer data retention policies?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp44",
        category: "Data Protection", // Added category
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp45",
        category: "Incident Response", // Added category
        question: "Do you have data breach protocols?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp46",
        category: "Consumer Rights", // Added category
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp47",
        category: "Data Collection", // Added category
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
        category: "Network Segmentation", // Added category
        question: "Do you have network segmentation implemented for critical systems?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "is2",
        category: "Patch Management", // Added category
        question: "How often do you update and patch your server infrastructure?",
        type: "multiple",
        options: ["Never", "As needed only", "Monthly", "Weekly", "Automated/Real-time"],
        weight: 10,
      },
      {
        id: "is3",
        category: "Intrusion Detection", // Added category
        question: "Do you have intrusion detection and prevention systems (IDS/IPS) deployed?",
        type: "boolean",
        weight: 9,
      },
      {
        id: "is4",
        category: "Penetration Testing", // Added category
        question: "How frequently do you conduct penetration testing?",
        type: "multiple",
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "is5",
        category: "Access Management", // Added category
        question: "Are all administrative accounts protected with privileged access management?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "is6",
        category: "Logging & Monitoring", // Added category
        question: "Do you have comprehensive logging and monitoring for all critical systems?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "is7",
        category: "Firewall Management", // Added category
        question: "How often do you review and update firewall rules?",
        type: "multiple",
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "is8",
        category: "Configuration Management", // Added category
        question: "Do you have secure configuration standards for all infrastructure components?",
        type: "boolean",
        weight: 8,
      },
      {
        id: "is9",
        category: "Data Encryption", // Added category
        question: "Are all data transmissions encrypted both in transit and at rest?",
        type: "boolean",
        weight: 10,
      },
      {
        id: "is10",
        category: "Vulnerability Management", // Added category
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
        category: "Governance", // Added category
        question:
          "Has management established a governance structure with clear roles and responsibilities for SOC compliance?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc2",
        category: "Policies & Procedures", // Added category
        question: "Are there documented policies and procedures for all SOC-relevant control activities?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc3",
        category: "Risk Assessment", // Added category
        question: "Has management established a risk assessment process to identify and evaluate risks?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc4",
        category: "Control Objectives", // Added category
        question: "Are control objectives clearly defined and communicated throughout the organization?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc5",
        category: "Control Monitoring", // Added category
        question: "Is there a formal process for monitoring and evaluating control effectiveness?",
        type: "tested",
        weight: 9,
      },

      // Security Controls
      {
        id: "soc6",
        category: "Logical Access", // Added category
        question: "Are logical access controls implemented to restrict access to systems and data?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc7",
        category: "User Access Management", // Added category
        question: "Is user access provisioning and deprovisioning performed in a timely manner?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc8",
        category: "Privileged Access", // Added category
        question: "Are privileged access rights regularly reviewed and approved?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc9",
        category: "Authentication", // Added category
        question: "Is multi-factor authentication implemented for all critical systems?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc10",
        category: "Password Management", // Added category
        question: "Are password policies enforced and regularly updated?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc11",
        category: "Data Encryption", // Added category
        question: "Is data encryption implemented for data at rest and in transit?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc12",
        category: "Incident Response", // Added category
        question: "Are security incident response procedures documented and tested?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc13",
        category: "Vulnerability Management", // Added category
        question: "Is vulnerability management performed regularly with timely remediation?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc14",
        category: "Network Security", // Added category
        question: "Are network security controls (firewalls, IDS/IPS) properly configured and monitored?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc15",
        category: "Physical Security", // Added category
        question: "Is physical access to data centers and facilities properly controlled?",
        type: "tested",
        weight: 8,
      },

      // Availability Controls
      {
        id: "soc16",
        category: "System Monitoring", // Added category
        question: "Are system capacity and performance monitored to ensure availability?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc17",
        category: "Business Continuity", // Added category
        question: "Is there a documented business continuity and disaster recovery plan?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc18",
        category: "Backup & Recovery", // Added category
        question: "Are backup and recovery procedures regularly tested?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc19",
        category: "System Availability", // Added category
        question: "Is system availability monitored with appropriate alerting mechanisms?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc20",
        category: "Change Management", // Added category
        question: "Are change management procedures in place for system modifications?",
        type: "tested",
        weight: 9,
      },

      // Processing Integrity Controls
      {
        id: "soc21",
        category: "Data Processing", // Added category
        question: "Are data processing controls implemented to ensure completeness and accuracy?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc22",
        category: "Data Input Validation", // Added category
        question: "Is data input validation performed to prevent processing errors?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc23",
        category: "Automated Controls", // Added category
        question: "Are automated controls in place to detect and prevent duplicate transactions?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc24",
        category: "Error Monitoring", // Added category
        question: "Is data processing monitored for exceptions and errors?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc25",
        category: "Data Reconciliation", // Added category
        question: "Are reconciliation procedures performed to ensure data integrity?",
        type: "tested",
        weight: 9,
      },

      // Confidentiality Controls
      {
        id: "soc26",
        category: "Confidentiality Agreements", // Added category
        question: "Are confidentiality agreements in place with employees and third parties?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc27",
        category: "Data Classification", // Added category
        question: "Is sensitive data classified and handled according to its classification?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc28",
        category: "Data Retention & Disposal", // Added category
        question: "Are data retention and disposal policies implemented and followed?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc29",
        category: "Access to Confidential Info", // Added category
        question: "Is access to confidential information restricted on a need-to-know basis?",
        type: "tested",
        weight: 9,
      },

      // Privacy Controls
      {
        id: "soc30",
        category: "Privacy Policies", // Added category
        question: "Are privacy policies and procedures documented and communicated?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc31",
        category: "Personal Information Handling", // Added category
        question: "Is personal information collected, used, and disclosed in accordance with privacy policies?",
        type: "tested",
        weight: 10,
      },
      {
        id: "soc32",
        category: "Data Subject Notice", // Added category
        question: "Are individuals provided with notice about data collection and use practices?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc33",
        category: "Consent Management", // Added category
        question: "Is consent obtained for the collection and use of personal information where required?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc34",
        category: "Data Subject Rights", // Added category
        question: "Are data subject rights (access, correction, deletion) supported and processed?",
        type: "tested",
        weight: 9,
      },

      // Monitoring and Logging
      {
        id: "soc35",
        category: "System Activity Logging", // Added category
        question: "Are system activities logged and monitored for security events?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc36",
        category: "Log Protection", // Added category
        question: "Is log data protected from unauthorized access and modification?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc37",
        category: "Log Review", // Added category
        question: "Are logs regularly reviewed for suspicious activities?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc38",
        category: "Centralized Logging", // Added category
        question: "Is there a centralized logging system for security monitoring?",
        type: "tested",
        weight: 8,
      },

      // Third-Party Management
      {
        id: "soc39",
        category: "Third-Party Evaluation", // Added category
        question: "Are third-party service providers evaluated for SOC compliance?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc40",
        category: "Contract Review", // Added category
        question: "Are contracts with service providers reviewed for appropriate control requirements?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc41",
        category: "Third-Party Monitoring", // Added category
        question: "Is third-party performance monitored against contractual requirements?",
        type: "tested",
        weight: 8,
      },

      // Training and Awareness
      {
        id: "soc42",
        category: "Security & Compliance Training", // Added category
        question: "Is security and compliance training provided to all relevant personnel?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc43",
        category: "Role & Responsibility Awareness", // Added category
        question: "Are employees made aware of their roles and responsibilities for SOC compliance?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc44",
        category: "Ongoing Training", // Added category
        question: "Is ongoing training provided to keep personnel current with policies and procedures?",
        type: "tested",
        weight: 7,
      },

      // Management Review and Oversight
      {
        id: "soc45",
        category: "Management Review", // Added category
        question: "Does management regularly review control effectiveness and compliance status?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc46",
        category: "Deficiency Remediation", // Added category
        question: "Are control deficiencies identified, documented, and remediated in a timely manner?",
        type: "tested",
        weight: 9,
      },
      {
        id: "soc47",
        category: "Control Change Approval", // Added category
        question: "Is there a formal process for management to approve significant changes to controls?",
        type: "tested",
        weight: 8,
      },
      {
        id: "soc48",
        category: "Internal Audits", // Added category
        question: "Are internal audits performed to assess control effectiveness?",
        type: "tested",
        weight: 9,
      },
    ],
  },
]

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested" | "textarea"
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

                        {question.type === "textarea" && (
                          <Textarea
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            placeholder="Provide your detailed response here..."
                            rows={4}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedCategory === "soc-compliance") {
                        setCurrentStep("soc-info")
                      } else {
                        setCurrentStep("choose-method")
                      }
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={calculateRisk} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Calculate Risk
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Results */}
            {currentStep === "results" && currentCategory && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Results</h2>
                  <p className="text-lg text-gray-600">
                    Your {currentCategory.name} risk assessment is complete.
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
                        This score reflects your current posture based on the assessment.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Findings & Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                          <p className="text-sm text-blue-800">
                            Based on your responses, your organization demonstrates a <strong>{riskLevel}</strong> risk
                            posture in {currentCategory.name.toLowerCase()}.
                            Further review of specific areas is recommended to enhance security and compliance.
                          </p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h3 className="font-semibold text-red-900 mb-2">Areas for Improvement</h3>
                          <ul className="text-sm text-red-800 list-disc pl-5 space-y-1">
                            <li>Review and update incident response plan annually.</li>
                            <li>Implement multi-factor authentication for all critical systems.</li>
                            <li>Increase frequency of vulnerability assessments to quarterly.</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-semibold text-green-900 mb-2">Strengths</h3>
                          <ul className="text-sm text-green-800 list-disc pl-5 space-y-1">
                            <li>Strong data encryption standards in place.</li>
                            <li>Regular security awareness training for employees.</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("assessment")}
                      className="hover:bg-gray-50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Questions
                    </Button>
                    <Button onClick={() => alert("Report Downloaded!")} className="bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Delegate Assessment Modal */}
            {showDelegateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Delegate Assessment</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDelegateForm(false)}
                        className="hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Send this assessment to a team member or third-party</CardDescription>
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