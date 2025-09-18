import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieSerializeOptions } from 'cookie' // Import CookieSerializeOptions
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies' // Import RequestCookie

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieSerializeOptions) {
          // Update the request's cookies for subsequent middleware/server components
          request.cookies.set({ name, value, ...options } as RequestCookie)
          // Update the response's cookies to be sent to the client
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({ name, value, ...options } as RequestCookie)
        },
        remove(name: string, options: CookieSerializeOptions) {
          // Remove from the request's cookies
          request.cookies.set({ name, value: '', ...options } as RequestCookie)
          // Remove from the response's cookies
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({ name, value: '', ...options } as RequestCookie)
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // and for Supabase to set the correct cookies on the response.
  await supabase.auth.getUser()

  return supabaseResponse
}