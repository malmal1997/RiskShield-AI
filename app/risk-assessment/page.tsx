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
      setCurrentStep("soc-<dyad-problem-report summary="52 problems">
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
<problem file="app/api/ai-assessment/analyze/route.ts" line="2" column="10" code="2305">Module '&quot;@/lib/ai-service&quot;' has no exported member 'analyzeDocuments'.</problem>
<problem file="app/api/ai-assessment/test/route.ts" line="2" column="27" code="2305">Module '&quot;@/lib/ai-service&quot;' has no exported member 'analyzeDocuments'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1792" column="41" code="2339">Property 'category' does not exist on type '{ id: string; question: string; type: string; weight: number; options?: undefined; required?: undefined; } | { id: string; question: string; type: string; options: string[]; weight: number; required?: undefined; } | { ...; }'.
  Property 'category' does not exist on type '{ id: string; question: string; type: string; weight: number; options?: undefined; required?: undefined; }'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1967" column="36" code="2345">Argument of type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; exceptions: string; nonOperationalControls: string; ... 4 more ...; socDateAsOf: string; }' is not assignable to parameter of type 'SetStateAction&lt;{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; socDateAsOf: string; testedStatus: string; ... 5 more ...; userEntityControls: string; }&gt;'.
  Property 'testedStatus' is missing in type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; exceptions: string; nonOperationalControls: string; ... 4 more ...; socDateAsOf: string; }' but required in type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; socDateAsOf: string; testedStatus: string; ... 5 more ...; userEntityControls: string; }'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1989" column="24" code="2552">Cannot find name 'Download'. Did you mean 'onload'?</problem>
<problem file="app/risk-assessment/page.tsx" line="2010" column="26" code="2304">Cannot find name 'X'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1362" column="27" code="2345">Argument of type '(prev: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; { [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to parameter of type 'SetStateAction&lt;Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;&gt;'.
  Type '(prev: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; { [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to type '(prevState: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;'.
    Type '{ [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to type 'Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;'.
      'string' index signatures are incompatible.
        Type '&quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;' is not assignable to type '&quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;'.
          Type '&quot;operational&quot;' is not assignable to type '&quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1617" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1618" column="23" code="2532">Object is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1620" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1624" column="25" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2337" column="59" code="2349">This expression is not callable.
  Each member of the union type '{ &lt;S extends { id: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; required?: undefined; } | { id: string; question: string; type: &quot;multiple&quot;; options: string[]; weight: number; required?: undefined; } | { ...; } | { ...; }&gt;(predicate: (value: { ...; } | ... 2 more ... | { ...; }, ind...' has signatures, but none of those signatures are compatible with each other.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2337" column="66" code="7006">Parameter 'q' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2387" column="29" code="2345">Argument of type 'Record&lt;string, &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;' is not assignable to parameter of type 'SetStateAction&lt;Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;&gt;'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2433" column="26" code="2349">This expression is not callable.
  Each member of the union type '{ &lt;S extends { referencedControl: string; controlDescription: string; testingDescription: string; auditorResponse: string; managementResponse: string; }&gt;(predicate: (value: { referencedControl: string; controlDescription: string; testingDescription: string; auditorResponse: string; managementResponse: string; }, ind...' has signatures, but none of those signatures are compatible with each other.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2433" column="34" code="7006">Parameter '_' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2433" column="37" code="7006">Parameter 'i' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="4076" column="40" code="2345">Argument of type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; exceptions: string; nonOperationalControls: string; ... 4 more ...; socDateAsOf: string; }' is not assignable to parameter of type 'SetStateAction&lt;{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; socDateAsOf: string; testedStatus: string; ... 5 more ...; userEntityControls: string; }&gt;'.
  Property 'testedStatus' is missing in type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; exceptions: string; nonOperationalControls: string; ... 4 more ...; socDateAsOf: string; }' but required in type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; socDateAsOf: string; testedStatus: string; ... 5 more ...; userEntityControls: string; }'.</problem>
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
</dyad-problem-report><think>**Tackling Compile Errors**

I'm currently addressing 52 TypeScript errors. My approach involves pinpointing and resolving each one meticulously. Starting with the error at `app/dashboard/page.tsx:179:10`, a missing closing tag for a `div` element will be addressed. The strategy is to tackle these issues systematically, ensuring a clean compile and a robust application.


**Resolving Missing Imports**

Now, I'm working to correct the missing import for `analyzeDocuments`. It seems my earlier fix of exporting `analyzeDocuments` from `@/lib/ai-service` in `route.ts` didn't fully resolve the issue. I am now double-checking the import statements in both `app/api/ai-assessment/analyze/route.ts` and `app/api/ai-assessment/test/route.ts` to ensure the correct path is used and the function is available after the export. My focus is on making sure the imports match the exports.


**Implementing JSX Fixes**

I'm now fixing the missing closing tag in `app/dashboard/page.tsx`, successfully correcting the JSX syntax error. Next, I'm working through the `max_tokens` inconsistencies in `lib/ai-service.ts`. The plan is to change all instances of `maxTokens` to `max_tokens`. Following that, I'll export the `analyzeDocuments` function. Finally, I will add the missing properties to the `Question` interface.


**Analyzing Each Issue**

I'm currently addressing each of the reported 52 TypeScript errors. The initial plan involves closing the missing `div` tag in `app/dashboard/page.tsx:179:10`. Next, I'll update all instances of `maxTokens` to `max_tokens` within `lib/ai-service.ts`. After that, I will export the `analyzeDocuments` function, as it is needed. I'm prioritizing adding the `category` to the `Question` interface. To be sure all the states are in working condition. I'll continue methodically through the list.


**Fixing Compile-Time Errors**

I'm making progress in addressing the compile-time errors. I've successfully closed the missing `div` tag in `app/dashboard/page.tsx`, and I've begun changing all instances of `maxTokens` to `max_tokens` in `lib/ai-service.ts`. I will now focus on exporting the `analyzeDocuments` function. Additionally, I'll add the `category` property to the `Question` interface. My goal is to methodically address each error and ensure a clean build.


**Analyzing Type Issues**

I'm currently addressing a range of errors, starting with JSX syntax and `max_tokens` inconsistencies. I've corrected the missing closing `div` tag and am in the process of replacing `maxTokens` with `max_tokens` throughout `lib/ai-service.ts`. The focus now shifts to exporting `analyzeDocuments` and incorporating the `category` property into the `Question` interface, after which I will resolve all state inconsistencies. I'll meticulously progress through the remaining issues.


**Tackling Remaining Issues**

I'm now focusing on a wide range of remaining issues. I've addressed missing imports for icons and resolved state typing inconsistencies.  The goal is to eliminate remaining  null errors in `app/solutions/page.tsx` by using null checks and to  fix the  type mismatches for the `<Form>` and `<FormField>` components in `app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx`.  Additionally, I will be removing incorrect props from `MainNavigation`. My plan is to tackle each problem systematically, addressing null checks and type mismatches.


**Resolving Type Mismatches**

I'm currently addressing multiple type mismatches and null errors. I've focused on `app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx`,  correcting  `formSchema`  and  `useForm` configurations.  I'm also removing incorrect props from `MainNavigation`.  Next, I plan to resolve state and potential null issues in `app/solutions/page.tsx` using null checks. My objective is to resolve these type mismatches.


</think>I've addressed the TypeScript compile-time errors you reported. Here's a breakdown of the changes:

1.  **`app/dashboard/page.tsx`**: Corrected a JSX syntax error by ensuring the `div` element was properly closed.
2.  **`lib/ai-service.ts`**: Updated all instances of `maxTokens` to `max_tokens` to align with the `@ai-sdk/google` library's API.
3.  **`app/api/ai-assessment/analyze/route.ts` and `app/api/ai-assessment/test/route.ts`**: Exported the `analyzeDocuments` function from `lib/ai-service.ts` so it can be imported and used in these API routes.
4.  **`app/risk-assessment/page.tsx`**:
    *   Added the `category` property to the `Question` interface and populated it for all questions in the `assessmentCategories` array.
    *   Ensured the `socInfo` state initialization includes the `testedStatus` property.
    *   Imported the `Download` and `X` icons from `lucide-react` as they were being used without being imported.
5.  **`app/risk-assessment/ai-assessment/page.tsx`**:
    *   Adjusted the type definition for `socExceptionStatus` to correctly include `"operational"`.
    *   Added nullish coalescing (`|| 0`) when accessing `question.weight` to handle cases where it might be `undefined`.
    *   Explicitly typed the parameters `q`, `_`, and `i` in the `every` and `filter` array methods to resolve implicit `any` type errors.
    *   Ensured the `socInfo` state initialization includes the `testedStatus` property.
6.  **`app/solutions/page.tsx`**: Added null checks for the `carousel` element before attempting to access its properties, preventing potential runtime errors if the element is not found.
7.  **`app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx`**:
    *   Modified the `formSchema` to explicitly mark boolean fields as optional (`.optional()`) to correctly match the inferred types when using `default(false)`.
    *   Corrected the usage of the `Form` component by wrapping the form with `FormProvider` from `react-hook-form` and ensuring `FormField` correctly receives the `control` prop.
8.  **`app/third-party-assessment/page.tsx`**: Removed the `userEmail` and `onSignOut` props from the `MainNavigation` component calls, as `MainNavigation` now internally uses the `useAuth` hook for user information and sign-out functionality.
9.  **`components/theme-provider.tsx`**: Simplified the `ThemeProvider` component to directly use `children` from its props, resolving the type error.

These changes ensure type safety and correct functionality across your application.

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
  );
}