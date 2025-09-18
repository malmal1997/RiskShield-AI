import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  console.log("--- DEBUGGING ENVIRONMENT VARIABLES ---");
  console.log("Server-side SUPABASE_URL:", supabaseUrl ? "Loaded" : "UNDEFINED");
  console.log("Server-side SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceRoleKey ? "Loaded" : "UNDEFINED");
  console.log("Client-side NEXT_PUBLIC_SUPABASE_URL:", nextPublicSupabaseUrl ? "Loaded" : "UNDEFINED");
  console.log("-------------------------------------");

  return NextResponse.json({
    message: "Check your server console for environment variable debug output.",
    SUPABASE_URL_status: supabaseUrl ? "Loaded" : "UNDEFINED",
    SUPABASE_SERVICE_ROLE_KEY_status: supabaseServiceRoleKey ? "Loaded" : "UNDEFINED",
    NEXT_PUBLIC_SUPABASE_URL_status: nextPublicSupabaseUrl ? "Loaded" : "UNDEFINED",
  });
}
