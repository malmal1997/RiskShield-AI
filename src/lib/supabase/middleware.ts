import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieSerializeOptions } from 'cookie' // Import CookieSerializeOptions

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: Array<{ name: string; value: string; options: CookieSerializeOptions }>) => {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value, options))
        },
        // This is a new feature in Supabase SSR, ensuring cookies are set on the response
        // for subsequent requests.
        set: (name: string, value: string, options: CookieSerializeOptions) => {
          request.cookies.set(name, value, options);
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set(name, value, options);
        },
        remove: (name: string, options: CookieSerializeOptions) => {
          request.cookies.delete(name, options);
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set(name, '', options);
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // and for Supabase to set the correct cookies on the response.
  await supabase.auth.getUser()

  return supabaseResponse
}