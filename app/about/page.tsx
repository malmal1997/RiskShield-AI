"use client"

import React from 'react';
import { Shield, Users, Briefcase, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About <span className="text-blue-600">RiskGuard AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Empowering financial institutions with intelligent risk management solutions.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                At RiskGuard AI, our mission is to revolutionize risk and compliance management for financial institutions. We leverage cutting-edge artificial intelligence to provide accurate, real-time insights, enabling our clients to navigate complex regulatory landscapes and mitigate risks with confidence.
              </p>
              <p className="text-lg text-gray-700">
                We believe in a future where compliance is proactive, not reactive, and where technology empowers human expertise to safeguard financial integrity.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-4">
                To be the leading AI-powered platform for risk and compliance, trusted by financial institutions worldwide for its accuracy, efficiency, and comprehensive coverage. We envision a world where businesses can focus on innovation and growth, knowing their risk posture is continuously monitored and optimized.
              </p>
              <p className="text-lg text-gray-700">
                Our commitment extends to fostering a culture of security, transparency, and continuous improvement within the financial sector.
              </p>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Info className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Innovation</CardTitle>
                <CardDescription>
                  We constantly push the boundaries of AI to deliver smarter, more effective solutions.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Security is at the core of everything we do, protecting our clients' data and operations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Partnership</CardTitle>
                <CardDescription>
                  We build strong relationships with our clients, working together to achieve their goals.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-blue-100 mb-8">
            Be a part of a dynamic team that's shaping the future of financial risk management.
          </p>
          <Link href="/careers">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              View Open Positions
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">RiskShield AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered risk assessment platform helping organizations maintain compliance and mitigate risks across
                all industries.
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
                    Third-Party Assessment
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Compliance Monitoring
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Reporting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
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
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 RiskShield AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}