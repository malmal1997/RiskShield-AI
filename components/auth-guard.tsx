"use client"

import type React from "react"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Mail, Lock, User, AlertCircle, Play, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  allowPreview?: boolean
  previewMessage?: string
}

export function AuthGuard({ children, allowPreview = false, previewMessage }: AuthGuardProps) {
  const { user, loading, signIn, signUp, signOut, isDemo, refreshProfile } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  console.log("[v0] AuthGuard: Current auth state:", {
    hasUser: !!user,
    userEmail: user?.email,
    loading,
    isDemo,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Check for demo credentials
      if (email === "demo@riskshield.ai" && password === "demo123") {
        sessionStorage.setItem(
          "demo_session",
          JSON.stringify({
            user: {
              id: "demo-user-id",
              email: "demo@riskshield.ai",
              name: "Demo User",
            },
            organization: {
              id: "demo-org-id",
              name: "RiskShield Demo Organization",
              plan: "enterprise",
            },
            role: "admin",
            loginTime: new Date().toISOString(),
          }),
        )

        // Refresh auth context to pick up demo session
        await refreshProfile()

        // Navigate to dashboard
        router.push("/dashboard")
        return
      }

      const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password)

      if (error) {
        setError(error.message)
      } else if (isSignUp) {
        setError("Check your email for a confirmation link!")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      sessionStorage.setItem(
        "demo_session",
        JSON.stringify({
          user: {
            id: "demo-user-id",
            email: "demo@riskshield.ai",
            name: "Demo User",
          },
          organization: {
            id: "demo-org-id",
            name: "RiskShield Demo Organization",
            plan: "enterprise",
          },
          role: "admin",
          loginTime: new Date().toISOString(),
        }),
      )

      // Refresh auth context to pick up demo session
      await refreshProfile()

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Demo login failed. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="mt-2 text-gray-600">Loading...</p>
          <p className="mt-1 text-xs text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If preview is allowed, always render the preview banner and children
  if (allowPreview) {
    return (
      <>
        {/* Preview Banner - only show if not authenticated */}
        {!user && !isDemo && (
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
                  disabled={isSubmitting}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Try Demo (Admin)
                </Button>
                <a href="/auth/register" className="text-white hover:text-blue-100 text-sm font-medium">
                  Sign Up Free
                </a>
              </div>
            </div>
          </div>
        )}
        {children}
      </>
    )
  }

  // Original login form for pages that require full authentication and don't allow preview
  if (!user && !isDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RiskShield AI</span>
            </div>
            <CardTitle className="text-2xl">{isSignUp ? "Create Account" : "Sign In Required"}</CardTitle>
            <p className="text-gray-600">
              {isSignUp
                ? "Create your account to manage vendor assessments"
                : "Sign in to access your vendor assessments"}
            </p>
          </CardHeader>
          <CardContent>
            {/* Demo Access Banner */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">🚀 Try Demo Access (Admin)</h3>
                  <p className="text-sm text-blue-700">Full enterprise platform access</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Email: demo@riskshield.ai
                    <br />
                    Password: demo123
                  </p>
                </div>
                <Button
                  onClick={handleDemoLogin}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Demo
                    </>
                  )}
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></RefreshCw>
                    <span>{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                  setEmail("")
                  setPassword("")
                }}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Create one"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
