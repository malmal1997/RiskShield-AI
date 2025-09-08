import { createClient } from "@supabase/supabase-js"

    // Client-side Supabase client with authentication
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // --- DEBUGGING START ---
    console.log("DEBUG: NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? `Loaded (${supabaseUrl.substring(0, 20)}...)` : "UNDEFINED");
    console.log("DEBUG: NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? `Loaded (${supabaseAnonKey.substring(0, 20)}...)` : "UNDEFINED");
    // --- DEBUGGING END ---

    // Initialize client directly, assuming environment variables are set
    let supabaseClientInstance: ReturnType<typeof createClient>;
    try {
      supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      console.log("✅ Supabase client initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Supabase client:", error);
      // Provide a fallback or re-throw if initialization is critical
      throw new Error("Failed to initialize Supabase client. Check environment variables.");
    }


    export { supabaseClientInstance as supabaseClient }