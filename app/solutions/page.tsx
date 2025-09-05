"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Shield,
  FileText,
  BadgeCheck,
  TrendingUp,
  CheckCircle,
  Users,
  Cog,
  LifeBuoy,
  Lock,
  Server,
  Clock,
  HeartPulse, // For Healthcare
  Banknote, // For Banks
  CreditCard, // For Credit Unions
  Zap, // For Fintech
  ArrowRight,
  Building, // Added Building icon
  Building2, // For Real Estate
  BriefcaseBusiness, // For Government
  GraduationCap, // For Education
  ShoppingCart, // For Retail
  Factory, // For Manufacturing
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay" // Import Autoplay

// Data for solution categories
const coreSolutions = [
  {
    id: "compliance-management",
    title: "Compliance Management",
    description:
      "Streamline regulatory compliance with AI-powered assessment tools, automated reporting, and comprehensive gap analysis.",
    icon: BadgeCheck,
    features: [
      "Automated tracking and reporting",
      "Regulatory reporting",
      "Compliance tracking",
      "Audit preparation",
      "Gap analysis",
    ],
    link: "/solutions/compliance-management", // Updated link
  },
  {
    id: "cybersecurity-risk",
    title: "Cybersecurity Risk",
    description:
      "Identify, assess, and mitigate cybersecurity threats with comprehensive risk evaluation and advanced AI-powered tools.",
    icon: Shield,
    features: [
      "Automated risk scoring",
      "Threat intelligence",
      "Risk visualization",
      "Custom frameworks",
      "Security policy management",
    ],
    link: "/solutions/cybersecurity-risk", // Updated link
  },
  {
    id: "third-party-risk",
    title: "Third-Party Risk",
    description:
      "Manage vendor and third-party relationships with comprehensive risk assessment tools.",
    icon: Users,
    features: [
      "Partner risk evaluation",
      "Continuous monitoring",
      "Contract management",
      "Risk scoring",
    ],
    link: "/solutions/third-party-risk", // Updated link
  },
]

const specializedAssessments = [
  {
    id: "data-privacy-assessment",
    title: "Data Privacy Assessment",
    description:
      "Evaluate data protection practices and privacy compliance requirements.",
    icon: Lock,
    features: [
      "GDPR compliance review",
      "Data handling procedures",
      "Privacy impact assessments",
      "Data breach response",
    ],
    link: "/solutions/data-privacy-assessment", // Updated link
  },
  {
    id: "infrastructure-security",
    title: "Infrastructure Security",
    description:
      "Assess IT infrastructure security and system vulnerabilities.",
    icon: Server,
    features: [
      "System architecture review",
      "Security controls audit",
      "Vulnerability scanning",
      "Network security assessment",
    ],
    link: "/solutions/infrastructure-security", // Updated link
  },
  {
    id: "financial-services-assessment",
    title: "Financial Services Assessment",
    description:
      "Specialized risk assessment for financial service providers.",
    icon: Building,
    features: [
      "Regulatory compliance check",
      "Financial risk analysis",
      "Anti-money laundering",
      "Credit risk evaluation",
    ],
    link: "/solutions/financial-services-assessment", // Updated link
  },
]

const internalRiskAssessments = [
  {
    id: "operational-risk-assessment",
    title: "Operational Risk Assessment",
    description:
      "Evaluate operational processes and identify potential risk areas.",
    icon: Cog,
    features: [
      "Process workflow analysis",
      "Risk mitigation strategies",
      "Performance monitoring",
      "Quality assurance",
    ],
    link: "/solutions/operational-risk-assessment", // Updated link
  },
  {
    id: "business-continuity-assessment",
    title: "Business Continuity Assessment",
    description:
      "Evaluate business continuity plans and disaster recovery capabilities.",
    icon: Clock,
    features: [
      "Disaster recovery planning",
      "Business impact analysis",
      "Crisis management",
      "Recovery testing",
    ],
    link: "/solutions/business-continuity-assessment", // Updated link
  },
]

// Data for industry-specific solutions
const industrySolutions = [
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Specialized risk management solutions for healthcare organizations to ensure HIPAA compliance and data security.",
    icon: HeartPulse,
    link: "/solutions/healthcare",
  },
  {
    id: "banks",
    title: "Banks",
    description: "Comprehensive solutions for banks to streamline regulatory compliance and manage operational risks.",
    icon: Banknote,
    link: "/solutions/banks",
  },
  {
    id: "credit-unions",
    title: "Credit Unions",
    description: "Tailored risk management to maintain compliance with NCUA regulations and protect member data.",
    icon: CreditCard,
    link: "/solutions/credit-unions",
  },
  {
    id: "fintech",
    title: "Fintech",
    description: "Innovative risk management solutions for fintech companies navigating evolving regulatory landscapes.",
    icon: Zap,
    link: "/solutions/fintech",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Risk management for property development, investment, and management firms.",
    icon: Building2,
    link: "/solutions/real-estate",
  },
  {
    id: "government",
    title: "Government",
    description: "Compliance and security solutions for public sector agencies and municipalities.",
    icon: BriefcaseBusiness,
    link: "/solutions/government",
  },
  {
    id: "education",
    title: "Education",
    description: "Protecting student data and ensuring operational resilience for educational institutions.",
    icon: GraduationCap,
    link: "/solutions/education",
  },
  {
    id: "retail",
    title: "Retail",
    description: "Managing cybersecurity and operational risks for e-commerce and brick-and-mortar retailers.",
    icon: ShoppingCart,
    link: "/solutions/retail",
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    description: "Supply chain risk, operational technology security, and compliance for manufacturers.",
    icon: Factory,
    link: "/solutions/manufacturing",
  },
]

// Component to render a solution card
const SolutionCard = ({ solution }: { solution: any }) => {
  const Icon = solution.icon
  return (
    <Card className="border border-gray-200 hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">{solution.title}</CardTitle>
        </div>
        <CardDescription className="flex-grow">{solution.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="space-y-2 mb-4">
          {solution.features.map((feature: string, idx: number) => (
            <div key={idx} className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
        <Link href={solution.link} asChild>
          <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// Component to render an industry solution card for the carousel
const IndustrySolutionCard = ({ solution }: { solution: any }) => {
  const Icon = solution.icon
  return (
    <Card className="border border-gray-200 hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="text-center">
        <Icon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
        <CardTitle className="text-xl font-semibold">{solution.title}</CardTitle>
        <CardDescription className="flex-grow">{solution.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto text-center">
        <Link href={solution.link} asChild>
          <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function SolutionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Our Solutions</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Comprehensive Risk Management
              <br />
              <span className="text-blue-600">Solutions for Your Business</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              RiskGuard AI offers a suite of intelligent tools to streamline your risk assessment, compliance, and
              third-party management processes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/demo" asChild>
                <Button
                  size="lg"
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Risk Management Suite Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Complete Risk Management Suite</h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to assess, manage, and mitigate risks across your organization
            </p>
          </div>

          <Tabs defaultValue="core-solutions" className="w-full">
            <TabsList className="flex justify-center gap-1 max-w-fit mx-auto mb-8 h-auto p-1 rounded-lg bg-gray-100">
              <TabsTrigger value="core-solutions" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">Core Solutions</TabsTrigger>
              <TabsTrigger value="specialized-assessments" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">Specialized Assessments</TabsTrigger>
              <TabsTrigger value="internal-risk-assessments" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">Internal Risk Assessments</TabsTrigger>
            </TabsList>

            <TabsContent value="core-solutions">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coreSolutions.map((solution) => (
                  <SolutionCard key={solution.id} solution={solution} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specialized-assessments">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {specializedAssessments.map((solution) => (
                  <SolutionCard key={solution.id} solution={solution} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="internal-risk-assessments">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {internalRiskAssessments.map((solution) => (
                  <SolutionCard key={solution.id} solution={solution} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Industry-Specific Solutions Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Industry-Specific Solutions</h2>
            <p className="mt-4 text-lg text-gray-600">
              Tailored risk management solutions for different types of institutions.
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true, // Enable looping for continuous revolving
            }}
            plugins={[
              Autoplay({
                delay: 3000, // 3 seconds delay
                stopOnInteraction: false, // Keep revolving even if user interacts
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {industrySolutions.map((solution, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <IndustrySolutionCard solution={solution} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Risk Management?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations leveraging RiskGuard AI for intelligent, efficient, and comprehensive risk
              and compliance management.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/auth/register" asChild>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/help-center" asChild>
                <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white hover:text-blue-600 px-8 py-3">
                  <LifeBuoy className="mr-2 h-5 w-5" />
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
