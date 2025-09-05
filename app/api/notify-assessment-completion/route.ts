import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { assessmentId, vendorName, vendorEmail, assessmentType, completedDate } = await request.json()

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("📧 Resend API key not configured for completion notifications")
      return NextResponse.json({
        success: true,
        message: "Notification would be sent (demo mode)",
      })
    }

    // Generate completion notification email
    const completionEmail = {
      from: "RiskShield AI <noreply@yourdomain.com>", // Replace with your verified domain
      to: ["admin@riskshield.ai"], // Replace with your admin email
      subject: `✅ Vendor Assessment Completed - ${vendorName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Assessment Completed</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .info-box { background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 20px 0; }
                .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Assessment Completed</h1>
                    <p>A vendor has completed their risk assessment</p>
                </div>
                
                <div class="content">
                    <h2>Assessment Details:</h2>
                    
                    <div class="info-box">
                        <ul>
                            <li><strong>Vendor:</strong> ${vendorName}</li>
                            <li><strong>Email:</strong> ${vendorEmail}</li>
                            <li><strong>Assessment Type:</strong> ${assessmentType}</li>
                            <li><strong>Completed:</strong> ${new Date(completedDate).toLocaleString()}</li>
                            <li><strong>Assessment ID:</strong> ${assessmentId}</li>
                        </ul>
                    </div>
                    
                    <p>The vendor assessment has been completed and is ready for your review.</p>
                    
                    <div style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/third-party-assessment" class="button">
                            View Assessment Results
                        </a>
                    </div>
                    
                    <h3>Next Steps:</h3>
                    <ul>
                        <li>Review the assessment responses in your dashboard</li>
                        <li>Analyze the calculated risk score</li>
                        <li>Generate compliance reports if needed</li>
                        <li>Follow up with the vendor if additional information is required</li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
Assessment Completed

A vendor has completed their risk assessment:

Vendor: ${vendorName}
Email: ${vendorEmail}
Assessment Type: ${assessmentType}
Completed: ${new Date(completedDate).toLocaleString()}
Assessment ID: ${assessmentId}

Please review the assessment results in your RiskShield AI dashboard.

View results: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/third-party-assessment
      `,
    }

    // Send notification email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completionEmail),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("Resend API error:", result)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send notification: ${result.message}`,
        },
        { status: 500 },
      )
    }

    console.log("✅ Assessment completion notification sent:", result)
    return NextResponse.json({
      success: true,
      message: "Completion notification sent successfully",
      messageId: result.id,
    })
  } catch (error) {
    console.error("Error sending completion notification:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send completion notification",
      },
      { status: 500 },
    )
  }
}
