import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Rejection request started")

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

    console.log("[v0] API: Rejecting registration:", registrationId)

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

    // Update registration status to rejected
    console.log("[v0] API: Updating registration status to rejected...")
    const { error: updateError } = await supabase
      .from("pending_registrations")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        rejected_by: "admin",
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

    console.log("[v0] API: Registration rejected successfully")
    return NextResponse.json({
      success: true,
      message: "Registration rejected successfully.",
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
