import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reportData = await request.json()

    // Insert the AI assessment report
    const { data: report, error: insertError } = await supabase
      .from("ai_assessment_reports")
      .insert({
        user_id: user.id,
        report_title: reportData.report_title,
        assessment_type: reportData.assessment_type,
        risk_level: reportData.risk_level,
        risk_score: reportData.risk_score,
        report_summary: reportData.report_summary,
        full_report_content: reportData.full_report_content,
        uploaded_documents_metadata: reportData.uploaded_documents_metadata,
        soc_info: reportData.soc_info,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting AI assessment report:", insertError)
      return NextResponse.json({ error: "Failed to save report" }, { status: 500 })
    }

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error("Error in AI assessment reports API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all AI assessment reports for the user
    const { data: reports, error: fetchError } = await supabase
      .from("ai_assessment_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching AI assessment reports:", fetchError)
      return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
    }

    return NextResponse.json({ reports }, { status: 200 })
  } catch (error) {
    console.error("Error in AI assessment reports API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
