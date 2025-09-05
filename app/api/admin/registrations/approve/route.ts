import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json()

    if (!registrationId) {
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

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: registration.email,
      password: "TempPassword123!", // User will need to reset
      email_confirm: true,
    })

    if (authError) {
      console.error("[v0] API: Error creating auth user:", authError)
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
    }

    // Create user profile
    const { error: profileError } = await adminClient.from("user_profiles").insert({
      user_id: authUser.user.id,
      email: registration.email,
      first_name: registration.contact_name.split(" ")[0] || registration.contact_name,
      last_name: registration.contact_name.split(" ").slice(1).join(" ") || "",
    })

    if (profileError) {
      console.error("[v0] API: Error creating user profile:", profileError)
    }

    // Create user role
    const { error: roleError } = await adminClient.from("user_roles").insert({
      user_id: authUser.user.id,
      role: "user",
      permissions: ["view_assessments", "create_assessments"],
    })

    if (roleError) {
      console.error("[v0] API: Error creating user role:", roleError)
    }

    // Update registration status
    const { error: updateError } = await adminClient
      .from("pending_registrations")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: "admin", // In a real app, this would be the current admin user ID
      })
      .eq("id", registrationId)

    if (updateError) {
      console.error("[v0] API: Error updating registration status:", updateError)
      return NextResponse.json({ error: "Failed to update registration status" }, { status: 500 })
    }

    console.log("[v0] API: Registration approved successfully")
    return NextResponse.json({ success: true, userId: authUser.user.id })
  } catch (error) {
    console.error("[v0] API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
