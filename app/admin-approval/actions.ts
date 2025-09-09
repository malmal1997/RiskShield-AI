"use server";

import { supabaseAdmin } from "@/src/integrations/supabase/admin";
import type { PendingRegistration } from "@/lib/auth-service";

// Function to approve a pending registration (Admin action)
export async function approveRegistration(registrationId: string, adminUserId: string | null): Promise<{ success: boolean, error: any | null }> {
  try {
    // 1. Fetch the pending registration details using the admin client
    const { data: pendingReg, error: fetchError } = await supabaseAdmin
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

    let organizationIdForProfileAndRole: string;

    // 2. Check if a user profile already exists for this user_id
    const { data: existingProfile, error: checkProfileError } = await supabaseAdmin
      .from("user_profiles")
      .select("organization_id") // Only need organization_id if it exists
      .eq("user_id", pendingReg.id)
      .maybeSingle();

    if (checkProfileError) {
      throw new Error(`Error checking for existing user profile: ${checkProfileError.message}`);
    }

    if (existingProfile) {
      console.log(`User profile for user_id ${pendingReg.id} already exists. Reusing existing organization_id.`);
      organizationIdForProfileAndRole = existingProfile.organization_id;
      // We assume if the profile exists, the organization it points to also exists.
      // We skip creating a new organization and user profile.
    } else {
      // If no existing profile, then create the organization and user profile
      // Create the organization with a guaranteed unique slug
      let baseSlug = pendingReg.institution_name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      if (!baseSlug) {
        baseSlug = "organization";
      }

      let orgSlug = baseSlug;
      let counter = 0;
      let isSlugUnique = false;

      while (!isSlugUnique) {
        const { data: existingOrg, error: checkSlugError } = await supabaseAdmin
          .from('organizations')
          .select('id')
          .eq('slug', orgSlug)
          .maybeSingle();

        if (checkSlugError) {
          throw new Error(checkSlugError.message);
        }

        if (!existingOrg) {
          isSlugUnique = true;
        } else {
          counter++;
          orgSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}-${counter}`;
        }
      }

      const { data: newOrganization, error: orgError } = await supabaseAdmin
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
        throw new Error(`Error creating organization: ${orgError.message}`);
      }
      organizationIdForProfileAndRole = newOrganization.id;

      // Create the user profile
      const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
        user_id: pendingReg.id, // The ID in pending_registrations is the user_id from auth.users
        organization_id: organizationIdForProfileAndRole,
        first_name: pendingReg.contact_name.split(' ')[0],
        last_name: pendingReg.contact_name.split(' ').slice(1).join(' '),
        email: pendingReg.email,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: "en",
      });

      if (profileError) {
        throw new Error(`Error creating user profile: ${profileError.message}`);
      }
    }

    // 3. Create the admin role for the user, using the determined organizationIdForProfileAndRole
    // Also check if role already exists to make this idempotent
    const { data: existingRole, error: checkRoleError } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", pendingReg.id)
      .eq("organization_id", organizationIdForProfileAndRole)
      .maybeSingle();

    if (checkRoleError) {
      throw new Error(`Error checking for existing user role: ${checkRoleError.message}`);
    }

    if (!existingRole) {
      const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
        organization_id: organizationIdForProfileAndRole,
        user_id: pendingReg.id,
        role: "admin",
        permissions: {
          all: true,
        },
      });

      if (roleError) {
        throw new Error(`Error creating user role: ${roleError.message}`);
      }
    } else {
      console.log(`User role for user_id ${pendingReg.id} and organization ${organizationIdForProfileAndRole} already exists. Skipping creation.`);
    }

    // 4. Update the pending registration status
    const { error: updateError } = await supabaseAdmin
      .from('pending_registrations')
      .update({
        status: 'approved',
        approved_by: adminUserId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', registrationId);

    if (updateError) {
      throw new Error(`Error updating pending registration status: ${updateError.message}`);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error approving registration:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}