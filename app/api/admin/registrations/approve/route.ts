import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[v0] API: Missing environment variables", {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
  })
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Approval request started")

    const { registrationId } = await request.json()

    if (!registrationId) {
      console.log("[v0] API: Missing registration ID")
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 })
    }

    console.log("[v0] API: Approving registration:", registrationId)

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

    // Create user in Supabase Auth
    console.log("[v0] API: Creating auth user...")
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: registration.email,
      password: "TempPassword123!", // User will need to reset
      email_confirm: true,
    })

    if (authError) {
      console.error("[v0] API: Auth error details:", {
        message: authError.message,
        status: authError.status,
        code: authError.code || "unknown",
      })

      if (authError.message?.includes("already registered")) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
      }

      return NextResponse.json(
        {
          error: "Failed to create user account",
          details: authError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] API: Auth user created:", authUser.user.id)

    // Create user profile
    console.log("[v0] API: Creating user profile...")
    const { error: profileError } = await adminClient.from("user_profiles").insert({
      user_id: authUser.user.id,
      email: registration.email,
      first_name: registration.contact_name.split(" ")[0] || registration.contact_name,
      last_name: registration.contact_name.split(" ").slice(1).join(" ") || "",
    })

    if (profileError) {
      console.error("[v0] API: Profile error:", profileError)
    }

    // Create user role
    console.log("[v0] API: Creating user role...")
    const { error: roleError } = await adminClient.from("user_roles").insert({
      user_id: authUser.user.id,
      role: "user",
      permissions: ["view_assessments", "create_assessments"],
    })

    if (roleError) {
      console.error("[v0] API: Role error:", roleError)
    }

    // Update registration status
    console.log("[v0] API: Updating registration status...")
    const { error: updateError } = await adminClient
      .from("pending_registrations")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: "admin", // In a real app, this would be the current admin user ID
      })
      .eq("id", registrationId)

    if (updateError) {
      console.error("[v0] API: Update error:", updateError)
      return NextResponse.json({ error: "Failed to update registration status" }, { status: 500 })
    }

    console.log("[v0] API: Registration approved successfully")
    return NextResponse.json({ success: true, userId: authUser.user.id })
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
