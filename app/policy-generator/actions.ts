"use server"

interface PolicyFormData {
  companyName: string
  institutionType: string
  selectedPolicy: string
  employeeCount: string
  assets: string
}

// Enhanced policy templates with structured data for better rendering
const policyTemplates = {
  cybersecurity: (data: PolicyFormData) => ({
    title: "CYBERSECURITY POLICY",
    companyName: data.companyName,
    effectiveDate: new Date().toLocaleDateString(),
    institutionType: data.institutionType,
    employeeCount: data.employeeCount,
    assets: data.assets,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sections: [
      {
        number: "1",
        title: "PURPOSE AND SCOPE",
        content: `This Cybersecurity Policy establishes the framework for protecting ${data.companyName}'s information systems, data, and technology infrastructure from cyber threats. This policy applies to all employees, contractors, and third parties with access to ${data.companyName}'s systems.`,
      },
      {
        number: "2",
        title: "DATA PROTECTION",
        content: `${data.companyName} is committed to protecting sensitive customer and business data through comprehensive security measures.`,
        items: [
          "Encryption of data at rest and in transit",
          "Regular data backups and secure storage",
          "Access controls based on principle of least privilege",
          "Data classification and handling procedures",
          "Regular security assessments and audits",
        ],
      },
      {
        number: "3",
        title: "ACCESS CONTROLS",
        content: "All system access must be properly authorized and monitored.",
        items: [
          "Authorization by management required",
          "Access based on job responsibilities",
          "Regular access reviews and updates",
          "Strong authentication methods required",
          "Comprehensive logging and monitoring",
        ],
      },
      {
        number: "4",
        title: "INCIDENT RESPONSE",
        content: `In the event of a cybersecurity incident, ${data.companyName} will follow established procedures to minimize impact and ensure rapid recovery.`,
        items: [
          "Immediate containment and threat assessment",
          "Stakeholder notification within 24 hours",
          "Detailed incident documentation",
          "Post-incident review and improvements",
          "Regulatory reporting as required",
        ],
      },
      {
        number: "5",
        title: "EMPLOYEE TRAINING",
        content: "All employees must complete comprehensive cybersecurity training.",
        items: [
          "Annual cybersecurity awareness training",
          "Phishing simulation exercises",
          "Role-specific security training",
          "Regular updates on emerging threats",
          "Security policy acknowledgment",
        ],
      },
      {
        number: "6",
        title: "COMPLIANCE REQUIREMENTS",
        content: "This policy ensures compliance with applicable regulations and standards.",
        items: [
          "Federal financial regulations (FFIEC guidelines)",
          "State privacy laws and requirements",
          "Industry standards (NIST Cybersecurity Framework)",
          data.institutionType === "Credit Union" ? "NCUA regulations" : "FDIC requirements",
          "Regular compliance assessments",
        ],
      },
    ],
  }),

  compliance: (data: PolicyFormData) => ({
    title: "REGULATORY COMPLIANCE POLICY",
    companyName: data.companyName,
    effectiveDate: new Date().toLocaleDateString(),
    institutionType: data.institutionType,
    employeeCount: data.employeeCount,
    assets: data.assets,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sections: [
      {
        number: "1",
        title: "PURPOSE",
        content: `This Regulatory Compliance Policy ensures ${data.companyName} maintains full compliance with all applicable federal and state regulations governing ${data.institutionType.toLowerCase()} operations.`,
      },
      {
        number: "2",
        title: "REGULATORY FRAMEWORK",
        content: `${data.companyName} operates under the oversight of multiple regulatory agencies.`,
        items: [
          data.institutionType === "Credit Union"
            ? "National Credit Union Administration (NCUA)"
            : "Federal Deposit Insurance Corporation (FDIC)",
          "Office of the Comptroller of the Currency (OCC)",
          "Consumer Financial Protection Bureau (CFPB)",
          "Federal Reserve System",
          "State banking regulators",
        ],
      },
      {
        number: "3",
        title: "BSA/AML COMPLIANCE",
        content: `${data.companyName} maintains a comprehensive Bank Secrecy Act/Anti-Money Laundering program.`,
        items: [
          "Customer Identification Program (CIP)",
          "Suspicious Activity Reporting (SAR)",
          "Currency Transaction Reporting (CTR)",
          "Customer Due Diligence (CDD)",
          "Enhanced Due Diligence (EDD) for high-risk customers",
        ],
      },
      {
        number: "4",
        title: "CONSUMER PROTECTION",
        content: "We ensure compliance with all consumer protection regulations.",
        items: [
          "Truth in Lending Act (TILA)",
          "Fair Credit Reporting Act (FCRA)",
          "Equal Credit Opportunity Act (ECOA)",
          "Fair Debt Collection Practices Act (FDCPA)",
          "Electronic Fund Transfer Act (EFTA)",
        ],
      },
      {
        number: "5",
        title: "COMPLIANCE MONITORING",
        content: `${data.companyName} monitors compliance through comprehensive oversight programs.`,
        items: [
          "Monthly compliance reports",
          "Quarterly risk assessments",
          "Annual policy reviews",
          "Regular training programs",
          "Third-party compliance audits",
        ],
      },
    ],
  }),

  "third-party": (data: PolicyFormData) => ({
    title: "THIRD-PARTY RISK MANAGEMENT POLICY",
    companyName: data.companyName,
    effectiveDate: new Date().toLocaleDateString(),
    institutionType: data.institutionType,
    employeeCount: data.employeeCount,
    assets: data.assets,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sections: [
      {
        number: "1",
        title: "PURPOSE",
        content: `This policy establishes the framework for managing risks associated with third-party relationships at ${data.companyName}, ensuring proper due diligence, ongoing monitoring, and risk mitigation.`,
      },
      {
        number: "2",
        title: "SCOPE",
        content: "This policy applies to all third-party relationships including:",
        items: [
          "Technology service providers",
          "Professional service providers",
          "Vendors and suppliers",
          "Subcontractors and consultants",
          "Business partners and affiliates",
        ],
      },
      {
        number: "3",
        title: "RISK ASSESSMENT",
        content: `${data.companyName} categorizes third-party relationships based on risk levels and implements appropriate controls.`,
      },
      {
        number: "4",
        title: "DUE DILIGENCE REQUIREMENTS",
        content: "Before engaging any third party, comprehensive due diligence is conducted.",
        items: [
          "Financial stability assessment",
          "Regulatory compliance review",
          "Security and privacy evaluation",
          "Business continuity planning review",
          "Insurance coverage verification",
          "Reference checks and reputation assessment",
        ],
      },
      {
        number: "5",
        title: "ONGOING MONITORING",
        content: `${data.companyName} monitors third-party performance through regular assessments.`,
        items: [
          "Regular performance reviews",
          "Annual risk assessments",
          "Continuous monitoring of financial stability",
          "Security assessments and penetration testing",
          "Compliance audits and certifications",
        ],
      },
    ],
  }),

  "business-continuity": (data: PolicyFormData) => ({
    title: "BUSINESS CONTINUITY PLAN",
    companyName: data.companyName,
    effectiveDate: new Date().toLocaleDateString(),
    institutionType: data.institutionType,
    employeeCount: data.employeeCount,
    assets: data.assets,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sections: [
      {
        number: "1",
        title: "PURPOSE",
        content: `This Business Continuity Plan ensures ${data.companyName} can continue critical operations during and after disruptive events, protecting customers, employees, and stakeholders.`,
      },
      {
        number: "2",
        title: "CRITICAL BUSINESS FUNCTIONS",
        content: "The following functions have been identified as critical to operations:",
        items: [
          "Customer deposit and withdrawal services",
          "Loan processing and servicing",
          "Payment processing systems",
          "Online and mobile banking",
          "Customer service operations",
          "Regulatory reporting",
        ],
      },
      {
        number: "3",
        title: "RISK SCENARIOS",
        content: "Potential disruption scenarios include:",
        items: [
          "Natural disasters (floods, earthquakes, storms)",
          "Technology failures and cyber attacks",
          "Pandemic and health emergencies",
          "Utility outages and infrastructure failures",
          "Workplace violence and security threats",
        ],
      },
      {
        number: "4",
        title: "RECOVERY STRATEGIES",
        content: `${data.companyName} maintains multiple recovery options to ensure business continuity.`,
        items: [
          "Alternate facilities and backup locations",
          "Real-time data replication systems",
          "Cloud-based backup systems",
          "Work-from-home capabilities",
          "Mobile banking units for customer service",
        ],
      },
      {
        number: "5",
        title: "TESTING AND MAINTENANCE",
        content: "Regular testing ensures plan effectiveness.",
        items: [
          "Annual full-scale exercises",
          "Quarterly tabletop exercises",
          "Monthly communication tests",
          "Annual plan reviews and updates",
          "Staff training and awareness programs",
        ],
      },
    ],
  }),

  privacy: (data: PolicyFormData) => ({
    title: "PRIVACY & DATA PROTECTION POLICY",
    companyName: data.companyName,
    effectiveDate: new Date().toLocaleDateString(),
    institutionType: data.institutionType,
    employeeCount: data.employeeCount,
    assets: data.assets,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sections: [
      {
        number: "1",
        title: "PURPOSE",
        content: `This Privacy & Data Protection Policy establishes ${data.companyName}'s commitment to protecting customer and employee personal information in compliance with applicable privacy laws and regulations.`,
      },
      {
        number: "2",
        title: "LEGAL FRAMEWORK",
        content: `${data.companyName} complies with all applicable privacy regulations.`,
        items: [
          "Gramm-Leach-Bliley Act (GLBA)",
          "Fair Credit Reporting Act (FCRA)",
          "California Consumer Privacy Act (CCPA)",
          "State privacy laws and regulations",
          "Federal banking privacy requirements",
        ],
      },
      {
        number: "3",
        title: "DATA COLLECTION",
        content: "We collect personal information for legitimate business purposes:",
        items: [
          "Account opening and maintenance",
          "Loan processing and underwriting",
          "Fraud prevention and security",
          "Regulatory compliance and reporting",
          "Customer service and support",
        ],
      },
      {
        number: "4",
        title: "CUSTOMER RIGHTS",
        content: "Customers have specific rights regarding their personal information:",
        items: [
          "Access their personal information",
          "Request corrections to inaccurate data",
          "Opt-out of marketing communications",
          "Limit information sharing (where permitted)",
          "File privacy complaints",
        ],
      },
      {
        number: "5",
        title: "DATA SECURITY",
        content: `${data.companyName} protects personal information through comprehensive security measures.`,
        items: [
          "Encryption of sensitive data",
          "Access controls and authentication",
          "Regular security assessments",
          "Employee training and awareness",
          "Incident response procedures",
        ],
      },
    ],
  }),

  operational: (data: PolicyFormData) => ({
    title: "OPERATIONAL RISK POLICY",
    companyName: data.companyName,
    effectiveDate: new Date().toLocaleDateString(),
    institutionType: data.institutionType,
    employeeCount: data.employeeCount,
    assets: data.assets,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sections: [
      {
        number: "1",
        title: "PURPOSE",
        content: `This Operational Risk Policy establishes the framework for identifying, assessing, monitoring, and managing operational risks at ${data.companyName} to ensure safe and sound banking operations.`,
      },
      {
        number: "2",
        title: "OPERATIONAL RISK DEFINITION",
        content: "Operational risk includes the risk of loss resulting from:",
        items: [
          "Inadequate or failed internal processes",
          "System outages and technology failures",
          "Human error and misconduct",
          "External fraud and cyber attacks",
          "Natural disasters and business disruption",
        ],
      },
      {
        number: "3",
        title: "RISK GOVERNANCE",
        content: "Operational Risk Management Structure includes:",
        items: [
          "Board of Directors: Ultimate oversight responsibility",
          "Risk Committee: Policy approval and monitoring",
          "Chief Risk Officer: Day-to-day risk management",
          "Business Line Managers: Risk identification and mitigation",
          "Internal Audit: Independent risk assessment",
        ],
      },
      {
        number: "4",
        title: "RISK IDENTIFICATION",
        content: `${data.companyName} identifies operational risks through multiple methods.`,
        items: [
          "Risk and control self-assessments (RCSA)",
          "Key risk indicator (KRI) monitoring",
          "Loss event data collection",
          "Internal and external audit findings",
          "Regulatory examination results",
        ],
      },
      {
        number: "5",
        title: "INTERNAL CONTROLS",
        content: `${data.companyName} maintains comprehensive internal controls.`,
        items: [
          "Segregation of duties",
          "Authorization limits and approvals",
          "Regular reconciliations",
          "Physical and logical security",
          "Management oversight and review",
        ],
      },
    ],
  }),
}

export async function generatePolicy(formData: PolicyFormData) {
  // Simulate API delay for realistic experience
  await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    const template = policyTemplates[formData.selectedPolicy as keyof typeof policyTemplates]

    if (!template) {
      throw new Error("Policy template not found")
    }

    return template(formData)
  } catch (error) {
    console.error("Error generating policy:", error)
    throw new Error("Failed to generate policy")
  }
}
