import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET() {
  try {
    console.log("[v0] API: Fetching pending registrations with admin client")

    const { data: registrations, error } = await adminClient
      .from("pending_registrations")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] API: Error fetching registrations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] API: Found registrations:", registrations?.length || 0)
    return NextResponse.json({ registrations })
  } catch (error) {
    console.error("[v0] API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Registration action request started")

    let requestBody
    try {
      requestBody = await request.json()
    } catch (parseError) {
      console.error("[v0] API: Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { action, registrationId } = requestBody

    if (!action || !registrationId) {
      console.log("[v0] API: Missing action or registration ID")
      return NextResponse.json({ error: "Action and registration ID are required" }, { status: 400 })
    }

    if (!["approve", "reject"].includes(action)) {
      console.log("[v0] API: Invalid action:", action)
      return NextResponse.json({ error: "Action must be 'approve' or 'reject'" }, { status: 400 })
    }

    console.log(`[v0] API: ${action}ing registration:`, registrationId)

    // Get the registration details
    const { data: registration, error: fetchError } = await adminClient
      .from("pending_registrations")
      .select("*")
      .eq("id", registrationId)
      .single()

    if (fetchError || !registration) {
      console.error("[v0] API: Error fetching registration:", fetchError)
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    console.log("[v0] API: Found registration for:", registration.email)

    // Update registration status
    const updateData =
      action === "approve"
        ? {
            status: "approved",
            approved_at: new Date().toISOString(),
            approved_by: null, // Using null since we don't have a specific admin user UUID
          }
        : {
            status: "rejected",
            rejected_at: new Date().toISOString(),
            rejected_by: null, // Using null since we don't have a specific admin user UUID
          }

    console.log(`[v0] API: Updating registration status to ${action}ed...`)
    const { error: updateError } = await adminClient
      .from("pending_registrations")
      .update(updateData)
      .eq("id", registrationId)

    if (updateError) {
      console.error("[v0] API: Update error:", updateError)
      return NextResponse.json(
        {
          error: `Failed to ${action} registration`,
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    console.log(`[v0] API: Registration ${action}ed successfully`)
    return NextResponse.json({
      success: true,
      message: `Registration ${action}ed successfully.`,
      registrationId,
    })
  } catch (error) {
    console.error("[v0] API: Unexpected error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    })
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
