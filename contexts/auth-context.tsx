"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name?: string
}

interface Profile {
  id: string
  name: string
  role: string
}

interface Organization {
  id: string
  name: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  organization: Organization | null
  role: string | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Check for demo session
    const demoSession = sessionStorage.getItem("demoSession")
    if (demoSession) {
      try {
        const demoData = JSON.parse(demoSession)
        setUser(demoData.user)
        setProfile(demoData.profile)
        setOrganization(demoData.organization)
        setRole(demoData.role)
        setIsDemo(true)
      } catch (error) {
        console.error("Error parsing demo session:", error)
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Demo login logic
    if (email === "demo@riskshield.ai" && password === "demo123") {
      const demoData = {
        user: { id: "demo-user", email: "demo@riskshield.ai", name: "Demo User" },
        profile: { id: "demo-profile", name: "Demo User", role: "admin" },
        organization: { id: "demo-org", name: "Demo Organization" },
        role: "admin",
      }

      sessionStorage.setItem("demoSession", JSON.stringify(demoData))
      setUser(demoData.user)
      setProfile(demoData.profile)
      setOrganization(demoData.organization)
      setRole(demoData.role)
      setIsDemo(true)
      return
    }

    throw new Error("Invalid credentials")
  }

  const signUp = async (email: string, password: string) => {
    throw new Error("Sign up not implemented")
  }

  const signOut = async () => {
    sessionStorage.removeItem("demoSession")
    setUser(null)
    setProfile(null)
    setOrganization(null)
    setRole(null)
    setIsDemo(false)
  }

  const refreshProfile = async () => {
    // Refresh profile logic
  }

  const hasPermission = (permission: string) => {
    return role === "admin" || isDemo
  }

  const value: AuthContextType = {
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
