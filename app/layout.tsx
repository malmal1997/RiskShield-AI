import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { TrackingProvider } from "@/components/tracking-provider"
import { AppFooter } from "@/components/app-footer" // Import AppFooter
import { AuthAwareNavigation } from "@/components/AuthAwareNavigation" // Import the new AuthAwareNavigation component

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RiskShield AI - Intelligent Risk Assessment Platform",
  description: "AI-powered risk assessment and compliance management platform for modern businesses.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <TrackingProvider>
            <AuthAwareNavigation /> {/* Use the new AuthAwareNavigation component here */}
            <main className="flex-grow"> {/* Main content area, takes remaining space */}
              {children}
            </main>
            <AppFooter /> {/* Moved here */}
          </TrackingProvider>
        </AuthProvider>
        <Toaster /> {/* Moved outside TrackingProvider, but still in body */}
      </body>
    </html>
  )
}