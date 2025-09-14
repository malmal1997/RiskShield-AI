"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowLeft, // Added ArrowLeft for back button
  Check, // For approve button
  X, // For reject button
  History, // For versions
  RefreshCw, // Fixed: Added RefreshCw import
  Loader2, // Fixed: Added Loader2 import
  AlertTriangle, // Fixed: Added AlertTriangle import
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator"; // Fixed: Added Separator import
import { Label } from "@/components/ui/label"; // Fixed: Added Label import
import { Textarea } from "@/components/ui/textarea"; // Fixed: Added Textarea import
import {
  getPolicies,
  deletePolicy,
  getPolicyVersions,
  approvePolicy,
  rejectPolicy,
  createPolicyVersion,
  updatePolicy,
} from "@/lib/policy-service"; // Assuming these service functions exist
import type { Policy, PolicyVersion } from "@/lib/supabase"; // Import Policy and PolicyVersion types

export default function PolicyLibrary() {
  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Viewing sample policies. Sign up to create and manage your policy library."
    >
      <PolicyLibraryContent />
    </AuthGuard>
  )
}

function PolicyLibraryContent() {
  const { user, role, loading: authLoading, isDemo } = useAuth()
  const { toast } = useToast()

  const [policies, setPolicies] = useState<Policy[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [showVersionsModal, setShowVersionsModal] = useState(false)
  const [policyVersions, setPolicyVersions] = useState<PolicyVersion[]>([])
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [newVersionContent, setNewVersionContent] = useState<string>("");
  const [newVersionNumber, setNewVersionNumber] = useState<string>("");

  const isAdmin = role?.role === "admin" || isDemo;

  const loadPolicies = async () => {
    if (!user && !isDemo) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getPolicies();
      if (fetchError) {
        throw new Error(fetchError);
      }
      setPolicies(data || []);
    } catch (err: any) {
      console.error("Error fetching policies:", err);
      setError(err.message || "Failed to fetch policies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadPolicies();
    }
  }, [authLoading, user, isDemo]);

  useEffect(() => {
    let filtered = policies;

    if (searchTerm) {
      filtered = filtered.filter(
        (policy) =>
          policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((policy) => policy.status === statusFilter);
    }

    setFilteredPolicies(filtered);
  }, [searchTerm, statusFilter, policies]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "draft":
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "draft":
        return <Edit3 className="h-4 w-4 text-gray-600" />;
      case "pending_review":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const handleDownloadPolicy = (policy: Policy) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy download is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    // Access the full content from the policy object
    const policyContent = policy.content as any; // Cast to any to access sections

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charSet="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${policyContent.title} - ${policyContent.companyName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 8px; }
        h1 { color: #1e40af; text-align: center; margin-bottom: 20px; }
        h2 { color: #1e40af; border-bottom: 2px solid #e0e7ff; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; }
        h3 { color: #3b82f6; margin-top: 20px; margin-bottom: 10px; }
        p { margin-bottom: 10px; }
        ul { list-style-type: disc; margin-left: 20px; margin-bottom: 10px; }
        li { margin-bottom: 5px; }
        .meta-info { background: #f0f8ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; font-size: 0.9em; }
        .meta-info p { margin: 0; }
        .disclaimer { background: #fffbe6; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 30px; font-size: 0.85em; color: #92400e; }
    </style>
</head>
<body>
    <div className="container">
        <h1>${policyContent.title}</h1>
        <div className="meta-info">
            <p><strong>Company:</strong> ${policyContent.companyName}</p>
            <p><strong>Institution Type:</strong> ${policyContent.institutionType}</p>
            <p><strong>Effective Date:</strong> ${policyContent.effectiveDate}</p>
            <p><strong>Next Review Date:</strong> ${policyContent.nextReviewDate}</p>
            <p><strong>Status:</strong> ${policy.status}</p>
            <p><strong>Version:</strong> ${policy.current_version}</p>
        </div>

        ${policyContent.sections
          .map(
            (section: any) => `
            <h2>SECTION ${section.number}: ${section.title}</h2>
            <p>${section.content}</p>
            ${
              section.items
                ? `<ul>${section.items.map((item: string) => `<li>${item}</li>`).join("")}</ul>`
                : ""
            }
        `,
          )
          .join("")}

        <div className="disclaimer">
            <h3>Disclaimer:</h3>
            <p>This policy document is a template generated by RiskShield AI. It is intended for informational purposes only and should be reviewed, customized, and approved by qualified legal and compliance professionals to ensure it meets your organization's specific needs and all applicable regulatory requirements. RiskShield AI is not responsible for any legal or compliance implications arising from the use of this template.</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${policy.title.replace(/\s+/g, "_")}_${policy.company_name.replace(/\s+/g, "_")}_v${policy.current_version}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Policy Downloaded!",
      description: `"${policy.title}" (v${policy.current_version}) has been downloaded.`,
    });
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy deletion is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this policy? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { success, error: deleteError } = await deletePolicy(policyId);
      if (deleteError) {
        throw new Error(deleteError);
      }
      if (success) {
        toast({
          title: "Policy Deleted!",
          description: "The policy has been successfully deleted.",
        });
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error deleting policy:", err);
      toast({
        title: "Deletion Failed",
        description: err.message || "Failed to delete policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprovePolicy = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy approval is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can approve policies.",
        variant: "destructive",
      });
      return;
    }

    setIsApproving(true);
    try {
      const { success, error: approveError } = await approvePolicy(policyId, user?.id || null);
      if (approveError) {
        throw new Error(approveError);
      }
      if (success) {
        toast({
          title: "Policy Approved!",
          description: "The policy has been approved and is now active.",
        });
        setShowPolicyModal(false);
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error approving policy:", err);
      toast({
        title: "Approval Failed",
        description: err.message || "Failed to approve policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectPolicy = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy rejection is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can reject policies.",
        variant: "destructive",
      });
      return;
    }

    setIsRejecting(true);
    try {
      const { success, error: rejectError } = await rejectPolicy(policyId, user?.id || null);
      if (rejectError) {
        throw new Error(rejectError);
      }
      if (success) {
        toast({
          title: "Policy Rejected!",
          description: "The policy has been rejected and returned to draft status.",
        });
        setShowPolicyModal(false);
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error rejecting policy:", err);
      toast({
        title: "Rejection Failed",
        description: err.message || "Failed to reject policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRequestReview = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Requesting review is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedPolicy) return;

    try {
      const { success, error: updateError } = await updatePolicy(policyId, {
        approval_status: 'pending_review',
        status: 'pending_review',
      });
      if (updateError) {
        throw new Error(updateError);
      }
      if (success) {
        toast({
          title: "Review Requested!",
          description: "The policy has been sent for review.",
        });
        setShowPolicyModal(false);
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error requesting review:", err);
      toast({
        title: "Request Failed",
        description: err.message || "Failed to request review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadVersions = async (policyId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Policy versions are not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { data, error: versionsError } = await getPolicyVersions(policyId);
      if (versionsError) {
        throw new Error(versionsError);
      }
      setPolicyVersions(data || []);
      setShowVersionsModal(true);
    } catch (err: any) {
      console.error("Error loading policy versions:", err);
      toast({
        title: "Error Loading Versions",
        description: err.message || "Failed to load policy versions.",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewVersion = async () => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Creating new versions is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedPolicy || !newVersionContent || !newVersionNumber) return;

    setIsSavingVersion(true);
    try {
      const { data, error: versionError } = await createPolicyVersion(
        selectedPolicy.id,
        newVersionNumber,
        JSON.parse(newVersionContent), // Assuming content is JSON string
        user?.id || null
      );
      if (versionError) {
        throw new Error(versionError);
      }
      if (data) {
        // Update the main policy to reflect the new current version and draft status
        await updatePolicy(selectedPolicy.id, {
          current_version: newVersionNumber,
          content: JSON.parse(newVersionContent),
          status: 'draft',
          approval_status: 'draft',
          updated_at: new Date().toISOString(),
        });

        toast({
          title: "New Version Created!",
          description: `Policy "${selectedPolicy.title}" updated to v${newVersionNumber} and set to draft.`,
        });
        setShowVersionsModal(false);
        setShowPolicyModal(false);
        await loadPolicies();
      }
    } catch (err: any) {
      console.error("Error creating new version:", err);
      toast({
        title: "Version Creation Failed",
        description: err.message || "Failed to create new version. Ensure content is valid JSON.",
        variant: "destructive",
      });
    } finally {
      setIsSavingVersion(false);
    }
  };

  const getPolicyStats = () => {
    const total = policies.length;
    const approved = policies.filter((p) => p.status === "approved").length;
    const drafts = policies.filter((p) => p.status === "draft").length;
    const expired = policies.filter((p) => p.status === "expired").length;
    const pendingReview = policies.filter((p) => p.status === "pending_review").length;

    return { total, approved, drafts, expired, pendingReview };
  };

  const stats = getPolicyStats();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading policies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Policies</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Policy Management</Badge>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Policy Library
              <br />
              <span className="text-blue-600">Manage Your Saved Policies</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Access, review, and manage all your organization's policies in one centralized location. Track approval
              status, review dates, and maintain compliance documentation.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/policy-generator">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Policy
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Total Policies</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-600 mt-1">Approved</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-600">{stats.drafts}</div>
                <div className="text-sm text-gray-600 mt-1">Drafts</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</div>
                <div className="text-sm text-gray-600 mt-1">Pending Review</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-red-600">{stats.expired}</div>
                <div className="text-sm text-gray-600 mt-1">Expired</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search policies..."
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
                    <option value="approved">Approved</option>
                    <option value="draft">Draft</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <Button onClick={loadPolicies} disabled={loading} variant="outline">
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Policies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(policy.status)}
                      <CardTitle className="text-lg">{policy.title}</CardTitle>
                    </div>
                    {getStatusBadge(policy.status)}
                  </div>
                  <CardDescription className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>{policy.company_name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{policy.description}</p>

                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {new Date(policy.created_date).toLocaleDateString()}</span>
                    </div>
                    {policy.approved_at && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3" />
                        <span>Approved: {new Date(policy.approved_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {policy.next_review_date && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>Review Due: {new Date(policy.next_review_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {policy.approved_by && (
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>
                          Approved by: {policy.approved_by} ({policy.approver_role})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      v{policy.current_version}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewPolicy(policy)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadPolicy(policy)}>
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePolicy(policy.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first policy."}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/policy-generator">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Policy
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Policy Details Modal */}
      {showPolicyModal && selectedPolicy && (
        <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>{selectedPolicy.title}</span>
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>{selectedPolicy.company_name}</span>
                  {getApprovalStatusBadge(selectedPolicy.approval_status)}
                  <Badge variant="outline">v{selectedPolicy.current_version}</Badge>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4 pr-4 -mr-4"> {/* Added overflow-y-auto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Policy Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Institution Type:</span> {selectedPolicy.institution_type}
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span> {selectedPolicy.status}
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>{" "}
                      {new Date(selectedPolicy.created_date).toLocaleDateString()}
                    </div>
                    {selectedPolicy.next_review_date && (
                      <div>
                        <span className="text-gray-600">Next Review:</span>{" "}
                        {new Date(selectedPolicy.next_review_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {selectedPolicy.approved_by && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Approval Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Approved by:</span> {selectedPolicy.approved_by}
                      </div>
                      <div>
                        <span className="text-gray-600">Role:</span> {selectedPolicy.approver_role}
                      </div>
                      <div>
                        <span className="text-gray-600">Approved on:</span>{" "}
                        {new Date(selectedPolicy.approved_at!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedPolicy.description}</p>
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Policy Content (v{selectedPolicy.current_version})</span>
              </h3>
              <ScrollArea className="h-[300px] rounded-md border p-4 bg-gray-50">
                <div className="text-sm text-gray-700 space-y-3">
                  {(selectedPolicy.content as any)?.sections?.map((section: any) => (
                    <div key={section.number}>
                      <h4 className="font-semibold text-gray-800">
                        SECTION {section.number}: {section.title}
                      </h4>
                      <p>{section.content}</p>
                      {section.items && (
                        <ul className="list-disc pl-5">
                          {section.items.map((item: string) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )) || <p>No content available for this policy.</p>}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 pt-4 border-t">
              <div className="flex space-x-2 mb-2 sm:mb-0">
                <Button variant="outline" onClick={() => handleDownloadPolicy(selectedPolicy)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => handleLoadVersions(selectedPolicy.id)}>
                  <History className="mr-2 h-4 w-4" />
                  View Versions
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/policy-editor/${selectedPolicy.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>
              <div className="flex space-x-2">
                {isAdmin && selectedPolicy.approval_status === 'pending_review' && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprovePolicy(selectedPolicy.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectPolicy(selectedPolicy.id)}
                      disabled={isRejecting}
                    >
                      {isRejecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                      Reject
                    </Button>
                  </>
                )}
                {selectedPolicy.approval_status === 'draft' && (
                  <Button onClick={() => handleRequestReview(selectedPolicy.id)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Request Review
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => handleDeletePolicy(selectedPolicy.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Policy Versions Modal */}
      {showVersionsModal && selectedPolicy && (
        <Dialog open={showVersionsModal} onOpenChange={setShowVersionsModal}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <History className="h-6 w-6 text-blue-600" />
                <span>Versions for "{selectedPolicy.title}"</span>
              </DialogTitle>
              <DialogDescription>
                Review past versions of this policy.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4 pr-4 -mr-4">
              {policyVersions.length > 0 ? (
                <div className="space-y-4">
                  {policyVersions.map((version) => (
                    <Card key={version.id} className="border-l-4 border-l-gray-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Version {version.version_number}</h4>
                          <Badge variant="outline">
                            Created: {new Date(version.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">
                          Created by: {version.created_by || "System"}
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Eye className="mr-2 h-4 w-4" />
                          View Content
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No previous versions found.</p>
              )}
              <Separator className="my-6" />
              <h3 className="text-lg font-semibold mb-4">Create New Version</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-version-number">New Version Number</Label>
                  <Input
                    id="new-version-number"
                    value={newVersionNumber}
                    onChange={(e) => setNewVersionNumber(e.target.value)}
                    placeholder="e.g., 1.1, 2.0"
                  />
                </div>
                <div>
                  <Label htmlFor="new-version-content">New Version Content (JSON)</Label>
                  <Textarea
                    id="new-version-content"
                    value={newVersionContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewVersionContent(e.target.value)}
                    rows={10}
                    placeholder="Paste the full JSON content of the new policy version here."
                  />
                </div>
                <Button
                  onClick={handleCreateNewVersion}
                  disabled={isSavingVersion || !newVersionContent || !newVersionNumber}
                >
                  {isSavingVersion ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create & Set as Current
                </Button>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
              <p>&copy; 2025 RiskShield AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}