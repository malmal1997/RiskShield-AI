"use client";

import { useParams } from "next/navigation";
// Removed: import { MainNavigation } from "@/components/main-navigation";
// Removed: import { AppFooter } from "@/components/app-footer";
import { DocumentationCategoryContent } from "@/components/documentation-category-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DocumentationCategoryPage() {
  const params = useParams();
  const category = params.category as string;

  // Format category for display
  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/documentation" passHref>
              <Button variant="ghost" className="mb-4 text-blue-600 hover:text-blue-800 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Documentation
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {formattedCategory} Guides
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              In-depth articles and tutorials for {formattedCategory.toLowerCase()}.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <DocumentationCategoryContent category={category} />
        </div>
      </section>
    </>
  );
}