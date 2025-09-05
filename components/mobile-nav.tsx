"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden" size="sm">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4 mt-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
            Platform
          </Link>
          <Link href="/solutions" className="text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
            Solutions
          </Link>
          <Link href="/risk-assessment" className="text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
            Risk Assessment
          </Link>
          <Link
            href="/third-party-assessment"
            className="text-gray-600 hover:text-gray-900 font-medium"
            onClick={() => setOpen(false)}
          >
            Third-Party Assessment
          </Link>
          <Link href="/policy-generator" className="text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
            Policy Generator
          </Link>
          <Link href="/policy-library" className="text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
            Policy Library
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
            About
          </Link>
          <div className="flex flex-col space-y-2 pt-4 border-t">
            <Link href="/auth/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setOpen(false)}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
