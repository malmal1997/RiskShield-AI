"use server";

import { supabaseAdmin } from "@/src/integrations/supabase/admin";
import { getCurrentUserWithProfile, OrganizationMember, UserProfile, UserRole, logAuditEvent, DefaultRolePermissions } from "@/lib/auth-service"; // Import DefaultRolePermissions
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function inviteUserToOrganization(email: string, firstName: string, lastName: string, role: UserRole['role']): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user: currentUser, organization, role: currentUserRole } = await getCurrentUserWithProfile();

    if (!currentUser || !organization || !currentUserRole || currentUserRole.role !== 'admin') {
      return { success: false, error: "Unauthorized: Only organization administrators can invite users." };
    }

    // 1. Invite user to Supabase Auth
    const { data: invitedUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        first_name: firstName,
        last_name: lastName,
        organization_id: organization.id, // Store organization_id in user metadata
      },
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?invited=true`, // Redirect to login after email confirmation
    });

    if (inviteError) {
      console.error("inviteUserToOrganization: Supabase invite error:", inviteError);
      return { success: false, error: inviteError.message };
    }

    if (!invitedUser?.user) {
      return { success: false, error: "Failed to invite user: No user data returned." };
    }

    // 2. Create user profile
    const { error: profileError } = await supabaseAdmin.from('user_profiles').insert({
      user_id: invitedUser.user.id,
      organization_id: organization.id,
      email: invitedUser.user.email!,
      first_name: firstName,
      last_name: lastName,
      status: 'active', // New invited users are active by default
      timezone: 'UTC', // Default timezone
      language: 'en', // Default language
    });

    if (profileError) {
      console.error("inviteUserToOrganization: Profile creation error:", profileError);
      // Attempt to delete the invited user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(invitedUser.user.id);
      return { success: false, error: `Failed to create user profile: ${profileError.message}` };
    }

    // 3. Assign role with default permissions
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
      user_id: invitedUser.user.id,
      organization_id: organization.id,
      role: role,
      permissions: DefaultRolePermissions[role], // Assign default permissions based on the role
    });

    if (roleError) {
      console.error("inviteUserToOrganization: Role assignment error:", roleError);
      // Attempt to delete the invited user and profile if role assignment fails
      await supabaseAdmin.from('user_profiles').delete().eq('user_id', invitedUser.user.id);
      await supabaseAdmin.auth.admin.deleteUser(invitedUser.user.id);
      return { success: false, error: `Failed to assign user role: ${roleError.message}` };
    }

    // Log audit event
    await logAuditEvent({
      action: 'user_invited',
      entity_type: 'user',
      entity_id: invitedUser.user.id,
      new_values: { email, firstName, lastName, role, organization_id: organization.id },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("inviteUserToOrganization: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteUserFromOrganization(memberUserId: string): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user: currentUser, organization, role: currentUserRole } = await getCurrentUserWithProfile();

    if (!currentUser || !organization || !currentUserRole || currentUserRole.role !== 'admin') {
      return { success: false, error: "Unauthorized: Only organization administrators can delete users." };
    }

    // Prevent admin from deleting their own account
    if (memberUserId === currentUser.id) {
      return { success: false, error: "Administrators cannot delete their own account." };
    }

    // Fetch old values for audit log
    const { data: oldProfile } = await supabaseAdmin.from('user_profiles').select('*').eq('user_id', memberUserId).single();
    const { data: oldRole } = await supabaseAdmin.from('user_roles').select('*').eq('user_id', memberUserId).single();

    // 1. Delete user's role
    const { error: roleError } = await supabaseAdmin.from('user_roles')
      .delete()
      .eq('user_id', memberUserId)
      .eq('organization_id', organization.id);

    if (roleError) {
      console.error("deleteUserFromOrganization: Role deletion error:", roleError);
      return { success: false, error: `Failed to delete user role: ${roleError.message}` };
    }

    // 2. Delete user's profile
    const { error: profileError } = await supabaseAdmin.from('user_profiles')
      .delete()
      .eq('user_id', memberUserId)
      .eq('organization_id', organization.id);

    if (profileError) {
      console.error("deleteUserFromOrganization: Profile deletion error:", profileError);
      return { success: false, error: `Failed to delete user profile: ${profileError.message}` };
    }

    // 3. Delete user from Supabase Auth (this is a hard delete)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(memberUserId);

    if (authError) {
      console.error("deleteUserFromOrganization: Supabase Auth user deletion error:", authError);
      return { success: false, error: `Failed to delete user from authentication: ${authError.message}` };
    }

    // Log audit event
    await logAuditEvent({
      action: 'user_deleted',
      entity_type: 'user',
      entity_id: memberUserId,
      old_values: oldProfile,
      new_values: undefined,
    });

    console.log(`User ${memberUserId} deleted from organization ${organization.name}.`);
    return { success: true, error: null };
  } catch (error) {
    console.error("deleteUserFromOrganization: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}