"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainNavigation } from "@/components/main-navigation"
import { Shield, Mail, Phone, MessageSquare, Send, CheckCircle, Bot } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AIChatbot } from "@/src/components/AIChatbot";
import { AppFooter } from "@/components/app-footer"; // Import AppFooter

export default function HelpCenterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    assessmentId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false) // New state to control form visibility
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSubmitted(false)

    try {
      // Simulate API call to send support request
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Support request submitted:", formData)

      toast({
        title: "Support Request Sent!",
        description: "We've received your message and will get back to you shortly.",
      })

      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        assessmentId: "",
      })
      setShowContactForm(false); // Hide form after submission
    } catch (error) {
      console.error("Error submitting support request:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send your support request. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAiCannotHelp = () => {
    setShowContactForm(true);
    toast({
      title: "Contact Support",
      description: "Please fill out the form below to submit a support ticket.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNavigation showAuthButtons={true} />

      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              RiskGuard AI Help Center
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Get instant answers from our AI assistant or submit a support ticket.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* AI Chatbot Section - Always visible */}
          <div className="mb-12">
            <AIChatbot onAiCannotHelp={handleAiCannotHelp} />
          </div>

          {/* Contact Support Form - Conditionally visible */}
          {showContactForm && (
            <div className="mt-12">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                    <span>Submit a Support Ticket</span>
                  </CardTitle>
                  <CardDescription>
                    Our team will get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                      <p className="text-gray-600">Your message has been sent. We appreciate your patience.</p>
                      <Button onClick={() => setIsSubmitted(false)} className="mt-6">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Your Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Your Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john.doe@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Regarding my recent assessment"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="assessmentId">Assessment ID (Optional)</Label>
                        <Input
                          id="assessmentId"
                          value={formData.assessmentId}
                          onChange={handleInputChange}
                          placeholder="e.g., assessment-123456789"
                          className="font-mono"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          If your inquiry is about a specific assessment, please provide its ID.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="message">Your Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Describe your issue or question in detail..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Send className="mr-2 h-4 w-4 animate-pulse" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="w-full mt-2" onClick={() => setShowContactForm(false)}>
                        Cancel
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other Ways to Get Help */}
          <div className="mt-12 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Other Ways to Get Help</h2>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <Mail className="h-6 w-6 text-blue-600" />
                <a href="mailto:support@riskguard.ai" className="text-lg text-blue-600 hover:underline">
                  support@riskguard.ai
                </a>
              </div>
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <Phone className="h-6 w-6 text-blue-600" />
                <a href="tel:+15551234567" className="text-lg text-blue-600 hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <span className="text-lg text-blue-600">Live Chat (Coming Soon)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppFooter />
    </div>
  );
}
