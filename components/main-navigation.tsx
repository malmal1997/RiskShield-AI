"use client"

import React, { useState, useEffect } from "react" // Added React import
import { Shield, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useFeatureTracking } from "@/hooks/use-tracking"
import { useAuth } from "@/components/auth-context"
import type { UserPermissions } from "@/lib/auth-service" // Import UserPermissions

interface NavigationProps {
  showAuthButtons?: boolean
}

export function MainNavigation({ showAuthButtons = true }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { trackClick } = useFeatureTracking()
  const { user, signOut, isDemo, hasPermission } = useAuth() // Use hasPermission

  // Define navigation items with their visibility rules based on permissions
  const publicNavigationItems = [
    { name: "Platform", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "About Us", href: "/about-us" },
    { name: "Careers", href: "/careers" },
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
  ];

  const authenticatedNavigationItems: Array<{ name: string; href: string; permission?: keyof UserPermissions }> = [
    { name: "Dashboard", href: "/dashboard", permission: "view_dashboard" },
    { name: "Risk Assessment", href: "/risk-assessment", permission: "view_assessments" },
    { name: "Third-Party Assessment", href: "/third-party-assessment", permission: "view_assessments" },
    { name: "Policy Generator", href: "/policy-generator", permission: "create_policies" },
    { name: "Policy Library", href: "/policy-library", permission: "view_policies" },
    { name: "Settings", href: "/settings", permission: "manage_organization_settings" },
    { name: "Admin Approval", href: "/admin-approval", permission: "review_registrations" }, // Restricted
    { name: "Assessment Templates", href: "/assessment-templates", permission: "manage_assessment_templates" },
    { name: "Vendors", href: "/vendors", permission: "view_vendors" },
    { name: "Reports", href: "/reports", permission: "view_reports" },
    { name: "Analytics", href: "/analytics", permission: "view_analytics" }, // Restricted
    { name: "System Status", href: "/system-status", permission: "view_system_status" }, // Restricted
    { name: "Dev Dashboard", href: "/dev-dashboard", permission: "access_dev_dashboard" }, // Restricted
    { name: "Demo Features", href: "/demo-features", permission: "view_demo_features" }, // Restricted
    { name: "Interactive Demo", href: "/demo", permission: "view_interactive_demo" }, // Restricted
    { name: "AI Test", href: "/ai-test", permission: "access_ai_test" }, // Restricted
  ];

  const filteredAuthenticatedNavigationItems = authenticatedNavigationItems.filter(item => 
    item.permission ? hasPermission(item.permission) : true // If no specific permission is set, it's visible to all authenticated
  );

  const navigationItems = user ? filteredAuthenticatedNavigationItems : publicNavigationItems;

  const isActive = (href: string) => {
    if (!pathname) return false; // Add null check for pathname
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const handleNavClick = (itemName: string, href: string) => {
    trackClick("navigation", { page: itemName, href, isPreview: isDemo })
  }

  const handleAuthClick = (action: string) => {
    trackClick("auth", { action, isPreview: isDemo })
  }

  return (
    <React.Fragment>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">RiskShield AI</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8 lg:ml-12 xl:ml-16">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => handleNavClick(item.name, item.href)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.href) ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {showAuthButtons && (
                <div className="flex items-center space-x-4 ml-6 xl:ml-8 pl-6 xl:pl-8 border-l border-gray-200">
                  {user ? (
                    <>
                      <span className="text-sm text-gray-600 whitespace-nowrap">{user.email}</span>
                      <Button variant="outline" size="sm" onClick={signOut}>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => handleAuthClick("sign_in_click")}>
                        <Button variant="outline" size="sm">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => handleAuthClick("sign_up_click")}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive(item.href) ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      handleNavClick(item.name, item.href)
                      setMobileMenuOpen(false)
                    }}
                  >
                    {item.name}
                  </Link>
                ))}

                {showAuthButtons && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                    {user ? (
                      <>
                        <span className="text-sm text-gray-600">{user.email}</span>
                        <Button variant="outline" size="sm" onClick={signOut} className="w-fit bg-transparent">
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          onClick={() => {
                            handleAuthClick("sign_in_click")
                            setMobileMenuOpen(false)
                          }}
                        >
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Sign In
                          </Button>
                        </Link>
                        <Link
                          href="/auth/register"
                          onClick={() => {
                            handleAuthClick("sign_up_click")
                            setMobileMenuOpen(false)
                          }}
                        >
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Get Started
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </React.Fragment>
  )
}
