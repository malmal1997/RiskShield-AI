"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase-client"
import type { User, Session } from "@supabase/supabase-js" // Import Session type
import { getCurrentUserWithProfile } from "@/lib/auth-service" // Import the service function

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
  signOut: () => Promise<void>
  refreshProfile: (sessionFromListener?: Session | null) => Promise<void> // Made sessionFromListener optional
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

  const clearAuthState = () => {
    setUser(null);
    setProfile(null);
    setOrganization(null);
    setRole(null);
    setIsDemo(false);
    setLoading(false);
    console.log("AuthContext: Cleared all auth state.");
  };

  const refreshProfile = async (sessionFromListener?: Session | null) => {
    console.log("AuthContext: refreshProfile called.", { sessionFromListener: !!sessionFromListener });
    setLoading(true); // Always start loading

    // Check for demo session first
    let demoSession = null;
    if (typeof window !== 'undefined') { // Guard localStorage access
      demoSession = localStorage.getItem("demo_session");
    }
    
    if (demoSession) {
      try {
        const session: DemoSession = JSON.parse(demoSession)
        console.log("AuthContext: Demo session found.", session)
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
        console.error("AuthContext: Error parsing demo session:", error)
        if (typeof window !== 'undefined') { // Guard localStorage access
          localStorage.removeItem("demo_session")
        }
      }
    }

    // Regular Supabase auth flow continues...
    try {
      let currentUser: User | null = null;

      if (sessionFromListener?.user) {
        currentUser = sessionFromListener.user;
        console.log("AuthContext: Using user from session listener:", currentUser.email, currentUser.id);
      } else {
        console.log("AuthContext: Attempting to get Supabase user from client...");
        const {
          data: { user: fetchedUser },
          error: userError,
        } = await supabaseClient.auth.getUser();

        if (userError || !fetchedUser) {
          console.log("AuthContext: No Supabase user found or error:", userError);
          clearAuthState(); // This sets loading to false
          return; // Exit early if no user
        }
        currentUser = fetchedUser;
        console.log("AuthContext: Supabase user fetched:", currentUser.email, currentUser.id);
      }

      setUser(currentUser);

      // Add a small delay to allow database changes to propagate, especially after a new user/profile creation
      // This is crucial if the profile/org/role were just created by the approveRegistration server action.
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

      // Use the service function to fetch all related data
      const { user: fetchedUser, profile: fetchedProfile, organization: fetchedOrganization, role: fetchedRole } = await getCurrentUserWithProfile();

      if (fetchedProfile) {
        console.log("AuthContext: User profile found:", fetchedProfile);
        setProfile(fetchedProfile);
      } else {
        console.log("AuthContext: No user profile data found for user:", currentUser.id);
        setProfile(null);
      }

      if (fetchedOrganization) {
        console.log("AuthContext: Organization found:", fetchedOrganization);
        setOrganization(fetchedOrganization);
      } else {
        console.log("AuthContext: No organization data found.");
        setOrganization(null);
      }

      if (fetchedRole) {
        console.log("AuthContext: User role found:", fetchedRole);
        setRole(fetchedRole);
      } else {
        console.log("AuthContext: No user role data found.");
        setRole(null);
      }
      
      setIsDemo(false)
    } catch (error) {
      console.error("AuthContext: Unhandled error in refreshProfile:", error)
      clearAuthState(); // This sets loading to false
    } finally {
      console.log("AuthContext: refreshProfile finished. Setting loading to false.")
      setLoading(false); // Always ensure loading is set to false here
    }
  }

  useEffect(() => {
    let subscription: any = null

    const getInitialSession = async () => {
      console.log("AuthContext: Initial session check started.")
      await refreshProfile() // No sessionFromListener for initial check
      console.log("AuthContext: Initial session check finished.")
    }

    getInitialSession()

    // Listen for auth changes
    try {
      console.log("AuthContext: Setting up auth state change listener.")
      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("AuthContext: Auth state changed. Event:", event, "Session:", session)
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await refreshProfile(session);
        } else if (event === 'SIGNED_OUT') {
          clearAuthState(); // Explicitly clear state on sign out
        } else {
          await refreshProfile(); // For other events, just refresh normally
        }
      })

      subscription = authSubscription
    } catch (error) {
      console.error("AuthContext: Error setting up auth listener:", error)
      setLoading(false)
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        try {
          console.log("AuthContext: Unsubscribing from auth state changes.")
          subscription.unsubscribe()
        } catch (error) {
          console.error("AuthContext: Error unsubscribing from auth changes:", error)
        }
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: signIn called for email:", email)
    setLoading(true); // Set loading true during sign-in attempt
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error("AuthContext: signIn error:", error)
      setLoading(false); // Set loading false on sign-in error
    } else {
      console.log("AuthContext: signIn successful (awaiting onAuthStateChange to update state).")
      // onAuthStateChange will handle setting loading to false after profile refresh
    }
    return { error }
  }

  const signOut = async () => {
    console.log("AuthContext: signOut called.")
    setLoading(true); // Set loading true during sign-out attempt
    if (typeof window !== 'undefined') { // Guard localStorage access
      localStorage.removeItem("demo_session")
    }
    setIsDemo(false)

    const { error } = await supabaseClient.auth.signOut()
    if (error) {
      console.error("AuthContext: signOut error:", error);
      setLoading(false); // Set loading false on sign-out error
    } else {
      console.log("AuthContext: signOut successful (awaiting onAuthStateChange to clear state).")
      // onAuthStateChange will handle clearing state and setting loading to false
    }
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
    signOut,
    refreshProfile,
    hasPermission,
  }

  console.log("AuthContext: Rendering AuthProvider with state:", {
    user: user?.email,
    profile: profile?.first_name,
    organization: organization?.name,
    role: role?.role,
    loading,
    isDemo,
  })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}