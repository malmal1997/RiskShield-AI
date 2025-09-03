"use client";

// Removed: import { MainNavigation } from "@/components/main-navigation";
// Removed: import { AppFooter } from "@/components/app-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Lightbulb, TrendingUp, Handshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Ensure Button is imported

export default function AboutUsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Our Story</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About RiskShield AI
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Empowering organizations with intelligent risk assessment and compliance management.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                At RiskShield AI, our mission is to revolutionize risk management by providing cutting-edge, AI-powered solutions that enable organizations to proactively identify, assess, and mitigate risks. We believe in a future where compliance is seamless, and security is inherent.
              </p>
              <p className="text-lg text-gray-700">
                We are dedicated to helping financial institutions and other regulated industries navigate complex regulatory landscapes with confidence, ensuring data integrity, operational resilience, and sustained growth.
              </p>
            </div>
            <div className="flex justify-center">
              <Lightbulb className="h-48 w-48 text-blue-600 opacity-75" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600">Principles that guide our innovation and service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 text-center p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">Integrity</CardTitle>
              <CardDescription className="text-base">
                We operate with the highest ethical standards, ensuring transparency and trustworthiness in all our actions.
              </CardDescription>
            </Card>
            <Card className="border border-gray-200 text-center p-6 hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">Innovation</CardTitle>
              <CardDescription className="text-base">
                We continuously push the boundaries of AI and technology to deliver cutting-edge solutions that solve real-world problems.
              </CardDescription>
            </Card>
            <Card className="border border-gray-200 text-center p-6 hover:shadow-lg transition-shadow">
              <Handshake className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">Customer Success</CardTitle>
              <CardDescription className="text-base">
                Our customers' success is our priority. We are committed to providing exceptional support and value.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section (Placeholder) */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-600">Dedicated experts driving innovation in risk management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Example Team Member Card */}
            <Card className="border border-gray-200 text-center p-6">
              <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" /> {/* Placeholder for avatar */}
              <CardTitle className="text-xl font-semibold mb-1">Jane Doe</CardTitle>
              <CardDescription className="text-base text-blue-600 mb-4">CEO & Founder</CardDescription>
              <p className="text-sm text-gray-600">
                Visionary leader with extensive experience in financial technology and AI.
              </p>
            </Card>
            {/* Add more team member cards here */}
            <Card className="border border-gray-200 text-center p-6">
              <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-1">John Smith</CardTitle>
              <CardDescription className="text-base text-blue-600 mb-4">Chief Technology Officer</CardDescription>
              <p className="text-sm text-gray-600">
                Architect of our AI platform, specializing in secure and scalable systems.
              </p>
            </Card>
            <Card className="border border-gray-200 text-center p-6">
              <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-1">Emily White</CardTitle>
              <CardDescription className="text-base text-blue-600 mb-4">Head of Compliance</CardDescription>
              <p className="text-sm text-gray-600">
                Expert in regulatory frameworks and compliance strategies for financial institutions.
              </p>
            </Card>
            <Card className="border border-gray-200 text-center p-6">
              <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-1">David Green</CardTitle>
              <CardDescription className="text-base text-blue-600 mb-4">Lead AI Scientist</CardDescription>
              <p className="text-sm text-gray-600">
                Driving the development of advanced AI models for risk analysis and prediction.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Journey</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Be a part of a team that's shaping the future of risk management.
            </p>
            <Link href="/careers" passHref>
              <Button size="lg" variant="secondary" asChild>
                View Open Positions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}