"use server";

import { supabaseAdmin } from "@/src/integrations/supabase/admin";
import { getCurrentUserWithProfile, OrganizationMember, UserProfile, UserRole } from "@/lib/auth-service";
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

    // 3. Assign role
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
      user_id: invitedUser.user.id,
      organization_id: organization.id,
      role: role,
      permissions: {}, // Default empty permissions, can be expanded
    });

    if (roleError) {
      console.error("inviteUserToOrganization: Role assignment error:", roleError);
      // Attempt to delete the invited user and profile if role assignment fails
      await supabaseAdmin.from('user_profiles').delete().eq('user_id', invitedUser.user.id);
      await supabaseAdmin.auth.admin.deleteUser(invitedUser.user.id);
      return { success: false, error: `Failed to assign user role: ${roleError.message}` };
    }

    // 4. Send invitation email via Resend (Supabase inviteUserByEmail already sends an email, this is for custom content)
    // This part is optional if Supabase's default email is sufficient.
    // If you want a custom email, you'd need to disable Supabase's default email for invites
    // and send your own here. For now, we'll assume Supabase handles the initial invite email.
    // If you want to send a *separate* notification, you can do so here.
    console.log(`User ${email} invited to organization ${organization.name} with role ${role}. Supabase will send the confirmation email.`);

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

    console.log(`User ${memberUserId} deleted from organization ${organization.name}.`);
    return { success: true, error: null };
  } catch (error) {
    console.error("deleteUserFromOrganization: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}