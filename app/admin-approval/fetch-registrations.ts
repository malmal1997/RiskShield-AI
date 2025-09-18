"use server";

import { supabaseAdmin } from "@/src/integrations/supabase/admin";
import type { PendingRegistration } from "@/lib/auth-service";

export async function fetchPendingRegistrationsServer(): Promise<{ data: PendingRegistration[] | null, error: string | null }> {
  try {
    console.log("Server Action: Fetching pending registrations...");
    const { data, error } = await supabaseAdmin
      .from("pending_registrations")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Server Action Error: Failed to fetch pending registrations:", error);
      return { data: null, error: error.message };
    }

    console.log(`Server Action: Successfully fetched ${data?.length || 0} pending registrations.`);
    return { data: data || [], error: null };
  } catch (err) {
    console.error("Server Action Error: Unexpected error fetching pending registrations:", err);
    return { data: null, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
