"use client"

import type React from "react"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Shield, Play, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

// Paths that do NOT require authentication
const publicPaths = ['/', '/solutions', '/auth/login', '/auth/register', '/auth/forgot-password', '/demo', '/ai-test', '/system-status', '/demo-features'];

interface AuthGuardProps {
  children: React.ReactNode
  allowPreview?: boolean
  previewMessage?: string
}

export function AuthGuard({ children, allowPreview = false, previewMessage }: AuthGuardProps) {
  const { user, loading, isDemo, profile, organization, role, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Use a state to explicitly control if we are in a redirecting phase
  const [isRedirectingState, setIsRedirectingState] = useState(true); // Start as true to show loading initially

  useEffect(() => {
    console.log(`AuthGuard useEffect [${Date.now()}]: pathname=${pathname}, loading=${loading}, user=${user?.email}, profile=${profile?.first_name}, role=${role?.role}, isDemo=${isDemo}`);

    if (loading) {
      setIsRedirectingState(true); // Keep loading state if auth context is still loading
      console.log("AuthGuard useEffect: Auth context still loading, setting isRedirectingState=true.");
      return;
    }
    console.log("AuthGuard useEffect: Auth context finished loading, proceeding with checks.");

    const isAuthenticated = !!user || isDemo;
    const isApproved = !!profile && !!role && !!organization;
    const isAuthPage = ['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname);

    let targetPath: string | null = null;

    // 1. If user is authenticated (real user or demo) AND on the public landing page ('/'):
    if (isAuthenticated && pathname === '/') {
      targetPath = '/dashboard';
      console.log(`AuthGuard: Authenticated user on landing page. Target path: ${targetPath}.`);
    }
    // 2. If user is authenticated (real user, not demo) but NOT APPROVED:
    //    Redirect to login page to show "pending approval" message, unless already on an auth page.
    else if (user && !isDemo && !isApproved && !isAuthPage) {
      targetPath = '/auth/login';
      console.log(`AuthGuard: User ${user.email} is authenticated but NOT APPROVED. Target path: ${targetPath}.`);
    }
    // 3. If user is FULLY APPROVED (authenticated and approved) AND on an auth page:
    //    Redirect to dashboard.
    else if (isAuthenticated && isApproved && isAuthPage) {
      targetPath = '/dashboard';
      console.log(`AuthGuard: User ${user?.email} is FULLY APPROVED and on an auth page. Target path: ${targetPath}.`);
    }
    // 4. If user is NOT AUTHENTICATED and tries to access a PROTECTED page:
    //    Redirect to login page.
    else if (!isAuthenticated && !publicPaths.includes(pathname) && !allowPreview) {
      targetPath = '/auth/login';
      console.log(`AuthGuard: User is NOT AUTHENTICATED. Target path: ${targetPath}.`);
    }

    // Perform redirection if a target path is determined and it's different from the current path
    if (targetPath && pathname !== targetPath) {
      console.log(`AuthGuard: Initiating router.replace(${targetPath}) from ${pathname}.`);
      setIsRedirectingState(true); // Show redirecting state
      router.replace(targetPath);
    } else {
      console.log(`AuthGuard: No redirection needed for ${pathname}. Setting isRedirectingState=false.`);
      setIsRedirectingState(false); // No redirect, so stop showing redirecting state
    }

  }, [loading, user, isDemo, profile, organization, role, allowPreview, pathname, router]);

  // Render logic:
  // If still loading auth state OR if a redirect is in progress, show a loading spinner.
  if (isRedirectingState) {
    console.log("AuthGuard: Rendering loading/redirecting state.");
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {loading ? "Loading authentication..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  // If no loading and no redirect is pending, render children.
  console.log("AuthGuard: Rendering children.");
  return <>{children}</>;
}