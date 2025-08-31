import { createClient } from "@supabase/supabase-js"

// Client-side Supabase client with authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: null } }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: function () {
      return this
    },
    single: function () {
      return this
    },
    order: function () {
      return this
    },
  }),
})

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
