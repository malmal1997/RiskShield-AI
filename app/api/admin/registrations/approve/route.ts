import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Approval request started")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[v0] API: Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    console.log("[v0] API: Environment check passed")

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    let requestBody
    try {
      requestBody = await request.json()
    } catch (parseError) {
      console.error("[v0] API: Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { registrationId } = requestBody

    if (!registrationId) {
      console.log("[v0] API: Missing registration ID")
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 })
    }

    console.log("[v0] API: Approving registration:", registrationId)

    // Get the registration details
    const { data: registration, error: fetchError } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("id", registrationId)
      .single()

    if (fetchError || !registration) {
      console.error("[v0] API: Error fetching registration:", fetchError)
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    console.log("[v0] API: Found registration for:", registration.email)

    // This allows us to test the approval workflow without complex auth operations
    console.log("[v0] API: Updating registration status to approved...")
    const { error: updateError } = await supabase
      .from("pending_registrations")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: "admin",
      })
      .eq("id", registrationId)

    if (updateError) {
      console.error("[v0] API: Update error:", updateError)
      return NextResponse.json(
        {
          error: "Failed to update registration status",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] API: Registration approved successfully")
    return NextResponse.json({
      success: true,
      message: "Registration approved. User will be notified to complete account setup.",
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
