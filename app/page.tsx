import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Shield, FileText, BadgeCheck, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import { MainNavigation } from "@/components/main-navigation"

export default function RiskGuardLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <MainNavigation showAuthButtons={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-100 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-blue-600 sm:text-5xl md:text-6xl">
              AI-Powered Risk Assessment
              <br />
              <span className="text-blue-600">for All Organizations</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Comprehensive regulatory compliance solutions with advanced AI
              <br />
              analytics for cybersecurity, business continuity, and third-party risk
              <br />
              management across all industries.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Create Account - Free
                </Button>
              </Link>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                View Platform Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • Setup in minutes • Multi-framework compliant
            </p>
          </div>
        </div>
      </section>

      {/* Experience the Platform Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-600">Experience the Platform</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Dashboard */}
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Client Dashboard</CardTitle>
                </div>
                <CardDescription>
                  Monitor compliance status, track assessment progress, and receive real-time alerts on regulatory
                  requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Real-time compliance tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Risk assessment overview</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Regulatory change notifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Questionnaire */}
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Assessment Questionnaire</CardTitle>
                </div>
                <CardDescription>
                  Streamlined assessment tools covering cybersecurity, business continuity, and compliance requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Cybersecurity questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Business continuity risk audit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Compliance requirements</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis Reports */}
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Risk Analysis Reports</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive automated reports with actionable recommendations and compliance verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Automated risk analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Comprehensive risk reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Actionable advisory statements</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Certifications */}
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Additional Certifications</CardTitle>
                </div>
                <CardDescription>
                  Accepts organizational assessments for SOC 2 Type II, ISO 27001, NIST, and other industry
                  certifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">SOC 2 comprehensive assessments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">ISO 27001 compliance evaluation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">NIST Framework alignment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Risk Assessments */}
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Third-Party Risk Assessments</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive vendor risk evaluation and monitoring with automated assessment distribution and
                  tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Vendor risk questionnaires</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Automated assessment distribution</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Risk scoring and monitoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policy Generator/Manager */}
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Policy Generator/Manager</CardTitle>
                </div>
                <CardDescription>
                  AI-powered policy creation and management system with regulatory compliance templates and version
                  control.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">AI-powered policy generation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Regulatory compliance templates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Version control and tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-600">Get Started in 3 Simple Steps</h2>
            <p className="mt-4 text-lg text-gray-600">Join hundreds of organizations already using RiskGuard AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Register Your Institution</h3>
              <p className="text-gray-600">
                Complete our simple registration form with your institution details. Takes less than 5 minutes.
              </p>
              <Link href="/auth/register" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Start Registration →
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Approval</h3>
              <p className="text-gray-600">
                Our team reviews your application and sets up your secure account within 1-2 business days.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Assessing</h3>
              <p className="text-gray-600">
                Log in to your dashboard and begin conducting comprehensive risk assessments immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Financial Institutions */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-600">Trusted by Organizations Worldwide</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600 mt-2">Organizations served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">10,000+</div>
              <div className="text-sm text-gray-600 mt-2">Risk assessments completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-gray-600 mt-2">Compliance success rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">75%</div>
              <div className="text-sm text-gray-600 mt-2">Time reduction in assessments</div>
            </div>
          </div>

          {/* Partner Logos */}
          <div className="flex items-center justify-center space-x-4 opacity-60 flex-wrap gap-4">
            <Badge variant="outline" className="px-3 py-2 text-sm font-semibold">
              SOC 2
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-sm font-semibold">
              ISO 27001
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-sm font-semibold">
              NIST
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-sm font-semibold">
              HIPAA
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-sm font-semibold">
              GDPR
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-sm font-semibold">
              FDIC
            </Badge>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Strengthen Your Risk Management?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations using RiskGuard AI to maintain compliance and mitigate risks with
              confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Schedule Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-white underline hover:no-underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
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
  )
}