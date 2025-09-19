"use client"

import { useState } from "react"
import { Shield, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useFeatureTracking } from "@/hooks/use-tracking"
import { useAuth } from "./auth-context" // Import useAuth

interface NavigationProps {
  onSignOut?: () => void
  showAuthButtons?: boolean
}

export function MainNavigation({ onSignOut, showAuthButtons = true }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { trackClick } = useFeatureTracking()
  const { user, isDemo, signOut: authSignOut } = useAuth(); // Use useAuth hook

  console.log("MainNavigation: user =", user?.email, "isDemo =", isDemo);

  // Determine if user is authenticated or in demo mode
  const isAuthenticatedOrDemo = !!user || isDemo;
  const displayEmail = user?.email || (isDemo ? "demo@riskshield.ai" : undefined);

  console.log("MainNavigation: isAuthenticatedOrDemo =", isAuthenticatedOrDemo);

  const publicNavigationItems = [
    { name: "Platform", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "About Us", href: "/about-us" },
    { name: "Careers", href: "/careers" },
    { name: "Documentation", href: "/documentation" },
    { name: "Help Center", href: "/help-center" },
  ];

  const restrictedNavigationItems = [
    { name: "Risk Assessment", href: "/risk-assessment" },
    { name: "Third-Party Assessment", href: "/third-party-assessment" },
    { name: "Policy Generator", href: "/policy-generator" },
    { name: "Policy Library", href: "/policy-library" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Settings", href: "/settings" },
  ];

  // Determine which navigation items to show
  const allNavigationItems = isAuthenticatedOrDemo
    ? restrictedNavigationItems
    : publicNavigationItems;

  const isActive = (href: string) => {
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

  const handleSignOutClick = () => {
    if (onSignOut) {
      onSignOut(); // Call prop if provided
    } else {
      authSignOut(); // Use context signOut
    }
  }

  return (
    <header className="bg-white sticky top-0 z-40">
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
            {allNavigationItems.map((item) => (
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
                {isAuthenticatedOrDemo ? (
                  <>
                    <span className="text-sm text-gray-600 whitespace-nowrap">{displayEmail}</span>
                    <Button variant="outline" size="sm" onClick={handleSignOutClick}>
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
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
              {allNavigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
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
                  {isAuthenticatedOrDemo ? (
                    <>
                      <span className="text-sm text-gray-600">{displayEmail}</span>
                      <Button variant="outline" size="sm" onClick={handleSignOutClick} className="w-fit bg-transparent">
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
  )
}
