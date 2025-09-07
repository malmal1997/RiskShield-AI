import { createClient } from "@supabase/supabase-js"

// Client-side Supabase client with authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Initialize client directly, assuming environment variables are set
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

console.log("✅ Supabase client initialized successfully")

export { supabaseClient }