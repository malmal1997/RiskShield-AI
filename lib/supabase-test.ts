import { supabaseClient } from "./supabase-client" // Changed import to supabaseClient

export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...")

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("Environment variables:")
    console.log("SUPABASE_URL:", supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "NOT SET")
    console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "NOT SET")

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables")
    }

    // Test basic connection
    const { data, error } = await supabaseClient.from("assessments").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Supabase connection error:", error)
      throw error
    }

    console.log("✅ Supabase connection successful!")
    console.log("Total assessments in database:", data)

    return { success: true, count: data }
  } catch (error) {
    console.error("❌ Supabase connection failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    }
  }
}
