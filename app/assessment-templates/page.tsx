"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Eye,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-context";
import { getAssessmentTemplates, deleteAssessmentTemplate } from "@/lib/assessment-service";
import type { AssessmentTemplate } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function AssessmentTemplatesPage() {
  return (
    <AuthGuard>
      <AssessmentTemplatesContent />
    </AuthGuard>
  );
}

function AssessmentTemplatesContent() {
  const { user, role, loading: authLoading, isDemo } = useAuth();
  const { toast } = useToast();

  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<AssessmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const isAdmin = role?.role === "admin" || isDemo;

  const loadTemplates = async () => {
    if (!isAdmin) {
      setError("You do not have administrative privileges to view this page.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getAssessmentTemplates();
      if (fetchError) {
        throw new Error(fetchError);
      }
      setTemplates(data || []);
    } catch (err: any) {
      console.error("Error fetching assessment templates:", err);
      setError(err.message || "Failed to fetch assessment templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadTemplates();
    }
  }, [authLoading, isAdmin]);

  useEffect(() => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((template) => template.status === statusFilter);
    }

    setFilteredTemplates(filtered);
  }, [searchTerm, statusFilter, templates]);

  const handleDeleteTemplate = async (templateId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Template deletion is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(templateId);
    try {
      const { success, error: deleteError } = await deleteAssessmentTemplate(templateId);
      if (deleteError) {
        throw new Error(deleteError);
      }
      if (success) {
        toast({
          title: "Template Deleted!",
          description: "The assessment template has been successfully deleted.",
        });
        await loadTemplates();
      }
    } catch (err: any) {
      console.error("Error deleting template:", err);
      toast({
        title: "Deletion Failed",
        description: err.message || "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "archived":
        return <Badge className="bg-yellow-100 text-yellow-800">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading assessment templates...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Settings
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessment Templates</h1>
              <p className="mt-2 text-gray-600">Create and manage custom assessment templates for your organization.</p>
            </div>
          </div>
          <Link href="/assessment-templates/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Template
            </Button>
          </Link>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center space-x-3 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <Button onClick={loadTemplates} disabled={loading} variant="outline">
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredTemplates.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Assessment Templates Found</h2>
              <p className="text-gray-600">Create your first custom assessment template.</p>
              <Link href="/assessment-templates/create">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {filteredTemplates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {getStatusBadge(template.status)}
                  </div>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Type: {template.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <Link href={`/assessment-templates/${template.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      disabled={isDeleting === template.id}
                    >
                      {isDeleting === template.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}