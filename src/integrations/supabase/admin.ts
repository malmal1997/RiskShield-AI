import { createClient } from "@supabase/supabase-js"

// Ensure these environment variables are set for the service role client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// --- DEBUGGING START ---
console.log("DEBUG: SUPABASE_URL (Admin):", supabaseUrl ? "Loaded" : "UNDEFINED");
console.log("DEBUG: SUPABASE_SERVICE_ROLE_KEY (Admin):", supabaseServiceRoleKey ? "Loaded" : "UNDEFINED");
// --- DEBUGGING END ---

// Add runtime checks for environment variables
if (!supabaseUrl) {
  throw new Error("Missing environment variable: SUPABASE_URL is not set for Supabase Admin client.");
}
if (!supabaseServiceRoleKey) {
  throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY is not set for Supabase Admin client.");
}

// Initialize client with service_role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false, // Service role client typically doesn't persist sessions
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

console.log("✅ Supabase Admin client initialized successfully")

export { supabaseAdmin }