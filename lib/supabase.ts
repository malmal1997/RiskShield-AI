import { createClient } from "@supabase/supabase-js"

// Safely get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Initialize client directly, assuming environment variables are set
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Typically false for server-side/API routes
    autoRefreshToken: false,
  },
})

console.log("✅ Supabase client initialized successfully")

export { supabase }

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
  user_id: string; // Added user_id
  organization_id: string; // Added organization_id
}

export interface AssessmentResponse {
  id: number
  assessment_id: string
  user_id: string; // Added user_id
  organization_id: string; // Added organization_id
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