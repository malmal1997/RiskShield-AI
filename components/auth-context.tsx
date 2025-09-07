"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any | null>(null)
  const [role, setRole] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  const refreshProfile = async () => {
    console.log("AuthContext: refreshProfile called")
    // Check for demo session first
    const demoSession = localStorage.getItem("demo_session")
    if (demoSession) {
      try {
        const session: DemoSession = JSON.parse(demoSession)
        setUser(session.user)
        setOrganization(session.organization)
        setRole({ role: session.role, permissions: { all: true } })
        setProfile({
          first_name: "Demo",
          last_name: "User",
          organization_id: session.organization.id,
          avatar_url: "/placeholder.svg?height=32&width=32",
        })
        setIsDemo(true)
        setLoading(false)
        console.log("AuthContext: Demo session loaded.")
        return
      } catch (error) {
        console.error("AuthContext: Error parsing demo session:", error)
        localStorage.removeItem("demo_session")
      }
    }

    // Regular Supabase auth flow continues...
    try {
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser()

      if (userError || !user) {
        console.log("AuthContext: No Supabase user found or userError:", userError)
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        return
      }

      console.log("AuthContext: Supabase user found:", user.email)

      // Get user profile from Supabase
      const { data: profile, error: profileError } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileError || !profile) {
        console.error("AuthContext: Error fetching profile or profile not found:", profileError)
        setUser(user)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        return
      }

      // Get organization
      const { data: organization, error: orgError } = await supabaseClient
        .from("organizations")
        .select("*")
        .eq("id", profile.organization_id)
        .single()

      // Get user role
      const { data: roleData, error: roleError } = await supabaseClient
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("organization_id", profile.organization_id)
        .single()

      setUser(user)
      setProfile(profile)
      setOrganization(orgError ? null : organization)
      setRole(roleError ? null : roleData)
      setIsDemo(false)
      console.log("AuthContext: Supabase profile, organization, and role loaded.")
    } catch (error) {
      console.error("AuthContext: Error in refreshProfile during Supabase flow:", error)
      setUser(null)
      setProfile(null)
      setOrganization(null)
      setRole(null)
      setIsDemo(false)
    } finally {
      setLoading(false)
      console.log("AuthContext: refreshProfile finished, loading set to false.")
    }
  }

  useEffect(() => {
    let subscription: any = null

    const getInitialSession = async () => {
      await refreshProfile() // This handles both real and demo sessions
    }

    getInitialSession()

    // Listen for auth changes
    try {
      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("AuthContext: Auth state changed event:", event)
        // Always refresh profile on auth state change, let refreshProfile handle demo logic
        // This ensures the context is always up-to-date with Supabase's state
        await refreshProfile()
      })

      subscription = authSubscription
    } catch (error) {
      console.error("AuthContext: Error setting up auth listener:", error)
      setLoading(false) // Ensure loading is false even if listener setup fails
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        try {
          subscription.unsubscribe()
          console.log("AuthContext: Supabase auth subscription unsubscribed.")
        } catch (error) {
          console.error("AuthContext: Error unsubscribing from auth changes:", error)
        }
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signIn for:", email)
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.error("AuthContext: signIn failed:", error.message)
      } else {
        console.log("AuthContext: signIn successful for:", email)
      }
      return { error }
    } catch (e) {
      console.error("AuthContext: Unexpected error during signIn:", e)
      return { error: e }
    }
  }

  const signUp = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signUp for:", email)
    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
      })
      if (error) {
        console.error("AuthContext: signUp failed:", error.message)
      } else {
        console.log("AuthContext: signUp successful for:", email)
      }
      return { error }
    } catch (e) {
      console.error("AuthContext: Unexpected error during signUp:", e)
      return { error: e }
    }
  }

  const signOut = async () => {
    console.log("AuthContext: Attempting signOut.")
    // Clear demo session
    localStorage.removeItem("demo_session")
    setIsDemo(false)

    // Sign out from Supabase
    const { error } = await supabaseClient.auth.signOut()
    if (error) {
      console.error("AuthContext: Supabase signOut failed:", error.message)
    } else {
      console.log("AuthContext: Supabase signOut successful.")
    }

    // Reset state
    setUser(null)
    setProfile(null)
    setOrganization(null)
    setRole(null)
    setLoading(false) // Ensure loading is false after sign out
  }

  const hasPermission = (permission: string): boolean => {
    if (!role) return false
    if (role.role === "admin" || isDemo) return true
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}