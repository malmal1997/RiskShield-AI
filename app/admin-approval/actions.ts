"use server";

import { supabaseAdmin } from "@/src/integrations/supabase/admin";
import type { PendingRegistration } from "@/lib/auth-service"; // Import the interface

// Function to approve a pending registration (Admin action)
export async function approveRegistration(registrationId: string, adminUserId: string): Promise<{ success: boolean, error: any | null }> {
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

    // 2. Create the organization
    let orgSlug = pendingReg.institution_name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    // Ensure slug is not empty and append a unique part of the registrationId
    if (!orgSlug) {
      orgSlug = "organization";
    }
    // Append a short, unique identifier from the registrationId to ensure uniqueness
    // Using the last 8 characters of the UUID should be sufficient for uniqueness in slugs
    const uniqueSuffix = registrationId.substring(registrationId.length - 8);
    orgSlug = `${orgSlug}-${uniqueSuffix}`;

    const { data: organization, error: orgError } = await supabaseAdmin
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
    const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
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
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
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
      throw new Error(updateError.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error approving registration:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}