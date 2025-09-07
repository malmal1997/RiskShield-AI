"use client"

import React from 'react';
import { Briefcase, Users, DollarSign, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function CareersPage() {
  const jobOpenings = [
    {
      id: '1',
      title: 'Senior AI/ML Engineer',
      location: 'Remote (US)',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Develop and deploy advanced AI/ML models for risk assessment and compliance.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Cloud Platforms'],
    },
    {
      id: '2',
      title: 'Product Manager, Risk & Compliance',
      location: 'New York, NY',
      type: 'Full-time',
      department: 'Product',
      description: 'Define product strategy and roadmap for our risk management platform.',
      skills: ['Product Management', 'Fintech', 'Compliance', 'Agile'],
    },
    {
      id: '3',
      title: 'Cybersecurity Analyst',
      location: 'Remote (EU)',
      type: 'Full-time',
      department: 'Security',
      description: 'Conduct security assessments, vulnerability analysis, and incident response.',
      skills: ['Cybersecurity', 'Penetration Testing', 'SIEM', 'GRC'],
    },
    {
      id: '4',
      title: 'Frontend Developer (React/Next.js)',
      location: 'Remote (Global)',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Build responsive and intuitive user interfaces for our web application.',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'UI/UX'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Join Our <span className="text-blue-600">RiskGuard AI</span> Team
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Innovate the future of financial risk management with a passionate and driven team.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Work With Us?</h2>
              <ul className="space-y-6 text-lg text-gray-700">
                <li className="flex items-start">
                  <Lightbulb className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Cutting-Edge Technology:</strong> Work with the latest AI and cloud technologies to solve real-world problems.
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Impactful Work:</strong> Contribute to safeguarding financial institutions and ensuring regulatory compliance.
                  </div>
                </li>
                <li className="flex items-start">
                  <DollarSign className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Competitive Compensation:</strong> Enjoy a comprehensive benefits package and opportunities for growth.
                  </div>
                </li>
                <li className="flex items-start">
                  <Briefcase className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <strong>Flexible Work Environment:</strong> We support remote work and a healthy work-life balance.
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Culture</h2>
              <p className="text-lg text-gray-700 mb-4">
                We foster a culture of innovation, collaboration, and continuous learning. Our team is made up of experts from diverse backgrounds, all united by a shared passion for technology and a commitment to excellence. We encourage open communication, creative problem-solving, and mutual respect.
              </p>
              <p className="text-lg text-gray-700">
                At RiskGuard AI, your ideas are valued, and your growth is our priority. We invest in our people through ongoing training, mentorship, and career development programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Current Job Openings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobOpenings.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">{job.type}</Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-2 text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.department}</span>
                    <Users className="h-4 w-4 ml-4" />
                    <span>{job.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    Learn More & Apply <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-blue-100 mb-8">
            Explore our opportunities and find your next career challenge at RiskGuard AI.
          </p>
          <Link href="/careers"> {/* Link to a more detailed careers page or external ATS */}
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              View All Openings
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