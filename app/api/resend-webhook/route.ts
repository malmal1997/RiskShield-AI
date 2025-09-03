import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    console.log("📧 Resend webhook received:", payload)

    // Handle different email events
    switch (payload.type) {
      case "email.sent":
        console.log(`✅ Email sent: ${payload.data.email_id}`)
        break

      case "email.delivered":
        console.log(`📬 Email delivered: ${payload.data.email_id}`)
        break

      case "email.opened":
        console.log(`👀 Email opened: ${payload.data.email_id}`)
        // You could update assessment status here
        break

      case "email.clicked":
        console.log(`🖱️ Email link clicked: ${payload.data.email_id}`)
        // You could track vendor engagement here
        break

      case "email.bounced":
        console.log(`❌ Email bounced: ${payload.data.email_id}`)
        // You could mark assessment as failed delivery
        break

      default:
        console.log(`📧 Unknown email event: ${payload.type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
