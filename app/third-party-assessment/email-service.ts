"use server"

// Real email sending function using Resend API directly
export async function sendAssessmentEmail(emailData: {
  vendorName: string
  vendorEmail: string
  contactPerson: string
  assessmentType: string
  dueDate: string
  customMessage: string
  assessmentId: string
  companyName: string
}) {
  try {
    console.log("📧 Starting email send process...")
    console.log("📧 Email data:", emailData)

    // Validate email data
    if (!emailData.vendorEmail || !emailData.vendorName || !emailData.assessmentId) {
      throw new Error("Missing required email data")
    }

    // Check if this is an AI-powered assessment
    const isAiPowered = emailData.assessmentType.includes("(AI-Powered)")
    console.log("🤖 Is AI-powered assessment:", isAiPowered)

    // Get the current URL for the assessment link
    const currentUrl = "https://v0-fork-of-recreate-ui-screenshot-five.vercel.app"
    const assessmentLink = `${currentUrl}/vendor-assessment/${emailData.assessmentId}?token=abc123xyz${isAiPowered ? "&ai=true" : ""}`

    console.log("📧 Assessment link generated:", assessmentLink)

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailData.vendorEmail)) {
      console.error("❌ Invalid email format:", emailData.vendorEmail)
      return {
        success: false,
        message: `Invalid email format: ${emailData.vendorEmail}`,
        assessmentLink: assessmentLink,
      }
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("📧 Resend API key not configured, running in demo mode...")
      return {
        success: true,
        message: "Assessment invitation created successfully (email service in demo mode)",
        messageId: `demo_${Date.now()}`,
        assessmentLink: assessmentLink,
        isDemo: true,
      }
    }

    // Create email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${isAiPowered ? "AI-Powered " : ""}Vendor Risk Assessment Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: ${isAiPowered ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" : "#1e40af"}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1>🛡️ ${isAiPowered ? "AI-Powered " : ""}Vendor Risk Assessment</h1>
          <p>You've been invited to complete ${isAiPowered ? "an AI-powered " : "a "}security assessment</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2>Hello${emailData.contactPerson ? ` ${emailData.contactPerson}` : ""},</h2>
          
          <p><strong>${emailData.companyName}</strong> has requested that you complete a <strong>${emailData.assessmentType}</strong> as part of our vendor risk evaluation process.</p>
          
          ${
            isAiPowered
              ? `
          <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0;">🤖 AI-Powered Assessment Features</h3>
              <ul style="color: #1e40af; margin-bottom: 0;">
                  <li>Upload your security policies, procedures, and compliance documents</li>
                  <li>AI analyzes your documents and suggests answers automatically</li>
                  <li>Review and approve AI-generated responses</li>
                  <li>Complete assessments 3x faster with AI assistance</li>
              </ul>
          </div>
          `
              : ""
          }
          
          <div style="background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3>Assessment Details:</h3>
              <ul>
                  <li><strong>Assessment Type:</strong> ${emailData.assessmentType}</li>
                  <li><strong>Due Date:</strong> ${emailData.dueDate ? new Date(emailData.dueDate).toLocaleDateString() : "Not specified"}</li>
                  <li><strong>Estimated Time:</strong> ${isAiPowered ? "10-20 minutes (with AI assistance)" : "15-30 minutes"}</li>
                  <li><strong>Company:</strong> ${emailData.vendorName}</li>
              </ul>
          </div>
          
          ${
            emailData.customMessage
              ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3>Additional Message:</h3>
              <p>${emailData.customMessage}</p>
          </div>
          `
              : ""
          }
          
          <p>To complete your assessment, please click the link below:</p>
          
          <div style="text-align: center; margin: 20px 0;">
              <a href="${assessmentLink}" style="display: inline-block; background: ${isAiPowered ? "#3b82f6" : "#1e40af"}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  ${isAiPowered ? "🤖 Complete AI-Powered Assessment" : "Complete Assessment Now"}
              </a>
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; word-break: break-all;">
              <p><strong>Direct Link (if button doesn't work):</strong></p>
              <p><a href="${assessmentLink}" style="color: #1e40af;">${assessmentLink}</a></p>
          </div>
          
          ${
            isAiPowered
              ? `
          <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0; font-size: 14px; color: #047857;">
                  <strong>💡 Pro Tip:</strong> Have your security policies, SOC reports, and compliance documents ready to upload for instant AI analysis and completion.
              </p>
          </div>
          `
              : ""
          }
          
          <div style="background: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #dc2626;">
                  <strong>Important:</strong> This assessment link is unique to your company. Please do not share it with others.
              </p>
          </div>
          
          <p style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
              This email was sent by RiskShield AI on behalf of ${emailData.companyName}<br>
              If you have questions, please contact the requesting organization directly.<br>
              © 2025 RiskShield AI. All rights reserved.
          </p>
      </div>
  </div>
</body>
</html>
    `

    const textContent = `
Hello${emailData.contactPerson ? ` ${emailData.contactPerson}` : ""},

${emailData.companyName} has requested that you complete a ${emailData.assessmentType} as part of our vendor risk evaluation process.

${
  isAiPowered
    ? `
🤖 AI-POWERED ASSESSMENT FEATURES:
- Upload your security policies, procedures, and compliance documents
- AI analyzes your documents and suggests answers automatically
- Review and approve AI-generated responses
- Complete assessments 3x faster with AI assistance
`
    : ""
}

Assessment Details:
- Assessment Type: ${emailData.assessmentType}
- Due Date: ${emailData.dueDate ? new Date(emailData.dueDate).toLocaleDateString() : "Not specified"}
- Estimated Time: ${isAiPowered ? "10-20 minutes (with AI assistance)" : "15-30 minutes"}
- Company: ${emailData.vendorName}

${emailData.customMessage ? `Additional Message: ${emailData.customMessage}\n\n` : ""}

To complete your assessment, please visit:
${assessmentLink}

${
  isAiPowered
    ? `💡 Pro Tip: Have your security policies, SOC reports, and compliance documents ready to upload for instant AI analysis and completion.\n\n`
    : ""
}

IMPORTANT: This assessment link is unique to your company. Please do not share it with others.

If you have questions, please contact the requesting organization directly.

Best regards,
RiskShield AI Team
    `

    // Prepare the email payload for Resend
    const emailPayload = {
      from: "RiskShield AI <onboarding@resend.dev>",
      to: [emailData.vendorEmail],
      subject: `🛡️ ${isAiPowered ? "AI-Powered " : ""}Vendor Risk Assessment Required - ${emailData.assessmentType}`,
      html: htmlContent,
      text: textContent,
    }

    console.log("📧 Sending email to:", emailData.vendorEmail)
    console.log("📧 Subject:", emailPayload.subject)

    // Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    })

    const responseText = await response.text()
    console.log("📧 Response status:", response.status)
    console.log("📧 Response body:", responseText)

    if (!response.ok) {
      console.error("📧 Resend API error:", responseText)

      // Parse error response
      let errorMessage = responseText
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.message || errorData.error || responseText
      } catch (e) {
        // Use raw response if not JSON
      }

      // Still return success since assessment was created, but note email issue
      return {
        success: true,
        message: `Assessment invitation created successfully! 

⚠️ Email delivery issue: ${errorMessage}

🔗 Please share this assessment link manually:
${assessmentLink}

The assessment is ready to be completed.`,
        messageId: `fallback_${Date.now()}`,
        assessmentLink: assessmentLink,
        emailError: errorMessage,
      }
    }

    const result = JSON.parse(responseText)
    console.log("✅ Email sent successfully!")
    console.log("✅ Message ID:", result.id)

    return {
      success: true,
      message: `${isAiPowered ? "AI-powered assessment" : "Assessment"} invitation sent successfully! 

📧 Email sent to: ${emailData.vendorEmail}
📋 Message ID: ${result.id}
🤖 AI Features: ${isAiPowered ? "Enabled" : "Disabled"}

The vendor should receive the email shortly with ${isAiPowered ? "AI-powered features for document upload and analysis" : "the standard assessment form"}.`,
      messageId: result.id,
      assessmentLink: assessmentLink,
      isAiPowered: isAiPowered,
    }
  } catch (error) {
    console.error("💥 Email service error:", error)

    const assessmentLink = `https://v0-fork-of-recreate-ui-screenshot-five.vercel.app/vendor-assessment/${emailData.assessmentId}?token=abc123xyz`

    // Always return success for assessment creation, even if email fails
    return {
      success: true,
      message: `Assessment invitation created successfully!

⚠️ Email service temporarily unavailable: ${error instanceof Error ? error.message : "Unknown error"}

🔗 Please share this assessment link manually:
${assessmentLink}

The assessment is ready to be completed by the vendor.`,
      messageId: `error_fallback_${Date.now()}`,
      assessmentLink: assessmentLink,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Email template for vendor assessment invitation (kept for compatibility)
export const generateAssessmentEmail = (data: {
  vendorName: string
  vendorEmail: string
  contactPerson: string
  assessmentType: string
  dueDate: string
  customMessage: string
  assessmentId: string
  companyName: string
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const isAiPowered = data.assessmentType.includes("(AI-Powered)")
  const assessmentLink = `${baseUrl}/vendor-assessment/${data.assessmentId}?token=abc123xyz${isAiPowered ? "&ai=true" : ""}`

  return {
    to: data.vendorEmail,
    subject: `${isAiPowered ? "AI-Powered " : ""}Vendor Risk Assessment Required - ${data.assessmentType}`,
    html: "HTML content generated inline",
    text: "Text content generated inline",
    assessmentLink: assessmentLink,
  }
}
