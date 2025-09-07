"use client"

import React from 'react';
import { Book, Search, FileText, Shield, Users, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function DocumentationPage() {
  const categories = [
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Guides on conducting various risk assessments, including cybersecurity and operational risks.',
      links: [
        { name: 'Getting Started with Risk Assessments', href: '#' },
        { name: 'Understanding Risk Scores', href: '#' },
        { name: 'AI-Powered Analysis Deep Dive', href: '#' },
      ],
    },
    {
      icon: Users,
      title: 'Vendor Management',
      description: 'Documentation for managing third-party vendors, assessments, and compliance.',
      links: [
        { name: 'Onboarding New Vendors', href: '#' },
        { name: 'Sending Third-Party Assessments', href: '#' },
        { name: 'Vendor Risk Monitoring', href: '#' },
      ],
    },
    {
      icon: FileText,
      title: 'Policy Management',
      description: 'Learn how to generate, edit, approve, and manage your organization\'s policies.',
      links: [
        { name: 'Using the Policy Generator', href: '#' },
        { name: 'Customizing Policy Templates', href: '#' },
        { name: 'Policy Approval Workflow', href: '#' },
      ],
    },
    {
      icon: Settings,
      title: 'Platform Settings',
      description: 'Configure your organization, user roles, notifications, and integrations.',
      links: [
        { name: 'Organization Setup', href: '#' },
        { name: 'User & Role Management', href: '#' },
        { name: 'Notification Preferences', href: '#' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-12"> {/* Adjusted padding-top */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            RiskGuard AI <span className="text-blue-600">Documentation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Find guides, tutorials, and API references to help you get the most out of RiskGuard AI.
          </p>
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-3 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <IconComponent className="h-10 w-10 text-blue-600 mb-4" />
                    <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link href={link.href} className="flex items-center text-blue-600 hover:text-blue-800 group">
                            <span className="text-sm font-medium">{link.name}</span>
                            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="mt-6 w-full">
                      View All in {category.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-blue-100 mb-8">
            Our support team is here to assist you with any questions or issues.
          </p>
          <Link href="/contact"> {/* Assuming a contact page exists or will be created */}
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Support
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