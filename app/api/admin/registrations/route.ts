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

    if (action === "approve") {
      console.log("[v0] API: Creating Supabase Auth user account...")

      let userPassword: string
      try {
        userPassword = atob(registration.password_hash) // Decode base64 to get original password
        console.log("[v0] API: Successfully decoded user password")
      } catch (decodeError) {
        console.error("[v0] API: Failed to decode password hash:", decodeError)
        return NextResponse.json(
          {
            error: "Failed to process user password",
            details: "Invalid password format in registration",
          },
          { status: 500 },
        )
      }

      const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
        email: registration.email,
        password: userPassword, // Use decoded original password instead of hash
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: registration.contact_name,
          institution_name: registration.institution_name,
          institution_type: registration.institution_type,
        },
      })

      if (authError) {
        console.error("[v0] API: Auth user creation error:", authError)
        return NextResponse.json(
          {
            error: "Failed to create user account",
            details: authError.message,
          },
          { status: 500 },
        )
      }

      console.log("[v0] API: Auth user created:", authUser.user?.id)

      console.log("[v0] API: User can now login with their original registration password")

      // Create user profile
      const { error: profileError } = await adminClient.from("user_profiles").insert({
        user_id: authUser.user!.id,
        email: registration.email,
        first_name: registration.contact_name.split(" ")[0] || registration.contact_name,
        last_name: registration.contact_name.split(" ").slice(1).join(" ") || "",
        organization_id: null, // Will be set up later
      })

      if (profileError) {
        console.error("[v0] API: Profile creation error:", profileError)
        // Continue with approval even if profile creation fails
      }

      // Create user role
      const { error: roleError } = await adminClient.from("user_roles").insert({
        user_id: authUser.user!.id,
        role: "user",
        permissions: ["view_assessments", "create_assessments"],
      })

      if (roleError) {
        console.error("[v0] API: Role creation error:", roleError)
        // Continue with approval even if role creation fails
      }

      console.log("[v0] API: User account setup completed")
    }

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
      message:
        action === "approve"
          ? `Registration approved and user account created successfully. You can now login with your email and password.` // Updated message to reflect immediate login capability
          : `Registration rejected successfully.`,
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
