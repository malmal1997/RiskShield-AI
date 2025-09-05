"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabaseClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

interface DemoUser {
  id: string
  email: string
  name: string
}

interface DemoOrganization {
  id: string
  name: string
  plan: string
}

interface DemoSession {
  user: DemoUser
  organization: DemoOrganization
  role: string
  loginTime: string
}

interface AuthContextType {
  user: User | DemoUser | null
  profile: any | null
  organization: any | null
  role: any | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasPermission: (permission: string) => boolean
  createDemoSession: (userType?: "admin" | "user") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any | null>(null)
  const [role, setRole] = useState<any | null>(null)
  const [loading, setLoading] = useState(false) // Start with false to prevent hydration issues
  const [isDemo, setIsDemo] = useState(false)

  const createDemoSession = useCallback((userType?: "admin" | "user") => {
    if (typeof window === "undefined") return

    const demoSession: DemoSession = {
      user: {
        id: userType === "admin" ? "demo-admin-001" : "demo-user-001",
        email: userType === "admin" ? "demo@riskshield.ai" : "demo@example.com",
        name: userType === "admin" ? "Demo Admin" : "Demo User",
      },
      organization: {
        id: "demo-org-001",
        name: "Demo Organization",
        plan: "enterprise",
      },
      role: userType === "admin" ? "admin" : "user",
      loginTime: new Date().toISOString(),
    }

    sessionStorage.setItem("demo_session", JSON.stringify(demoSession))
    console.log("[v0] AuthContext: Created demo session for", userType, demoSession)

    // Immediately set the auth state
    setUser(demoSession.user)
    setOrganization(demoSession.organization)
    setRole({
      role: demoSession.role,
      permissions:
        userType === "admin"
          ? ["manage_users", "manage_assessments", "manage_organizations", "view_analytics"]
          : ["view_assessments"],
    })
    setProfile({
      first_name: userType === "admin" ? "Demo" : "Demo",
      last_name: userType === "admin" ? "Admin" : "User",
      organization_id: demoSession.organization.id,
      avatar_url: "/placeholder.svg?height=32&width=32",
    })
    setIsDemo(true)
    setLoading(false)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (typeof window === "undefined") {
      return
    }

    setLoading(true)

    const demoSession = sessionStorage.getItem("demo_session")
    console.log("[v0] AuthContext: Checking sessionStorage for demo_session:", demoSession)

    if (demoSession) {
      try {
        const session: DemoSession = JSON.parse(demoSession)
        console.log("[v0] AuthContext: Demo session found, setting demo user")
        setUser(session.user)
        setOrganization(session.organization)
        setRole({
          role: session.role,
          permissions:
            session.role === "admin"
              ? ["manage_users", "manage_assessments", "manage_organizations", "view_analytics"]
              : ["view_assessments"],
        })
        setProfile({
          first_name: session.role === "admin" ? "Demo" : "Demo",
          last_name: session.role === "admin" ? "Admin" : "User",
          organization_id: session.organization.id,
          avatar_url: "/placeholder.svg?height=32&width=32",
        })
        setIsDemo(true)
        setLoading(false)
        return
      } catch (error) {
        console.error("[v0] AuthContext: Error parsing demo session:", error)
        sessionStorage.removeItem("demo_session")
      }
    }

    try {
      const {
        data: { user: supabaseUser },
        error: userError,
      } = await supabaseClient.auth.getUser()

      if (userError || !supabaseUser) {
        console.log("[v0] AuthContext: No Supabase user found")
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
      } else {
        console.log("[v0] AuthContext: Supabase user found, fetching profile")
        // Get user profile from Supabase
        const { data: profileData, error: profileError } = await supabaseClient
          .from("user_profiles")
          .select("*")
          .eq("user_id", supabaseUser.id)
          .single()

        if (profileError || !profileData) {
          console.log("[v0] AuthContext: No profile found for user")
          setUser(supabaseUser)
          setProfile(null)
          setOrganization(null)
          setRole(null)
          setIsDemo(false)
        } else {
          // Get organization and role data
          const [orgResult, roleResult] = await Promise.all([
            supabaseClient.from("organizations").select("*").eq("id", profileData.organization_id).single(),
            supabaseClient.from("user_roles").select("*").eq("user_id", supabaseUser.id).single(),
          ])

          setUser(supabaseUser)
          setProfile(profileData)
          setOrganization(orgResult.error ? null : orgResult.data)
          setRole(roleResult.error ? null : roleResult.data)
          setIsDemo(false)
        }
      }
    } catch (error) {
      console.error("[v0] AuthContext: Error in auth check:", error)
      setUser(null)
      setProfile(null)
      setOrganization(null)
      setRole(null)
      setIsDemo(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let subscription: any = null

    if (typeof window !== "undefined") {
      refreshProfile()

      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("[v0] AuthContext: Auth state change event:", event)
        if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
          setOrganization(null)
          setRole(null)
          setIsDemo(false)
          setLoading(false)
        } else if (session?.user) {
          await refreshProfile()
        }
      })
      subscription = authSubscription
    }

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe()
      }
    }
  }, [refreshProfile])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    // Clear demo session
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("demo_session")
    }
    setIsDemo(false)

    // Sign out from Supabase
    await supabaseClient.auth.signOut()

    // Reset state
    setUser(null)
    setProfile(null)
    setOrganization(null)
    setRole(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!role) return false
    if (role.role === "admin" || isDemo) {
      console.log("[v0] AuthContext: Admin or demo user, granting permission:", permission)
      return true
    }
    return role.permissions && (role.permissions[permission] === true || role.permissions.all === true)
  }

  const value = {
    user,
    profile,
    organization,
    role,
    loading,
    isDemo,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    hasPermission,
    createDemoSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  console.log("useAuth hook: context =", context) // Added logging here
  if (context === undefined) {
    if (typeof window === "undefined") {
      return {
        user: null,
        profile: null,
        organization: null,
        role: null,
        loading: false,
        isDemo: false,
        signIn: async () => ({ error: null }),
        signUp: async () => ({ error: null }),
        signOut: async () => {},
        refreshProfile: async () => {},
        hasPermission: () => false,
        createDemoSession: () => {},
      }
    }
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
