import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createClientAdminUser() {
  try {
    console.log("[v0] Creating client admin user K@gmail.com...")

    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "K@gmail.com",
      password: "password123",
      email_confirm: true,
    })

    if (authError) {
      console.error("[v0] Auth user creation error:", authError)
      return
    }

    console.log("[v0] Auth user created:", authData.user.id)

    // Create user profile
    const { error: profileError } = await supabase.from("user_profiles").upsert({
      user_id: authData.user.id,
      email: "K@gmail.com",
      first_name: "Client",
      last_name: "Admin",
      timezone: "UTC",
      language: "en",
    })

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      return
    }

    console.log("[v0] User profile created")

    // Create user role as client admin
    const { error: roleError } = await supabase.from("user_roles").upsert({
      user_id: authData.user.id,
      role: "client_admin",
      permissions: ["manage_assessments", "view_analytics", "manage_users"],
    })

    if (roleError) {
      console.error("[v0] Role creation error:", roleError)
      return
    }

    console.log("[v0] User role created as client_admin")
    console.log("[v0] Client admin user K@gmail.com created successfully!")
    console.log("[v0] Login credentials: K@gmail.com / password123")
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
  }
}

createClientAdminUser()
