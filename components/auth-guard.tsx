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

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    console.log(`AuthGuard useEffect START: pathname=${pathname}, loading=${loading}, user=${user?.email}, profile=${profile?.first_name}, role=${role?.role}, isDemo=${isDemo}`);

    if (loading) {
      setRedirecting(false);
      console.log("AuthGuard useEffect: Still loading, returning.");
      return; // Still loading auth state, do nothing yet
    }
    console.log("AuthGuard useEffect: Loading is false, proceeding with checks.");

    const isAuthenticated = !!user || isDemo;
    const isApproved = !!profile && !!role && !!organization; // User is fully approved if profile, role, AND organization are present
    const isAuthPage = ['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname);

    // Determine target path for redirection
    let redirectTo: string | null = null;

    // 1. If user is authenticated (real user or demo) AND on the public landing page ('/'):
    //    Always redirect to dashboard. This is the highest priority for authenticated users.
    if (isAuthenticated && pathname === '/') {
      redirectTo = '/dashboard';
      console.log(`AuthGuard: Authenticated user on landing page. Setting redirect to ${redirectTo}.`);
    }
    // 2. If user is authenticated (real user, not demo) but NOT APPROVED:
    //    Redirect to login page to show "pending approval" message, unless already on an auth page.
    else if (user && !isDemo && !isApproved && !isAuthPage) {
      redirectTo = '/auth/login';
      console.log(`AuthGuard: User ${user.email} is authenticated but NOT APPROVED. Setting redirect to ${redirectTo}.`);
    }
    // 3. If user is FULLY APPROVED (authenticated and approved) AND on an auth page:
    //    Redirect to dashboard.
    else if (isAuthenticated && isApproved && isAuthPage) {
      redirectTo = '/dashboard';
      console.log(`AuthGuard: User ${user?.email} is FULLY APPROVED and on an auth page. Setting redirect to ${redirectTo}.`);
    }
    // 4. If user is NOT AUTHENTICATED and tries to access a PROTECTED page:
    //    Redirect to login page.
    else if (!isAuthenticated && !publicPaths.includes(pathname) && !allowPreview) {
      redirectTo = '/auth/login';
      console.log(`AuthGuard: User is NOT AUTHENTICATED. Setting redirect to ${redirectTo}.`);
    }

    // Perform redirection if a target path is determined and it's different from the current path
    if (redirectTo && pathname !== redirectTo) {
      setRedirecting(true);
      console.log(`AuthGuard: Performing router.replace(${redirectTo}) from ${pathname}.`);
      router.replace(redirectTo);
    } else {
      setRedirecting(false);
      console.log(`AuthGuard: No redirection needed for ${pathname}.`);
    }

  }, [loading, user, isDemo, profile, organization, role, allowPreview, pathname, router]);

  const handleDemoLogin = () => {
    console.log("AuthGuard: handleDemoLogin called.");
    localStorage.setItem(
      "demo_session",
      JSON.stringify({
        user: {
          id: "demo-user-id",
          email: "demo@riskguard.ai",
          name: "Demo User",
        },
        organization: {
          id: "demo-org-id",
          name: "RiskGuard Demo Organization",
          plan: "enterprise",
        },
        role: "admin",
        loginTime: new Date().toISOString(),
      }),
    );
    window.location.href = "/dashboard"; 
  };

  let contentToRender: React.ReactNode = null;

  const renderLoadingStateContent = () => {
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
  };

  if (loading || redirecting) {
    console.log("AuthGuard: Assigning loading state content.");
    contentToRender = renderLoadingStateContent();
  } else {
    console.log("AuthGuard: Assigning children content.");
    contentToRender = <>{children}</>;
  }

  return contentToRender;
}