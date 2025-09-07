"use client"

import type React from "react"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Shield, Play } from "lucide-react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  allowPreview?: boolean
  previewMessage?: string
}

export function AuthGuard({ children, allowPreview = false, previewMessage }: AuthGuardProps) {
  const { user, loading, isDemo } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Paths that do NOT require authentication
  const publicPaths = ['/', '/solutions', '/auth/login', '/auth/register', '/auth/forgot-password', '/demo', '/ai-test', '/system-status'];

  // Redirect logic
  useEffect(() => {
    if (loading) return; // Wait until auth state is resolved

    const isAuthenticated = !!user || isDemo;
    const isPublicPath = publicPaths.includes(pathname);

    if (!isAuthenticated && !isPublicPath && !allowPreview) {
      // If not authenticated, not a public path, and not allowed preview, redirect to login
      router.replace('/auth/login');
    } else if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/forgot-password')) {
      // If authenticated and trying to access login/register/forgot-password, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [loading, user, isDemo, allowPreview, pathname, router, publicPaths]);

  const handleDemoLogin = () => {
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
    // Force full page reload to ensure AuthContext re-evaluates and navigation updates
    window.location.href = "/dashboard"; 
  };

  if (loading || (!user && !isDemo && !publicPaths.includes(pathname) && !allowPreview)) {
    // Show loading spinner while auth is resolving or if redirecting
    // The second part of the condition ensures we show loading only if a redirect is imminent for a protected page
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If on a public path, or authenticated, or allowed preview, render children
  const isAuthenticated = !!user || isDemo;
  const isPublicPath = publicPaths.includes(pathname);

  if (!isAuthenticated && allowPreview && !isPublicPath) {
    // This is the preview mode for protected pages
    return (
      <div className="min-h-screen bg-white">
        {/* Preview Banner */}
        <div className="bg-blue-600 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="font-medium">
                {previewMessage || "You're viewing a preview. Sign up for full access to all features."}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDemoLogin}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Play className="h-4 w-4 mr-1" />
                Try Demo
              </Button>
              <a href="/auth/register" className="text-white hover:text-blue-100 text-sm font-medium">
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // If authenticated, or on a public path, or if allowPreview is true and we're not on a public path (handled above)
  return <>{children}</>;
}