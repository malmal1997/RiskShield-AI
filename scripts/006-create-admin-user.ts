import { createClient } from "@supabase/supabase-js"

// This script creates a real admin user account
// Run this script to create your first admin user

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  const adminEmail = "admin@riskshield.ai"
  const adminPassword = "AdminPassword123!" // Change this to a secure password

  console.log("Creating admin user account...")

  try {
    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Skip email confirmation for admin
      user_metadata: {
        first_name: "Admin",
        last_name: "User",
        role: "admin",
      },
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return
    }

    console.log("✅ Auth user created:", authData.user.id)

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
      console.error("Error creating organization:", orgError)
      return
    }

    console.log("✅ Organization created:", orgData.id)

    // Step 3: Create user profile
    const { error: profileError } = await supabase.from("user_profiles").insert({
      user_id: authData.user.id,
      organization_id: orgData.id,
      email: adminEmail,
      first_name: "Admin",
      last_name: "User",
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      return
    }

    console.log("✅ User profile created")

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
      console.error("Error assigning admin role:", roleError)
      return
    }

    console.log("✅ Admin role assigned")
    console.log("\n🎉 Admin user created successfully!")
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log("\n⚠️  IMPORTANT: Change the password after first login!")
    console.log("You can now log in at /auth/login with these credentials.")
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

// Run the script
createAdminUser()
