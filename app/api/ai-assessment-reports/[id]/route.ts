import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const { id } = params
    const updates = await request.json()

    console.log("[v0] Updating assessment report:", id, "with updates:", updates)

    // Update the report in the database
    const { data, error } = await supabase.from("ai_assessment_reports").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Database error updating report:", error)
      return NextResponse.json({ error: "Failed to update report", details: error.message }, { status: 500 })
    }

    console.log("[v0] Report updated successfully:", data.id)

    return NextResponse.json({
      success: true,
      report: data,
    })
  } catch (error) {
    console.error("[v0] Error updating assessment report:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
