"use server"

import { supabaseClient } from "./supabase-client"
import { getCurrentUserWithProfile } from "./auth-service"

export interface EncryptedApiKey {
  id: string
  api_key_name: string
  created_at: string
  // encrypted_key and nonce are not exposed to the client
}

// Function to create an API key (encrypts and stores via Edge Function)
export async function createUserApiKey(apiKeyName: string, apiKeyValue: string): Promise<{ success: boolean; message: string }> {
  try {
    const { user } = await getCurrentUserWithProfile()
    if (!user) {
      return { success: false, message: "User not authenticated." }
    }

    // Call the Supabase Edge Function to encrypt and store the key
    const { data, error } = await supabaseClient.functions.invoke('encrypt-api-key', {
      body: { apiKeyName, apiKeyValue, userId: user.id },
    });

    if (error) {
      console.error("Error invoking encrypt-api-key function:", error);
      return { success: false, message: `Failed to save API key: ${error.message}` };
    }

    if (data.error) {
      console.error("Edge function returned error:", data.error);
      return { success: false, message: `Failed to save API key: ${data.error}` };
    }

    return { success: true, message: "API key saved successfully!" };

  } catch (error) {
    console.error("Error in createUserApiKey:", error);
    return { success: false, message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` };
  }
}

// Function to get user's API keys (returns masked keys)
export async function getUserApiKeys(): Promise<{ data: EncryptedApiKey[] | null; error: string | null }> {
  try {
    const { user } = await getCurrentUserWithProfile()
    if (!user) {
      return { data: null, error: "User not authenticated." }
    }

    const { data, error } = await supabaseClient
      .from("encrypted_api_keys")
      .select("id, api_key_name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching API keys:", error);
      return { data: null, error: `Failed to fetch API keys: ${error.message}` };
    }

    return { data, error: null };

  } catch (error) {
    console.error("Error in getUserApiKeys:", error);
    return { data: null, error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` };
  }
}

// Function to delete an API key
export async function deleteUserApiKey(keyId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { user } = await getCurrentUserWithProfile()
    if (!user) {
      return { success: false, message: "User not authenticated." }
    }

    const { error } = await supabaseClient
      .from("encrypted_api_keys")
      .delete()
      .eq("id", keyId)
      .eq("user_id", user.id); // Ensure only owner can delete

    if (error) {
      console.error("Error deleting API key:", error);
      return { success: false, message: `Failed to delete API key: ${error.message}` };
    }

    return { success: true, message: "API key deleted successfully!" };

  } catch (error) {
    console.error("Error in deleteUserApiKey:", error);
    return { success: false, message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` };
  }
}

// New function to decrypt a user's API key
export async function decryptUserApiKey(keyId: string, userId: string): Promise<{ apiKey: string | null; error: string | null }> {
  try {
    const { data, error } = await supabaseClient.functions.invoke('decrypt-api-key', {
      body: { keyId, userId },
    });

    if (error) {
      console.error("Error invoking decrypt-api-key function:", error);
      return { apiKey: null, error: `Failed to decrypt API key: ${error.message}` };
    }

    if (data.error) {
      console.error("Edge function returned error:", data.error);
      return { apiKey: null, error: `Failed to decrypt API key: ${data.error}` };
    }

    return { apiKey: data.apiKey, error: null };

  } catch (error) {
    console.error("Error in decryptUserApiKey:", error);
    return { apiKey: null, error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` };
  }
}
