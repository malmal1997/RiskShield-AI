import { createClient } from "@supabase/supabase-js"

// Ensure these environment variables are set for the service role client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the service role key

// --- DEBUGGING START ---
console.log("DEBUG: NEXT_PUBLIC_SUPABASE_URL (Admin):", supabaseUrl ? "Loaded" : "UNDEFINED");
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