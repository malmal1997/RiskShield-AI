import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { TrackingProvider } from "@/components/tracking-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RiskGuard AI - Intelligent Risk Assessment Platform",
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
      <body className={inter.className}>
        <AuthProvider>
          <TrackingProvider>
            {children}
            <Toaster />
          </TrackingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
