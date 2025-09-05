"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Loader2 } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

const AIAssessmentClient = dynamic(() => import("./ai-assessment-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Brain className="mr-1 h-3 w-3" />
              AI-Powered Assessment
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              AI-Powered Risk Assessment
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">Loading AI assessment tools...</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">Initializing AI-powered risk assessment tools...</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  ),
})

export default function AIAssessmentPage() {
  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Sign up to save assessments and access full AI features"
    >
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading...</p>
            </div>
          </div>
        }
      >
        <AIAssessmentClient />
      </Suspense>
    </AuthGuard>
  )
}
