import { supabaseClient } from "./supabase-client"
import type { User } from "@supabase/supabase-js"

export interface Organization {
  id: string
  name: string
  slug: string
  domain?: string
  logo_url?: string
  settings: Record<string, any>
  subscription_plan: string
  subscription_status: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  organization_id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  phone?: string
  timezone: string
  language: string
  preferences: Record<string, any>
  last_active_at?: string
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  organization_id: string
  user_id: string
  role: "admin" | "manager" | "analyst" | "viewer"
  permissions: Record<string, any>
  created_at: string
}

export interface PendingRegistration {
  id: string;
  institution_name: string;
  institution_type: string;
  contact_name: string;
  email: string;
  phone?: string;
  password_hash: string; // Note: This will be a placeholder as raw passwords are not accessible
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  rejected_at?: string;
  created_at: string;
  updated_at: string;
}

// Get current user with profile and organization
export async function getCurrentUserWithProfile(): Promise<{
  user: User | null
  profile: UserProfile | null
  organization: Organization | null
  role: UserRole | null
}> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return { user: null, profile: null, organization: null, role: null }
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile) {
      return { user, profile: null, organization: null, role: null }
    }

    // Get organization
    const { data: organization, error: orgError } = await supabaseClient
      .from("organizations")
      .select("*")
      .eq("id", profile.organization_id)
      .single()

    // Get user role
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("*")
      .eq("user_id", user.id)
      .eq("organization_id", profile.organization_id)
      .single()

    return {
      user,
      profile,
      organization: orgError ? null : organization,
      role: roleError ? null : roleData,
    }
  } catch (error) {
    console.error("Error getting user with profile:", error)
    return { user: null, profile: null, organization: null, role: null }
  }
}

// Register a new user and create a pending registration entry
export async function registerNewInstitution(data: {
  institutionName: string
  institutionType: string
  contactFirstName: string
  contactLastName: string
  email: string
  phone: string
  password: string
}): Promise<{ data: { user: User } | null, error: any | null }> {
  try {
    // First, sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.contactFirstName,
          last_name: data.contactLastName,
          organization_name: data.institutionName,
          institution_type: data.institutionType,
          phone: data.phone,
        },
      },
    });

    if (authError || !authData.user) {
      return { data: null, error: authError || new Error("Failed to create user") };
    }

    // The handle_new_user trigger will automatically create a pending_registration entry.
    // We don't create profile/organization/role here directly.
    // The user will be in auth.users but won't have a profile/role until approved.

    return { data: { user: authData.user }, error: null };
  } catch (error) {
    console.error("Error registering new institution:", error);
    return { data: null, error: error };
  }
}

// Function to approve a pending registration (Admin action)
export async function approveRegistration(registrationId: string, adminUserId: string): Promise<{ success: boolean, error: any | null }> {
  try {
    // 1. Fetch the pending registration details
    const { data: pendingReg, error: fetchError } = await supabaseClient
      .from('pending_registrations')
      .select('*')
      .eq('id', registrationId)
      .single();

    if (fetchError || !pendingReg) {
      throw new Error(fetchError?.message || 'Pending registration not found.');
    }

    if (pendingReg.status === 'approved') {
      return { success: true, error: null }; // Already approved
    }

    // 2. Create the organization
    const orgSlug = pendingReg.institution_name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const { data: organization, error: orgError } = await supabaseClient
      .from("organizations")
      .insert({
        name: pendingReg.institution_name,
        slug: orgSlug,
        subscription_plan: "trial",
        trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })
      .select()
      .single();

    if (orgError) {
      throw new Error(orgError.message);
    }

    // 3. Create the user profile
    const { error: profileError } = await supabaseClient.from("user_profiles").insert({
      user_id: pendingReg.id, // The ID in pending_registrations is the user_id from auth.users
      organization_id: organization.id,
      first_name: pendingReg.contact_name.split(' ')[0],
      last_name: pendingReg.contact_name.split(' ').slice(1).join(' '),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: "en",
    });

    if (profileError) {
      throw new Error(profileError.message);
    }

    // 4. Create the admin role for the user
    const { error: roleError } = await supabaseClient.from("user_roles").insert({
      organization_id: organization.id,
      user_id: pendingReg.id,
      role: "admin",
      permissions: {
        all: true,
      },
    });

    if (roleError) {
      throw new Error(roleError.message);
    }

    // 5. Update the pending registration status
    const { error: updateError } = await supabaseClient
      .from('pending_registrations')
      .update({
        status: 'approved',
        approved_by: adminUserId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', registrationId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error approving registration:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
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