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
  contact_person?: string | null
  assessment_type: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  sent_date: string
  completed_date?: string | null
  due_date?: string | null
  risk_score?: number | null
  risk_level: string
  company_size?: string | null
  custom_message?: string | null
  created_at: string
  updated_at: string
  user_id: string
  organization_id: string
  // Added properties for transformed data in third-party-assessment page
  responses?: any | null;
  completedVendorInfo?: any | null;
  assessmentAnswers?: Record<string, any> | null;
}

export interface AssessmentResponse {
  id: number
  assessment_id: string
  user_id: string
  organization_id: string
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

export interface PreviewSession {
  session_id: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  last_activity: string;
  total_time_spent?: number;
  converted_user_id?: string;
  converted_at?: string;
  created_at: string;
}

export interface PageView {
  id: number;
  session_id: string;
  page_path: string;
  page_title?: string;
  time_on_page?: number;
  created_at: string;
}

export interface FeatureInteraction {
  id: number;
  session_id: string;
  feature_name: string;
  action_type: string;
  feature_data?: any;
  created_at: string;
}

export interface PreviewLead {
  id: number;
  session_id: string;
  email?: string;
  name?: string;
  company?: string;
  phone?: string;
  interest_level: "high" | "medium" | "low";
  lead_source: string;
  notes?: string;
  followed_up?: boolean;
  created_at: string;
}

export interface Organization {
  id: string
  name: string
  slug: string
  domain?: string
  logo_url?: string
  settings: Record<string, any>
  subscription_plan: string
  subscription_status: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  organization_id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  phone?: string
  timezone: string
  language: string
  preferences: Record<string, any>
  last_active_at?: string
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  organization_id: string
  user_id: string
  role: "admin" | "manager" | "analyst" | "viewer"
  permissions: Record<string, any>
  created_at: string
}

export interface Notification {
  id: string
  organization_id: string
  user_id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read_at?: string | null // Allow null for read_at
  created_at: string
}