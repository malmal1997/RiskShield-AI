import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// API route to create admin users
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation for admin
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: "admin",
      },
    })

    if (authError) {
      return NextResponse.json({ error: `Failed to create auth user: ${authError.message}` }, { status: 400 })
    }

    // Step 2: Create organization for the admin
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: "RiskShield AI Admin",
        slug: "riskshield-admin",
        domain: "riskshield.ai",
        subscription_plan: "enterprise",
        subscription_status: "active",
      })
      .select()
      .single()

    if (orgError) {
      return NextResponse.json({ error: `Failed to create organization: ${orgError.message}` }, { status: 400 })
    }

    // Step 3: Create user profile
    const { error: profileError } = await supabase.from("user_profiles").insert({
      user_id: authData.user.id,
      organization_id: orgData.id,
      email,
      first_name: firstName,
      last_name: lastName,
    })

    if (profileError) {
      return NextResponse.json({ error: `Failed to create user profile: ${profileError.message}` }, { status: 400 })
    }

    // Step 4: Assign admin role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: authData.user.id,
      organization_id: orgData.id,
      role: "admin",
      permissions: {
        manage_users: true,
        manage_assessments: true,
        manage_organizations: true,
        view_analytics: true,
        approve_registrations: true,
      },
    })

    if (roleError) {
      return NextResponse.json({ error: `Failed to assign admin role: ${roleError.message}` }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: authData.user.id,
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
