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
    getSession: () => Promise.resolve({ data: { session: null }, error: null }), // Added getSession
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null, count: 0 }), // Added count
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
  // Added functions for edge functions
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

// Initialize client safely
let supabaseClientInstance: any;

// Only initialize the real Supabase client on the client-side
if (typeof window !== 'undefined') {
  try {
    if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
      supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      console.log("✅ Supabase client initialized successfully on client-side");
    } else {
      console.log("⚠️ Supabase not configured, using mock client on client-side");
      supabaseClientInstance = createMockClient();
    }
  } catch (error) {
    console.log("⚠️ Supabase initialization failed on client-side, using mock client:", error);
    supabaseClientInstance = createMockClient();
  }
} else {
  // On server-side, always use the mock client
  supabaseClientInstance = createMockClient();
  console.log("ℹ️ Using mock Supabase client on server-side");
}

export const supabaseClient = supabaseClientInstance;

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"));
};