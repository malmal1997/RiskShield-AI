"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabaseClient } from "@/lib/supabase-client"
import type { User, Session } from "@supabase/supabase-js"
import { getCurrentUserWithProfile } from "@/lib/auth-service"

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
  refreshProfile: (sessionFromListener?: Session | null) => Promise<void>
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

  const clearAuthState = useCallback(() => {
    console.log("AuthContext: clearAuthState called. Setting all auth states to null/false.");
    setUser(null);
    setProfile(null);
    setOrganization(null);
    setRole(null);
    setIsDemo(false);
    setLoading(false);
  }, []);

  const _refreshProfile = useCallback(async (sessionFromListener?: Session | null) => {
    console.log("AuthContext: _refreshProfile started, setting loading=true");
    setLoading(true); // Set loading true at the very beginning

    let demoSession = null;
    if (typeof window !== 'undefined') {
      demoSession = localStorage.getItem("demo_session");
    }
    
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
        console.log("AuthContext: Demo session loaded. Setting loading=false.");
        setLoading(false); // Set loading false for demo session
        return; // Exit early for demo session
      } catch (error) {
        console.error("AuthContext: Error parsing demo session, removing it:", error)
        if (typeof window !== 'undefined') {
          localStorage.removeItem("demo_session")
        }
        // Fall through to regular Supabase auth if demo session fails
      }
    }

    try {
      let currentUser: User | null = null;

      if (sessionFromListener?.user) {
        currentUser = sessionFromListener.user;
      } else {
        const {
          data: { user: fetchedUser },
          error: userError,
        } = await supabaseClient.auth.getUser();

        if (userError || !fetchedUser) {
          console.log("AuthContext: No Supabase user found or error fetching user. Clearing auth state.");
          clearAuthState(); // This sets loading=false
          return; 
        }
        currentUser = fetchedUser;
      }

      setUser(currentUser);
      console.log("AuthContext: Supabase user set:", currentUser?.email);

      const { user: fetchedUser, profile: fetchedProfile, organization: fetchedOrganization, role: fetchedRole } = await getCurrentUserWithProfile();

      if (fetchedProfile) {
        setProfile(fetchedProfile);
        console.log("AuthContext: Profile set:", fetchedProfile.first_name);
      } else {
        setProfile(null);
        console.log("AuthContext: Profile set to null.");
      }

      if (fetchedOrganization) {
        setOrganization(fetchedOrganization);
        console.log("AuthContext: Organization set:", fetchedOrganization.name);
      } else {
        setOrganization(null);
        console.log("AuthContext: Organization set to null.");
      }

      if (fetchedRole) {
        setRole(fetchedRole);
        console.log("AuthContext: Role set:", fetchedRole.role);
      } else {
        setRole(null);
        console.log("AuthContext: Role set to null.");
      }
      
      setIsDemo(false)
      console.log("AuthContext: _refreshProfile completed successfully. Setting loading=false.");
      setLoading(false); // This is the critical line to ensure loading is false after all data is processed
    } catch (error) {
      console.error("AuthContext: Unhandled error in _refreshProfile:", error)
      clearAuthState(); // This sets loading=false
    }
    // No finally block needed here.
  }, [clearAuthState]);

  const refreshProfile = useCallback(async (sessionFromListener?: Session | null) => {
    await _refreshProfile(sessionFromListener);
  }, [_refreshProfile]);


  useEffect(() => {
    let subscription: any = null;
    let isMounted = true;

    const handleRefreshWrapper = async (sessionFromListener?: Session | null) => {
      if (!isMounted) return;
      await _refreshProfile(sessionFromListener);
    };

    const getInitialSession = async () => {
      console.log("AuthContext: Initial session check started.");
      await handleRefreshWrapper();
      console.log("AuthContext: Initial session check completed.");
    };

    getInitialSession();

    try {
      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (isMounted) {
          console.log("AuthContext: onAuthStateChange event:", event, "session:", session?.user?.email);
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            // Only refresh if the session is new or updated,
            // or if the current user/profile/role state is inconsistent.
            // This avoids redundant fetches if the initial load already covered this session.
            if (session && (session.user?.id !== user?.id || !profile || !role || !organization)) {
                 await handleRefreshWrapper(session);
            } else if (!session) { // If session is null (e.g., signed out)
                clearAuthState();
            } else {
                // If user is already set and session is the same, just ensure loading is false
                // This handles cases where onAuthStateChange fires for an already processed session
                setLoading(false);
            }
          } else if (event === 'SIGNED_OUT') {
            clearAuthState();
          } else {
            // For other events (e.g., PASSWORD_RECOVERY), just ensure state is consistent
            await handleRefreshWrapper(session); 
          }
        }
      });

      subscription = authSubscription;
    } catch (error) {
      console.error("AuthContext: Error setting up auth listener:", error);
      if (isMounted) {
        setLoading(false); 
      }
    }

    return () => {
      isMounted = false;
      if (subscription && typeof subscription.unsubscribe === "function") {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("AuthContext: Error unsubscribing from auth changes:", error);
        }
      }
    };
  }, [clearAuthState, _refreshProfile, user, profile, role, organization]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoading(false);
    }
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("demo_session");
    }
    setIsDemo(false);

    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      setLoading(false);
    }
  };

  const hasPermission = useCallback((permission: string): boolean => {
    if (!role) return false;
    if (role.role === "admin" || isDemo) return true;
    return role.permissions && (role.permissions[permission] === true || role.permissions.all === true);
  }, [role, isDemo]);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}