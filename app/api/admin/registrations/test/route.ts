import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Test registration creation started")

    // Runtime environment validation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] API: Missing environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Create a test registration
    const testRegistration = {
      institution_name: "Test Institution",
      institution_type: "bank",
      contact_name: "Test User",
      email: `test-${Date.now()}@example.com`,
      phone: "555-0123",
      password_hash: "hashed_password_placeholder",
      status: "pending",
    }

    console.log("[v0] API: Creating test registration:", testRegistration.email)

    const { data, error } = await adminClient.from("pending_registrations").insert(testRegistration).select().single()

    if (error) {
      console.error("[v0] API: Error creating test registration:", error)
      return NextResponse.json(
        {
          error: "Failed to create test registration",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] API: Test registration created successfully:", data.id)
    return NextResponse.json({ success: true, registration: data })
  } catch (error) {
    console.error("[v0] API: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
