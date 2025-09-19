import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugAdminUser() {
  console.log("🔍 Debugging admin user K@gmail.com...")

  try {
    // Check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error("❌ Error fetching auth users:", authError)
      return
    }

    const adminUser = authUsers.users.find((user) => user.email === "K@gmail.com")

    if (!adminUser) {
      console.log("❌ Admin user K@gmail.com not found in auth.users")
      console.log("📋 Available users:")
      authUsers.users.forEach((user) => {
        console.log(`  - ${user.email} (${user.id})`)
      })
      return
    }

    console.log("✅ Admin user found in auth.users:")
    console.log(`  - ID: ${adminUser.id}`)
    console.log(`  - Email: ${adminUser.email}`)
    console.log(`  - Email confirmed: ${adminUser.email_confirmed_at ? "Yes" : "No"}`)
    console.log(`  - Created: ${adminUser.created_at}`)

    // Check user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", adminUser.id)
      .single()

    if (profileError) {
      console.log("❌ No profile found for admin user:", profileError.message)
    } else {
      console.log("✅ User profile found:")
      console.log(`  - Name: ${profile.first_name} ${profile.last_name}`)
      console.log(`  - Organization ID: ${profile.organization_id}`)
      console.log(`  - Status: ${profile.status}`)
    }

    // Check user role
    const { data: role, error: roleError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", adminUser.id)
      .single()

    if (roleError) {
      console.log("❌ No role found for admin user:", roleError.message)

      // Create admin role if missing
      console.log("🔧 Creating admin role...")
      const { data: newRole, error: createRoleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: adminUser.id,
          role: "admin",
          permissions: ["manage_users", "manage_assessments", "manage_organizations", "view_analytics"],
        })
        .select()
        .single()

      if (createRoleError) {
        console.error("❌ Error creating admin role:", createRoleError)
      } else {
        console.log("✅ Admin role created successfully")
      }
    } else {
      console.log("✅ User role found:")
      console.log(`  - Role: ${role.role}`)
      console.log(`  - Permissions: ${JSON.stringify(role.permissions)}`)
    }

    // Check organization if profile has one
    if (profile?.organization_id) {
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", profile.organization_id)
        .single()

      if (orgError) {
        console.log("❌ Organization not found:", orgError.message)
      } else {
        console.log("✅ Organization found:")
        console.log(`  - Name: ${org.name}`)
        console.log(`  - Plan: ${org.subscription_plan}`)
      }
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error)
  }
}

debugAdminUser()
