import { createClient } from "@supabase/supabase-js"

// Ensure these environment variables are set for the service role client
const supabaseUrl = process.env.SUPABASE_URL! // Corrected: Use SUPABASE_URL for server-side
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the service role key

// --- DEBUGGING START ---
console.log("DEBUG: SUPABASE_URL (Admin):", supabaseUrl ? "Loaded" : "UNDEFINED"); // Updated log
console.log("DEBUG: SUPABASE_SERVICE_ROLE_KEY (Admin):", supabaseServiceRoleKey ? "Loaded" : "UNDEFINED");
// --- DEBUGGING END ---

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