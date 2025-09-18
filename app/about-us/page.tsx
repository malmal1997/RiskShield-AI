"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Lightbulb,
  ShieldCheck,
  Rocket,
  Users,
  Handshake,
  Star,
  Briefcase,
  Mail,
  Linkedin,
  Twitter,
  ArrowRight,
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Our Story</Badge>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              About <span className="text-blue-600">RiskShield AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
              Revolutionizing risk management and compliance with cutting-edge artificial intelligence for organizations of all sizes.
            </p>
            <div className="mt-8">
              <Link href="/auth/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              To empower businesses to navigate the complex regulatory landscape with confidence, transforming risk into opportunity through intelligent automation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <Lightbulb className="h-16 w-16 text-blue-600 mx-auto md:mx-0 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Innovating for a Secure Future</h3>
              <p className="text-gray-700 leading-relaxed">
                Founded in 2025, RiskShield AI was born from a vision to simplify and enhance risk management. We believe that every organization, regardless of size, deserves access to advanced tools that not only identify risks but also provide clear, actionable pathways to mitigation and compliance. Our AI-driven platform is designed to reduce manual effort, increase accuracy, and provide real-time insights, allowing our clients to focus on growth and innovation.
              </p>
            </div>
            <div className="relative h-64 md:h-96 bg-blue-100 rounded-lg shadow-lg flex items-center justify-center">
              <img
                src="/placeholder.jpg"
                alt="Mission illustration"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide our work, our decisions, and our interactions with clients and partners.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  We operate with the highest ethical standards, ensuring transparency, honesty, and trustworthiness in all our dealings.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  We continuously push the boundaries of AI and technology to deliver groundbreaking solutions that anticipate future challenges.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Handshake className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold">Customer Success</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  Our clients' success is our priority. We are dedicated to providing exceptional service and support that drives tangible results.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              A diverse group of experts passionate about cybersecurity, AI, and empowering businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">John Doe</h3>
                <p className="text-blue-600 text-sm mb-2">CEO & Founder</p>
                <p className="text-gray-700 text-sm mb-4">
                  Visionary leader with a passion for secure and intelligent solutions.
                </p>
                <div className="flex justify-center space-x-3">
                  <Link href="#" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-700" />
                  </Link>
                  <Link href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-400" />
                  </Link>
                  <Link href="#" aria-label="Email">
                    <Mail className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 2 */}
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" alt="Jane Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">Jane Smith</h3>
                <p className="text-blue-600 text-sm mb-2">Chief Technology Officer</p>
                <p className="text-gray-700 text-sm mb-4">
                  Architect of our AI platform, driving innovation and technical excellence.
                </p>
                <div className="flex justify-center space-x-3">
                  <Link href="#" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-700" />
                  </Link>
                  <Link href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-400" />
                  </Link>
                  <Link href="#" aria-label="Email">
                    <Mail className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 3 */}
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" alt="Robert Johnson" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">Robert Johnson</h3>
                <p className="text-blue-600 text-sm mb-2">Head of Product</p>
                <p className="text-gray-700 text-sm mb-4">
                  Ensuring our solutions meet market needs and deliver exceptional user experience.
                </p>
                <div className="flex justify-center space-x-3">
                  <Link href="#" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-700" />
                  </Link>
                  <Link href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-400" />
                  </Link>
                  <Link href="#" aria-label="Email">
                    <Mail className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 4 */}
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" alt="Emily White" />
                  <AvatarFallback>EW</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">Emily White</h3>
                <p className="text-blue-600 text-sm mb-2">Chief Compliance Officer</p>
                <p className="text-gray-700 text-sm mb-4">
                  Expert in regulatory frameworks, ensuring our platform adheres to global standards.
                </p>
                <div className="flex justify-center space-x-3">
                  <Link href="#" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-700" />
                  </Link>
                  <Link href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-400" />
                  </Link>
                  <Link href="#" aria-label="Email">
                    <Mail className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Join Our Journey CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Journey</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Be a part of a team that's making a real difference in how organizations manage risk and compliance.
          </p>
          <Link href="/careers">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              View Open Positions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">RiskShield AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered risk assessment platform helping financial institutions maintain compliance and mitigate
                risks.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Risk Assessment
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Compliance Monitoring
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Policy Generator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Policy Library
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status Page
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about-us" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 RiskShield AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
