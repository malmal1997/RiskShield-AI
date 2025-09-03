"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { MainNavigation } from "@/components/main-navigation"
import { AppFooter } from "@/components/app-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { documentationContent } from "@/components/documentation-category-content" // Import documentationContent

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCategories, setFilteredCategories] = useState<
    Array<{ id: string; name: string; description: string; icon: React.ElementType }>
  >([])

  const categories = useMemo(
    () =>
      Object.entries(documentationContent).map(([id, data]) => ({
        id,
        name: data.title,
        description: data.description,
        icon: data.articles[0]?.icon || BookOpen, // Use first article's icon or a default
      })),
    [],
  )

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories)
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      const filtered = categories.filter((category) => {
        // Check if category name or description matches
        if (
          category.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          category.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          category.id.toLowerCase().includes(lowerCaseSearchTerm)
        ) {
          return true
        }

        // Check if any article within the category matches
        const categoryArticles = documentationContent[category.id]?.articles
        if (categoryArticles) {
          return categoryArticles.some(
            (article) =>
              article.title.toLowerCase().includes(lowerCaseSearchTerm) ||
              // Strip HTML tags from content before searching
              article.content
                .toLowerCase()
                .replace(/<[^>]*>/g, "")
                .includes(lowerCaseSearchTerm),
          )
        }
        return false
      })
      setFilteredCategories(filtered)
    }
  }, [searchTerm, categories])

  return (
    <div className="min-h-screen bg-white">
      <MainNavigation showAuthButtons={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Support & Learning</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">RiskGuard AI Documentation</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Find guides, tutorials, and answers to your questions about using the RiskGuard AI platform.
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Explore Our Guides</h2>
            <p className="mt-4 text-lg text-gray-600">Browse by category to find what you need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const Icon = category.icon
                return (
                  <Card key={category.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Display first few articles or a summary */}
                      <ul className="space-y-2 text-sm text-gray-600">
                        {documentationContent[category.id]?.articles.slice(0, 3).map((article, idx) => (
                          <li key={idx}>• {article.title}</li>
                        ))}
                      </ul>
                      <Link href={`/documentation/${category.id}`}>
                        <Button
                          variant="ghost"
                          className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                        >
                          View Guides →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try a different search term or browse all categories.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Our support team is here to assist you with any questions or issues.
            </p>
            <Link href="/help-center">
              <Button size="lg" variant="secondary">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  )
}
