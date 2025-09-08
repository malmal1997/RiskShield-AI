import { supabaseClient } from "./supabase-client"
import type { User } from "@supabase/supabase-js"
import type { Organization, UserProfile, UserRole } from "./supabase" // Import types from supabase.ts

// Get current user with profile and organization
export async function getCurrentUserWithProfile(): Promise<{
  user: User | null
  profile: UserProfile | null
  organization: Organization | null
  role: UserRole | null
}> {
  try {
    console.log("AuthService: Attempting to fetch current user with profile...");

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError) {
      console.error("AuthService: Supabase getUser error:", userError.message);
      return { user: null, profile: null, organization: null, role: null };
    }

    if (!user) {
      console.log("AuthService: No authenticated user found.");
      return { user: null, profile: null, organization: null, role: null };
    }

    console.log("AuthService: User found:", user.email, "ID:", user.id);

    // Get user profile
    console.log("AuthService: Fetching user profile for user ID:", user.id);
    const { data: profile, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      console.error("AuthService: Supabase profile error:", profileError.message);
      return { user, profile: null, organization: null, role: null };
    }

    if (!profile) {
      console.log("AuthService: No user profile found for user ID:", user.id);
      return { user, profile: null, organization: null, role: null };
    }

    console.log("AuthService: User profile found:", profile);

    // Get organization
    console.log("AuthService: Fetching organization for ID:", profile.organization_id);
    const { data: organization, error: orgError } = await supabaseClient
      .from("organizations")
      .select("*")
      .eq("id", profile.organization_id)
      .single()

    if (orgError) {
      console.error("AuthService: Supabase organization error:", orgError.message);
      return { user, profile, organization: null, role: null };
    }

    if (!organization) {
      console.log("AuthService: No organization found for ID:", profile.organization_id);
      return { user, profile, organization: null, role: null };
    }

    console.log("AuthService: Organization found:", organization.name);

    // Get user role
    console.log("AuthService: Fetching user role for user ID:", user.id, "and organization ID:", profile.organization_id);
    const { data: role, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("*")
      .eq("user_id", user.id)
      .eq("organization_id", profile.organization_id)
      .single()

    if (roleError) {
      console.error("AuthService: Supabase role error:", roleError.message);
      return { user, profile, organization, role: null };
    }

    if (!role) {
      console.log("AuthService: No user role found for user ID:", user.id);
      return { user, profile, organization, role: null };
    }

    console.log("AuthService: User role found:", role.role);

    return {
      user,
      profile,
      organization,
      role,
    };
  } catch (error) {
    console.error("AuthService: General error in getCurrentUserWithProfile:", error);
    return { user: null, profile: null, organization: null, role: null };
  }
}

// Create organization and user profile
export async function createOrganization(data: {
  organizationName: string
  userFirstName: string
  userLastName: string
  userEmail: string
  userPassword: string
}) {
  try {
    // Sign up user
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email: data.userEmail,
      password: data.userPassword,
    })

    if (authError || !authData.user) {
      throw new Error(authError?.message || "Failed to create user")
    }

    // Create organization
    const orgSlug = data.organizationName.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const { data: organization, error: orgError } = await supabaseClient
      .from("organizations")
      .insert({
        name: data.organizationName,
        slug: orgSlug,
        subscription_plan: "trial",
        trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })
      .select()
      .single()

    if (orgError) {
      throw new Error(orgError.message)
    }

    // Create user profile
    const { error: profileError } = await supabaseClient.from("user_profiles").insert({
      user_id: authData.user.id,
      organization_id: organization.id,
      first_name: data.userFirstName,
      last_name: data.userLastName,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: "en",
    })

    if (profileError) {
      throw new Error(profileError.message)
    }

    // Create admin role
    const { error: roleError } = await supabaseClient.from("user_roles").insert({
      organization_id: organization.id,
      user_id: authData.user.id,
      role: "admin",
      permissions: {
        all: true,
      },
    })

    if (roleError) {
      throw new Error(roleError.message)
    }

    return { organization, user: authData.user }
  } catch (error) {
    console.error("Error creating organization:", error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(updates: Partial<UserProfile>) {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { error } = await supabaseClient
      .from("user_profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    if (error) throw error
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Check user permissions
export function hasPermission(role: UserRole | null, permission: string): boolean {
  if (!role) return false

  // Admin has all permissions
  if (role.role === "admin") return true

  // Check specific permissions
  return role.permissions[permission] === true
}

// Audit logging
export async function logAuditEvent(data: {
  action: string
  entity_type?: string
  entity_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
}) {
  try {
    const { user, profile } = await getCurrentUserWithProfile()
    if (!user || !profile) return

    await supabaseClient.from("audit_logs").insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      ...data,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error logging audit event:", error)
  }
}