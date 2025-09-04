"use client";

import { useAuth } from "@/components/auth-context";
import { MainNavigation } from "@/components/main-navigation";
import { RefreshCw, Shield } from "lucide-react";
import React from "react";

export function AuthAwareNavigation() {
  const { loading, user, isDemo } = useAuth(); // Get user and isDemo here too

  console.log("AuthAwareNavigation: loading =", loading, "user =", user?.email, "isDemo =", isDemo);

  if (loading) {
    return (
      <header className="bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between w-full">
            <div className="flex items-center flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">RiskShield AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Loading navigation...</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return <MainNavigation showAuthButtons={true} />;
}