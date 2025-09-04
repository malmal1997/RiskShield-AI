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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any | null>(null)
  const [role, setRole] = useState<any | null>(null)
  const [loading, setLoading] = useState(true) // Initialize loading to true
  const [isDemo, setIsDemo] = useState(false)

  const refreshProfile = useCallback(async () => {
    setLoading(true)

    // Only attempt sessionStorage access and Supabase auth if mounted on client
    if (typeof window !== "undefined") {
      const demoSession = sessionStorage.getItem("demo_session")
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
          return
        } catch (error) {
          console.error("Error parsing demo session:", error)
          sessionStorage.removeItem("demo_session")
        }
      }

      // Regular Supabase auth flow continues...
      try {
        const {
          data: { user },
          error: userError,
        } = await supabaseClient.auth.getUser()

        if (userError || !user) {
          setUser(null)
          setProfile(null)
          setOrganization(null)
          setRole(null)
          setIsDemo(false)
          return // Do not set loading to false here, let finally block handle it
        }

        // Get user profile from Supabase
        const { data: profile, error: profileError } = await supabaseClient
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (profileError || !profile) {
          setUser(user)
          setProfile(null)
          setOrganization(null)
          setRole(null)
          setIsDemo(false)
          return // Do not set loading to false here, let finally block handle it
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
      } catch (error) {
        console.error("Error getting user with profile:", error)
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
      } finally {
        setLoading(false) // Ensure loading is always set to false after attempts
      }
    } else {
      // On server, ensure loading is false after initial render
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let subscription: any = null

    // Only call refreshProfile and set up listener if on client
    if (typeof window !== "undefined") {
      const getInitialSession = async () => {
        await refreshProfile()
      }
      getInitialSession()

      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await refreshProfile()
        } else {
          // If signed out, clear all state and set loading to false
          setUser(null)
          setProfile(null)
          setOrganization(null)
          setRole(null)
          setIsDemo(false)
          setLoading(false)
        }
      })
      subscription = authSubscription
    } else {
      // On server, ensure loading is false after initial render
      setLoading(false)
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        try {
          subscription.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from auth changes:", error)
        }
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