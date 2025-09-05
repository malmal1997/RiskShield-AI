import { createClient } from "@supabase/supabase-js"

// Simple script to create your first admin account
async function createFirstAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const adminDetails = {
    email: "your-email@company.com", // Replace with your email
    password: "your-secure-password", // Replace with your password
    firstName: "Your", // Replace with your first name
    lastName: "Name", // Replace with your last name
  }

  try {
    console.log("Creating admin user...")

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminDetails.email,
      password: adminDetails.password,
      email_confirm: true,
      user_metadata: {
        first_name: adminDetails.firstName,
        last_name: adminDetails.lastName,
        role: "admin",
      },
    })

    if (authError) throw authError

    // Create organization
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

    if (orgError) throw orgError

    // Create user profile
    const { error: profileError } = await supabase.from("user_profiles").insert({
      user_id: authData.user.id,
      organization_id: orgData.id,
      email: adminDetails.email,
      first_name: adminDetails.firstName,
      last_name: adminDetails.lastName,
    })

    if (profileError) throw profileError

    // Assign admin role
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

    if (roleError) throw roleError

    console.log("✅ Admin user created successfully!")
    console.log(`Email: ${adminDetails.email}`)
    console.log(`Password: ${adminDetails.password}`)
    console.log("You can now log in at /auth/login")
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
  }
}

createFirstAdmin()
