import { supabaseClient } from "./supabase-client";
import { getCurrentUserWithProfile, logAuditEvent } from "./auth-service";
import type { Integration } from "./supabase";

// Get all integrations for the current organization
export async function getIntegrations(): Promise<{ data: Integration[] | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    const { data, error } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('organization_id', organization.id)
      .order('integration_name', { ascending: true });

    if (error) {
      console.error("getIntegrations: Supabase query error:", error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error("getIntegrations: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Create a new integration
export async function createIntegration(integrationData: Omit<Integration, 'id' | 'organization_id' | 'created_at' | 'updated_at'>): Promise<{ data: Integration | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    const { data, error } = await supabaseClient
      .from('integrations')
      .insert({
        ...integrationData,
        organization_id: organization.id,
      })
      .select()
      .single();

    if (error) {
      console.error("createIntegration: Supabase insert error:", error);
      return { data: null, error: error.message };
    }

    await logAuditEvent({
      action: 'integration_created',
      entity_type: 'integration',
      entity_id: data.id,
      new_values: data,
    });

    return { data, error: null };
  } catch (error) {
    console.error("createIntegration: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Update an existing integration
export async function updateIntegration(integrationId: string, updates: Partial<Omit<Integration, 'id' | 'organization_id' | 'created_at'>>): Promise<{ data: Integration | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    const { data: oldData } = await supabaseClient.from('integrations').select('*').eq('id', integrationId).single();

    const { data, error } = await supabaseClient
      .from('integrations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', integrationId)
      .eq('organization_id', organization.id)
      .select()
      .single();

    if (error) {
      console.error("updateIntegration: Supabase update error:", error);
      return { data: null, error: error.message };
    }

    await logAuditEvent({
      action: 'integration_updated',
      entity_type: 'integration',
      entity_id: data.id,
      old_values: oldData,
      new_values: updates,
    });

    return { data, error: null };
  } catch (error) {
    console.error("updateIntegration: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Delete an integration
export async function deleteIntegration(integrationId: string): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { success: false, error: "User not authenticated or organization not found." };
    }

    const { data: oldData } = await supabaseClient.from('integrations').select('*').eq('id', integrationId).single();

    const { error } = await supabaseClient
      .from('integrations')
      .delete()
      .eq('id', integrationId)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("deleteIntegration: Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    await logAuditEvent({
      action: 'integration_deleted',
      entity_type: 'integration',
      entity_id: integrationId,
      old_values: oldData,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("deleteIntegration: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
