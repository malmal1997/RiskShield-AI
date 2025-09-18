"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Plus,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Save,
  Trash2,
  Edit,
  MoveUp,
  MoveDown,
  Copy,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-context";
import {
  getAssessmentTemplateById,
  updateAssessmentTemplate,
  getTemplateQuestions,
  createTemplateQuestion,
  updateTemplateQuestion,
  deleteTemplateQuestion,
} from "@/lib/assessment-service";
import type { AssessmentTemplate, TemplateQuestion } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"; // Added Badge import

export default function EditAssessmentTemplatePage() {
  return (
    <AuthGuard>
      <EditAssessmentTemplateContent />
    </AuthGuard>
  );
}

function EditAssessmentTemplateContent() {
  const params = useParams();
  const router = useRouter();
  const { role, loading: authLoading, isDemo } = useAuth();
  const { toast } = useToast();

  // Add null check for params
  const templateId = params?.id as string;

  const [template, setTemplate] = useState<AssessmentTemplate | null>(null);
  const [questions, setQuestions] = useState<TemplateQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState<string | null>(null); // For individual question save
  const [isDeletingQuestion, setIsDeletingQuestion] = useState<string | null>(null); // For individual question delete
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [newQuestionForm, setNewQuestionForm] = useState<Partial<TemplateQuestion>>({
    question_text: "",
    question_type: "boolean",
    options: [],
    weight: 1,
    category: "",
    order: 0,
    required: false,
  });
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const isAdmin = role?.role === "admin" || isDemo;

  const loadTemplateData = async () => {
    if (!isAdmin) {
      setError("You do not have administrative privileges to view this page.");
      setLoading(false);
      return;
    }

    if (!templateId) { // Ensure templateId exists before fetching
      setError("Template ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: templateData, error: templateError } = await getAssessmentTemplateById(templateId);
      if (templateError) {
        throw new Error(templateError);
      }
      if (!templateData) {
        setError("Template not found.");
        setLoading(false);
        return;
      }
      setTemplate(templateData);

      const { data: questionsData, error: questionsError } = await getTemplateQuestions(templateId);
      if (questionsError) {
        throw new Error(questionsError);
      }
      setQuestions(questionsData || []);
    } catch (err: any) {
      console.error("Error loading template data:", err);
      setError(err.message || "Failed to load template data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && templateId) {
      loadTemplateData();
    }
  }, [authLoading, templateId, isAdmin]);

  const handleTemplateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Template updates are not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!template) return;

    setIsSavingTemplate(true);
    try {
      const { data, error: updateError } = await updateAssessmentTemplate(template.id, {
        name: template.name,
        description: template.description,
        type: template.type,
        status: template.status,
      });
      if (updateError) {
        throw new Error(updateError);
      }
      if (data) {
        setTemplate(data);
        toast({
          title: "Template Updated!",
          description: "Template details have been saved.",
        });
      }
    } catch (err: any) {
      console.error("Error updating template:", err);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Question creation is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!template) return;

    setIsSavingQuestion("new");
    try {
      const newOrder = questions.length > 0 ? Math.max(...questions.map((q: TemplateQuestion) => q.order)) + 1 : 1;
      const questionToCreate = {
        ...newQuestionForm,
        template_id: template.id,
        order: newOrder,
        options: newQuestionForm.options && newQuestionForm.options.length > 0 ? newQuestionForm.options : null,
      } as Omit<TemplateQuestion, 'id' | 'created_at' | 'updated_at'>;

      const { data, error: createError } = await createTemplateQuestion(questionToCreate);
      if (createError) {
        throw new Error(createError);
      }
      if (data) {
        toast({
          title: "Question Added!",
          description: "New question has been added to the template.",
        });
        setQuestions((prev: TemplateQuestion[]) => [...prev, data]);
        setShowAddQuestionForm(false);
        setNewQuestionForm({
          question_text: "",
          question_type: "boolean",
          options: [],
          weight: 1,
          category: "",
          order: 0,
          required: false,
        });
      }
    } catch (err: any) {
      console.error("Error adding question:", err);
      toast({
        title: "Add Question Failed",
        description: err.message || "Failed to add question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingQuestion(null);
    }
  };

  const handleUpdateQuestion = async (question: TemplateQuestion) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Question updates are not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    setIsSavingQuestion(question.id);
    try {
      const updates = {
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options && question.options.length > 0 ? question.options : null,
        weight: question.weight,
        category: question.category,
        order: question.order,
        required: question.required,
      };
      const { data, error: updateError } = await updateTemplateQuestion(question.id, updates);
      if (updateError) {
        throw new Error(updateError);
      }
      if (data) {
        setQuestions((prev: TemplateQuestion[]) => prev.map((q: TemplateQuestion) => (q.id === data.id ? data : q)));
        toast({
          title: "Question Updated!",
          description: "Question details have been saved.",
        });
        setEditingQuestionId(null); // Exit editing mode
      }
    } catch (err: any) {
      console.error("Error updating question:", err);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingQuestion(null);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Question deletion is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }

    setIsDeletingQuestion(questionId);
    try {
      const { success, error: deleteError } = await deleteTemplateQuestion(questionId);
      if (deleteError) {
        throw new Error(deleteError);
      }
      if (success) {
        toast({
          title: "Question Deleted!",
          description: "Question has been removed from the template.",
        });
        setQuestions((prev: TemplateQuestion[]) => prev.filter((q: TemplateQuestion) => q.id !== questionId));
      }
    } catch (err: any) {
      console.error("Error deleting question:", err);
      toast({
        title: "Deletion Failed",
        description: err.message || "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingQuestion(null);
    }
  };

  const handleMoveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const index = questions.findIndex((q: TemplateQuestion) => q.id === questionId);
    if (index === -1) return;

    const newQuestions = [...questions];
    const questionToMove = newQuestions[index];

    if (direction === 'up' && index > 0) {
      const prevQuestion = newQuestions[index - 1];
      newQuestions[index] = { ...prevQuestion, order: questionToMove.order };
      newQuestions[index - 1] = { ...questionToMove, order: prevQuestion.order };
    } else if (direction === 'down' && index < newQuestions.length - 1) {
      const nextQuestion = newQuestions[index + 1];
      newQuestions[index] = { ...nextQuestion, order: questionToMove.order };
      newQuestions[index + 1] = { ...questionToMove, order: nextQuestion.order };
    } else {
      return; // Cannot move further
    }

    // Sort by new order values
    newQuestions.sort((a, b) => a.order - b.order);
    setQuestions(newQuestions);

    // Optionally, save the new order to the database
    // This would involve iterating through newQuestions and calling updateTemplateQuestion for each changed order
    // For simplicity, we'll skip immediate DB update for order changes in this demo.
    toast({
      title: "Question Order Changed",
      description: "Remember to save the template to persist order changes.",
    });
  };

  const handleDuplicateQuestion = (question: TemplateQuestion) => {
    const newOrder = questions.length > 0 ? Math.max(...questions.map((q: TemplateQuestion) => q.order)) + 1 : 1;
    const duplicatedQuestion: Partial<TemplateQuestion> = {
      ...question,
      id: undefined, // Let DB generate new ID
      question_text: `${question.question_text} (Copy)`,
      order: newOrder,
      created_at: undefined,
      updated_at: undefined,
    };
    setNewQuestionForm(duplicatedQuestion);
    setShowAddQuestionForm(true);
    toast({
      title: "Question Duplicated",
      description: "Review and save the duplicated question.",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading template...</p>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Template</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link href="/assessment-templates">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Templates
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!template) {
    return null; // Should not happen if error is handled
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/assessment-templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Templates
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Template: {template.name}</h1>
              <p className="mt-2 text-gray-600">Manage template details and questions.</p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Template Details</span>
            </CardTitle>
            <CardDescription>Update basic information for this assessment template.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTemplateUpdate} className="space-y-6">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={template.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplate({ ...template, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={template.description || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTemplate({ ...template, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="type">Template Type *</Label>
                <Select
                  value={template.type}
                  onValueChange={(value: string) => setTemplate({ ...template, type: value })}
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
                  value={template.status}
                  onValueChange={(value: AssessmentTemplate['status']) => setTemplate({ ...template, status: value })}
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
                <Button type="submit" disabled={isSavingTemplate}>
                  {isSavingTemplate ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Template Details
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Template Questions</span>
            </CardTitle>
            <CardDescription>Add, edit, and reorder questions for this template.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowAddQuestionForm(!showAddQuestionForm)} className="mb-4">
              <Plus className="mr-2 h-4 w-4" />
              {showAddQuestionForm ? "Hide Add Question Form" : "Add New Question"}
            </Button>

            {showAddQuestionForm && (
              <div className="border p-4 rounded-lg mb-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">
                  {editingQuestionId ? "Edit Question" : "Add New Question"}
                </h3>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div>
                    <Label htmlFor="new-question-text">Question Text *</Label>
                    <Input
                      id="new-question-text"
                      value={newQuestionForm.question_text || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuestionForm({ ...newQuestionForm, question_text: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-question-category">Category</Label>
                    <Input
                      id="new-question-category"
                      value={newQuestionForm.category || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuestionForm({ ...newQuestionForm, category: e.target.value })}
                      placeholder="e.g., Data Protection, Access Control"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-question-type">Question Type *</Label>
                    <Select
                      value={newQuestionForm.question_type || "boolean"}
                      onValueChange={(value: TemplateQuestion['question_type']) =>
                        setNewQuestionForm({ ...newQuestionForm, question_type: value, options: [] })
                      }
                      required
                    >
                      <SelectTrigger id="new-question-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                        <SelectItem value="multiple">Multiple Choice</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="tested">Tested/Not Tested</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(newQuestionForm.question_type === "multiple") && (
                    <div>
                      <Label htmlFor="new-question-options">Options (comma-separated)</Label>
                      <Input
                        id="new-question-options"
                        value={(newQuestionForm.options as string[] | undefined)?.join(", ") || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewQuestionForm({ ...newQuestionForm, options: e.target.value.split(",").map((s: string) => s.trim()) })
                        }
                        placeholder="Option 1, Option 2, Option 3"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-question-required"
                      checked={newQuestionForm.required || false}
                      onCheckedChange={(checked: boolean) => setNewQuestionForm({ ...newQuestionForm, required: checked })}
                    />
                    <Label htmlFor="new-question-required">Required</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddQuestionForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSavingQuestion === "new"}>
                      {isSavingQuestion === "new" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Question
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {questions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-10 w-10 mx-auto mb-3" />
                <p>No questions added yet. Click "Add New Question" to get started.</p>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((question: TemplateQuestion, index: number) => (
                <Card key={question.id} className="p-4 border">
                  {editingQuestionId === question.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateQuestion(question);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor={`edit-question-text-${question.id}`}>Question Text *</Label>
                        <Input
                          id={`edit-question-text-${question.id}`}
                          value={question.question_text}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setQuestions((prev: TemplateQuestion[]) =>
                              prev.map((q: TemplateQuestion) => (q.id === question.id ? { ...q, question_text: e.target.value } : q))
                            )
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-question-category-${question.id}`}>Category</Label>
                        <Input
                          id={`edit-question-category-${question.id}`}
                          value={question.category || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setQuestions((prev: TemplateQuestion[]) =>
                              prev.map((q: TemplateQuestion) => (q.id === question.id ? { ...q, category: e.target.value } : q))
                            )
                          }
                          placeholder="e.g., Data Protection, Access Control"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-question-type-${question.id}`}>Question Type *</Label>
                        <Select
                          value={question.question_type}
                          onValueChange={(value: TemplateQuestion['question_type']) =>
                            setQuestions((prev: TemplateQuestion[]) =>
                              prev.map((q: TemplateQuestion) => (q.id === question.id ? { ...q, question_type: value, options: [] } : q))
                            )
                          }
                          required
                        >
                          <SelectTrigger id={`edit-question-type-${question.id}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                            <SelectItem value="multiple">Multiple Choice</SelectItem>
                            <SelectItem value="textarea">Text Area</SelectItem>
                            <SelectItem value="tested">Tested/Not Tested</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {(question.question_type === "multiple") && (
                        <div>
                          <Label htmlFor={`edit-question-options-${question.id}`}>Options (comma-separated)</Label>
                          <Input
                            id={`edit-question-options-${question.id}`}
                            value={(question.options as string[] | undefined)?.join(", ") || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setQuestions((prev: TemplateQuestion[]) =>
                                prev.map((q: TemplateQuestion) =>
                                  q.id === question.id
                                    ? { ...q, options: e.target.value.split(",").map((s: string) => s.trim()) }
                                    : q
                                )
                              )
                            }
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-question-required"
                          checked={question.required || false}
                          onCheckedChange={(checked: boolean) =>
                            setQuestions((prev: TemplateQuestion[]) =>
                              prev.map((q: TemplateQuestion) => (q.id === question.id ? { ...q, required: checked } : q))
                            )
                          }
                        />
                        <Label htmlFor={`edit-question-required-${question.id}`}>Required</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setEditingQuestionId(null)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSavingQuestion === question.id}>
                          {isSavingQuestion === question.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <p className="text-sm text-gray-500 mb-1">
                          {question.category && <Badge variant="outline" className="mr-2">{question.category}</Badge>}
                          <Badge variant="secondary">{question.question_type}</Badge>
                          {question.required && <span className="text-red-500 text-xs ml-2">*Required</span>}
                        </p>
                        <h3 className="font-medium text-gray-900 text-base">
                          {question.order}. {question.question_text}
                        </h3>
                        {question.options && question.options.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Options: {(question.options as string[]).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleMoveQuestion(question.id, 'up')} disabled={index === 0}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleMoveQuestion(question.id, 'down')} disabled={index === questions.length - 1}>
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicateQuestion(question)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingQuestionId(question.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={isDeletingQuestion === question.id}
                        >
                          {isDeletingQuestion === question.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}