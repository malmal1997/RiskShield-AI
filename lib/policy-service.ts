import { supabaseClient } from "./supabase-client";
import { getCurrentUserWithProfile, logAuditEvent } from "./auth-service";
import type { Policy, PolicyVersion } from "./supabase";
import type { Json } from "./supabase"; // Added Json import

// Get all policies for the current user's organization
export async function getPolicies(): Promise<{ data: Policy[] | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    const { data, error } = await supabaseClient
      .from('policies')
      .select('*')
      .eq('organization_id', organization.id)
      .order('created_date', { ascending: false });

    if (error) {
      console.error("getPolicies: Supabase query error:", error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error("getPolicies: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Get a specific policy by ID
export async function getPolicyById(policyId: string): Promise<{ data: Policy | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    const { data, error } = await supabaseClient
      .from('policies')
      .select('*')
      .eq('id', policyId)
      .eq('organization_id', organization.id)
      .single();

    if (error) {
      console.error("getPolicyById: Supabase query error:", error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error("getPolicyById: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Update an existing policy
export async function updatePolicy(policyId: string, updates: Partial<Omit<Policy, 'id' | 'organization_id' | 'user_id' | 'created_date'>>): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { success: false, error: "User not authenticated or organization not found." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('policies').select('*').eq('id', policyId).single();

    const { error } = await supabaseClient
      .from('policies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', policyId)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("updatePolicy: Supabase update error:", error);
      return { success: false, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'policy_updated',
      entity_type: 'policy',
      entity_id: policyId,
      old_values: oldData,
      new_values: updates,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("updatePolicy: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Delete a policy
export async function deletePolicy(policyId: string): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { success: false, error: "User not authenticated or organization not found." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('policies').select('*').eq('id', policyId).single();

    const { error } = await supabaseClient
      .from('policies')
      .delete()
      .eq('id', policyId)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("deletePolicy: Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'policy_deleted',
      entity_type: 'policy',
      entity_id: policyId,
      old_values: oldData,
      new_values: undefined, // Fixed: Changed null to undefined
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("deletePolicy: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Get all versions for a specific policy
export async function getPolicyVersions(policyId: string): Promise<{ data: PolicyVersion[] | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    // Verify policy belongs to organization
    const { data: policy, error: policyError } = await supabaseClient
      .from('policies')
      .select('id')
      .eq('id', policyId)
      .eq('organization_id', organization.id)
      .single();

    if (policyError || !policy) {
      return { data: null, error: "Policy not found or not accessible." };
    }

    const { data, error } = await supabaseClient
      .from('policy_versions')
      .select('*')
      .eq('policy_id', policyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("getPolicyVersions: Supabase query error:", error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error("getPolicyVersions: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Create a new policy version
export async function createPolicyVersion(policyId: string, versionNumber: string, content: Json, createdBy: string | null): Promise<{ data: PolicyVersion | null, error: string | null }> {
  try {
    const { user, organization } = await getCurrentUserWithProfile();
    if (!user || !organization) {
      return { data: null, error: "User not authenticated or organization not found." };
    }

    // Verify policy belongs to organization
    const { data: policy, error: policyError } = await supabaseClient
      .from('policies')
      .select('id')
      .eq('id', policyId)
      .eq('organization_id', organization.id)
      .single();

    if (policyError || !policy) {
      return { data: null, error: "Policy not found or not accessible." };
    }

    const { data, error } = await supabaseClient
      .from('policy_versions')
      .insert({
        policy_id: policyId,
        version_number: versionNumber,
        content: content,
        created_by: createdBy,
      })
      .select()
      .single();

    if (error) {
      console.error("createPolicyVersion: Supabase insert error:", error);
      return { data: null, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'policy_version_created',
      entity_type: 'policy_version',
      entity_id: data.id,
      new_values: data,
      old_values: undefined, // Fixed: Changed null to undefined
    });

    return { data, error: null };
  } catch (error) {
    console.error("createPolicyVersion: Unexpected error:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Approve a policy
export async function approvePolicy(policyId: string, approvedByUserId: string | null): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, organization, role } = await getCurrentUserWithProfile();
    if (!user || !organization || !role) { // Ensure role is also present
      return { success: false, error: "Unauthorized: User not authenticated or organization not found." };
    }

    // Check if admin e-signature is required and if the current user is an admin
    if (organization.require_admin_signature && role.role !== 'admin') {
      return { success: false, error: "Unauthorized: Admin e-signature is required to approve policies." };
    }
    
    // If admin e-signature is required, ensure approvedByUserId is provided and matches current user
    if (organization.require_admin_signature && (!approvedByUserId || approvedByUserId !== user.id)) {
        return { success: false, error: "Unauthorized: Admin e-signature must be from the current authenticated administrator." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('policies').select('*').eq('id', policyId).single();

    const { error } = await supabaseClient
      .from('policies')
      .update({
        status: 'approved',
        approval_status: 'approved',
        approved_by_user_id: approvedByUserId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', policyId)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("approvePolicy: Supabase update error:", error);
      return { success: false, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'policy_approved',
      entity_type: 'policy',
      entity_id: policyId,
      old_values: oldData,
      new_values: { status: 'approved', approval_status: 'approved', approved_by_user_id: approvedByUserId, approved_at: new Date().toISOString() },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("approvePolicy: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Reject a policy
export async function rejectPolicy(policyId: string, rejectedByUserId: string | null): Promise<{ success: boolean, error: string | null }> {
  try {
    const { user, organization, role } = await getCurrentUserWithProfile();
    if (!user || !organization || role?.role !== 'admin') {
      return { success: false, error: "Unauthorized: Only administrators can reject policies." };
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('policies').select('*').eq('id', policyId).single();

    const { error } = await supabaseClient
      .from('policies')
      .update({
        status: 'draft', // Return to draft
        approval_status: 'rejected',
        approved_by_user_id: rejectedByUserId, // Use approved_by_user_id for who rejected
        approved_at: new Date().toISOString(), // Use approved_at for when rejected
        updated_at: new Date().toISOString(),
      })
      .eq('id', policyId)
      .eq('organization_id', organization.id);

    if (error) {
      console.error("rejectPolicy: Supabase update error:", error);
      return { success: false, error: error.message };
    }

    // Log audit event
    await logAuditEvent({
      action: 'policy_rejected',
      entity_type: 'policy',
      entity_id: policyId,
      old_values: oldData,
      new_values: { status: 'draft', approval_status: 'rejected', approved_by_user_id: rejectedByUserId, approved_at: new Date().toISOString() },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("rejectPolicy: Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}