"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DemoSessionSetup() {
  const createDemoSession = () => {
    const demoSession = {
      user: {
        id: "demo-user-123",
        email: "demo@riskguard.ai",
        name: "Demo User",
      },
      organization: {
        id: "demo-org-123",
        name: "Demo Organization",
        plan: "enterprise",
      },
      role: {
        role: "admin",
        permissions: { all: true },
      },
      loginTime: new Date().toISOString(),
      profile: {
        first_name: "Demo",
        last_name: "User",
        organization_id: "demo-org-123",
        avatar_url: "/placeholder.svg?height=32&width=32",
      }
    }

    localStorage.setItem("demo_session", JSON.stringify(demoSession))
    window.location.reload()
  }

  const clearDemoSession = () => {
    localStorage.removeItem("demo_session")
    window.location.reload()
  }

  const hasDemoSession = typeof window !== "undefined" && localStorage.getItem("demo_session")

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Demo Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasDemoSession ? (
          <p className="text-sm text-gray-600">
            You have an active demo session. You can clear it to test without authentication.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Create a demo session to test the application without setting up full authentication.
          </p>
        )}

        {hasDemoSession ? (
          <Button onClick={clearDemoSession} variant="outline" className="w-full">
            Clear Demo Session
          </Button>
        ) : (
          <Button onClick={createDemoSession} className="w-full">
            Create Demo Session
          </Button>
        )}
      </CardContent>
    </Card>
  )
}