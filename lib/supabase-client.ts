import { createClient } from "@supabase/supabase-js"

// Client-side Supabase client with authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseClientInstance: any = null

const createSupabaseClient = () => {
  if (supabaseClientInstance) {
    return supabaseClientInstance
  }

  // Create a mock client for when Supabase is not configured
  const createMockClient = () => ({
    auth: {
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    from: () => ({
      select: function () {
        return this
      },
      insert: function () {
        return this
      },
      update: function () {
        return this
      },
      delete: function () {
        return this
      },
      eq: function () {
        return this
      },
      single: () => Promise.resolve({ data: null, error: null }),
      order: function () {
        return this
      },
      limit: function () {
        return this
      },
      gte: function () {
        return this
      },
      is: function () {
        return this
      },
      upsert: function () {
        return this
      },
    }),
    functions: {
      invoke: () => Promise.resolve({ data: null, error: null }),
    },
    channel: () => ({
      on: function () {
        return this
      },
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  })

  // Only initialize the real Supabase client on the client-side
  if (typeof window !== "undefined") {
    try {
      if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
        supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false, // Prevent URL session detection issues
          },
        })
        console.log("✅ Supabase client initialized successfully")
      } else {
        console.log("⚠️ Supabase not configured, using mock client")
        supabaseClientInstance = createMockClient()
      }
    } catch (error) {
      console.log("⚠️ Supabase initialization failed, using mock client:", error)
      supabaseClientInstance = createMockClient()
    }
  } else {
    // On server-side, always use the mock client
    supabaseClientInstance = createMockClient()
  }

  return supabaseClientInstance
}

export const supabaseClient = createSupabaseClient()

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"))
}
