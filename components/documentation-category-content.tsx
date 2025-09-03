"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Lightbulb, Shield, FileText, BarChart3, Settings, Users, Bot, Bell } from "lucide-react";

interface DocumentationCategoryContentProps {
  category: string;
}

export const documentationContent: Record<string, { title: string; description: string; articles: { title: string; content: string; icon: React.ElementType }[] }> = {
  "getting-started": {
    title: "Getting Started with RiskGuard AI",
    description: "Your first steps to setting up and using the RiskGuard AI platform.",
    articles: [
      {
        title: "Account Creation & Login",
        icon: Users,
        content: `
          <p>Welcome to RiskGuard AI! This guide will walk you through the process of creating your account and logging in for the first time.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">1. Register Your Institution</h3>
          <p>Navigate to the <a href="/auth/register" class="text-blue-600 hover:underline">registration page</a> and fill out the required information for your financial institution. This includes your company name, contact details, and desired credentials.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">2. Account Approval</h3>
          <p>After submission, our team will review your application. This typically takes 1-2 business days. You will receive an email notification once your account is approved.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">3. First Login</h3>
          <p>Once approved, return to the <a href="/auth/login" class="text-blue-600 hover:underline">login page</a> and enter your registered email and password. You'll be redirected to your personalized dashboard.</p>
        `,
      },
      {
        title: "Dashboard Navigation",
        icon: BarChart3,
        content: `
          <p>The RiskGuard AI dashboard is your central hub for all risk management activities. Here's a quick overview of its key sections:</p>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Overview:</strong> Get a high-level summary of your risk posture, compliance score, and active assessments.</li>
            <li><strong>Assessments:</strong> View all your ongoing and completed risk assessments.</li>
            <li><strong>Vendors:</strong> Manage your third-party vendor relationships.</li>
            <li><strong>Reports:</strong> Generate and access various risk and compliance reports.</li>
            <li><strong>Notifications:</strong> Stay updated with real-time alerts and system messages.</li>
          </ul>
          <p class="mt-4">Use the main navigation bar at the top to easily switch between different modules of the platform.</p>
        `,
      },
      {
        title: "Your First Assessment",
        icon: FileText,
        content: `
          <p>Ready to conduct your first risk assessment? Follow these steps:</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">1. Choose Assessment Type</h3>
          <p>From the dashboard or the <a href="/risk-assessment" class="text-blue-600 hover:underline">Risk Assessment page</a>, select the type of assessment you wish to perform (e.g., Cybersecurity, Data Privacy).</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">2. Select Method (Manual or AI-Powered)</h3>
          <p>Decide whether to complete the assessment manually by answering questions or use our AI-powered analysis by uploading relevant documents.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">3. Complete & Review</h3>
          <p>If manual, answer the questions. If AI-powered, upload your documents, let the AI analyze, and then review the generated answers and evidence. Once satisfied, approve and finalize the assessment.</p>
        `,
      },
    ],
  },
  "risk-assessments": {
    title: "Conducting Risk Assessments",
    description: "In-depth guides on performing various risk assessments with RiskGuard AI.",
    articles: [
      {
        title: "Cybersecurity Assessments",
        icon: Shield,
        content: `
          <p>Our Cybersecurity Assessment helps you evaluate your organization's defense against cyber threats.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Key Areas Covered:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Data Protection & Encryption</li>
            <li>Network Security & Firewalls</li>
            <li>Incident Response Planning</li>
            <li>Employee Training & Awareness</li>
            <li>Vulnerability Management</li>
          </ul>
          <p class="mt-4">Upload your security policies, incident response plans, and network diagrams for AI-powered analysis to get a comprehensive risk score and actionable recommendations.</p>
        `,
      },
      {
        title: "Third-Party Risk Evaluation",
        icon: Users,
        content: `
          <p>Managing risks from third-party vendors is crucial. RiskGuard AI simplifies this process.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Steps:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Send Invitations:</strong> Use the <a href="/third-party-assessment" class="text-blue-600 hover:underline">Third-Party Assessment page</a> to send secure assessment links to your vendors.</li>
            <li><strong>Vendor Submission:</strong> Vendors complete the assessment, optionally using AI to analyze their own documents.</li>
            <li><strong>Review & Score:</strong> Automatically receive risk scores and detailed reports once vendors submit their responses.</li>
            <li><strong>Continuous Monitoring:</strong> Track vendor status and schedule periodic re-assessments.</li>
          </ul>
        `,
      },
      {
        title: "AI-Powered Analysis",
        icon: Bot,
        content: `
          <p>Leverage the power of AI to accelerate your risk assessments.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">How it Works:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Document Upload:</strong> Upload your organization's policies, procedures, SOC reports, and other relevant documents.</li>
            <li><strong>AI Processing:</strong> Our AI models analyze the content, extract key information, and match it against assessment questions.</li>
            <li><strong>Suggested Answers & Evidence:</strong> The AI provides suggested answers for each question, along with direct quotes from your documents as evidence.</li>
            <li><strong>Review & Approve:</strong> You review the AI's suggestions, make any necessary edits, and approve the answers before finalizing the assessment.</li>
          </ul>
          <p class="mt-4">This significantly reduces the time and effort required to complete complex assessments.</p>
        `,
      },
    ],
  },
  "policy-management": {
    title: "Policy Management",
    description: "Guides on generating, editing, and managing your organizational policies.",
    articles: [
      {
        title: "Using the Policy Generator",
        icon: FileText,
        content: `
          <p>The AI Policy Generator helps you create custom policies tailored to your institution's needs.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Steps:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Select Policy Type:</strong> Choose from various templates like Cybersecurity, Regulatory Compliance, or Data Privacy.</li>
            <li><strong>Provide Details:</strong> Enter your company name, institution type, and other relevant information.</li>
            <li><strong>Generate:</strong> Our AI will generate a comprehensive draft policy document.</li>
            <li><strong>Review & Edit:</strong> Customize the generated policy to perfectly match your organization's specific requirements.</li>
          </ul>
          <p class="mt-4">Access the generator from the <a href="/policy-generator" class="text-blue-600 hover:underline">Policy Generator page</a>.</p>
        `,
      },
      {
        title: "Policy Library",
        icon: FileText,
        content: `
          <p>The Policy Library is your centralized repository for all approved and draft policies.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Features:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Search & Filter:</strong> Easily find policies by name, status, or type.</li>
            <li><strong>Version Control:</strong> Track changes and maintain different versions of your policies.</li>
            <li><strong>Approval Status:</strong> Monitor the approval workflow for each policy.</li>
            <li><strong>Export:</strong> Download policies in various formats for distribution and record-keeping.</li>
          </ul>
          <p class="mt-4">Visit the <a href="/policy-library" class="text-blue-600 hover:underline">Policy Library page</a> to manage your documents.</p>
        `,
      },
      {
        title: "Digital Approval",
        icon: CheckCircle,
        content: `
          <p>Streamline your policy approval process with digital signatures and audit trails.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Process:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Review:</strong> After editing a policy, send it for internal review.</li>
            <li><strong>Sign-off:</strong> Designated approvers can digitally sign the policy within the platform.</li>
            <li><strong>Audit Trail:</strong> All approvals and changes are logged, providing a clear audit trail for compliance.</li>
            <li><strong>Finalization:</strong> Once approved, the policy is marked as final and ready for implementation.</li>
          </ul>
        `,
      },
    ],
  },
  "analytics-reporting": {
    title: "Analytics & Reporting",
    description: "Understand your risk data and generate insightful reports.",
    articles: [
      {
        title: "Dashboard Overview",
        icon: BarChart3,
        content: `
          <p>The Analytics Dashboard provides a comprehensive view of your organization's risk posture.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Key Metrics:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Overall Risk Score & Level</li>
            <li>Assessment Completion Rates</li>
            <li>High-Risk Vendors</li>
            <li>Compliance Trends</li>
            <li>Real-time Activity Feed</li>
          </ul>
          <p class="mt-4">Customize your dashboard to focus on the metrics most important to your role and organization.</p>
        `,
      },
      {
        title: "Custom Reports",
        icon: FileText,
        content: `
          <p>Generate tailored reports to meet specific internal or regulatory requirements.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Report Types:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Executive Risk Summaries</li>
            <li>Vendor Risk Assessment Reports</li>
            <li>Compliance Status Reports</li>
            <li>Security Metrics Dashboards</li>
          </ul>
          <p class="mt-4">Reports can be scheduled for automatic generation and distribution, ensuring stakeholders always have the latest information.</p>
        `,
      },
      {
        title: "Exporting Data",
        icon: Settings,
        content: `
          <p>Easily export your assessment data and reports for further analysis or archival purposes.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Supported Formats:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>PDF (for formatted reports)</li>
            <li>CSV (for raw data export)</li>
            <li>JSON (for programmatic access)</li>
          </ul>
          <p class="mt-4">Data export functionality is available from the <a href="/reports" class="text-blue-600 hover:underline">Reports page</a> and individual assessment views.</p>
        `,
      },
    ],
  },
  "account-settings": {
    title: "Account & Settings",
    description: "Manage your profile, organization, and integrations.",
    articles: [
      {
        title: "User Management",
        icon: Users,
        content: `
          <p>As an administrator, you can manage users within your organization.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Features:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Invite new users to your organization.</li>
            <li>Assign and modify user roles (Admin, Manager, Analyst, Viewer).</li>
            <li>View user activity and access logs.</li>
            <li>Remove users from the organization.</li>
          </ul>
          <p class="mt-4">Access these features from <a href="/settings/users" class="text-blue-600 hover:underline">Settings > Users</a>.</p>
        `,
      },
      {
        title: "API Keys",
        icon: Settings,
        content: `
          <p>Integrate RiskGuard AI with other systems using API keys.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Managing API Keys:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Generate new API keys for various AI providers (Google Gemini, Groq, Hugging Face).</li>
            <li>Name your API keys for easy identification.</li>
            <li>Securely store and manage your API keys.</li>
            <li>Delete unused or compromised API keys.</li>
          </ul>
          <p class="mt-4">Your API keys are encrypted and stored securely. Manage them in <a href="/settings" class="text-blue-600 hover:underline">Settings > Integrations</a>.</p>
        `,
      },
      {
        title: "Notification Settings",
        icon: Bell,
        content: `
          <p>Customize how you receive notifications from RiskGuard AI.</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Options:</h3>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Email notifications for assessments, reports, and alerts.</li>
            <li>Push notifications for real-time updates.</li>
            <li>SMS alerts for critical security events.</li>
          </ul>
          <p class="mt-4">Adjust your preferences in <a href="/settings" class="text-blue-600 hover:underline">Settings > Notifications</a>.</p>
        `,
      },
    ],
  },
  "tips-best-practices": {
    title: "Tips & Best Practices",
    description: "Optimize your risk management strategy with expert advice.",
    articles: [
      {
        title: "Improving Risk Scores",
        icon: Lightbulb,
        content: `
          <p>To improve your organization's risk scores, focus on these key areas:</p>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Implement Recommendations:</strong> Act on the recommendations provided in your assessment reports.</li>
            <li><strong>Strengthen Controls:</strong> Enhance cybersecurity measures, access controls, and data protection.</li>
            <li><strong>Regular Training:</strong> Ensure employees receive frequent security awareness and compliance training.</li>
            <li><strong>Document Everything:</strong> Maintain up-to-date policies, procedures, and evidence of control implementation.</li>
            <li><strong>Continuous Monitoring:</strong> Regularly review and update your risk management strategies.</li>
          </ul>
        `,
      },
      {
        title: "Compliance Strategies",
        icon: Shield,
        content: `
          <p>Effective compliance is an ongoing process. Consider these strategies:</p>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Stay Updated:</strong> Regularly monitor changes in relevant regulations (e.g., FDIC, NCUA, GDPR).</li>
            <li><strong>Automate Tracking:</strong> Utilize RiskGuard AI's compliance tracking features to automate monitoring.</li>
            <li><strong>Internal Audits:</strong> Conduct regular internal audits to identify and address compliance gaps proactively.</li>
            <li><strong>Training & Awareness:</strong> Ensure all staff are aware of their compliance responsibilities.</li>
            <li><strong>Documentation:</strong> Maintain meticulous records of all compliance activities and evidence.</li>
          </ul>
        `,
      },
      {
        title: "AI Usage Tips",
        icon: Bot,
        content: `
          <p>Get the most out of RiskGuard AI's intelligent features:</p>
          <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>High-Quality Documents:</strong> Upload clear, comprehensive, and up-to-date documents for AI analysis.</li>
            <li><strong>Supported Formats:</strong> Prefer PDF, TXT, MD, CSV, JSON, HTML, XML. Convert Word/Excel files to supported formats.</li>
            <li><strong>Review AI Suggestions:</strong> Always review AI-generated answers and evidence. The AI is a powerful assistant, but human oversight is crucial.</li>
            <li><strong>Provide Context:</strong> For complex questions, ensure your documents provide sufficient context for the AI to draw accurate conclusions.</li>
          </ul>
        `,
      },
    ],
  },
};

export function DocumentationCategoryContent({ category }: DocumentationCategoryContentProps) {
  const content = documentationContent[category];

  if (!content) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Content Not Found</CardTitle>
          <CardDescription>
            The documentation category "{category}" could not be found. Please check the URL or return to the main documentation page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/documentation">
            <Button>Back to Documentation</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-12">
      {content.articles.map((article, index) => {
        const IconComponent = article.icon;
        return (
          <Card key={index} className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <IconComponent className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl font-semibold">{article.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: article.content }} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
