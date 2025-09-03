"use client";

// Removed: import { MainNavigation } from "@/components/main-navigation";
// Removed: import { AppFooter } from "@/components/app-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Award, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareersPage() {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior AI Engineer",
      location: "Remote (US)",
      department: "Engineering",
      type: "Full-time",
      description: "Develop and optimize AI models for risk assessment and compliance.",
    },
    {
      id: 2,
      title: "Compliance Analyst",
      location: "New York, NY",
      department: "Compliance",
      type: "Full-time",
      description: "Analyze regulatory requirements and integrate them into our platform.",
    },
    {
      id: 3,
      title: "Product Manager",
      location: "Remote (EU)",
      department: "Product",
      type: "Full-time",
      description: "Lead the development of new features and product lines.",
    },
    {
      id: 4,
      title: "Cybersecurity Consultant",
      location: "London, UK",
      department: "Professional Services",
      type: "Full-time",
      description: "Advise clients on cybersecurity best practices and platform implementation.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Join Our Team</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Careers at RiskGuard AI
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Innovate the future of risk management with a passionate and growing team.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Work With Us?</h2>
            <p className="mt-4 text-lg text-gray-600">
              We offer a dynamic environment where your contributions make a real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 text-center p-6 hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">Impactful Work</CardTitle>
              <CardDescription className="text-base">
                Contribute to a platform that helps organizations navigate critical risks and ensure compliance.
              </CardDescription>
            </Card>
            <Card className="border border-gray-200 text-center p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">Collaborative Culture</CardTitle>
              <CardDescription className="text-base">
                Join a team of bright, supportive individuals who are passionate about technology and innovation.
              </CardDescription>
            </Card>
            <Card className="border border-gray-200 text-center p-6 hover:shadow-lg transition-shadow">
              <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">Growth Opportunities</CardTitle>
              <CardDescription className="text-base">
                We invest in our employees' development with continuous learning and career advancement paths.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Current Job Openings</h2>
            <p className="mt-4 text-lg text-gray-600">Find your next opportunity with RiskGuard AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-700">{job.type}</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
                    <span>View Details</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {jobOpenings.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No open positions at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Make an Impact?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our mission.
            </p>
            <Link href="/auth/register" passHref>
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