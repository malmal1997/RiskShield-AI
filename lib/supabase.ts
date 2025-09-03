import { createClient } from "@supabase/supabase-js"

// Safely get environment variables
const supabaseUrl =
  typeof window !== "undefined"
    ? window.location.origin.includes("localhost")
      ? process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      : process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    : process.env.NEXT_PUBLIC_SUPABASE_URL || ""

const supabaseAnonKey =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
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
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
})

// Initialize client safely
let supabase: any

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    // console.log("✅ Supabase client initialized successfully")
  } else {
    // console.log("⚠️ Supabase not configured, using mock client")
    supabase = createMockClient()
  }
} catch (error) {
  // console.log("⚠️ Supabase initialization failed, using mock client:", error)
  supabase = createMockClient()
}

export { supabase }

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"))
}

// Types for our database tables
export interface Assessment {
  id: string
  vendor_name: string
  vendor_email: string
  contact_person?: string
  assessment_type: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  sent_date: string
  completed_date?: string
  due_date?: string
  risk_score?: number
  risk_level: string
  company_size?: string
  custom_message?: string
  created_at: string
  updated_at: string
}

export interface AssessmentResponse {
  id: number
  assessment_id: string
  vendor_info: {
    companyName: string
    contactName: string
    email: string
    phone?: string
    website?: string
    employeeCount?: string
    industry?: string
    description?: string
  }
  answers: Record<string, any>
  submitted_at: string
}
