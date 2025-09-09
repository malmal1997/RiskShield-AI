"use server";

import { supabaseAdmin } from "@/src/integrations/supabase/admin";
import type { PendingRegistration } from "@/lib/auth-service";

// Function to approve a pending registration (Admin action)
export async function approveRegistration(registrationId: string, adminUserId: string | null): Promise<{ success: boolean, error: any | null }> {
  try {
    console.log(`[approveRegistration] Starting approval for registration ID: ${registrationId}`);
    console.log(`[approveRegistration] Admin User ID: ${adminUserId}`);

    // 1. Fetch the pending registration details using the admin client
    const { data: pendingReg, error: fetchError } = await supabaseAdmin
      .from('pending_registrations')
      .select('*')
      .eq('id', registrationId)
      .single();

    if (fetchError || !pendingReg) {
      console.error(`[approveRegistration] Error fetching pending registration: ${fetchError?.message || 'Not found'}`);
      throw new Error(fetchError?.message || 'Pending registration not found.');
    }

    if (pendingReg.status === 'approved') {
      console.log(`[approveRegistration] Registration ${registrationId} is already approved. Skipping.`);
      return { success: true, error: null }; // Already approved
    }

    console.log(`[approveRegistration] Pending registration details: User ID=${pendingReg.id}, Email=${pendingReg.email}, Institution=${pendingReg.institution_name}`);

    let organizationIdForProfileAndRole: string;

    // 2. Check if a user profile already exists for this user_id
    const { data: existingProfile, error: checkProfileError } = await supabaseAdmin
      .from("user_profiles")
      .select("organization_id") // Only need organization_id if it exists
      .eq("user_id", pendingReg.id)
      .maybeSingle();

    if (checkProfileError) {
      console.error(`[approveRegistration] Error checking for existing user profile for user_id ${pendingReg.id}: ${checkProfileError.message}`);
      throw new Error(`Error checking for existing user profile: ${checkProfileError.message}`);
    }

    if (existingProfile) {
      console.log(`[approveRegistration] User profile for user_id ${pendingReg.id} already exists. Reusing existing organization_id: ${existingProfile.organization_id}`);
      organizationIdForProfileAndRole = existingProfile.organization_id;
      // We assume if the profile exists, the organization it points to also exists.
      // We skip creating a new organization and user profile.
    } else {
      console.log(`[approveRegistration] No existing user profile for user_id ${pendingReg.id}. Creating new organization and profile.`);
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
          console.error(`[approveRegistration] Error checking for unique slug ${orgSlug}: ${checkSlugError.message}`);
          throw new Error(checkSlugError.message);
        }

        if (!existingOrg) {
          isSlugUnique = true;
        } else {
          // If slug exists, append a random string to ensure uniqueness
          counter++;
          orgSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
          console.log(`[approveRegistration] Slug ${baseSlug} already exists. Trying new slug: ${orgSlug}`);
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
        console.error(`[approveRegistration] Error creating organization: ${orgError.message}`);
        throw new Error(`Error creating organization: ${orgError.message}`);
      }
      organizationIdForProfileAndRole = newOrganization.id;
      console.log(`[approveRegistration] New organization created: ID=${organizationIdForProfileAndRole}, Name=${newOrganization.name}, Slug=${newOrganization.slug}`);

      // Create the user profile
      const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
        user_id: pendingReg.id, // The ID in pending_registrations is the user_id from auth.users
        organization_id: organizationIdForProfileAndRole,
        first_name: pendingReg.contact_name.split(' ')[0],
        last_name: pendingReg.contact_name.split(' ').slice(1).join(' '),
        email: pendingReg.email,
        timezone: "UTC", // Set a default timezone for server-side insertion
        language: "en",
      });

      if (profileError) {
        console.error(`[approveRegistration] Error creating user profile for user_id ${pendingReg.id}: ${profileError.message}`);
        throw new Error(`Error creating user profile: ${profileError.message}`);
      }
      console.log(`[approveRegistration] User profile created for user_id ${pendingReg.id} in organization ${organizationIdForProfileAndRole}`);
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
      console.error(`[approveRegistration] Error checking for existing user role for user_id ${pendingReg.id} in organization ${organizationIdForProfileAndRole}: ${checkRoleError.message}`);
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
        console.error(`[approveRegistration] Error creating user role for user_id ${pendingReg.id} in organization ${organizationIdForProfileAndRole}: ${roleError.message}`);
        throw new Error(`Error creating user role: ${roleError.message}`);
      }
      console.log(`[approveRegistration] User role 'admin' created for user_id ${pendingReg.id} in organization ${organizationIdForProfileAndRole}`);
    } else {
      console.log(`[approveRegistration] User role for user_id ${pendingReg.id} and organization ${organizationIdForProfileAndRole} already exists. Skipping creation.`);
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
      console.error(`[approveRegistration] Error updating pending registration status for ID ${registrationId}: ${updateError.message}`);
      throw new Error(`Error updating pending registration status: ${updateError.message}`);
    }
    console.log(`[approveRegistration] Pending registration ${registrationId} status updated to 'approved'.`);

    return { success: true, error: null };
  } catch (error) {
    console.error("[approveRegistration] Overall error during approval process:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}