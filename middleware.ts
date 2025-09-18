import { updateSession } from '@/src/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Redirect authenticated users from '/' to '/dashboard'
  if (request.nextUrl.pathname === '/' && request.cookies.has('sb-eorksudteedlthoyklpy-auth-token')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (for security.txt or other well-known files)
     * - api/ (API routes)
     * - /auth/login (login page)
     * - /auth/register (register page)
     * - /auth/forgot-password (forgot password page)
     * - /vendor-assessment (public vendor assessment page)
     * - /solutions (public solutions page)
     * - /about-us (public about us page)
     * - /careers (public careers page)
     * - /privacy-policy (public privacy policy page)
     * - /terms-of-service (public terms of service page)
     */
    '/((?!_next/static|_next/image|favicon.ico|.well-known|api/|auth/login|auth/register|auth/forgot-password|vendor-assessment|solutions|about-us|careers|privacy-policy|terms-of-service).*)',
  ],
}