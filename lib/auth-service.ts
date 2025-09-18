import { supabaseClient } from "./supabase-client"
import type { User } from "@supabase/supabase-js"
import type { Json } from "./supabase" // Added Json import

export interface UserPermissions {
  // General
  view_dashboard: boolean;
  view_analytics: boolean;
  view_reports: boolean;
  view_notifications: boolean;

  // Vendor Management
  view_vendors: boolean;
  manage_vendors: boolean; // Create, edit, delete vendors

  // Assessment Management
  create_assessments: boolean;
  view_assessments: boolean;
  manage_assessments: boolean; // Edit, delete assessments
  approve_assessments: boolean; // For admin approval flow
  manage_assessment_templates: boolean; // Create, edit, delete templates/questions

  // Policy Management
  create_policies: boolean;
  view_policies: boolean;
  manage_policies: boolean; // Edit, delete policies
  approve_policies: boolean; // For admin approval flow

  // Organization & User Management
  manage_organization_settings: boolean;
  manage_team_members: boolean; // Invite, change roles/status, delete users
  review_registrations: boolean; // For super admin to approve new orgs

  // Integrations
  manage_integrations: boolean;

  // Developer/System Access
  access_dev_dashboard: boolean;
}

export const DefaultRolePermissions: Record<UserRole['role'], UserPermissions> = {
  admin: {
    view_dashboard: true,
    view_analytics: true,
    view_reports: true,
    view_notifications: true,
    view_vendors: true,
    manage_vendors: true,
    create_assessments: true,
    view_assessments: true,
    manage_assessments: true,
    approve_assessments: true,
    manage_assessment_templates: true,
    create_policies: true,
    view_policies: true,
    manage_policies: true,
    approve_policies: true,
    manage_organization_settings: true,
    manage_team_members: true,
    review_registrations: true,
    manage_integrations: true,
    access_dev_dashboard: true,
  },
  manager: {
    view_dashboard: false, // Restricted to admin
    view_analytics: false, // Restricted to admin
    view_reports: true,
    view_notifications: true,
    view_vendors: true,
    manage_vendors: true,
    create_assessments: true,
    view_assessments: true,
    manage_assessments: true,
    approve_assessments: false, // Managers cannot approve final assessments
    manage_assessment_templates: true,
    create_policies: true,
    view_policies: true,
    manage_policies: true,
    approve_policies: false, // Managers cannot approve final policies
    manage_organization_settings: false,
    manage_team_members: false,
    review_registrations: false,
    manage_integrations: false,
    access_dev_dashboard: false,
  },
  analyst: {
    view_dashboard: false, // Restricted to admin
    view_analytics: false, // Restricted to admin
    view_reports: true,
    view_notifications: true,
    view_vendors: true,
    manage_vendors: false,
    create_assessments: true,
    view_assessments: true,
    manage_assessments: false,
    approve_assessments: false,
    manage_assessment_templates: false,
    create_policies: true,
    view_policies: true,
    manage_policies: false,
    approve_policies: false,
    manage_organization_settings: false,
    manage_team_members: false,
    review_registrations: false,
    manage_integrations: false,
    access_dev_dashboard: false,
  },
  viewer: {
    view_dashboard: false, // Restricted to admin
    view_analytics: false, // Restricted to admin
    view_reports: true,
    view_notifications: true,
    view_vendors: true,
    manage_vendors: false,
    create_assessments: false,
    view_assessments: true,
    manage_assessments: false,
    approve_assessments: false,
    manage_assessment_templates: false,
    create_policies: false,
    view_policies: true,
    manage_policies: false,
    approve_policies: false,
    manage_organization_settings: false,
    manage_team_members: false,
    review_registrations: false,
    manage_integrations: false,
    access_dev_dashboard: false,
  },
};

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
  require_admin_signature?: boolean; // Added new field
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
  status: string; 
}

export interface UserRole {
  id: string
  organization_id: string
  user_id: string
  role: "admin" | "manager" | "analyst" | "viewer"
  permissions: UserPermissions // Changed to use UserPermissions
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

// Combined type for organization members
export interface OrganizationMember {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  profile_status: string;
  role_id: string;
  role_name: UserRole['role'];
  role_permissions: Json | null;
  created_at: string;
}

// Get current user with profile and organization
export async function getCurrentUserWithProfile(): Promise<{
  user: User | null
  profile: UserProfile | null
  organization: Organization | null
  role: UserRole | null
}> {
  console.log("getCurrentUserWithProfile: Function started.");
  let user: User | null = null;
  let profile: UserProfile | null = null;
  let organization: Organization | null = null;
  let role: UserRole | null = null;

  try {
    console.log("getCurrentUserWithProfile: Attempting to fetch user from Supabase Auth (supabaseClient.auth.getUser()).");
    const {
      data: { user: fetchedUser },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error("getCurrentUserWithProfile: Supabase auth.getUser() error:", userError.message);
      return { user: null, profile: null, organization: null, role: null };
    }
    
    user = fetchedUser;
    if (!user) {
      console.log("getCurrentUserWithProfile: No Supabase user found after auth.getUser().");
      return { user: null, profile: null, organization: null, role: null };
    }
    console.log("getCurrentUserWithProfile: Supabase user found:", user.id, user.email);

    // Get user profile
    try {
      console.log("getCurrentUserWithProfile: Fetching user_profiles for user_id:", user.id);
      const { data: fetchedProfile, error: profileError } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error("getCurrentUserWithProfile: Profile fetch error:", profileError.message);
        // Do not throw, continue with null profile
      } else if (fetchedProfile) {
        profile = fetchedProfile;
        console.log("getCurrentUserWithProfile: Profile found:", profile!.id, "organization_id:", profile!.organization_id);
      } else {
        console.log("getCurrentUserWithProfile: No profile found for user_id:", user.id);
      }
    } catch (profileCatchError) {
      console.error("getCurrentUserWithProfile: Catch error during profile fetch:", profileCatchError);
    }

    // If no profile, we can't fetch organization or role, so return early
    if (!profile) {
      console.log("getCurrentUserWithProfile: No profile, returning early.");
      return { user, profile: null, organization: null, role: null };
    }

    // Get organization
    try {
      console.log("getCurrentUserWithProfile: Fetching organizations for id:", profile.organization_id);
      const { data: fetchedOrganization, error: orgError } = await supabaseClient
        .from("organizations")
        .select("*")
        .eq("id", profile.organization_id)
        .single();

      if (orgError) {
        console.error("getCurrentUserWithProfile: Organization fetch error:", orgError.message);
        // Do not throw, continue with null organization
      } else if (fetchedOrganization) {
        organization = fetchedOrganization;
        console.log("getCurrentUserWithProfile: Organization found:", organization!.id, organization!.name);
      } else {
        console.log("getCurrentUserWithProfile: No organization found for profile's organization_id:", profile.organization_id);
      }
    } catch (orgCatchError) {
      console.error("getCurrentUserWithProfile: Catch error during organization fetch:", orgCatchError);
    }

    // Get user role
    try {
      console.log("getCurrentUserWithProfile: Fetching user_roles for user_id:", user.id, "and organization_id:", profile.organization_id);
      const { data: fetchedRole, error: roleError } = await supabaseClient
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("organization_id", profile.organization_id)
        .single();

      if (roleError) {
        console.error("getCurrentUserWithProfile: Role fetch error:", roleError.message);
        // Do not throw, continue with null role
      } else if (fetchedRole) {
        role = fetchedRole;
        console.log("getCurrentUserWithProfile: Role found:", role!.role);
      } else {
        console.log("getCurrentUserWithProfile: No role found for user:", user.id, "in organization:", profile.organization_id);
      }
    } catch (roleCatchError) {
      console.error("getCurrentUserWithProfile: Catch error during role fetch:", roleCatchError);
    }

    console.log("getCurrentUserWithProfile: Function finished successfully.");
    return { user, profile, organization, role };

  } catch (mainCatchError) {
    console.error("getCurrentUserWithProfile: Unhandled main catch error:", mainCatchError);
    return { user: null, profile: null, organization: null, role: null };
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

// New function to update organization settings
export async function updateOrganizationSettings(updates: Partial<Organization>): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, organization, role } = await getCurrentUserWithProfile();
    if (!user || !organization || role?.role !== 'admin') {
      return { success: false, error: "Unauthorized: Only administrators can update organization settings." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('organizations').select('*').eq('id', organization.id).single();

    const { error } = await supabaseClient
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', organization.id);

    if (error) {
      console.error("updateOrganizationSettings: Supabase update error:", error);
      return { success: false, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'organization_settings_updated',
      entity_type: 'organization',
      entity_id: organization.id,
      old_values: oldData,
      new_values: updates,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("updateOrganizationSettings: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}


// Get all members for the current user's organization
export async function getOrganizationMembers(): Promise<{ data: OrganizationMember[] | null, error: string | null }> {
  try {
    const { user, profile, organization } = await getCurrentUserWithProfile();
    if (!user || !profile || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    // Fetch all user profiles and their associated roles for the current organization
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select(`
        user_id,
        email,
        first_name,
        last_name,
        avatar_url,
        status,
        created_at,
        user_roles (
          id,
          role,
          permissions
        )
      `)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("getOrganizationMembers: Supabase query error:", error);
      return { data: null, error: error.message };
    }

    const members: OrganizationMember[] = (data || []).map(item => ({
      user_id: item.user_id,
      email: item.email,
      first_name: item.first_name,
      last_name: item.last_name,
      avatar_url: item.avatar_url,
      profile_status: item.status,
      role_id: (item.user_roles as any)?.id || '',
      role_name: (item.user_roles as any)?.role || 'viewer',
      role_permissions: (item.user_roles as any)?.permissions || null,
      created_at: item.created_at, 
    }));

    return { data: members, error: null };
  } catch (error) {
    console.error("getOrganizationMembers: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Update a member's role within the organization
export async function updateMemberRole(memberUserId: string, newRole: UserRole['role']): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, profile, organization, role: currentUserRole } = await getCurrentUserWithProfile();
    if (!user || !profile || !organization || !currentUserRole) {
      return { success: false, error: "User not authenticated or organization not found." };
    }

    // Only admins can update roles
    if (currentUserRole.role !== 'admin') {
      return { success: false, error: "Only administrators can update user roles." };
    }

    // Prevent admin from changing their own role (or demoting themselves)
    if (memberUserId === user.id && newRole !== 'admin') {
      return { success: false, error: "Administrators cannot change their own role." };
    }

    const { error } = await supabaseClient
      .from('user_roles')
      .update({ role: newRole, permissions: DefaultRolePermissions[newRole], updated_at: new Date().toISOString() }) // Update permissions based on new role
      .eq('user_id', memberUserId)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("updateMemberRole: Supabase update error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("updateMemberRole: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Update a member's profile status within the organization
export async function updateMemberStatus(memberUserId: string, newStatus: UserProfile['status']): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, profile, organization, role: currentUserRole } = await getCurrentUserWithProfile();
    if (!user || !profile || !organization || !currentUserRole) {
      return { success: false, error: "User not authenticated or organization not found." };
    }

    // Only admins can update user statuses
    if (currentUserRole.role !== 'admin') {
      return { success: false, error: "Only administrators can update user statuses." };
    }

    // Prevent admin from deactivating their own account
    if (memberUserId === user.id && newStatus === 'inactive') {
      return { success: false, error: "Administrators cannot deactivate their own account." };
    }

    const { error } = await supabaseClient
      .from('user_profiles')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('user_id', memberUserId)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("updateMemberStatus: Supabase update error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("updateMemberStatus: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Check user permissions
export function hasPermission(role: UserRole | null, permission: keyof UserPermissions): boolean {
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