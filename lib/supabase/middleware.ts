import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Middleware: Missing Supabase environment variables", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      nodeEnv: process.env.NODE_ENV,
    })
    // Return early without Supabase client if env vars are missing
    return supabaseResponse
  }

  try {
    // With Fluid compute, don't put this client in a global environment
    // variable. Always create a new one on each request.
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: If you remove getUser() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Allow access to public routes and auth routes
    if (
      request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname.startsWith("/auth") ||
      request.nextUrl.pathname.startsWith("/api") ||
      request.nextUrl.pathname.startsWith("/_next") ||
      request.nextUrl.pathname.startsWith("/favicon") ||
      request.nextUrl.pathname.startsWith("/about-us") ||
      request.nextUrl.pathname.startsWith("/careers") ||
      request.nextUrl.pathname.startsWith("/documentation") ||
      request.nextUrl.pathname.startsWith("/help-center") ||
      request.nextUrl.pathname.startsWith("/platform") ||
      request.nextUrl.pathname.startsWith("/solutions")
    ) {
      return supabaseResponse
    }

    // Redirect unauthenticated users to login for protected routes
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Middleware: Error creating Supabase client:", error)
    return supabaseResponse
  }
}
