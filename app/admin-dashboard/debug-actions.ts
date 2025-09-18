"use server";

import { supabaseAdmin } from "@/src/integrations/supabase/admin";
import type { PendingRegistration } from "@/lib/auth-service";

export async function fetchAllRegistrationsServer(): Promise<{ data: PendingRegistration[] | null, error: string | null }> {
  try {
    console.log("Server Action: Fetching all registrations for debug view...");
    const { data, error } = await supabaseAdmin
      .from("pending_registrations")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Server Action Error: Failed to fetch all registrations:", error);
      return { data: null, error: error.message };
    }

    console.log(`Server Action: Successfully fetched ${data?.length || 0} all registrations.`);
    return { data: data || [], error: null };
  } catch (err) {
    console.error("Server Action Error: Unexpected error fetching all registrations:", err);
    return { data: null, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function createTestRegistrationAndApprove(): Promise<{ success: boolean, message: string, error?: string }> {
  try {
    console.log("Server Action: Triggering create-and-approve-admin API route...");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin-actions/create-and-approve-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Server Action Error: Failed to create test registration:", result.error);
      return { success: false, message: result.message || "Failed to create test registration.", error: result.error };
    }

    console.log("Server Action: Test registration created and approved successfully.");
    return { success: true, message: result.message };
  } catch (err) {
    console.error("Server Action Error: Unexpected error creating test registration:", err);
    return { success: false, message: "Unknown error creating test registration.", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function testDatabaseConnectionServer(): Promise<{ success: boolean, message: string }> {
  try {
    console.log("Server Action: Testing database connection...");
    const { data, error } = await supabaseAdmin.from("pending_registrations").select("id", { count: "exact", head: true });

    if (error) {
      console.error("Server Action Error: Database connection test failed:", error);
      return { success: false, message: `Connection failed: ${error.message}` };
    }

    console.log("Server Action: Database connection successful.");
    return { success: true, message: "Connected" };
  } catch (err) {
    console.error("Server Action Error: Unexpected error during database connection test:", err);
    return { success: false, message: `Connection failed: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
}