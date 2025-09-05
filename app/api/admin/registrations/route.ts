import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET() {
  try {
    console.log("[v0] API: Fetching pending registrations with admin client")

    const { data: registrations, error } = await adminClient
      .from("pending_registrations")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] API: Error fetching registrations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] API: Found registrations:", registrations?.length || 0)
    return NextResponse.json({ registrations })
  } catch (error) {
    console.error("[v0] API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
