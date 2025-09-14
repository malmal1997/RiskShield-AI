import { supabaseClient } from "./supabase-client";
import { getCurrentUserWithProfile, logAuditEvent } from "./auth-service"; // Import logAuditEvent

export interface Vendor {
  id: string;
  user_id: string;
  organization_id: string;
  name: string;
  email: string;
  website?: string;
  industry: string;
  size: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  risk_level: string;
  status: string;
  tags: string[];
  last_assessment_date?: string;
  next_assessment_date?: string;
  total_assessments: number;
  completed_assessments: number;
  average_risk_score: number;
  created_at: string;
  updated_at: string;
}

// Get all vendors for the current user's organization
export async function getVendors(): Promise<Vendor[]> {
  try {
    const { user, profile } = await getCurrentUserWithProfile();
    if (!user || !profile) {
      console.log("getVendors: No authenticated user or profile found.");
      return [];
    }

    const { data, error } = await supabaseClient
      .from("vendors")
      .select("*")
      .eq("user_id", user.id) // RLS will enforce organization_id
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getVendors: Supabase query error:", error);
      throw new Error(`Failed to fetch vendors: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("getVendors: Error fetching vendors:", error);
    throw error;
  }
}

// Create a new vendor
export async function createVendor(vendorData: Omit<Vendor, 'id' | 'user_id' | 'organization_id' | 'created_at' | 'updated_at' | 'total_assessments' | 'completed_assessments' | 'average_risk_score'>): Promise<Vendor> {
  try {
    const { user, profile, organization } = await getCurrentUserWithProfile();
    if (!user || !profile || !organization) {
      throw new Error("User not authenticated or organization not found. Cannot create vendor.");
    }

    const insertData = {
      ...vendorData,
      user_id: user.id,
      organization_id: organization.id,
      total_assessments: 0,
      completed_assessments: 0,
      average_risk_score: 0,
      risk_level: vendorData.risk_level || 'pending',
      status: vendorData.status || 'active',
      tags: vendorData.tags || [],
    };

    const { data, error } = await supabaseClient
      .from("vendors")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("createVendor: Supabase insert error:", error);
      throw new Error(`Failed to create vendor: ${error.message}`);
    }

    // Log audit event
    await logAuditEvent({
      action: 'vendor_created',
      entity_type: 'vendor',
      entity_id: data.id,
      new_values: data,
    });

    return data;
  } catch (error) {
    console.error("createVendor: Error creating vendor:", error);
    throw error;
  }
}

// Update an existing vendor
export async function updateVendor(id: string, updates: Partial<Omit<Vendor, 'id' | 'user_id' | 'organization_id' | 'created_at'>>): Promise<Vendor> {
  try {
    const { user } = await getCurrentUserWithProfile();
    if (!user) {
      throw new Error("User not authenticated. Cannot update vendor.");
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('vendors').select('*').eq('id', id).single();

    const { data, error } = await supabaseClient
      .from("vendors")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user can only update their own vendors
      .select()
      .single();

    if (error) {
      console.error("updateVendor: Supabase update error:", error);
      throw new Error(`Failed to update vendor: ${error.message}`);
    }

    // Log audit event
    await logAuditEvent({
      action: 'vendor_updated',
      entity_type: 'vendor',
      entity_id: data.id,
      old_values: oldData,
      new_values: updates,
    });

    return data;
  } catch (error) {
    console.error("updateVendor: Error updating vendor:", error);
    throw error;
  }
}

// Delete a vendor
export async function deleteVendor(id: string): Promise<void> {
  try {
    const { user } = await getCurrentUserWithProfile();
    if (!user) {
      throw new Error("User not authenticated. Cannot delete vendor.");
    }

    // Fetch old data for audit log
    const { data: oldData } = await supabaseClient.from('vendors').select('*').eq('id', id).single();

    const { error } = await supabaseClient
      .from("vendors")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Ensure user can only delete their own vendors

    if (error) {
      console.error("deleteVendor: Supabase delete error:", error);
      throw new Error(`Failed to delete vendor: ${error.message}`);
    }

    // Log audit event
    await logAuditEvent({
      action: 'vendor_deleted',
      entity_type: 'vendor',
      entity_id: id,
      old_values: oldData,
    });

  } catch (error) {
    console.error("deleteVendor: Error deleting vendor:", error);
    throw error;
  }
}