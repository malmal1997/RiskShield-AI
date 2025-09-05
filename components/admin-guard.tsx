"use client"

import type React from "react"
import { useAuth } from "./auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, RefreshCw } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, role, isDemo } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="mt-2 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Check if user is authenticated and has admin role
  const isAdmin = role?.role === "admin" || isDemo

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <p className="text-gray-600">You need administrator privileges to access this area.</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700">This area is restricted to system administrators only.</p>
              <p className="text-xs text-red-600 mt-2">
                If you believe you should have access, please contact your system administrator.
              </p>
            </div>
            <a
              href="/dashboard"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Shield className="h-4 w-4" />
              <span>Return to Dashboard</span>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
