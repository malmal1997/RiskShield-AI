"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Plus,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-context";
import { createAssessmentTemplate } from "@/lib/assessment-service";
import type { AssessmentTemplate } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateAssessmentTemplatePage() {
  return (
    <AuthGuard>
      <CreateAssessmentTemplateContent />
    </AuthGuard>
  );
}

function CreateAssessmentTemplateContent() {
  const { loading: authLoading, isDemo, hasPermission } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    type: "",
    status: "draft" as AssessmentTemplate['status'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManageTemplates = hasPermission("manage_assessment_templates");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Template creation is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!canManageTemplates) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to create assessment templates.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await createAssessmentTemplate(templateForm);
      if (createError) {
        throw new Error(createError);
      }
      if (data) {
        toast({
          title: "Template Created!",
          description: `Template "${data.name}" has been successfully created.`,
        });
        router.push(`/assessment-templates/${data.id}/edit`);
      }
    } catch (err: any) {
      console.error("Error creating template:", err);
      setError(err.message || "Failed to create template. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!canManageTemplates) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/assessment-templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Templates
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Template</h1>
              <p className="mt-2 text-gray-600">Define a new assessment template for your organization.</p>
            </div>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center space-x-3 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Template Details</span>
            </CardTitle>
            <CardDescription>Provide basic information for your new assessment template.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={templateForm.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g., Annual Cybersecurity Review"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={templateForm.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  placeholder="A brief description of what this template assesses."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="type">Template Type *</Label>
                <Select
                  value={templateForm.type}
                  onValueChange={(value: string) => setTemplateForm({ ...templateForm, type: value })}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="data-privacy">Data Privacy</SelectItem>
                    <SelectItem value="third-party">Third-Party Risk</SelectItem>
                    <SelectItem value="business-continuity">Business Continuity</SelectItem>
                    <SelectItem value="operational-risk">Operational Risk</SelectItem>
                    <SelectItem value="soc-compliance">SOC Compliance</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={templateForm.status}
                  onValueChange={(value: AssessmentTemplate['status']) => setTemplateForm({ ...templateForm, status: value })}
                  required
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Template
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}