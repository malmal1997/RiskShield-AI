import { createClient } from "@supabase/supabase-js"

// Client-side Supabase client with authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a mock client for when Supabase is not configured
const createMockClient = () => {
  // Helper for chainable methods like .eq(), .order(), .limit(), .single()
  const mockChainableQuery = () => {
    const chainable = {
      eq: () => chainable,
      is: () => chainable,
      order: () => chainable,
      limit: () => chainable,
      upsert: () => Promise.resolve({ data: null, error: null }), // Final execution for upsert
      update: () => Promise.resolve({ data: null, error: null }), // Final execution for update
      delete: () => Promise.resolve({ data: null, error: null }), // Final execution for delete
      select: () => Promise.resolve({ data: [], error: null }), // Final execution for select
      insert: () => Promise.resolve({ data: null, error: null }), // Final execution for insert
      single: () => Promise.resolve({ data: null, error: null }), // Final execution for single
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback), // Make it thenable
      catch: (callback: any) => Promise.resolve({ data: null, error: null }).catch(callback),
    };
    return chainable;
  };

  return {
    auth: {
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: null } }),
    },
    from: () => mockChainableQuery(), // from() returns a chainable query object
  };
};

// Initialize client safely
let supabaseClient: any

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    console.log("✅ Supabase client initialized successfully")
  } else {
    console.log("⚠️ Supabase not configured, using mock client")
    supabaseClient = createMockClient()
  }
} catch (error) {
  console.log("⚠️ Supabase initialization failed, using mock client:", error)
  supabaseClient = createMockClient()
}

export { supabaseClient }

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"))
}