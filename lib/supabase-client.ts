import { createClient } from "@supabase/supabase-js"

    // Client-side Supabase client with authentication
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // --- DEBUGGING START ---
    console.log("DEBUG: NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Loaded" : "UNDEFINED");
    console.log("DEBUG: NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Loaded" : "UNDEFINED");
    // --- DEBUGGING END ---

    // Initialize client directly, assuming environment variables are set
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })

    console.log("✅ Supabase client initialized successfully")

    export { supabaseClient }