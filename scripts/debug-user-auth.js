import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugUserAuth() {
  try {
    console.log("🔍 Debugging user authentication for K@gmail.com...")

    // Check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error("❌ Error fetching auth users:", authError)
      return
    }

    const targetUser = authUsers.users.find((user) => user.email === "K@gmail.com")

    if (!targetUser) {
      console.log("❌ User K@gmail.com not found in auth.users")
      return
    }

    console.log("✅ User found in auth.users:", {
      id: targetUser.id,
      email: targetUser.email,
      created_at: targetUser.created_at,
      email_confirmed_at: targetUser.email_confirmed_at,
    })

    // Check user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", targetUser.id)
      .single()

    if (profileError) {
      console.log("❌ No profile found for user:", profileError.message)
    } else {
      console.log("✅ User profile found:", profile)
    }

    // Check user role
    const { data: role, error: roleError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", targetUser.id)
      .single()

    if (roleError) {
      console.log("❌ No role found for user:", roleError.message)
    } else {
      console.log("✅ User role found:", role)
    }

    // Check organization if profile has organization_id
    if (profile?.organization_id) {
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", profile.organization_id)
        .single()

      if (orgError) {
        console.log("❌ No organization found:", orgError.message)
      } else {
        console.log("✅ Organization found:", org)
      }
    }

    console.log("\n🔧 Recommendations:")
    if (!profile) {
      console.log("- Create user profile")
    }
    if (!role) {
      console.log("- Create user role (admin/user)")
    }
    if (profile && !profile.organization_id) {
      console.log("- Assign user to organization")
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error)
  }
}

debugUserAuth()
