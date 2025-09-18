"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox" // Added Checkbox import
import {
  Shield,
  FileText,
  BarChart3,
  Eye,
  Bot,
  Clock,
  Building,
  Lock,
  Server,
  Send,
  Users,
  User,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Download,
  X,
  ArrowRight,
  Upload,
  AlertCircle,
  Check,
  Save,
  Info,
  FileCheck,
  Loader2,
  Copy,
  Edit3,
  Calendar,
  AlertTriangle, // Added AlertTriangle
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Label as ShadcnLabel } from "@/components/ui/label"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { sendAssessmentEmail } from "@/app/third-party-assessment/email-service"
import Link from "next/link"
import { Input as ShadcnInput } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { saveAiAssessmentReport, getAssessmentTemplates, getTemplateQuestions } from "@/lib/assessment-service"
import type { AssessmentTemplate, TemplateQuestion } from "@/lib/supabase";
import { useRouter } from "next/navigation"

interface BuiltInQuestion {
  id: string;
  category: string;
  question: string;
  type: "boolean" | "multiple" | "tested" | "textarea" | "checkbox"; // Added "checkbox"
  options?: string[];
  weight?: number;
  required?: boolean;
}

interface BuiltInAssessmentCategory {
  id: string;
  name: string;
  description: string;
  icon: any; // Using 'any' for LucideIcon type for simplicity
  questions: BuiltInQuestion[];
}

// Assessment categories and questions (now default/built-in templates)
const assessmentCategories: BuiltInAssessmentCategory[] = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Evaluate your organization's cybersecurity posture and controls",
    icon: Shield,
    questions: [
      {
        id: "cs1",
        category: "Security Policies",
        question: "Does your organization have a formal information security policy?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "cs2",
        category: "Security Training",
        question: "How often do you conduct cybersecurity training for employees?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs3",
        category: "Access Control",
        question: "Do you have multi-factor authentication implemented for all critical systems?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "cs4",
        category: "Vulnerability Management",
        question: "How frequently do you perform vulnerability assessments?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs5",
        category: "Incident Response",
        question: "Do you have an incident response plan in place?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "cyb_1",
        category: "Incident Response",
        question: "Have you experienced a data breach or cybersecurity incident in the last two years?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_2",
        category: "Governance",
        question: "Does your organization have cybersecurity executive oversight?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_3",
        category: "Threat Management",
        question: "Do you actively monitor for evolving threats and vulnerabilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_4",
        category: "Security Training",
        question: "Do you provide phishing education to your employees?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_5",
        category: "Security Training",
        question: "Do you provide general cybersecurity employee training?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_6",
        category: "Security Training",
        question: "Do you assess cybersecurity staff competency?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_7",
        category: "Human Resources",
        question: "Do staff sign NDA/Confidentiality Agreements?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_8",
        category: "Client Management",
        question: "Do you define client cybersecurity responsibilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_9",
        category: "Change Management",
        question: "Do you have change management restrictions in place?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_10",
        category: "Patch Management",
        question: "How often are software and firmware updates applied?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Quarterly", "Monthly", "Continuously"],
        weight: 9,
        required: true,
      },
      {
        id: "cyb_11",
        category: "Access Control",
<dyad-problem-report summary="1255 problems">
<problem file="app/risk-assessment/page.tsx" line="2253" column="6" code="17008">JSX element 'AuthGuard' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="2257" column="8" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="2296" column="10" code="17008">JSX element 'section' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="2297" column="12" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="3040" column="16" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="3041" column="18" code="17008">JSX element 'div' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="3042" column="20" code="17008">JSX element 'h2' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="3060" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3064" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3066" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3068" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3070" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3072" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3074" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3076" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3078" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3080" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3082" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3084" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3086" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3088" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3090" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3092" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3094" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3096" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3098" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3102" column="98" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3104" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3107" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3113" column="97" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3201" column="2" code="17008">JSX element 'dyad-write' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="3243" column="1" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3258" column="5" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3265" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3268" column="5" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3273" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3278" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3284" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3289" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3291" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3297" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3299" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3304" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3306" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3312" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3314" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3319" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3321" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3327" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3329" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3335" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3337" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3343" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3345" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3351" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3353" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3359" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3361" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3367" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3369" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3375" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3377" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3383" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3385" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3391" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3393" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3400" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3402" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3408" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3410" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3416" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3418" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3424" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3426" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3432" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3434" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3440" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3442" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3448" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3450" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3456" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3458" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3464" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3466" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3472" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3474" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3480" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3482" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3488" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3490" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3496" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3498" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3504" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3506" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3512" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3514" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3520" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3522" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3528" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3530" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3536" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3538" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3544" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3546" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3552" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3554" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3560" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3562" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3568" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3570" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3576" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3578" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3585" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3587" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3593" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3595" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3601" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3603" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3609" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3611" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3617" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3619" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3626" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3628" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3634" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3636" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3642" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3644" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3650" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3652" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3658" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3660" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3666" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3668" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3670" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3676" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3681" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3683" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3689" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3691" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3696" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3698" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3704" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3706" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3711" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3713" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3715" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3721" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3726" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3728" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3734" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3736" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3741" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3743" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3749" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3751" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3756" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3758" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3760" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3766" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3772" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3774" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3781" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3783" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3789" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3791" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3798" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3800" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3806" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3808" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3814" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3816" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3822" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3824" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3830" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3832" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3839" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3841" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3847" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3849" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3855" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3857" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3863" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3865" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3871" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3873" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3879" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3881" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3887" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3889" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3895" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3897" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3903" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3905" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3911" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3913" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3919" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3921" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3927" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3929" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3935" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3937" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3943" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3945" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3951" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3953" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3960" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3962" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3968" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3970" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3976" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3978" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3984" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3986" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="3993" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="3995" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4002" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4004" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4011" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4013" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4019" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4021" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4027" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4029" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4031" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4037" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4043" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4045" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4052" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4054" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4060" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4062" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4069" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4071" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4077" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4079" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4085" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4087" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4094" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4096" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4102" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4104" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4106" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4112" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4118" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4120" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4127" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4129" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4135" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4137" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4144" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4146" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4152" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4154" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4160" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4162" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4169" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4171" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4177" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4179" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4185" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4187" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4193" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4195" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4202" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4204" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4210" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4212" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4218" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4220" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4226" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4228" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4234" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4236" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4242" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4244" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4250" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4252" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4258" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4260" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4266" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4268" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4274" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4276" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4282" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4284" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4290" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4292" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4298" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4300" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4306" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4308" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4314" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4316" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4322" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4324" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4330" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4332" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4338" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4340" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4346" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4348" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4354" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4356" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4362" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4364" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4370" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4372" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4378" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4380" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4386" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4388" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4394" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4396" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4402" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4404" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4410" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4412" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4418" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4420" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4426" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4428" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4434" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4436" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4442" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4444" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4450" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4452" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4458" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4460" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4466" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4468" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4474" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4476" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4482" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4484" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4490" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4492" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4494" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4500" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4506" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4508" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4515" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4517" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4523" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4525" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4532" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4534" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4540" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4542" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4548" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4550" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4557" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4559" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4565" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4567" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4573" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4575" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4581" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4583" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4585" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4592" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4599" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4601" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4607" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4609" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4615" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4617" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4623" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4625" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4631" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4635" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4641" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4643" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4649" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4651" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4657" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4659" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4665" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4667" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4673" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4675" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4681" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4683" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4689" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4691" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4697" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4699" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4705" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4707" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4713" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4717" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4723" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4725" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4731" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4733" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4739" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4741" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4747" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4749" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4755" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4759" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4765" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4767" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4773" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4775" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4781" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4783" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4789" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4791" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4797" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4801" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4807" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4809" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4815" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4817" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4823" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4825" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4831" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4835" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4841" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4843" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4849" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4851" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4857" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4859" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4865" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4867" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4873" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4877" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4883" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4885" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4891" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4893" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4899" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4901" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4907" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4911" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4917" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4919" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4925" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4927" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4933" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4937" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4943" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4945" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4951" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4953" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4959" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4963" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4969" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4971" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4977" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4979" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4985" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4987" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="4993" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4995" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="4999" column="5" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5006" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5009" column="10" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5009" column="25" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5009" column="54" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5010" column="34" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5010" column="42" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5011" column="27" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5011" column="35" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5021" column="11" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5022" column="11" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5023" column="7" code="1005">'...' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5023" column="15" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5031" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5031" column="6" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5032" column="3" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5033" column="31" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5034" column="5" code="1005">'...' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5034" column="13" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5040" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5040" column="4" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5041" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5044" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5046" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5049" column="3" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5054" column="67" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5054" column="73" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5055" column="71" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5055" column="77" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5057" column="5" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5058" column="3" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5059" column="75" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5059" column="77" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5061" column="73" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5061" column="79" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5062" column="42" code="17008">JSX element 'Record' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="5063" column="53" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5063" column="59" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5064" column="53" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5064" column="59" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5065" column="45" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5065" column="51" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5069" column="12" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5084" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5085" column="56" code="17008">JSX element 'Record' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="5086" column="76" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5086" column="78" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5087" column="76" code="1003">Identifier expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5087" column="78" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5091" column="17" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5092" column="29" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5093" column="16" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5094" column="32" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5095" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5096" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5098" column="17" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5100" column="5" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5103" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5109" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5110" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5112" column="17" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5130" column="5" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5131" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5133" column="17" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5176" column="5" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5177" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5180" column="50" code="17008">JSX element 'HTMLInputElement' has no corresponding closing tag.</problem>
<problem file="app/risk-assessment/page.tsx" line="5180" column="70" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5181" column="5" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5182" column="7" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5182" column="61" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5184" column="14" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5185" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5186" column="30" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5187" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5188" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5190" column="53" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5194" column="82" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5199" column="6" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5200" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5202" column="44" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5203" column="5" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5208" column="9" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5210" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5213" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5214" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5217" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5218" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5225" column="7" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5226" column="37" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5227" column="44" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5228" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5229" column="72" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5231" column="66" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5231" column="164" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5234" column="15" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5236" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5241" column="9" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5243" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5258" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5260" column="7" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5263" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5264" column="7" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5267" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5268" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5270" column="64" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5274" column="37" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5278" column="33" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5284" column="52" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5285" column="53" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5286" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5288" column="38" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5289" column="5" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5294" column="9" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5296" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5302" column="9" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5304" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5311" column="9" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5313" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5320" column="9" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5326" column="23" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5326" column="50" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5326" column="148" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5332" column="26" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5336" column="9" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5337" column="60" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5338" column="19" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5342" column="9" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5344" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5349" column="31" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5351" column="16" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5354" column="9" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5355" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5356" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5357" column="49" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5363" column="11" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5364" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5365" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5366" column="7" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5367" column="33" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5368" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5369" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5370" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5372" column="53" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5373" column="5" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5374" column="7" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5386" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5387" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5389" column="33" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5390" column="9" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5397" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5400" column="54" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5401" column="5" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5402" column="7" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5403" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5411" column="42" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5412" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5416" column="48" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5417" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5418" column="38" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5419" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5422" column="38" code="1005">'}' expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5423" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5426" column="54" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5432" column="7" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5433" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5437" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="5440" column="5" code="1109">Expression expected.</problem>
<problem file="app/risk-assessment/page.tsx" line="5452" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="6442" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="app/risk-assessment/page.tsx" line="6442" column="2" code="1005">'&lt;/' expected.</problem>
<problem file="app/reports/page.tsx" line="95" column="9" code="2304">Cannot find name 'isDemo'.</problem>
<problem file="app/reports/page.tsx" line="124" column="12" code="2304">Cannot find name 'RefreshCw'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1101" column="9" code="2322">Type '&quot;checkbox&quot;' is not assignable to type '&quot;boolean&quot; | &quot;multiple&quot; | &quot;tested&quot; | &quot;textarea&quot;'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1850" column="21" code="2552">Cannot find name 'useRef'. Did you mean 'user'?</problem>
<problem file="app/risk-assessment/page.tsx" line="2991" column="36" code="2304">Cannot find name 'Checkbox'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3042" column="96" code="2339">Property 'dyad-problem-report' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3043" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3043" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3044" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3044" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3045" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3045" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3046" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3046" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3047" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3047" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3048" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3048" column="149" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3049" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3049" column="156" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3050" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3050" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3051" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3051" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3052" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3052" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3053" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3053" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3054" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3054" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3055" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3055" column="150" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3056" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3056" column="154" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3057" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3057" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3058" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3058" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3059" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3059" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3060" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3060" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3061" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3061" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3062" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3062" column="116" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3063" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3063" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3064" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3064" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3065" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3065" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3066" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3066" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3067" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3067" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3068" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3068" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3069" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3069" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3070" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3070" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3071" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3071" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3072" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3072" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3073" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3073" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3074" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3074" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3075" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3075" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3076" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3076" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3077" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3077" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3078" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3078" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3079" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3079" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3080" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3080" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3081" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3081" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3082" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3082" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3083" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3083" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3084" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3084" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3085" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3085" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3086" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3086" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3087" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3087" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3088" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3088" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3089" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3089" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3090" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3090" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3091" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3091" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3092" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3092" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3093" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3093" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3094" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3094" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3095" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3095" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3096" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3096" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3097" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3097" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3098" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3098" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3099" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3099" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3100" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3100" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3101" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3101" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3102" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3102" column="110" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3103" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3103" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3104" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3104" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3105" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3105" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3106" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3106" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3107" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3107" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3108" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3108" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3109" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3109" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3110" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3110" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3111" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3111" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3112" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3112" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3113" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3113" column="109" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3114" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3114" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3115" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3115" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3116" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3116" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3117" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3117" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3118" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3118" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3119" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3119" column="115" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3120" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3120" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3121" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3121" column="152" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3122" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3122" column="112" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3123" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3123" column="97" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3124" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3124" column="102" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3125" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3125" column="174" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3126" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3126" column="161" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3127" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3127" column="162" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3128" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3128" column="161" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3129" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3129" column="163" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3130" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3130" column="173" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3131" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3131" column="160" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3132" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3132" column="159" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3133" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3133" column="164" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3134" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3134" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3135" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3135" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3136" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3136" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3137" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3137" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3138" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3138" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3139" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3139" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3140" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3140" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3141" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3141" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3142" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3142" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3143" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3143" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3144" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3144" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3145" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3145" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3146" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3146" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3147" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3147" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3148" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3148" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3149" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3149" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3150" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3150" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3151" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3151" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3152" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3152" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3153" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3153" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3154" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3154" column="129" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3155" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3155" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3156" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3156" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3157" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3157" column="158" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3158" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3158" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3159" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3159" column="128" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3160" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3160" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3161" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3161" column="161" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3162" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3162" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3163" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3163" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3164" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3164" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3165" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3165" column="117" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3166" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3166" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3167" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3167" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3168" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3168" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3169" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3169" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3170" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3170" column="119" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3171" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3171" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3172" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3172" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3173" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3173" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3174" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3174" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3175" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3175" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3176" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3176" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3177" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3177" column="125" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3178" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3178" column="133" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3179" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3179" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3180" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3180" column="122" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3181" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3181" column="126" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3182" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3182" column="131" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3183" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3183" column="146" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3184" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3184" column="130" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3185" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3185" column="123" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3186" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3186" column="136" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3187" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3187" column="142" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3188" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3188" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3189" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3189" column="133" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3190" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3190" column="142" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3191" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3191" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3192" column="1" code="2339">Property 'dyad-problem-report' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3201" column="1" code="2339">Property 'dyad-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3204" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3204" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3204" column="31" code="2552">Cannot find name 'useRef'. Did you mean 'user'?</problem>
<problem file="app/risk-assessment/page.tsx" line="3206" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3206" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3206" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3206" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3212" column="10" code="2304">Cannot find name 'Checkbox'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3214" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3245" column="19" code="2749">'ShadcnLabel' refers to a value, but is being used as a type here. Did you mean 'typeof ShadcnLabel'?</problem>
<problem file="app/risk-assessment/page.tsx" line="3246" column="22" code="2749">'ShadcnTextarea' refers to a value, but is being used as a type here. Did you mean 'typeof ShadcnTextarea'?</problem>
<problem file="app/risk-assessment/page.tsx" line="3249" column="19" code="2749">'ShadcnInput' refers to a value, but is being used as a type here. Did you mean 'typeof ShadcnInput'?</problem>
<problem file="app/risk-assessment/page.tsx" line="3250" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3250" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3250" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3250" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3253" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3253" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3254" column="15" code="2693">'AssessmentTemplate' only refers to a type, but is being used as a value here.</problem>
<problem file="app/risk-assessment/page.tsx" line="3254" column="15" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="3254" column="35" code="2693">'TemplateQuestion' only refers to a type, but is being used as a value here.</problem>
<problem file="app/risk-assessment/page.tsx" line="3258" column="3" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3268" column="3" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3278" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3284" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3291" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3299" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3306" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3314" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3321" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3329" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3337" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3345" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3353" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3361" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3369" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3377" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3385" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3393" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3402" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3410" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3418" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3426" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3434" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3442" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3450" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3458" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3466" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3474" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3482" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3490" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3498" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3506" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3514" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3522" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3530" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3538" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3546" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3554" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3562" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3570" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3578" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3587" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3595" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3603" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3611" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3619" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3628" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3636" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3644" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3652" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3660" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3670" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3676" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3683" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3691" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3698" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3706" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3715" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3721" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3728" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3736" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3743" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3751" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3760" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3766" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3774" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3783" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3791" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3800" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3808" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3816" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3824" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3832" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3841" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3849" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3857" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3865" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3873" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3881" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3889" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3897" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3905" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3913" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3921" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3929" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3937" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3945" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3953" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3962" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3970" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3978" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3986" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="3995" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4004" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4013" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4021" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4031" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4037" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4045" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4054" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4062" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4071" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4079" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4087" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4096" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4106" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4112" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4120" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4129" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4137" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4146" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4154" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4162" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4171" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4179" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4187" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4195" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4204" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4212" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4220" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4228" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4236" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4244" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4252" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4260" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4268" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4276" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4284" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4292" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4300" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4308" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4316" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4324" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4332" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4340" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4348" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4356" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4364" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4372" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4380" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4388" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4396" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4404" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4412" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4420" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4428" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4436" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4444" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4452" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4460" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4468" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4476" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4484" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4494" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4500" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4508" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4517" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4525" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4534" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4542" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4550" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4559" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4567" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4575" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4585" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4592" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4601" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4609" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4617" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4625" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4635" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4643" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4651" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4659" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4667" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4675" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4683" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4691" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4699" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4707" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4717" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4725" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4733" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4741" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4749" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4759" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4767" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4775" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4783" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4791" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4801" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4809" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4817" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4825" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4835" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4843" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4851" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4859" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4867" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4877" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4885" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4893" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4901" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4911" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4919" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4927" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4937" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4945" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4953" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4963" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4971" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4979" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4987" column="9" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="4999" column="3" code="2304">Cannot find name 'id'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5009" column="18" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5010" column="27" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5011" column="20" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5020" column="28" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5023" column="7" code="2304">Cannot find name 'fileName'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5034" column="5" code="2304">Cannot find name 'fileName'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5044" column="3" code="2304">Cannot find name 'file'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5049" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="5049" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="5054" column="59" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5055" column="63" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5059" column="54" code="2693">'UploadedFileWithLabel' only refers to a type, but is being used as a value here.</problem>
<problem file="app/risk-assessment/page.tsx" line="5061" column="58" code="2693">'AnalysisResult' only refers to a type, but is being used as a value here.</problem>
<problem file="app/risk-assessment/page.tsx" line="5062" column="42" code="2693">'Record' only refers to a type, but is being used as a value here.</problem>
<problem file="app/risk-assessment/page.tsx" line="5063" column="45" code="2339">Property 'number' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5064" column="45" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5065" column="37" code="2339">Property 'string' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5069" column="5" code="2304">Cannot find name 'socType'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5085" column="56" code="2693">'Record' only refers to a type, but is being used as a value here.</problem>
<problem file="app/risk-assessment/page.tsx" line="5086" column="58" code="2693">'AssessmentTemplate' only refers to a type, but is being used as a value here.</problem>
<problem file="app/risk-assessment/page.tsx" line="5087" column="60" code="2693">'TemplateQuestion' only refers to a type, but is being used as a value here.</problem>
<problem file="app/risk-assessment/page.tsx" line="5102" column="27" code="2304">Cannot find name 'preSelectedCategory'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5180" column="50" code="2786">'HTMLInputElement' cannot be used as a JSX component.
  Its instance type 'HTMLInputElement' is not a valid JSX element.
    Type 'HTMLInputElement' is missing the following properties from type 'ElementClass': render, context, setState, forceUpdate, and 3 more.</problem>
<problem file="app/risk-assessment/page.tsx" line="5183" column="9" code="2304">Cannot find name 'file'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5183" column="9" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="app/risk-assessment/page.tsx" line="5184" column="9" code="2304">Cannot find name 'label'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5191" column="78" code="2304">Cannot find name 'indexToRemove'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5197" column="15" code="2304">Cannot find name 'index'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5197" column="34" code="18004">No value exists in scope for the shorthand property 'label'. Either declare one or provide an initializer.</problem>
<problem file="app/risk-assessment/page.tsx" line="5227" column="9" code="2304">Cannot find name 'formData'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5227" column="34" code="2304">Cannot find name 'item'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5234" column="9" code="2304">Cannot find name 'method'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5259" column="44" code="2304">Cannot find name 'err'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5261" column="18" code="2304">Cannot find name 'err'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5271" column="39" code="2304">Cannot find name 'questionId'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5271" column="52" code="2304">Cannot find name 'value'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5285" column="29" code="2304">Cannot find name 'reportId'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5326" column="9" code="2304">Cannot find name 'assessmentType'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5338" column="11" code="2304">Cannot find name 'fileName'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5351" column="11" code="2304">Cannot find name 'title'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5357" column="45" code="2304">Cannot find name 'err'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5361" column="24" code="2304">Cannot find name 'err'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5390" column="5" code="2304">Cannot find name 'let'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5411" column="7" code="2304">Cannot find name 'citationParts'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5411" column="30" code="2304">Cannot find name 'fileName'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5416" column="7" code="2304">Cannot find name 'citationParts'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5416" column="35" code="2304">Cannot find name 'pageNumber'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5418" column="7" code="2304">Cannot find name 'citationParts'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5422" column="7" code="2304">Cannot find name 'citationParts'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5429" column="29" code="2304">Cannot find name 'excerptData'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5436" column="15" code="2304">Cannot find name 'excerptText'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5436" column="36" code="2304">Cannot find name 'filteredParts'.</problem>
<problem file="app/risk-assessment/page.tsx" line="5501" column="14" code="2367">This comparison appears to be unintentional because the types '&quot;results&quot;' and '&quot;select-category&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/page.tsx" line="5598" column="14" code="2367">This comparison appears to be unintentional because the types '&quot;results&quot;' and '&quot;soc-info&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/page.tsx" line="5834" column="14" code="2367">This comparison appears to be unintentional because the types '&quot;results&quot;' and '&quot;upload-documents&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/page.tsx" line="5997" column="14" code="2367">This comparison appears to be unintentional because the types '&quot;results&quot;' and '&quot;review-answers&quot;' have no overlap.</problem>
<problem file="app/risk-assessment/page.tsx" line="6193" column="36" code="2304">Cannot find name 'Checkbox'.</problem>
</dyad-problem-report><think>**Analyzing Compilation Issues**

I've discovered a critical bug in the code generation: `app/risk-assessment/ai-assessment/page.tsx` now contains the content of `app/reports/page.tsx`. This explains the flood of TypeScript errors. The generation process appears to have overwritten the intended file with incorrect data. My immediate focus is on restoring the correct content and understanding the root cause of this file corruption.


**Debugging File Overwrites**

I'm now investigating file corruption. The previous overwrite corrupted `app/risk-assessment/ai-assessment/page.tsx` with `app/reports/page.tsx`, and introduced `dyad-problem-report` tags. I've restored the original `app/risk-assessment/ai-assessment/page.tsx` file. Next, I'm cleaning up `app/risk-assessment/page.tsx`. It now lacks correct imports, features incorrect types, and has incorrect JSX tags. I am addressing missing imports, adjusting type definitions, and fixing malformed JSX tags. I'll also eliminate these spurious `dyad-problem-report` tags.


**Restoring & Refining Files**

I've restored `app/risk-assessment/ai-assessment/page.tsx` to its pristine state. Now, I'm tackling `app/risk-assessment/page.tsx`. I've removed the spurious tags. Next, I'm adding missing imports and correcting the `BuiltInQuestion` interface. I'm focusing on fixing JSX closing tags and ensuring all variables are correctly declared and scoped. The "no overlap" error with `currentStep` will be addressed once syntax is clean. My priority is restoring the basic structure first.


**Fixing Remaining Compilation Errors**

I've restored the correct content for `app/risk-assessment/ai-assessment/page.tsx` and now I'm fixing `app/risk-assessment/page.tsx`. I've removed the `dyad-problem-report` tags, added `useRef` and `Checkbox` imports, and updated the `BuiltInQuestion` interface to include the `"checkbox"` type.  I'm now methodically adding missing closing JSX tags and fixing syntax errors, addressing undeclared variable issues to clean up the code. Once I resolve the syntax problems, I'll revisit the `"results"` type overlap error.


**Restoring File Integrity**

I'm now fully focused on restoring the compromised files. I've restored `app/risk-assessment/ai-assessment/page.tsx`, and am currently cleaning `app/risk-assessment/page.tsx`, which was also affected by the `dyad-problem-report` tags and incorrect content. I'm importing `useRef` and `Checkbox`, updating the `BuiltInQuestion` interface, and systematically correcting JSX tags and undeclared variables. I will also address the type overlap error once the syntax is resolved, as I suspect it is a consequence of the syntax issues, but I will make an explicit check of the type of the `currentStep` and the related conditions.


**Restoring File Integrity**

I'm systematically restoring `app/risk-assessment/page.tsx` now. Imports like `useRef` and `Checkbox` are added, and the `BuiltInQuestion` type is updated. I'm focusing on fixing all syntax errors, including JSX closing tags, and variable scope issues, starting with the file-related functions. I'm addressing undeclared variable errors. My main aim is to resolve basic syntax problems. Afterward, I'll revisit the `currentStep` type conflict, and fix it directly if the problem persists.


</think>You've encountered a significant issue where the content of `app/reports/page.tsx` was accidentally written into `app/risk-assessment/ai-assessment/page.tsx`, causing a large number of compilation errors across both files. My sincere apologies for this oversight!

I will fix this by:

1.  **Restoring `app/risk-assessment/ai-assessment/page.tsx`**: I will revert this file to its correct, original state.
2.  **Fixing `app/risk-assessment/page.tsx`**: I will correct the syntax errors, add missing imports, and update the `BuiltInQuestion` interface to properly include the "checkbox" type.
3.  **Fixing `app/reports/page.tsx`**: I will ensure `isDemo` is correctly destructured from `useAuth` and `RefreshCw` is imported from `lucide-react`.

These changes will resolve all the reported TypeScript errors.

<dyad-write path="app/risk-assessment/ai-assessment/page.tsx" description="Reverting to the correct version of AIAssessmentPage.">
"use client"

import { useState, useEffect, useRef } from "react" // Added useRef
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox" // Added Checkbox import
import { 
  Shield, 
  FileText, 
  BarChart3, 
  Eye, 
  Bot, 
  Clock, 
  Building, 
  Lock, 
  Server, 
  Send, 
  Users, 
  User, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Download, 
  X, 
  ArrowRight, 
  Upload, 
  AlertCircle, 
  Check, 
  Save, 
  Info, 
  FileCheck, 
  Loader2, 
  Copy, 
  Edit3, 
  Calendar, 
  AlertTriangle, // Added AlertTriangle
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Label as ShadcnLabel } from "@/components/ui/label"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { sendAssessmentEmail } from "@/app/third-party-assessment/email-service"
import Link from "next/link"
import { Input as ShadcnInput } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { saveAiAssessmentReport, getAssessmentTemplates, getTemplateQuestions } from "@/lib/assessment-service"
import type { AssessmentTemplate, TemplateQuestion } from "@/lib/supabase";
import { useRouter } from "next/navigation"

interface BuiltInQuestion {
  id: string;
  category: string;
  question: string;
  type: "boolean" | "multiple" | "tested" | "textarea" | "checkbox"; // Added "checkbox"
  options?: string[];
  weight?: number;
  required?: boolean;
}

interface BuiltInAssessmentCategory {
  id: string;
  name: string;
  description: string;
  icon: any; // Using 'any' for LucideIcon type for simplicity
  questions: BuiltInQuestion[];
}

// Assessment categories and questions (now default/built-in templates)
const assessmentCategories: BuiltInAssessmentCategory[] = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Evaluate your organization's cybersecurity posture and controls",
    icon: Shield,
    questions: [
      {
        id: "cs1",
        category: "Security Policies",
        question: "Does your organization have a formal information security policy?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "cs2",
        category: "Security Training",
        question: "How often do you conduct cybersecurity training for employees?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs3",
        category: "Access Control",
        question: "Do you have multi-factor authentication implemented for all critical systems?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "cs4",
        category: "Vulnerability Management",
        question: "How frequently do you perform vulnerability assessments?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
      },
      {
        id: "cs5",
        category: "Incident Response",
        question: "Do you have an incident response plan in place?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "cyb_1",
        category: "Incident Response",
        question: "Have you experienced a data breach or cybersecurity incident in the last two years?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_2",
        category: "Governance",
        question: "Does your organization have cybersecurity executive oversight?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_3",
        category: "Threat Management",
        question: "Do you actively monitor for evolving threats and vulnerabilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_4",
        category: "Security Training",
        question: "Do you provide phishing education to your employees?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_5",
        category: "Security Training",
        question: "Do you provide general cybersecurity employee training?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_6",
        category: "Security Training",
        question: "Do you assess cybersecurity staff competency?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_7",
        category: "Human Resources",
        question: "Do staff sign NDA/Confidentiality Agreements?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_8",
        category: "Client Management",
        question: "Do you define client cybersecurity responsibilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_9",
        category: "Change Management",
        question: "Do you have change management restrictions in place?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_10",
        category: "Patch Management",
        question: "How often are software and firmware updates applied?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Quarterly", "Monthly", "Continuously"],
        weight: 9,
        required: true,
      },
      {
        id: "cyb_11",
        category: "Access Control",
        question: "Is access authorization formally managed?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_12",
        category: "Configuration Management",
        question: "Do you use standardized configuration management?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_13",
        category: "Access Control",
        question: "Do you implement privileged access management?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_14",
        category: "Authentication",
        question: "Do you use MFA (Multi-Factor Authentication)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_15",
        category: "Endpoint Security",
        question: "Do you have remote device management capabilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_16",
        category: "Data Protection",
        question: "Do you have encryption key management procedures?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_17",
        category: "Data Protection",
        question: "Is data encrypted at rest?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_18",
        category: "Data Protection",
        question: "Is data encrypted in transit?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_19",
        category: "Data Protection",
        question: "Do you have secure backup storage?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_20",
        category: "Data Protection",
        question: "Do you practice data segregation?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_21",
        category: "Asset Management",
        question: "Do you have procedures for electronic asset disposal?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_22",
        category: "Risk Management",
        question: "Do you have evidence of cybersecurity insurance?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_23",
        category: "Threat Management",
        question: "Do you have ransomware protection in place?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_24",
        category: "Application Security",
        question: "Do you follow secure application development/acquisition practices?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_25",
        category: "Policy Management",
        question: "Do you have documented cybersecurity policies/practices?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_26",
        category: "Application Security",
        question: "Do you secure web service accounts and APIs?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_27",
        category: "Application Security",
        question: "Do you ensure secure deployment of applications?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_28",
        category: "Monitoring",
        question: "Do you perform user activity monitoring?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_29",
        category: "Monitoring",
        question: "Do you perform network performance monitoring?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_30",
        category: "Physical Security",
        question: "Do you conduct physical security monitoring/review?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "cyb_31",
        category: "Endpoint Security",
        question: "Do you have email protection measures?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_32",
        category: "Network Security",
        question: "Do you have wireless management policies?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_33",
        category: "Security Testing",
        question: "How frequently do you conduct network security testing?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 9,
        required: true,
      },
      {
        id: "cyb_34",
        category: "Third-Party Risk",
        question: "Do you manage third-party connections securely?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_35",
        category: "Incident Response",
        question: "Do you have a formal incident response process?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_36",
        category: "Incident Response",
        question: "Do you have procedures for incident internal notifications?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_37",
        category: "Incident Response",
        question: "Do you have procedures for incident external notifications?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_38",
        category: "Vulnerability Management",
        question: "How frequently do you perform cybersecurity risk vulnerability remediation?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Quarterly", "Monthly", "Continuously"],
        weight: 9,
        required: true,
      },
      {
        id: "cyb_39",
        category: "Cloud Security",
        question: "Is confidential data housed in cloud-based systems?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "cyb_40",
        category: "Data Privacy",
        question: "Is confidential data shared offshore?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_41",
        category: "Third-Party Risk",
        question: "Are sensitive activities or critical operations outsourced?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "cyb_42",
        category: "Third-Party Risk",
        question: "Do subcontractors access NPI (Non-Public Information)?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "cyb_43",
        category: "Third-Party Risk",
        question: "Have subcontractors (noted above) had a Data Breach or Information Security Incident within the last two (2) years?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
    ],
  },
  {
    id: "compliance",
    name: "Regulatory Compliance",
    description: "Assess compliance with financial regulations and standards",
    icon: FileText,
    questions: [
      {
        id: "rc1",
        category: "Regulatory Adherence",
        question: "Are you compliant with current FDIC regulations?",
        type: "boolean" as const,
        weight: 10,
      },
      {
        id: "rc2",
        category: "Policy Management",
        question: "How often do you review and update compliance policies?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
      },
      {
        id: "rc3",
        category: "Governance",
        question: "Do you have a dedicated compliance officer?",
        type: "boolean" as const,
        weight: 7,
      },
      {
        id: "rc4",
        category: "Audits",
        question: "How frequently do you conduct compliance audits?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
      },
      {
        id: "rc5",
        category: "Documentation",
        question: "Do you maintain proper documentation for all compliance activities?",
        type: "boolean" as const,
        weight: 8,
      },
    ],
  },
  {
    id: "operational",
    name: "Operational Risk",
    description: "Evaluate operational processes and internal controls",
    icon: BarChart3,
    questions: [
      {
        id: "or1",
        category: "Procedures",
        question: "Do you have documented operational procedures for all critical processes?",
        type: "boolean" as const,
        weight: 8,
      },
      {
        id: "or2",
        category: "Procedures",
        question: "How often do you review and update operational procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
      },
      {
        id: "or3",
        category: "Internal Controls",
        question: "Do you have adequate segregation of duties in place?",
        type: "boolean" as const,
        weight: 9,
      },
      {
        id: "or4",
        category: "Risk Assessment",
        question: "How frequently do you conduct operational risk assessments?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 8,
      },
      {
        id: "or5",
        category: "Business Continuity",
        question: "Do you have a business continuity plan?",
        type: "boolean" as const,
        weight: 9,
      },
    ],
  },
  {
    id: "business-continuity",
    name: "Business Continuity",
    description: "Assess your organization's business continuity and disaster recovery preparedness",
    icon: Shield,
    questions: [
      {
        id: "bc1",
        category: "BCM Program",
        question: "Do you have a documented Business Continuity Management (BCM) program in place?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "bc2",
        category: "BCM Program",
        question: "How frequently do you review and update your BCM program?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2-3 years", "Annually", "Semi-annually"],
        weight: 9,
        required: true,
      },
      {
        id: "bc3",
        category: "Governance",
        question: "Does your BCM program have executive oversight and sponsorship?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc4",
        category: "Training",
        question: "How often do you conduct BCM training for employees?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
        required: true,
      },
      {
        id: "bc5",
        category: "System Availability",
        question: "Do you monitor system capacity and availability on an ongoing basis?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc6",
        category: "Physical Security",
        question: "Do you have adequate physical security controls for critical facilities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc7",
        category: "Environmental Controls",
        question: "Do you have environmental security controls (fire suppression, climate control, etc.)?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc8",
        category: "Infrastructure Redundancy",
        question: "Do you have redundant telecommunications infrastructure to handle failures?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc9",
        category: "Maintenance",
        question: "How frequently do you perform equipment maintenance and firmware updates?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Annually", "Semi-annually", "Quarterly"],
        weight: 8,
        required: true,
      },
      {
        id: "bc10",
        category: "Power Systems",
        question: "Do you have backup power systems (UPS/generators) for critical operations?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc11",
        category: "Data Protection",
        question: "Do you have comprehensive data protection (firewall, anti-virus, encryption)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc12",
        category: "Third-Party Risk",
        question: "Do you have contingency plans for failures of critical third-party providers?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc13",
        category: "Personnel Security",
        question: "Do you conduct background checks on employees with access to critical systems?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc14",
        category: "Staffing",
        question: "Do you have adequate staffing depth and cross-training for critical functions?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc15",
        category: "Disaster Recovery",
        question: "Do you have a documented Disaster Recovery Plan separate from your BCM?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc16",
        category: "Crisis Communication",
        question: "Do you have established internal and external communication protocols for crisis management?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc17",
        category: "Communication",
        question: "Do you have communication procedures for planned system outages?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "bc18",
        category: "Incident Management",
        question: "Do you have a cybersecurity incident management plan?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc19",
        category: "Insurance",
        question: "Do you maintain appropriate business continuity insurance coverage?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "bc20",
        category: "Emergency Planning",
        question: "Do you have pandemic/health emergency continuity plans?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc21",
        category: "Remote Access",
        question: "Do you have remote administration contingencies for critical systems?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc22",
        category: "Software Development",
        question: "Do you have proper source code management and version control systems?",
        type: "boolean" as const,
        weight: 7,
        required: true,
      },
      {
        id: "bc23",
        category: "System Obsolescence",
        question: "Have you identified and addressed any outdated systems that pose continuity risks?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc24",
        category: "Data Backup",
        question: "How frequently do you backup critical business data?",
        type: "multiple" as const,
        options: ["Never", "Monthly", "Weekly", "Daily", "Real-time/Continuous"],
        weight: 10,
        required: true,
      },
      {
        id: "bc25",
        category: "Impact Analysis",
        question: "Have you conducted a formal Business Impact Analysis (BIA)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc26",
        category: "Recovery Objectives",
        question: "Have you defined Recovery Point Objectives (RPO) for critical systems?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc27",
        category: "Recovery Objectives",
        question: "Have you defined Recovery Time Objectives (RTO) for critical systems?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "bc28",
        category: "Testing",
        question: "How frequently do you test your BCM/DR plans?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 10,
        required: true,
      },
      {
        id: "bc29",
        category: "Testing",
        question: "How frequently do you test your incident response procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
        required: true,
      },
      {
        id: "bc30",
        category: "Testing",
        question: "How frequently do you test your data backup and recovery procedures?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
        required: true,
      },
      {
        id: "bc31",
        category: "Testing Documentation",
        question: "Do you document and analyze the results of your BC/DR testing?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "bc32",
        category: "Audits",
        question: "Do you have independent audits of your BC/DR plan testing conducted?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
    ],
  },
  {
    id: "financial-services",
    name: "Financial Services Assessment",
    description: "Evaluate compliance with financial industry regulations and standards",
    icon: Building,
    questions: [
      {
        id: "fs1",
        category: "Regulatory Compliance",
        question: "Are you compliant with current banking regulations (e.g., Basel III, Dodd-Frank)?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "fs2",
        category: "AML/KYC",
        question: "How often do you conduct anti-money laundering (AML) training?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
        required: true,
      },
      {
        id: "fs3",
        category: "AML/KYC",
        question: "Do you have a comprehensive Know Your Customer (KYC) program?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "fs4",
        category: "Credit Risk",
        question: "How frequently do you review and update your credit risk policies?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
        required: true,
      },
      {
        id: "fs5",
        category: "Capital Management",
        question: "Do you maintain adequate capital reserves as required by regulators?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "fs6",
        category: "Consumer Protection",
        question: "Are you compliant with consumer protection regulations (e.g., CFPB guidelines)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "fs7",
        category: "Stress Testing",
        question: "How often do you conduct stress testing on your financial portfolios?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Quarterly"],
        weight: 9,
        required: true,
      },
      {
        id: "fs8",
        category: "Client Asset Segregation",
        question: "Do you have proper segregation of client funds and assets?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
    ],
  },
  {
    id: "data-privacy",
    name: "Data Privacy Assessment",
    description: "Assess your organization's data privacy controls and regulatory compliance",
    icon: Lock,
    questions: [
      {
        id: "dp1",
        category: "Regulatory Compliance",
        question: "Are you compliant with applicable data privacy regulations (GDPR, CCPA, etc.)?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "dp2",
        category: "Privacy Impact Assessment",
        question: "How often do you conduct data privacy impact assessments?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Annually", "Semi-annually", "For all new projects"],
        weight: 9,
        required: true,
      },
      {
        id: "dp3",
        category: "Data Retention",
        question: "Do you have documented data retention and deletion policies?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "dp4",
        category: "Data Subject Rights",
        question: "How do you handle data subject access requests?",
        type: "multiple" as const,
        options: ["No formal process", "Manual process", "Semi-automated", "Fully automated", "Comprehensive system"],
        weight: 8,
        required: true,
      },
      {
        id: "dp5",
        category: "Governance",
        question: "Do you have a designated Data Protection Officer (DPO)?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "dp6",
        category: "Third-Party Data Processors",
        question: "Are all third-party data processors properly vetted and contracted?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "dp7",
        category: "Training",
        question: "How often do you provide data privacy training to employees?",
        type: "multiple" as const,
        options: ["Never", "Every 3 years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 7,
        required: true,
      },
      {
        id: "dp8",
        category: "Data Processing Records",
        question: "Do you maintain records of all data processing activities?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "dp9",
        category: "Privacy by Design",
        question: "Have you implemented privacy by design principles in your systems?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "dp10",
        category: "Information Security Policy",
        question: "Do you have a written Information Security Policy (ISP)?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "dp11",
        category: "Information Security Policy",
        question: "How often do you review and update your Information Security Policy?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 8,
        required: true,
      },
      {
        id: "dp12",
        category: "Information Security Policy",
        question: "Do you have a designated person responsible for Information Security Policy?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "dp13",
        category: "Compliance Monitoring",
        question: "Do you have data privacy compliance monitoring procedures in place?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp14",
        category: "Physical Security",
        question: "Do you have physical perimeter and boundary security controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp15",
        category: "Physical Security",
        question: "Do you have controls to protect against environmental extremes?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp16",
        category: "Audits & Assessments",
        question: "Do you conduct independent audits/assessments of your Information Security Policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp17",
        category: "Asset Management",
        question: "Do you have an IT asset management program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp18",
        category: "Asset Management",
        question: "Do you have restrictions on storage devices?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp19",
        category: "Endpoint Protection",
        question: "Do you have anti-malware/endpoint protection solutions deployed?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp20",
        category: "Network Security",
        question: "Do you implement network segmentation?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp21",
        category: "Network Security",
        question: "Do you have real-time network monitoring and alerting?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp22",
        category: "Security Testing",
        question: "How frequently do you conduct vulnerability scanning?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp23",
        category: "Security Testing",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        required: true,
      },
      {
        id: "dp24",
        category: "Regulatory Compliance",
        question: "Which regulatory compliance/industry standards does your company follow?",
        type: "checkbox",
        options: ["ISO 27001", "SOC 2", "HIPAA", "PCI DSS", "NIST", "None"],
        required: true,
      },
      {
        id: "dp25",
        category: "Access Control",
        question: "Do you have a formal access control policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp26",
        category: "Wireless Security",
        question: "Do you have physical access controls for wireless infrastructure?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp27",
        category: "Access Control",
        question: "Do you have defined password parameters and requirements?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp28",
        category: "Access Control",
        question: "Do you implement least privilege access principles?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp29",
        category: "Access Control",
        question: "How frequently do you conduct access reviews?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        required: true,
      },
      {
        id: "dp30",
        category: "Network Access",
        question: "Do you require device authentication for network access?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp31",
        category: "Remote Access",
        question: "Do you have secure remote logical access controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp32",
        category: "Third-Party Management",
        question: "Do you have a third-party oversight program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp33",
        category: "Third-Party Management",
        question: "Do you assess third-party security controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp34",
        category: "Third-Party Management",
        question: "Do you verify third-party compliance controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp35",
        category: "Human Resources",
        question: "Do you conduct background screening for employees with access to sensitive data?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp36",
        category: "Training",
        question: "Do you provide information security training to employees?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp37",
        category: "Training",
        question: "Do you provide privacy training to employees?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp38",
        category: "Training",
        question: "Do you provide role-specific compliance training?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp39",
        category: "Policy Management",
        question: "Do you have policy compliance and disciplinary measures?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp40",
        category: "Human Resources",
        question: "Do you have formal onboarding and offboarding controls?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp41",
        category: "Data Management",
        question: "Do you have a data management program?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp42",
        category: "Privacy Policy",
        question: "Do you have a published privacy policy?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp43",
        category: "Data Retention",
        question: "Do you have consumer data retention policies?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp44",
        category: "Data Protection",
        question: "Do you have controls to ensure PII is safeguarded?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp45",
        category: "Incident Response",
        question: "Do you have data breach protocols?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp46",
        category: "Consumer Rights",
        question: "Do you support consumer rights to dispute, copy, complain, delete, and opt out?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "dp47",
        category: "Data Collection",
        question: "Do you collect NPI, PII, or PHI data?",
        type: "boolean" as const,
        options: ["Yes", "No"],
        required: true,
      },
    ],
  },
  {
    id: "infrastructure-security",
    name: "Infrastructure Security",
    description: "Evaluate the security of your IT infrastructure and network systems",
    icon: Server,
    questions: [
      {
        id: "is1",
        category: "Network Segmentation",
        question: "Do you have network segmentation implemented for critical systems?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "is2",
        category: "Patch Management",
        question: "How often do you update and patch your server infrastructure?",
        type: "multiple" as const,
        options: ["Never", "As needed only", "Monthly", "Weekly", "Automated/Real-time"],
        weight: 10,
        required: true,
      },
      {
        id: "is3",
        category: "Intrusion Detection",
        question: "Do you have intrusion detection and prevention systems (IDS/IPS) deployed?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
      {
        id: "is4",
        category: "Penetration Testing",
        question: "How frequently do you conduct penetration testing?",
        type: "multiple" as const,
        options: ["Never", "Every 3+ years", "Every 2 years", "Annually", "Semi-annually"],
        weight: 9,
        required: true,
      },
      {
        id: "is5",
        category: "Access Management",
        question: "Are all administrative accounts protected with privileged access management?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "is6",
        category: "Logging & Monitoring",
        question: "Do you have comprehensive logging and monitoring for all critical systems?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "is7",
        category: "Firewall Management",
        question: "How often do you review and update firewall rules?",
        type: "multiple" as const,
        options: ["Never", "Annually", "Semi-annually", "Quarterly", "Monthly"],
        weight: 8,
        required: true,
      },
      {
        id: "is8",
        category: "Configuration Management",
        question: "Do you have secure configuration standards for all infrastructure components?",
        type: "boolean" as const,
        weight: 8,
        required: true,
      },
      {
        id: "is9",
        category: "Data Encryption",
        question: "Are all data transmissions encrypted both in transit and at rest?",
        type: "boolean" as const,
        weight: 10,
        required: true,
      },
      {
        id: "is10",
        category: "Vulnerability Management",
        question: "Do you have a formal vulnerability management program?",
        type: "boolean" as const,
        weight: 9,
        required: true,
      },
    ],
  },
  {
    id: "soc-compliance",
    name: "SOC Compliance Assessment",
    description: "Evaluate SOC 1, SOC 2, and SOC 3 compliance readiness and control effectiveness",
    icon: CheckCircle2,
    questions: [
      // Organization and Governance
      {
        id: "soc1",
        category: "Governance",
        question:
          "Has management established a governance structure with clear roles and responsibilities for SOC compliance?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc2",
        category: "Policies & Procedures",
        question: "Are there documented policies and procedures for all SOC-relevant control activities?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc3",
        category: "Risk Assessment",
        question: "Has management established a risk assessment process to identify and evaluate risks?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc4",
        category: "Control Objectives",
        question: "Are control objectives clearly defined and communicated throughout the organization?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc5",
        category: "Control Monitoring",
        question: "Is there a formal process for monitoring and evaluating control effectiveness?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Security Controls
      {
        id: "soc6",
        category: "Logical Access",
        question: "Are logical access controls implemented to restrict access to systems and data?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc7",
        category: "User Access Management",
        question: "Is user access provisioning and deprovisioning performed in a timely manner?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc8",
        category: "Privileged Access",
        question: "Are privileged access rights regularly reviewed and approved?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc9",
        category: "Authentication",
        question: "Is multi-factor authentication implemented for all critical systems?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc10",
        category: "Password Management",
        question: "Are password policies enforced and regularly updated?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc11",
        category: "Data Encryption",
        question: "Is data encryption implemented for data at rest and in transit?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc12",
        category: "Incident Response",
        question: "Are security incident response procedures documented and tested?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc13",
        category: "Vulnerability Management",
        question: "Is vulnerability management performed regularly with timely remediation?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc14",
        category: "Network Security",
        question: "Are network security controls (firewalls, IDS/IPS) properly configured and monitored?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc15",
        category: "Physical Security",
        question: "Is physical access to data centers and facilities properly controlled?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },

      // Availability Controls
      {
        id: "soc16",
        category: "System Monitoring",
        question: "Are system capacity and performance monitored to ensure availability?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc17",
        category: "Business Continuity",
        question: "Is there a documented business continuity and disaster recovery plan?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc18",
        category: "Backup & Recovery",
        question: "Are backup and recovery procedures regularly tested?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc19",
        category: "System Availability",
        question: "Is system availability monitored with appropriate alerting mechanisms?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc20",
        category: "Change Management",
        question: "Are change management procedures in place for system modifications?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Processing Integrity Controls
      {
        id: "soc21",
        category: "Data Processing",
        question: "Are data processing controls implemented to ensure completeness and accuracy?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc22",
        category: "Data Input Validation",
        question: "Is data input validation performed to prevent processing errors?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc23",
        category: "Automated Controls",
        question: "Are automated controls in place to detect and prevent duplicate transactions?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc24",
        category: "Error Monitoring",
        question: "Is data processing monitored for exceptions and errors?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc25",
        category: "Data Reconciliation",
        question: "Are reconciliation procedures performed to ensure data integrity?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Confidentiality Controls
      {
        id: "soc26",
        category: "Confidentiality Agreements",
        question: "Are confidentiality agreements in place with employees and third parties?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc27",
        category: "Data Classification",
        question: "Is sensitive data classified and handled according to its classification?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc28",
        category: "Data Retention & Disposal",
        question: "Are data retention and disposal policies implemented and followed?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc29",
        category: "Access to Confidential Info",
        question: "Is access to confidential information restricted on a need-to-know basis?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Privacy Controls
      {
        id: "soc30",
        category: "Privacy Policies",
        question: "Are privacy policies and procedures documented and communicated?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc31",
        category: "Personal Information Handling",
        question: "Is personal information collected, used, and disclosed in accordance with privacy policies?",
        type: "tested" as const,
        weight: 10,
        required: true,
      },
      {
        id: "soc32",
        category: "Data Subject Notice",
        question: "Are individuals provided with notice about data collection and use practices?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc33",
        category: "Consent Management",
        question: "Is consent obtained for the collection and use of personal information where required?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc34",
        category: "Data Subject Rights",
        question: "Are data subject rights (access, correction, deletion) supported and processed?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },

      // Monitoring and Logging
      {
        id: "soc35",
        category: "System Activity Logging",
        question: "Are system activities logged and monitored for security events?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc36",
        category: "Log Protection",
        question: "Is log data protected from unauthorized access and modification?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc37",
        category: "Log Review",
        question: "Are logs regularly reviewed for suspicious activities?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc38",
        category: "Centralized Logging",
        question: "Is there a centralized logging system for security monitoring?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },

      // Third-Party Management
      {
        id: "soc39",
        category: "Third-Party Evaluation",
        question: "Are third-party service providers evaluated for SOC compliance?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc40",
        category: "Contract Review",
        question: "Are contracts with service providers reviewed for appropriate control requirements?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc41",
        category: "Third-Party Monitoring",
        question: "Is third-party performance monitored against contractual requirements?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },

      // Training and Awareness
      {
        id: "soc42",
        category: "Security & Compliance Training",
        question: "Is security and compliance training provided to all relevant personnel?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc43",
        category: "Role & Responsibility Awareness",
        question: "Are employees made aware of their roles and responsibilities for SOC compliance?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc44",
        category: "Ongoing Training",
        question: "Is ongoing training provided to keep personnel current with policies and procedures?",
        type: "tested" as const,
        weight: 7,
        required: true,
      },

      // Management Review and Oversight
      {
        id: "soc45",
        category: "Management Review",
        question: "Does management regularly review control effectiveness and compliance status?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc46",
        category: "Deficiency Remediation",
        question: "Are control deficiencies identified, documented, and remediated in a timely manner?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
      {
        id: "soc47",
        category: "Control Change Approval",
        question: "Is there a formal process for management to approve significant changes to controls?",
        type: "tested" as const,
        weight: 8,
        required: true,
      },
      {
        id: "soc48",
        category: "Internal Audits",
        question: "Are internal audits performed to assess control effectiveness?",
        type: "tested" as const,
        weight: 9,
        required: true,
      },
    ],
  },
]

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested" | "textarea" | "checkbox" // Added "checkbox"
  options?: string[]
  weight?: number
  required?: boolean
  category?: string
}

interface AnalysisResult {
  answers: Record<string, boolean | string | string[]>
  confidenceScores: Record<string, number>
  reasoning: Record<string, string>
  overallAnalysis: string
  riskFactors: string[]
  recommendations: string[]
  riskScore: number
  riskLevel: string
  analysisDate: string
  documentsAnalyzed: number
  aiProvider?: string
  documentExcerpts?: Record<
    string,
    Array<{
      fileName: string
      excerpt: string
      relevance: string
      pageOrSection?: string
      quote?: string
      pageNumber?: number
      lineNumber?: number
      label?: 'Primary' | '4th Party';
    }>
  >
  directUploadResults?: Array<{
    fileName: string
    success: boolean
    fileSize: number
    fileType: string
    processingMethod: string
    label?: 'Primary' | '4th Party';
  }>
}

interface UploadedFileWithLabel {
  file: File;
  label: 'Primary' | '4th Party';
}

export default function AIAssessmentPage() {
  const { user, isDemo, hasPermission } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const isMounted = useRef(false); // Ref to track if component is mounted

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "select-category" | "upload-documents" | "soc-info" | "review-answers" | "results"
  >("select-category")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileWithLabel[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReportSaved, setIsReportSaved] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false); // Renamed setter to avoid conflict
  const [socInfo, setSocInfo] = useState({
    socType: "", // SOC 1, SOC 2, SOC 3
    reportType: "", // Type 1, Type 2
    auditor: "",
    auditorOpinion: "",
    auditorOpinionDate: "",
    socStartDate: "",
    socEndDate: "",
    socDateAsOf: "",
    testedStatus: "", // Added testedStatus
    exceptions: "",
        nonOperationalControls: "",
    companyName: "",
    productService: "",
    subserviceOrganizations: "",
    userEntityControls: "",
  })
  const [showOtherInput, setShowOtherInput] = useState<Record<string, boolean>>({});
  const [customTemplates, setCustomTemplates] = useState<AssessmentTemplate[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<TemplateQuestion[]>([]);

  const canCreateAssessments = hasPermission("create_assessments");

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Check for pre-selected category from main risk assessment page
    const preSelectedCategory = localStorage.getItem("selectedAssessmentCategory")
    if (isMounted.current && preSelectedCategory) {
      setSelectedCategory(preSelectedCategory)
      if (preSelectedCategory === "soc-compliance") {
        setCurrentStep("soc-info")
      } else {
        setCurrentStep("upload-documents")
      }
      localStorage.removeItem("selectedAssessmentCategory") // Clear it after use
    }
  }, [])

  useEffect(() => {
    async function fetchTemplates() {
      if (!isMounted.current) return;
      if (user) {
        const { data, error } = await getAssessmentTemplates();
        if (!isMounted.current) return;
        if (error) {
          console.error("Failed to fetch custom templates:", error);
          toast({
            title: "Error",
            description: "Failed to load custom assessment templates.",
            variant: "destructive",
          });
        } else {
          setCustomTemplates(data || []);
        }
      }
    }
    fetchTemplates();
  }, [user, toast]);

  useEffect(() => {
    async function loadQuestions() {
      if (!isMounted.current) return;
      if (selectedTemplateId) {
        const { data, error } = await getTemplateQuestions(selectedTemplateId);
        if (!isMounted.current) return;
        if (error) {
          console.error("Failed to load template questions:", error);
          setError("Failed to load questions for the selected template.");
          setCurrentQuestions([]);
        } else {
          setCurrentQuestions(data || []);
          const selectedTemplate = customTemplates.find(t => t.id === selectedTemplateId);
          if (selectedTemplate?.type === "soc-compliance") { // Check if it's the SOC template
            setCurrentStep("soc-info");
          } else {
            setCurrentStep("upload-documents");
          }
        }
      } else if (selectedCategory) {
        const builtIn = assessmentCategories.find((cat: BuiltInAssessmentCategory) => cat.id === selectedCategory);
        if (builtIn) {
          setCurrentQuestions(builtIn.questions.map((q: BuiltInQuestion) => ({
            id: q.id,
            template_id: "builtin", // Indicate it's a built-in template
            order: 0, // Default order
            question_text: q.question,
            question_type: q.type,
            options: (q.options as string[] | undefined) || null, // Safely access options
            required: q.required || false, // Safely access required
            category: q.category || null,
            weight: q.weight || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })));
          if (selectedCategory === "soc-compliance") {
            setCurrentStep("soc-info");
          } else {
            setCurrentStep("upload-documents");
          }
        }
      }
    }
    loadQuestions();
  }, [selectedCategory, selectedTemplateId, customTemplates, user]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        label: 'Primary' as 'Primary' | '4th Party' // Default label
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  }

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const handleFileLabelChange = (index: number, label: 'Primary' | '4th Party') => {
    setUploadedFiles(prevFiles => 
      prevFiles.map((item, i) => 
        i === index ? { ...item, label } : item
      )
    );
  };

  const handleAnalyzeDocuments = async () => {
    if (!canCreateAssessments) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to perform AI analysis.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedCategory && !selectedTemplateId) {
      setError("Please select an assessment category or template.")
      return
    }
    if (uploadedFiles.length === 0) {
      setError("Please upload documents for analysis.")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnswers({})

    try {
      const formData = new FormData();
      uploadedFiles.forEach((item) => {
        formData.append('files', item.file);
      });
      formData.append('labels', JSON.stringify(uploadedFiles.map(item => item.label)));
      formData.append('questions', JSON.stringify(currentQuestions));
      formData.append('assessmentType', (customTemplates.find(t => t.id === selectedTemplateId)?.name || assessmentCategories.find((c: BuiltInAssessmentCategory) => c.id === selectedCategory)?.name || "Custom Assessment"));

      const response = await fetch("/api/ai-assessment/analyze", {
        method: "POST",
        body: formData,
      });

      if (!isMounted.current) return; // Check mount status after async operation

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "AI analysis failed");
      }

      const result: AnalysisResult = await response.json();
      
      // --- Client-side Debugging ---
      console.log("Client: Raw analysis result from API:", result);
      console.log("Client: Analysis results.answers:", result.answers);
      console.log("Client: Analysis results.documentExcerpts:", result.documentExcerpts);
      // --- End Client-side Debugging ---

      setAnalysisResults(result)
      setAnswers(result.answers) // Pre-fill answers with AI suggestions
      setRiskScore(result.riskScore)
      setRiskLevel(result.riskLevel)
      setCurrentStep("review-answers")
    } catch (err: any) {
      console.error("AI Analysis Failed:", err)
      if (isMounted.current) { // Check mount status before setting error
        setError(err.message || "Failed to perform AI analysis. Please try again.")
      }
    } finally {
      if (isMounted.current) { // Check mount status before setting loading
        setIsAnalyzing(false)
      }
    }
  }

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSOCInfoComplete = () => {
    setCurrentStep("upload-documents")
  }

  const handleFinalSubmit = () => {
    // Here you would typically save the final answers and risk score to your database
    // For this demo, we'll just transition to the results page.
    setCurrentStep("results")
  }

  const handleViewFullReport = (reportId: string) => {
    router.push(`/reports/${reportId}/view?type=ai`); // Navigate within the same tab
  };

  const handleSaveReport = async () => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Reports cannot be saved in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!canCreateAssessments) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to save AI assessment reports.",
        variant: "destructive",
      });
      return;
    }

    if (!analysisResults || (!selectedCategory && !selectedTemplateId) || riskScore === null || riskLevel === null) {
      toast({
        title: "Error",
        description: "No complete report data available to save.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingReport(true); // Set saving state to true
    try {
      toast({
        title: "Saving Report...",
        description: "Your AI assessment report is being saved to your profile.",
      });

      const reportTitle = `${(customTemplates.find(t => t.id === selectedTemplateId)?.name || assessmentCategories.find((c: BuiltInAssessmentCategory) => c.id === selectedCategory)?.name || "Custom Assessment")} AI Assessment`;
      const reportSummary = analysisResults.overallAnalysis.substring(0, 250) + "..."; // Truncate for summary

      const savedReport = await saveAiAssessmentReport({
        assessmentType: (customTemplates.find(t => t.id === selectedTemplateId)?.name || assessmentCategories.find((c: BuiltInAssessmentCategory) => c.id === selectedCategory)?.name || "Custom Assessment"),
        reportTitle: reportTitle,
        riskScore: riskScore,
        riskLevel: riskLevel,
        reportSummary: reportSummary,
        fullReportContent: {
          analysisResults: analysisResults,
          answers: answers,
          questions: currentQuestions,
          socInfo: socInfo, // Include SOC info if available
        },
        uploadedDocumentsMetadata: uploadedFiles.map(item => ({
          fileName: item.file.name,
          fileSize: item.file.size,
          fileType: item.file.type,
          label: item.label,
        })),
        socInfo: socInfo,
      });

      if (!isMounted.current) return; // Check mount status after async operation

      if (savedReport) {
        setIsReportSaved(true);
        toast({
          title: "Report Saved!",
          description: "Your AI assessment report has been successfully saved to your profile.",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error("Error saving report:", err);
      if (isMounted.current) { // Check mount status before setting error
        toast({
          title: "Error Saving Report",
          description: err.message || "Failed to save the report. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) { // Check mount status before setting loading
        setIsSavingReport(false);
      }
    }
  };

  const getRiskLevelColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "medium-high":
        return "text-orange-600 bg-orange-100"
      case "high":
        return "text-red-600 bg-red-100"
      case "critical":
        return "text-red-800 bg-red-200"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const calculateProgress = () => {
    let progress = 0
    if (currentStep === "select-category") progress = 10
    else if (currentStep === "soc-info") progress = 30
    else if (currentStep === "upload-documents") progress = 50
    else if (currentStep === "review-answers") progress = 75
    else if (currentStep === "results") progress = 100
    return progress
  }

  // Helper function to render the evidence citation
  const renderEvidenceCitation = (excerptData: any) => {
    if (!excerptData || excerptData.excerpt === 'No directly relevant evidence found after comprehensive search') {
      return 'No directly relevant evidence found after comprehensive search.';
    }

    let citationParts: string[] = [];
    const fileName = excerptData.fileName;
    const pageNumber = excerptData.pageNumber;
    const label = excerptData.label; // This will be '4th Party' or null

    if (fileName && String(fileName).trim() !== '' && fileName !== 'N/A') {
      citationParts.push(`"${fileName}"`);
    }

    // Explicitly add page number or 'N/A'
    if (pageNumber != null && String(pageNumber).trim() !== '' && pageNumber !== 'N/A') {
      citationParts.push(`Page: ${pageNumber}`);
    } else {
      citationParts.push(`Page: N/A`); // Explicitly show N/A if page number is missing or invalid
    }

    if (label === '4th Party') {
      citationParts.push('4th Party');
    }

    // Filter out any potentially empty or null parts before joining
    const filteredParts = citationParts.filter(part => part && String(part).trim() !== ''); // Ensure parts are non-empty strings

    // The excerpt is always the first part of the return string
    const excerptText = `"${excerptData.excerpt}"`;

    if (filteredParts.length === 0) {
      return excerptText;
    }

    // Join parts for the citation, ensuring the excerpt is first
    return `${excerptText} (from ${filteredParts.join(' - ')})`;
  };

  if (!canCreateAssessments && !isDemo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You do not have permission to create AI assessments.</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard
      allowPreview={true}
      previewMessage="Preview Mode: Sign up to save assessments and access full features"
    >
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">AI-Powered Risk Assessment</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                AI Assessment Platform
                <br />
                <span className="text-blue-600">Automated Risk Evaluation</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Upload your documents and let AI analyze them to automatically complete your risk assessments.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href="/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Dashboard
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Assessment Progress</span>
                <span className="text-sm text-gray-600">{Math.round(calculateProgress())}% Complete</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          </div>
        </div>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Step 1: Select Assessment Category */}
            {currentStep === "select-category" && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Select AI Assessment Type</h2>
                  <p className="text-lg text-gray-600">
                    Choose the type of risk assessment you want AI to perform for you.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Built-in Templates */}
                  {assessmentCategories.map((category: BuiltInAssessmentCategory) => {
                    const IconComponent = category.icon
                    return (
                      <Card
                        key={category.id}
                        className={`relative group hover:shadow-lg transition-shadow cursor-pointer ${!canCreateAssessments ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => {
                          if (canCreateAssessments) {
                            setSelectedCategory(category.id)
                            setSelectedTemplateId(null); // Clear custom template selection
                          } else {
                            toast({
                              title: "Permission Denied",
                              description: "You do not have permission to create AI assessments.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">{category.description}</CardDescription>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={!canCreateAssessments}>
                            <Bot className="mr-2 h-4 w-4" />
                            Select for AI Analysis
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {/* Custom Templates */}
                  {customTemplates.map((template: AssessmentTemplate) => {
                    const IconComponent = FileText; // Default icon for custom templates
                    return (
                      <Card
                        key={template.id}
                        className={`relative group hover:shadow-lg transition-shadow cursor-pointer border-purple-300 bg-purple-50 ${!canCreateAssessments ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => {
                          if (canCreateAssessments) {
                            setSelectedTemplateId(template.id);
                            setSelectedCategory(null); // Clear built-in category selection
                          } else {
                            toast({
                              title: "Permission Denied",
                              description: "You do not have permission to create AI assessments.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <IconComponent className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">{template.description}</CardDescription>
                          <Badge className="bg-purple-200 text-purple-800 mb-2">Custom Template</Badge>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={!canCreateAssessments}>
                            <Bot className="mr-2 h-4 w-4" />
                            Select for AI Analysis
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: SOC Information (only for SOC assessments) */}
            {currentStep === "soc-info" && (selectedCategory === "soc-compliance" || customTemplates.find((t: AssessmentTemplate) => t.id === selectedTemplateId)?.type === "soc-compliance") && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep("select-category")}
                    className="mb-6 hover:bg-blue-50"
                    disabled={!canCreateAssessments}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Category Selection
                  </Button>
                </div>

                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">SOC Assessment Information</h2>
                  <p className="text-lg text-gray-600">
                    Please provide information about your SOC assessment requirements
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      SOC Assessment Details
                    </CardTitle>
                    <CardDescription>
                      This information will be included in your assessment report and help tailor the AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="socType">SOC Type *</Label>
                        <select
                          id="socType"
                          value={socInfo.socType}
                          onChange={(e) => setSocInfo({ ...socInfo, socType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={!canCreateAssessments}
                        >
                          <option value="">Select SOC Type</option>
                          <option value="SOC 1">SOC 1 - Internal Controls over Financial Reporting</option>
                          <option value="SOC 2">
                            SOC 2 - Security, Availability, Processing Integrity, Confidentiality, Privacy
                          </option>
                          <option value="SOC 3">SOC 3 - General Use Report</option>
                        </select>
                      </div>
                      {socInfo.socType !== "SOC 3" && (
                        <div>
                          <Label htmlFor="reportType">Report Type *</Label>
                          <select
                            id="reportType"
                            value={socInfo.reportType}
                            onChange={(e) => setSocInfo({ ...socInfo, reportType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={!canCreateAssessments}
                          >
                            <option value="">Select Report Type</option>
                            <option value="Type 1">Type 1 - Design and Implementation</option>
                            <option value="Type 2">Type 2 - Design, Implementation, and Operating Effectiveness</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="auditor">Auditor/CPA Firm</Label>
                        <Input
                          id="auditor"
                          value={socInfo.auditor}
                          onChange={(e) => setSocInfo({ ...socInfo, auditor: e.target.value })}
                          placeholder="Enter auditor or CPA firm name"
                          className="focus:ring-2 focus:ring-blue-500"
                          disabled={!canCreateAssessments}
                        />
                      </div>
                      <div>
                        <Label htmlFor="auditorOpinion">Auditor Opinion</Label>
                        <select
                          id="auditorOpinion"
                          value={socInfo.auditorOpinion}
                          onChange={(e) => setSocInfo({ ...socInfo, auditorOpinion: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={!canCreateAssessments}
                        >
                          <option value="">Select Opinion</option>
                          <option value="Unqualified">Unqualified</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Adverse">Adverse</option>
                          <option value="Disclaimer">Disclaimer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="auditorOpinionDate">Auditor Opinion Date</Label>
                        <Input
                          id="auditorOpinionDate"
                          type="date"
                          value={socInfo.auditorOpinionDate}
                          onChange={(e) => setSocInfo({ ...socInfo, auditorOpinionDate: e.target.value })}
                          className="focus:ring-2 focus:ring-blue-500"
                          disabled={!canCreateAssessments}
                        />
                      </div>
                      {socInfo.socType &&
                        socInfo.reportType &&
                        (socInfo.reportType === "Type 1" || socInfo.socType === "SOC 3" ? (
                          <div>
                            <Label htmlFor="socDateAsOf">SOC Date as of</Label>
                            <Input
                              id="socDateAsOf"
                              type="date"
                              value={socInfo.socDateAsOf}
                              onChange={(e) => setSocInfo({ ...socInfo, socDateAsOf: e.target.value })}
                              className="focus:ring-2 focus:ring-blue-500"
                              disabled={!canCreateAssessments}
                            />
                          </div>
                        ) : (
                          <>
                            <div>
                              <Label htmlFor="socStartDate">SOC Start Date</Label>
                              <Input
                                id="socStartDate"
                                type="date"
                                value={socInfo.socStartDate}
                                onChange={(e) => setSocInfo({ ...socInfo, socStartDate: e.target.value })}
                                className="focus:ring-2 focus:ring-blue-500"
                                disabled={!canCreateAssessments}
                              />
                            </div>
                            <div>
                              <Label htmlFor="socEndDate">SOC End Date</Label>
                              <Input
                                id="socEndDate"
                                type="date"
                                value={socInfo.socEndDate}
                                onChange={(e) => setSocInfo({ ...socInfo, socEndDate: e.target.value })}
                                className="focus:ring-2 focus:ring-blue-500"
                                disabled={!canCreateAssessments}
                              />
                            </div>
                          </>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="testedStatus">Testing Status</Label>
                        <select
                          id="testedStatus"
                          value={socInfo.testedStatus}
                          onChange={(e) => setSocInfo({ ...socInfo, testedStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={!canCreateAssessments}
                        >
                          <option value="">Select Testing Status</option>
                          <option value="Tested">Tested</option>
                          <option value="Untested">Untested</option>
                        </select>
                      </div>
                      <div></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={socInfo.companyName}
                          onChange={(e) => setSocInfo({ ...socInfo, companyName: e.target.value })}
                          placeholder="Enter your company name"
                          required
                          disabled={!canCreateAssessments}
                        />
                      </div>
                      <div>
                        <Label htmlFor="productService">Product/Service Being Assessed *</Label>
                        <Input
                          id="productService"
                          value={socInfo.productService}
                          onChange={(e) => setSocInfo({ ...socInfo, productService: e.target.value })}
                          placeholder="Enter the product or service"
                          required
                          disabled={!canCreateAssessments}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subserviceOrganizations">Subservice Organizations</Label>
                      <Textarea
                        id="subserviceOrganizations"
                        value={socInfo.subserviceOrganizations}
                        onChange={(e) => setSocInfo({ ...socInfo, subserviceOrganizations: e.target.value })}
                        placeholder="List any subservice organizations and their roles (e.g., cloud providers, data centers)..."
                        rows={3}
                        disabled={!canCreateAssessments}
                      />
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep("select-category")}
                        className="flex items-center"
                        disabled={!canCreateAssessments}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSOCInfoComplete}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                        disabled={!canCreateAssessments}
                      >
                        Continue to Document Upload
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Upload Documents */}
            {currentStep === "upload-documents" && (selectedCategory || selectedTemplateId) && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setCurrentStep((selectedCategory === "soc-compliance" || customTemplates.find((t: AssessmentTemplate) => t.id === selectedTemplateId)?.type === "soc-compliance") ? "soc-info" : "select-category")
                    }
                    className="mb-6 hover:bg-blue-50"
                    disabled={!canCreateAssessments}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to {(selectedCategory === "soc-compliance" || customTemplates.find((t: AssessmentTemplate) => t.id === selectedTemplateId)?.type === "soc-compliance") ? "SOC Information" : "Category Selection"}
                  </Button>
                </div>

                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Documents for AI Analysis</h2>
                  <p className="text-lg text-gray-600">
                    Selected: <span className="font-semibold text-blue-600">{(customTemplates.find((t: AssessmentTemplate) => t.id === selectedTemplateId)?.name || assessmentCategories.find((c: BuiltInAssessmentCategory) => c.id === selectedCategory)?.name)}</span>
                  </p>
                  <p className="text-gray-600 mt-2">
                    Upload your policies, reports, and procedures. Our AI will analyze them to answer the assessment
                    questions.
                  </p>
                </div>

                <Card className="mb-8 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader>
                    <div className="flex items-center justify-between"> {/* Added wrapper div */}
                      <CardTitle className="flex items-center space-x-2">
                        <Upload className="h-6 w-6 text-blue-600" />
                        <span className="text-blue-900">Document Upload</span>
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-700 text-xs">AI-POWERED</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-3">📄 Upload Your Documents</h4>
                        <p className="text-sm text-blue-800 mb-4">
                          Upload your security policies, SOC reports, compliance documents, and procedures. Our AI will
                          analyze them and automatically complete the assessment for you.
                        </p>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="document-upload" className="text-sm font-medium text-gray-700">
                              Upload Supporting Documents
                            </Label>
                            <div className={`mt-2 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-blue-25 ${!canCreateAssessments ? "opacity-50 cursor-not-allowed" : ""}`}>
                              <input
                                id="document-upload"
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={!canCreateAssessments}
                              />
                              <label htmlFor="document-upload" className={`cursor-pointer ${!canCreateAssessments ? "cursor-not-allowed" : ""}`}>
                                <Upload className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                                <p className="text-lg font-medium text-blue-900 mb-1">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-blue-700">
                                  PDF, DOC, DOCX, TXT, CSV, XLSX, PPT, PPTX up to 10MB each
                                </p>
                                <p className="text-xs text-blue-600 mt-2">
                                  💡 Recommended: Security policies, SOC reports, compliance certificates, procedures
                                </p>
                              </label>
                            </div>

                            {uploadedFiles.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h5 className="font-medium text-blue-900">Uploaded Files ({uploadedFiles.length}):</h5>
                                {uploadedFiles.map((item: UploadedFileWithLabel, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                      <span className="text-sm text-gray-700">{item.file.name}</span>
                                      <span className="text-xs text-gray-500">
                                        ({(item.file.size / 1024 / 1024).toFixed(1)} MB)
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Select
                                        value={item.label}
                                        onValueChange={(value: 'Primary' | '4th Party') => handleFileLabelChange(index, value)}
                                        disabled={!canCreateAssessments}
                                      >
                                        <SelectTrigger className="w-[120px] h-8 text-xs">
                                          <SelectValue placeholder="Select label" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Primary">Primary</SelectItem>
                                          <SelectItem value="4th Party">4th Party</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button variant="outline" size="sm" onClick={() => handleRemoveFile(index)} disabled={!canCreateAssessments}>
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {uploadedFiles.length > 0 && (
                            <Button
                              onClick={handleAnalyzeDocuments}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                              disabled={isAnalyzing || !canCreateAssessments}
                            >
                              {isAnalyzing ? (
                                <>
                                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                                  Analyzing Documents... This may take a few moments
                                </>
                              ) : (
                                <>
                                  <Bot className="mr-2 h-5 w-5" />
                                  🚀 Analyze Documents with AI
                                </>
                              )}
                            </Button>
                          )}

                          {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <p className="text-sm text-red-800">
                                  <strong>Error:</strong> {error}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          <p className="text-sm text-amber-800">
                            <strong>Note:</strong> AI-generated responses are suggestions based on your documents.
                            Please review and verify all answers before submission.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Review AI-Generated Answers */}
            {currentStep === "review-answers" && (selectedCategory || selectedTemplateId) && analysisResults && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep("upload-documents")}
                    className="mb-6 hover:bg-blue-50"
                    disabled={!canCreateAssessments}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Document Upload
                  </Button>
                </div>

                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Review AI-Generated Answers</h2>
                  <p className="text-lg text-gray-600">
                    Selected: <span className="font-semibold text-blue-600">{(customTemplates.find((t: AssessmentTemplate) => t.id === selectedTemplateId)?.name || assessmentCategories.find((c: BuiltInAssessmentCategory) => c.id === selectedCategory)?.name)}</span>
                  </p>
                  <p className="text-gray-600 mt-2">
                    The AI has analyzed your documents and provided suggested answers. Please review and edit as needed.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between"> {/* Added wrapper div */}
                      <CardTitle className="flex items-center space-x-2">
                        <Bot className="h-5 w-5" />
                        <span>AI-Suggested Responses</span>
                      </CardTitle>
                      {!isReportSaved && analysisResults.confidenceScores && (
                        <Badge className="bg-green-100 text-green-700">
                          Confidence: {Math.round(Object.values(analysisResults.confidenceScores).reduce((sum: number, val: number) => sum + val, 0) / Object.values(analysisResults.confidenceScores).length * 100)}%
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Review the AI's answers and make any necessary adjustments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {currentQuestions.map((question: TemplateQuestion, index: number) => (
                      <div key={question.id} className="space-y-4 border-b pb-6 last:border-b-0 last:pb-0">
                        <div>
                          <div className="flex items-start space-x-2 mb-2">
                            <Badge variant="outline" className="mt-1">
                              {question.category}
                            </Badge>
                            {question.required && <span className="text-red-500 text-sm">*</span>}
                            {!isReportSaved && analysisResults.confidenceScores?.[question.id] !== undefined && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                AI Confidence: {Math.round(analysisResults.confidenceScores[question.id] * 100)}%
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {index + 1}. {question.question_text}
                          </h3>
                        </div>

                        {/* AI Suggested Answer Display */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 mb-2">
                            <Bot className="inline h-4 w-4 mr-1" />
                            AI Suggestion:
                          </p>
                          <p className="text-sm font-medium text-blue-900">
                            {typeof analysisResults.answers[question.id] === "boolean"
                              ? (analysisResults.answers[question.id] ? "Yes" : "No")
                              : Array.isArray(analysisResults.answers[question.id])
                                ? (analysisResults.answers[question.id] as string[]).join(", ")
                                : analysisResults.answers[question.id] || "N/A"}
                          </p>
                          {analysisResults.documentExcerpts?.[question.id] &&
                            analysisResults.documentExcerpts[question.id].length > 0 && (
                              <div className="mt-3 text-xs text-gray-700 italic ml-4 p-2 bg-gray-50 border border-gray-100 rounded">
                                <Info className="inline h-3 w-3 mr-1" />
                                <strong>Evidence:</strong> {renderEvidenceCitation(analysisResults.documentExcerpts[question.id][0])}
                              </div>
                            )}
                        </div>

                        {/* Editable Answer Field */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Label htmlFor={`answer-${question.id}`} className="text-sm font-medium text-gray-700">
                            Your Final Answer (Edit if needed)
                          </Label>
                          {question.question_type === "boolean" && (
                            <div className="flex space-x-4 mt-2">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={answers[question.id] === true}
                                  onChange={() => handleAnswerChange(question.id, true)}
                                  className="mr-2"
                                  disabled={!canCreateAssessments}
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={answers[question.id] === false}
                                  onChange={() => handleAnswerChange(question.id, false)}
                                  className="mr-2"
                                  disabled={!canCreateAssessments}
                                />
                                No
                              </label>
                            </div>
                          )}
                          {question.question_type === "multiple" && (
                            <>
                              <select
                                value={
                                  (question.options?.includes(answers[question.id]) || !answers[question.id])
                                    ? answers[question.id]
                                    : "Other"
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "Other") {
                                    setShowOtherInput(prev => ({ ...prev, [question.id]: true }));
                                    handleAnswerChange(question.id, ""); // Clear answer when "Other" is selected
                                  } else {
                                    setShowOtherInput(prev => ({ ...prev, [question.id]: false }));
                                    handleAnswerChange(question.id, value);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                disabled={!canCreateAssessments}
                              >
                                <option value="">Select an option</option>
                                {question.options?.map((option: string) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                                <option value="Other">Other (please specify)</option>
                              </select>
                              {showOtherInput[question.id] && (
                                <Input
                                  id={`other-answer-${question.id}`}
                                  value={answers[question.id] || ""}
                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                  placeholder="Please specify..."
                                  className="mt-2"
                                  disabled={!canCreateAssessments}
                                />
                              )}
                            </>
                          )}
                          {question.question_type === "tested" && (
                            <div className="flex space-x-4 mt-2">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={answers[question.id] === "tested"}
                                  onChange={() => handleAnswerChange(question.id, "tested")}
                                  className="mr-2"
                                  disabled={!canCreateAssessments}
                                />
                                Tested
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  checked={answers[question.id] === "not_tested"}
                                  onChange={() => handleAnswerChange(question.id, "not_tested")}
                                  className="mr-2"
                                  disabled={!canCreateAssessments}
                                />
                                Not Tested
                              </label>
                            </div>
                          )}
                          {question.question_type === "textarea" && (
                            <Textarea
                              id={`answer-${question.id}`}
                              value={answers[question.id] || ""}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              placeholder="Provide your detailed response here..."
                              rows={4}
                              className="mt-2"
                              disabled={!canCreateAssessments}
                            />
                          )}
                          {question.question_type === "checkbox" && (
                            <div className="space-y-2 mt-2">
                              {question.options?.map((option: string) => (
                                <div key={option} className="flex items-center">
                                  <Checkbox
                                    id={`${question.id}-${option}`}
                                    checked={answers[question.id]?.includes(option) || false}
                                    onCheckedChange={(checked: boolean) => {
                                      const currentAnswers = answers[question.id] || [];
                                      if (checked) {
                                        handleAnswerChange(question.id, [...currentAnswers, option]);
                                      } else {
                                        handleAnswerChange(
                                          question.id,
                                          currentAnswers.filter((item: string) => item !== option)
                                        );
                                      }
                                    }}
                                    disabled={!canCreateAssessments}
                                  />
                                  <Label htmlFor={`${question.id}-${option}`} className="ml-2">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("upload-documents")}
                    className="hover:bg-gray-50"
                    disabled={!canCreateAssessments}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Document Upload
                  </Button>
                  <Button onClick={handleFinalSubmit} className="bg-green-600 hover:bg-green-700 text-white" disabled={!canCreateAssessments}>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Finalize Assessment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Results */}
            {currentStep === "results" && (selectedCategory || selectedTemplateId) && analysisResults && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Assessment Complete!</h2>
                  <p className="text-lg text-gray-600">
                    Your {(customTemplates.find((t: AssessmentTemplate) => t.id === selectedTemplateId)?.name || assessmentCategories.find((c: BuiltInAssessmentCategory) => c.id === selectedCategory)?.name)} risk assessment has been finalized.
                  </p>
                </div>

                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Risk Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-4">{riskScore}%</div>
                      <Badge className={`text-lg px-4 py-2 ${getRiskLevelColor(riskLevel)}`}>
                        {riskLevel} Risk
                      </Badge>
                      <p className="text-sm text-gray-600 mt-4">
                        This score reflects your current posture based on the AI analysis and your review.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-900 mb-2">Overall Analysis</h3>
                          <p className="text-sm text-blue-800">{analysisResults.overallAnalysis}</p>
                          <p className="text-xs text-blue-700 mt-2">
                            AI Provider: {analysisResults.aiProvider} | Documents Analyzed:{" "}
                            {analysisResults.documentsAnalyzed}
                          </p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h3 className="font-semibold text-red-900 mb-2">Identified Risk Factors</h3>
                          <ul className="text-sm text-red-800 list-disc pl-5 space-y-1">
                            {analysisResults.riskFactors.map((factor: string, index: number) => (
                              <li key={index} className="whitespace-pre-wrap">{factor}</li>
                            )) || <li>No risk factors identified.</li>}
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md">
                          <h3 className="font-medium text-green-900 mb-2">Recommendations</h3>
                          <ul className="text-sm text-green-800 list-disc pl-5 space-y-1">
                            {analysisResults.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="whitespace-pre-wrap">{rec}</li>
                            )) || <li>No recommendations provided.</li>}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("review-answers")}
                      className="hover:bg-gray-50"
                      disabled={!canCreateAssessments}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Review
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveReport}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isSavingReport || isDemo || !canCreateAssessments}
                      >
                        {isSavingReport ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Report
                          </>
                        )}
                      </Button>
                      <Button onClick={() => handleViewFullReport(user?.id || 'demo-user-id')} className="bg-blue-600 hover:bg-blue-700" disabled={!canCreateAssessments}>
                        <Download className="mr-2 h-4 w-4" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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