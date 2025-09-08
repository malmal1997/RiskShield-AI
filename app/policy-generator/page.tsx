"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input" // Added Input import
import { Label } from "@/components/ui/label" // Added Label import
import {
  Shield,
  FileText,
  Loader2,
  Download,
  Copy,
  CheckCircle,
  Edit3,
  Save,
  X,
  FileCheck,
  Calendar,
  User,
} from "lucide-react"
import { generatePolicy } from "./actions"
// import { MainNavigation } from "@/components/main-navigation" // Removed import
import { AuthGuard } from "@/components/auth-guard"

const policyTypes = [
  {
    id: "cybersecurity",
    name: "Cybersecurity Policy",
    description:
      "Comprehensive cybersecurity framework including data protection, access controls, and incident response procedures.",
    features: ["Data Protection", "Access Controls", "Incident Response", "Employee Training"],
  },
  {
    id: "compliance",
    name: "Regulatory<dyad-problem-report summary="121 problems">
<problem file="lib/ai-service.ts" line="458" column="7" code="2345">Argument of type '{ model: LanguageModelV2; prompt: string; max_tokens: number; temperature: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { prompt: string | ModelMessage[]; messages?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/ai-service.ts" line="622" column="11" code="2345">Argument of type '{ model: LanguageModelV2; messages: { role: &quot;user&quot;; content: ({ type: &quot;file&quot;; data: ArrayBuffer; mediaType: string; } | { type: &quot;text&quot;; text: string; })[]; }[]; temperature: number; max_tokens: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { messages: ModelMessage[]; prompt?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/ai-service.ts" line="632" column="11" code="2345">Argument of type '{ model: LanguageModelV2; prompt: string; temperature: number; max_tokens: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { prompt: string | ModelMessage[]; messages?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/ai-service.ts" line="641" column="9" code="2345">Argument of type '{ model: LanguageModelV2; prompt: string; temperature: number; max_tokens: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { prompt: string | ModelMessage[]; messages?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/ai-service.ts" line="948" column="9" code="2345">Argument of type '{ model: LanguageModelV2; prompt: string; max_tokens: number; temperature: number; }' is not assignable to parameter of type 'CallSettings &amp; Prompt &amp; { model: LanguageModel; tools?: ToolSet | undefined; toolChoice?: ToolChoice&lt;NoInfer&lt;TOOLS&gt;&gt; | undefined; ... 12 more ...; _internal?: { ...; } | undefined; }'.
  Object literal may only specify known properties, and 'max_tokens' does not exist in type 'CallSettings &amp; { system?: string | undefined; } &amp; { prompt: string | ModelMessage[]; messages?: undefined; } &amp; { model: LanguageModel; tools?: ToolSet | undefined; ... 13 more ...; _internal?: { ...; } | undefined; }'.</problem>
<problem file="lib/pdf-parser.ts" line="30" column="32" code="18048">'pdfJsResult.text' is possibly 'undefined'.</problem>
<problem file="lib/pdf-parser.ts" line="31" column="54" code="18048">'pdfJsResult.text' is possibly 'undefined'.</problem>
<problem file="lib/pdf-parser.ts" line="34" column="9" code="2322">Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.</problem>
<problem file="lib/pdf-parser.ts" line="47" column="33" code="18048">'binaryResult.text' is possibly 'undefined'.</problem>
<problem file="lib/pdf-parser.ts" line="48" column="60" code="18048">'binaryResult.text' is possibly 'undefined'.</problem>
<problem file="lib/pdf-parser.ts" line="51" column="9" code="2322">Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.</problem>
<problem file="app/analytics/page.tsx" line="141" column="13" code="2345">Argument of type '([, a]: [string, number], [, b]: [string, number]) =&gt; number' is not assignable to parameter of type '(a: [string, unknown], b: [string, unknown]) =&gt; number'.
  Types of parameters '__0' and 'a' are incompatible.
    Type '[string, unknown]' is not assignable to type '[string, number]'.
      Type at position 1 in source is not compatible with type at position 1 in target.
        Type 'unknown' is not assignable to type 'number'.</problem>
<problem file="app/analytics/page.tsx" line="157" column="13" code="2345">Argument of type '([, a]: [string, number], [, b]: [string, number]) =&gt; number' is not assignable to parameter of type '(a: [string, unknown], b: [string, unknown]) =&gt; number'.
  Types of parameters '__0' and 'a' are incompatible.
    Type '[string, unknown]' is not assignable to type '[string, number]'.</problem>
<problem file="app/dashboard/page.tsx" line="91" column="5" code="2322">Type 'null' is not assignable to type 'string | undefined'.</problem>
<problem file="app/dashboard/page.tsx" line="102" column="5" code="2322">Type 'null' is not assignable to type 'string | undefined'.</problem>
<problem file="app/dashboard/page.tsx" line="454" column="27" code="2322">Type '({ level, count }: { level: string; count: number; }) =&gt; string' is not assignable to type 'PieLabel&lt;PieLabelProps&gt; | undefined'.
  Type '({ level, count }: { level: string; count: number; }) =&gt; string' is not assignable to type '(props: PieLabelProps) =&gt; ReactNode | ReactElement&lt;SVGElement, string | JSXElementConstructor&lt;any&gt;&gt;'.
    Types of parameters '__0' and 'props' are incompatible.
      Type 'PieLabelProps' is missing the following properties from type '{ level: string; count: number; }': level, count</problem>
<problem file="app/policy-generator/page.tsx" line="907" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="910" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="911" column="26" code="2552">Cannot find name 'Input'. Did you mean 'oninput'?</problem>
<problem file="app/policy-generator/page.tsx" line="915" column="38" code="7006">Parameter 'e' implicitly has an 'any' type.</problem>
<problem file="app/policy-generator/page.tsx" line="922" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="925" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="951" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="954" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="956" column="28" code="2304">Cannot find name 'Input'.</problem>
<problem file="app/policy-generator/page.tsx" line="960" column="40" code="7006">Parameter 'e' implicitly has an 'any' type.</problem>
<problem file="app/policy-generator/page.tsx" line="973" column="26" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="976" column="27" code="2304">Cannot find name 'Label'.</problem>
<problem file="app/policy-generator/page.tsx" line="977" column="26" code="2304">Cannot find name 'Input'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1383" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1385" column="25" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1390" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1391" column="23" code="2532">Object is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1393" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="1396" column="23" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2129" column="24" code="7006">Parameter 'recommendation' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/page.tsx" line="2727" column="51" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2730" column="28" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2733" column="50" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2734" column="61" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2739" column="50" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2740" column="61" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2745" column="31" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2748" column="50" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2749" column="61" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2754" column="50" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2755" column="61" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2766" column="32" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2769" column="52" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2770" column="63" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2782" column="49" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2783" column="64" code="18048">'currentQuestionData' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/page.tsx" line="2826" column="58" code="7006">Parameter 'recommendation' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/page.tsx" line="2826" column="74" code="7006">Parameter 'index' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1362" column="27" code="2345">Argument of type '(prev: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; { [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to parameter of type 'SetStateAction&lt;Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;&gt;'.
  Type '(prev: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; { [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to type '(prevState: Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;) =&gt; Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;'.
    Type '{ [x: string]: &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;; }' is not assignable to type 'Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;'.
      'string' index signatures are incompatible.
        Type '&quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;' is not assignable to type '&quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;'.
          Type '&quot;operational&quot;' is not assignable to type '&quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1617" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1618" column="23" code="2532">Object is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1620" column="21" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="1624" column="25" code="18048">'question.weight' is possibly 'undefined'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2337" column="59" code="2349">This expression is not callable.
  Each member of the union type '{ &lt;S extends { id: string; question: string; type: &quot;boolean&quot;; weight: number; options?: undefined; required?: undefined; } | { id: string; question: string; type: &quot;multiple&quot;; options: string[]; weight: number; required?: undefined; } | { ...; } | { ...; }&gt;(predicate: (value: { ...; } | ... 2 more ... | { ...; }, ind...' has signatures, but none of those signatures are compatible with each other.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2337" column="66" code="7006">Parameter 'q' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2387" column="29" code="2345">Argument of type 'Record&lt;string, &quot;&quot; | &quot;operational&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;' is not assignable to parameter of type 'SetStateAction&lt;Record&lt;string, &quot;&quot; | &quot;exception&quot; | &quot;non-operational&quot;&gt;&gt;'.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2433" column="26" code="2349">This expression is not callable.
  Each member of the union type '{ &lt;S extends { referencedControl: string; controlDescription: string; testingDescription: string; auditorResponse: string; managementResponse: string; }&gt;(predicate: (value: { referencedControl: string; controlDescription: string; testingDescription: string; auditorResponse: string; managementResponse: string; }, ind...' has signatures, but none of those signatures are compatible with each other.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2433" column="34" code="7006">Parameter '_' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="2433" column="37" code="7006">Parameter 'i' implicitly has an 'any' type.</problem>
<problem file="app/risk-assessment/ai-assessment/page.tsx" line="4076" column="40" code="2345">Argument of type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; exceptions: string; nonOperationalControls: string; ... 4 more ...; socDateAsOf: string; }' is not assignable to parameter of type 'SetStateAction&lt;{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; socDateAsOf: string; testedStatus: string; ... 5 more ...; userEntityControls: string; }&gt;'.
  Property 'testedStatus' is missing in type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; exceptions: string; nonOperationalControls: string; ... 4 more ...; socDateAsOf: string; }' but required in type '{ socType: string; reportType: string; auditor: string; auditorOpinion: string; auditorOpinionDate: string; socStartDate: string; socEndDate: string; socDateAsOf: string; testedStatus: string; ... 5 more ...; userEntityControls: string; }'.</problem>
<problem file="app/solutions/page.tsx" line="951" column="42" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="952" column="71" code="2531">Object is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="955" column="17" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="960" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="961" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="963" column="23" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="978" column="42" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="979" column="71" code="2531">Object is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="982" column="17" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="987" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="988" column="21" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/solutions/page.tsx" line="990" column="23" code="18047">'carousel' is possibly 'null'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="7" column="80" code="2307">Cannot find module '@/components/ui/form' or its corresponding type declarations.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="39" column="5" code="2322">Type 'Resolver&lt;{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendorRiskMa...' is not assignable to type 'Resolver&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }, any, { ...; }&gt;'.
  Types of parameters 'options' and 'options' are incompatible.
    Type 'ResolverOptions&lt;{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }&gt;' is not assignable to type 'ResolverOptions&lt;{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendo...'.
      Type '{ name: string; email: string; company: string; assessmentData?: string | undefined; dataBreachIncidentResponsePlan?: boolean | undefined; encryptionInTransitAndAtRest?: boolean | undefined; regularSecurityAssessments?: boolean | undefined; accessControlsAndAuthentication?: boolean | undefined; vendorRiskManagementP...' is not assignable to type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }'.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="111" column="45" code="2345">Argument of type '(values: { name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }) =&gt; Promise&lt;...&gt;' is not assignable to parameter of type 'SubmitHandler&lt;TFieldValues&gt;'.
  Types of parameters 'values' and 'data' are incompatible.
    Type 'TFieldValues' is not assignable to type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }'.
      Type 'FieldValues' is missing the following properties from type '{ name: string; email: string; company: string; dataBreachIncidentResponsePlan: boolean; encryptionInTransitAndAtRest: boolean; regularSecurityAssessments: boolean; accessControlsAndAuthentication: boolean; vendorRiskManagementProgram: boolean; assessmentData?: string | undefined; }': name, email, company, dataBreachIncidentResponsePlan, and 4 more.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="115" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="128" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="141" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="155" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="171" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="187" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="203" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="219" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx" line="235" column="26" code="7031">Binding element 'field' implicitly has an 'any' type.</problem>
<problem file="app/third-party-assessment/page.tsx" line="88" column="22" code="2345">Argument of type '{ id: any; vendorName: any; vendorEmail: any; contactPerson: any; assessmentType: any; status: any; sentDate: any; completedDate: any; dueDate: any; riskScore: any; riskLevel: any; companySize: any; customMessage: any; responses: any; completedVendorInfo: any; assessmentAnswers: any; }[]' is not assignable to parameter of type 'SetStateAction&lt;Assessment[]&gt;'.
  Type '{ id: any; vendorName: any; vendorEmail: any; contactPerson: any; assessmentType: any; status: any; sentDate: any; completedDate: any; dueDate: any; riskScore: any; riskLevel: any; companySize: any; customMessage: any; responses: any; completedVendorInfo: any; assessmentAnswers: any; }[]' is not assignable to type 'Assessment[]'.
    Type '{ id: any; vendorName: any; vendorEmail: any; contactPerson: any; assessmentType: any; status: any; sentDate: any; completedDate: any; dueDate: any; riskScore: any; riskLevel: any; companySize: any; customMessage: any; responses: any; completedVendorInfo: any; assessmentAnswers: any; }' is missing the following properties from type 'Assessment': vendor_name, vendor_email, assessment_type, sent_date, and 3 more.</problem>
<problem file="app/third-party-assessment/page.tsx" line="119" column="11" code="2322">Type 'null' is not assignable to type 'number | undefined'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="143" column="11" code="2322">Type '{ id: string; vendor_name: string; vendor_email: string; contact_person: string; assessment_type: string; status: &quot;completed&quot;; sent_date: string; completed_date: string; due_date: string; risk_score: number; ... 6 more ...; assessmentAnswers: { ...; }; }' is not assignable to type 'Assessment'.
  Object literal may only specify known properties, and 'responses' does not exist in type 'Assessment'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="381" column="18" code="2551">Property 'vendorName' does not exist on type 'Assessment'. Did you mean 'vendor_name'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="382" column="18" code="2551">Property 'vendorEmail' does not exist on type 'Assessment'. Did you mean 'vendor_email'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="383" column="18" code="2551">Property 'assessmentType' does not exist on type 'Assessment'. Did you mean 'assessment_type'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="413" column="25" code="2322">Type '{ userEmail: string; onSignOut: (() =&gt; void) | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; NavigationProps'.
  Property 'userEmail' does not exist on type 'IntrinsicAttributes &amp; NavigationProps'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="432" column="25" code="2322">Type '{ userEmail: string; onSignOut: (() =&gt; void) | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; NavigationProps'.
  Property 'userEmail' does not exist on type 'IntrinsicAttributes &amp; NavigationProps'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="561" column="83" code="2551">Property 'vendorName' does not exist on type 'Assessment'. Did you mean 'vendor_name'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="562" column="76" code="2551">Property 'vendorEmail' does not exist on type 'Assessment'. Did you mean 'vendor_email'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="565" column="81" code="2551">Property 'assessmentType' does not exist on type 'Assessment'. Did you mean 'assessment_type'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="566" column="41" code="2551">Property 'riskLevel' does not exist on type 'Assessment'. Did you mean 'risk_level'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="566" column="65" code="2551">Property 'riskLevel' does not exist on type 'Assessment'. Did you mean 'risk_level'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="567" column="78" code="2551">Property 'riskLevel' does not exist on type 'Assessment'. Did you mean 'risk_level'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="568" column="45" code="2551">Property 'riskLevel' does not exist on type 'Assessment'. Did you mean 'risk_level'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="571" column="41" code="2339">Property 'responses' does not exist on type 'Assessment'.</problem>
<problem file="app/third-party-assessment/page.tsx" line="579" column="49" code="2551">Property 'sentDate' does not exist on type 'Assessment'. Did you mean 'sent_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="579" column="80" code="2551">Property 'sentDate' does not exist on type 'Assessment'. Did you mean 'sent_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="581" column="41" code="2551">Property 'dueDate' does not exist on type 'Assessment'. Did you mean 'due_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="581" column="83" code="2551">Property 'dueDate' does not exist on type 'Assessment'. Did you mean 'due_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="582" column="41" code="2551">Property 'completedDate' does not exist on type 'Assessment'. Did you mean 'completed_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="583" column="68" code="2551">Property 'completedDate' does not exist on type 'Assessment'. Did you mean 'completed_date'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="586" column="39" code="2551">Property 'riskScore' does not exist on type 'Assessment'. Did you mean 'risk_score'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="587" column="99" code="2551">Property 'riskScore' does not exist on type 'Assessment'. Did you mean 'risk_score'?</problem>
<problem file="app/third-party-assessment/page.tsx" line="870" column="31" code="2322">Type 'unknown' is not assignable to type 'ReactNode'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="769" column="18" code="18046">'error' is of type 'unknown'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="770" column="16" code="18046">'error' is of type 'unknown'.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="1333" column="47" code="7006">Parameter 'option' implicitly has an 'any' type.</problem>
<problem file="app/vendor-assessment/[id]/page.tsx" line="1344" column="47" code="7006">Parameter 'option' implicitly has an 'any' type.</problem>
<problem file="components/mobile-nav.tsx" line="5" column="51" code="2307">Cannot find module '@/components/ui/sheet' or its corresponding type declarations.</problem>
<problem file="components/theme-provider.tsx" line="9" column="33" code="2339">Property 'children' does not exist on type 'ThemeProviderProps'.</problem>
</dyad-problem-report><think>**Begin Implementation**

I'm now diving into the implementation phase. Based on my analysis, I've outlined the necessary changes to address the 121 TypeScript errors. My approach prioritizes efficiency, starting with the most impactful fixes first. I'll meticulously apply the planned changes, focusing on ensuring each adjustment aligns with the project's overall structure and maintains code integrity.


**Executing the Fixes**

I'm systematically implementing the fixes, beginning with `ai-service.ts` to address the `maxTokens` discrepancies and ensure `question.weight` is handled correctly as a number. Following that, I'll tackle the `pdf-parser.ts` file, ensuring robust type handling for text extraction and access to PDF metadata. Next, I'll move on to `app/analytics/page.tsx`, and make those minor type adjustments. I anticipate smooth sailing for the remaining files, applying the planned changes one by one.


**Initiating Fix Implementation**

I'm now starting the implementation of the fixes. My immediate focus is on `lib/ai-service.ts`, addressing `max_tokens` discrepancies and ensuring the correct handling of `question.weight`. After that, I'll move on to `lib/pdf-parser.ts`, making sure text extraction and metadata access are robust. Then, the focus will shift to `app/analytics/page.tsx` and the simple type adjustments needed there. The changes should be straightforward to implement.


**Implementing the Changes**

I'm now methodically applying the fixes. Starting with `lib/ai-service.ts`, I've adjusted `maxTokens` and ensured `question.weight` is a number. Next, I'll tackle `lib/pdf-parser.ts`, ensuring robust type handling for text and metadata. Progress is steady; the straightforward changes in `app/analytics/page.tsx` will follow. I'll maintain this structured approach for the remaining files.


</think>Okay, I understand the remaining TypeScript errors. It seems like a mix of type mismatches, implicit `any` types, missing component imports, and incorrect property access on potentially null/undefined objects.

I'll go through and fix these errors by:

1.  **Correcting AI SDK parameter**: Changing `maxTokens` to `max_tokens` in `lib/ai-service.ts`.
2.  **Refining PDF parsing types**: Ensuring `text` is always a string and casting metadata to `any` in `lib/pdf-parser.ts`.
3.  **Adding explicit types**: Specifying types for parameters in `map`, `sort`, and event handlers.
4.  **Importing missing UI components**: Adding `Label` and `Input` imports where needed.
5.  **Creating `components/ui/form.tsx`**: This file is missing but referenced by `app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx`. I'll create it with the necessary `Form` components.
6.  **Adjusting form schema and handlers**: Modifying types in `app/third-party-assessment/ThirdPartyAssessmentClientPage.tsx` to align with `react-hook-form` and `zod`.
7.  **Updating `Assessment` interface and data mapping**: Creating a `UIAssessment` interface for UI-specific data and mapping database fields correctly in `app/third-party-assessment/page.tsx`.
8.  **Removing unused `MainNavigation` props**: Removing `userEmail` and `onSignOut` from `MainNavigation` calls.
9.  **Adding null checks**: Implementing checks for potentially `null` or `undefined` objects.
10. **Creating `components/ui/sheet.tsx`**: This file is missing but referenced by `components/mobile-nav.tsx`. I'll create it with the necessary `Sheet` components.
11. **Updating `ThemeProviderProps`**: Adding `children: React.ReactNode` to the `ThemeProviderProps` interface.

These changes will resolve all the reported TypeScript errors.

<dyad-write path="lib/ai-service.ts" description="Updating AI SDK calls to use 'max_tokens' instead of 'maxTokens' and refining types for document excerpts.">
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export interface DocumentAnalysisResult {
  answers: Record<string, boolean | string>
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
    }>
  >
  directUploadResults?: Array<{
    fileName: string
    success: boolean
    fileSize: number
    fileType: string
    processingMethod: string
  }>
}

interface Question {
  id: string
  question: string
  type: "boolean" | "multiple" | "tested"
  options?: string[]
  weight: number
}

// Convert file to buffer for Google AI API
async function fileToBuffer(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer()
}

// Extract text content from files directly (for non-PDF files)
async function extractTextFromFile(file: File): Promise<{ text: string; success: boolean; method: string }> {
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  try {
    // Handle PDF files - we'll send these directly to Google AI
    if (fileType.includes("application/pdf") || fileName.endsWith(".pdf")) {
      console.log(`📄 PDF file detected: ${file.name} - will be sent directly to Google AI`)
      return {
        text: "", // Empty text - PDF will be sent as file attachment
        success: true,
        method: "pdf-direct-upload",
      }
    }

    // Handle plain text files
    if (fileType.includes("text/plain") || fileName.endsWith(".txt")) {
      const text = await file.text()
      console.log(`✅ Text file processed: ${text.length} characters`)
      return {
        text,
        success: true,
        method: "direct-text",
      }
    }

    // Handle other supported text-based formats
    if (
      fileName.endsWith(".md") ||
      fileName.endsWith(".csv") ||
      fileName.endsWith(".json") ||
      fileName.endsWith(".html") ||
      fileName.endsWith(".xml")
    ) {
      const text = await file.text()
      console.log(`✅ ${fileName.split(".").pop()?.toUpperCase()} file processed: ${text.length} characters`)
      return {
        text,
        success: true,
        method: "direct-text",
      }
    }

    // Fallback for other files
    return {
      text: `[UNSUPPORTED FILE: ${file.name}] - File format not supported for text extraction`,
      success: false,
      method: "unsupported",
    }
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error)
    return {
      text: `[ERROR: ${file.name}] - ${error instanceof Error ? error.message : "Unknown error"}`,
      success: false,
      method: "error",
    }
  }
}

// Check if file type is supported by Google AI
function isSupportedFileType(file: File): boolean {
  const supportedTypes = [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/json",
    "text/html",
    "application/xml",
    "text/xml",
  ]

  const supportedExtensions = [".pdf", ".txt", ".md", ".csv", ".json", ".html", ".xml", ".htm"]

  return (
    supportedTypes.includes(file.type.toLowerCase()) ||
    supportedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  )
}

// Get media type for Google AI API
function getGoogleAIMediaType(file: File): string {
  const fileName = file.name.toLowerCase()

  if (file.type) {
    return file.type
  }

  // Fallback based on file extension
  if (fileName.endsWith(".pdf")) return "application/pdf"
  if (fileName.endsWith(".txt")) return "text/plain"
  if (fileName.endsWith(".md")) return "text/markdown"
  if (fileName.endsWith(".csv")) return "text/csv"
  if (fileName.endsWith(".json")) return "application/json"
  if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return "text/html"
  if (fileName.endsWith(".xml")) return "application/xml"

  return "application/octet-stream"
}

// Enhanced cybersecurity concept mapping for better evidence validation
const CYBERSECURITY_CONCEPTS = {
  "penetration testing": [
    "penetration test",
    "pen test",
    "pentest",
    "security testing",
    "vulnerability assessment",
    "ethical hacking",
    "red team",
    "security audit",
    "intrusion testing",
    "security evaluation",
    "vulnerability testing",
  ],
  "anti-malware": [
    "antivirus",
    "anti-virus",
    "malware protection",
    "endpoint protection",
    "virus scanner",
    "malware detection",
    "threat protection",
    "security software",
  ],
  "vulnerability scanning": [
    "vulnerability scan",
    "vulnerability scanning",
    "security scan",
    "network scan",
    "system scan",
    "security assessment",
    "vulnerability assessment",
    "automated scanning",
    "security monitoring",
    "vulnerability testing",
    "security evaluation",
    "vulnerability analysis",
  ],
  "disciplinary measures": [
    "disciplinary action",
    "penalties",
    "sanctions",
    "enforcement",
    "consequences",
    "violations",
    "non-compliance",
    "corrective action",
    "punishment",
    "disciplinary procedures",
  ],
  "incident response": [
    "incident response",
    "security incident",
    "breach response",
    "emergency response",
    "incident handling",
    "incident management",
    "security breach",
    "cyber incident",
  ],
  "policy review": [
    "policy review",
    "policy update",
    "policy revision",
    "annual review",
    "policy maintenance",
    "policy evaluation",
    "policy assessment",
    "document review",
  ],
  "access control": [
    "access control",
    "user access",
    "authentication",
    "authorization",
    "permissions",
    "access management",
    "identity management",
    "user privileges",
  ],
  encryption: [
    "encryption",
    "encrypted",
    "cryptographic",
    "data protection",
    "secure transmission",
    "data at rest",
    "data in transit",
    "cryptography",
  ],
  backup: [
    "backup",
    "data backup",
    "backup procedures",
    "recovery",
    "disaster recovery",
    "business continuity",
    "data restoration",
    "backup strategy",
  ],
  training: [
    "training",
    "awareness",
    "education",
    "security training",
    "staff training",
    "employee training",
    "security awareness",
    "cybersecurity training",
  ],
}

// Enhanced semantic relevance checking
function checkSemanticRelevance(
  question: string,
  evidence: string,
): { isRelevant: boolean; confidence: number; reason: string } {
  const questionLower = question.toLowerCase()
  const evidenceLower = evidence.toLowerCase()

  // Skip relevance check if evidence indicates no content found
  if (
    evidenceLower.includes("no directly relevant evidence found") ||
    evidenceLower.includes("no evidence found") ||
    evidenceLower.includes("insufficient information")
  ) {
    return {
      isRelevant: false,
      confidence: 0.1,
      reason: "No evidence found in documents",
    }
  }

  const isVulnerabilityQuestion =
    questionLower.includes("vulnerability") ||
    questionLower.includes("penetration") ||
    questionLower.includes("pen test") ||
    questionLower.includes("security test") ||
    questionLower.includes("security scan")

  if (isVulnerabilityQuestion) {
    // For vulnerability questions, check for broader security-related terms
    const vulnerabilityTerms = [
      "vulnerability",
      "penetration",
      "pen test",
      "pentest",
      "security test",
      "security scan",
      "security assessment",
      "vulnerability scan",
      "vulnerability assessment",
      "security evaluation",
      "vulnerability testing",
      "security audit",
      "intrusion test",
    ]

    const hasVulnerabilityTerms = vulnerabilityTerms.some((term) => evidenceLower.includes(term))

    if (hasVulnerabilityTerms && evidenceLower.length > 20) {
      return {
        isRelevant: true,
        confidence: 0.85,
        reason: "Evidence contains vulnerability/security testing related content",
      }
    }
  }

  // Find the primary concept in the question
  let primaryConcept = ""
  let conceptKeywords: string[] = []

  for (const [concept, keywords] of Object.entries(CYBERSECURITY_CONCEPTS)) {
    if (keywords.some((keyword) => questionLower.includes(keyword))) {
      primaryConcept = concept
      conceptKeywords = keywords
      break
    }
  }

  if (!primaryConcept) {
    // Fallback to basic keyword extraction
    const questionWords = questionLower.split(/\s+/).filter((word) => word.length > 3)
    conceptKeywords = questionWords.slice(0, 3)
    primaryConcept = "general"
  }

  // Check if evidence contains relevant keywords
  const relevantKeywords = conceptKeywords.filter((keyword) => evidenceLower.includes(keyword.toLowerCase()))

  if (relevantKeywords.length === 0) {
    // For general questions, be more lenient
    if (primaryConcept === "general" && evidenceLower.length > 50) {
      return {
        isRelevant: true,
        confidence: 0.6,
        reason: "General evidence found for broad question",
      }
    }

    return {
      isRelevant: false,
      confidence: 0.1,
      reason: `Evidence does not contain keywords related to ${primaryConcept}.`,
    }
  }

  // Calculate confidence based on keyword matches and context
  const keywordRatio = relevantKeywords.length / conceptKeywords.length
  let confidence = keywordRatio * 0.8

  // Boost confidence if multiple relevant keywords are found
  if (relevantKeywords.length >= 2) {
    confidence = Math.min(confidence + 0.2, 0.95)
  }

  return {
    isRelevant: true,
    confidence: Math.max(confidence, 0.6),
    reason: `Evidence contains relevant keywords: ${relevantKeywords.join(", ")}`,
  }
}

// Direct Google AI analysis with file upload support
async function performDirectAIAnalysis(
  files: File[],
  questions: Question[],
  assessmentType: string,
): Promise<DocumentAnalysisResult> {
  console.log("🤖 Starting direct Google AI analysis with file upload support...")

  // Check if Google AI API key is available
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Google AI API key not found. Please add GOOGLE_GENERATIVE_AI_API_KEY environment variable.")
  }

  // Filter and process supported files
  const supportedFiles = files.filter((file) => isSupportedFileType(file))
  const unsupportedFiles = files.filter((file) => !isSupportedFileType(file))

  console.log(`📊 File Analysis:`)
  console.log(`✅ Supported files: ${supportedFiles.length}`)
  console.log(`❌ Unsupported files: ${unsupportedFiles.length}`)

  if (supportedFiles.length === 0) {
    console.log("❌ No supported files found for analysis")

    const answers: Record<string, boolean | string> = {}
    const confidenceScores: Record<string, number> = {}
    const reasoning: Record<string, string> = {}

    questions.forEach((question) => {
      if (question.type === "boolean") {
        answers[question.id] = false
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No supported documents available for analysis. Defaulting to 'No' for safety."
      } else if (question.type === "multiple" && question.options) {
        answers[question.id] = question.options[0] || "Never"
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No supported documents available for analysis. Using most conservative option."
      } else if (question.type === "tested") {
        answers[question.id] = "not_tested"
        confidenceScores[question.id] = 0.95
        reasoning[question.id] = "No supported documents available for analysis. Defaulting to 'Not Tested' for safety."
      }
    })

    return {
      answers,
      confidenceScores,
      reasoning,
      overallAnalysis: `No supported documents were available for Google AI analysis. Supported formats: PDF, TXT, MD, CSV, JSON, HTML, XML. Unsupported files: ${unsupportedFiles.map((f) => f.name).join(", ")}`,
      riskFactors: [
        "No supported document content available for analysis",
        "Unable to assess actual security posture from uploaded files",
        `${unsupportedFiles.length} files in unsupported formats`,
      ],
      recommendations: [
        "Upload documents in supported formats: PDF, TXT, MD, CSV, JSON, HTML, XML",
        "Convert Word documents to PDF or TXT format",
        "Convert Excel files to CSV format",
        "Ensure files contain actual policy and procedure content",
      ],
      riskScore: 0,
      riskLevel: "High",
      analysisDate: new Date().toISOString(),
      documentsAnalyzed: files.length,
      aiProvider: "Conservative Analysis (No supported files found)",
      documentExcerpts: {},
      directUploadResults: files.map((file) => ({
        fileName: file.name,
        success: false,
        fileSize: file.size,
        fileType: file.type || "unknown",
        processingMethod: "no-supported-files",
      })),
    }
  }

  // Test Google AI connection
  try {
    console.log("🔗 Testing Google AI connection...")
    const testResult = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: "Reply with 'OK' if you can read this.",
      max_tokens: 10, // Changed from maxTokens
      temperature: 0.1,
    })

    if (!testResult.text.toLowerCase().includes("ok")) {
      throw new Error("Google AI test failed - unexpected response")
    }
    console.log("✅ Google AI connection successful")
  } catch (error) {
    console.error("❌ Google AI test failed:", error)
    throw new Error(`Google AI is not available: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  // Process files - separate PDFs from text files
  console.log("📁 Processing files for Google AI...")
  const pdfFiles: File[] = []
  const textFiles: Array<{ file: File; text: string }> = []
  const processingResults: Array<{ fileName: string; success: boolean; method: string }> = []

  for (const file of supportedFiles) {
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()

    if (fileType.includes("application/pdf") || fileName.endsWith(".pdf")) {
      pdfFiles.push(file)
      processingResults.push({ fileName: file.name, success: true, method: "pdf-upload" })
      console.log(`📄 PDF file prepared for upload: ${file.name}`)
    } else {
      // Extract text from non-PDF files
      const extraction = await extractTextFromFile(file)
      if (extraction.success && extraction.text.length > 0) {
        textFiles.push({ file, text: extraction.text })
        processingResults.push({ fileName: file.name, success: true, method: extraction.method })
        console.log(`📝 Text extracted from ${file.name}: ${extraction.text.length} characters`)
      } else {
        processingResults.push({ fileName: file.name, success: false, method: extraction.method })
        console.log(`❌ Failed to extract text from ${file.name}`)
      }
    }
  }

  // Create comprehensive prompt for Google AI
  let documentContent = ""

  // Add text file content
  if (textFiles.length > 0) {
    documentContent += "TEXT DOCUMENTS:\n"
    textFiles.forEach(({ file, text }) => {
      documentContent += `\n=== DOCUMENT: ${file.name} ===\n${text}\n`
    })
  }

  // Add PDF file references
  if (pdfFiles.length > 0) {
    documentContent += "\nPDF DOCUMENTS:\n"
    pdfFiles.forEach((file) => {
      documentContent += `\n=== PDF DOCUMENT: ${file.name} ===\n[This PDF file has been uploaded and will be analyzed directly]\n`
    })
  }

  const basePrompt = `You are a cybersecurity expert analyzing documents for ${assessmentType} risk assessment. You have been provided with ${supportedFiles.length} document(s) to analyze.

CRITICAL INSTRUCTIONS:
- Analyze ALL provided documents (both text and PDF files) using your built-in document processing capabilities
- Answer questions based ONLY on information that is DIRECTLY and SPECIFICALLY found in the documents
- For PDF files, use your native PDF reading capabilities to extract and analyze the content
- THOROUGHLY scan ALL sections, pages, and content areas of each document
- Look for ALL cybersecurity-related content including but not limited to:
  * VULNERABILITY ASSESSMENTS: vulnerability scans, security scans, penetration testing, pen tests, pentests, security testing, vulnerability assessment, ethical hacking, red team, security audit, intrusion testing, security evaluation, vulnerability analysis
  * PENETRATION TESTING: penetration tests, pen tests, pentests, ethical hacking, red team exercises, intrusion testing, security audits
  * Security policies, procedures, controls, and measures
  * Access controls, authentication, authorization, user management
  * Incident response, breach procedures, emergency protocols
  * Data protection, encryption, backup procedures, recovery plans
  * Training programs, awareness initiatives, security education
  * Compliance requirements, audit procedures, review processes
  * Network security, endpoint protection, malware protection
  * Risk management, threat assessment, security monitoring
- SPECIAL ATTENTION: When looking for vulnerability assessments or penetration testing, search for ANY of these terms: "vulnerability scan", "vulnerability scanning", "vulnerability assessment", "vulnerability testing", "vulnerability analysis", "penetration test", "pen test", "pentest", "security test", "security testing", "security scan", "security assessment", "security evaluation", "security audit", "intrusion test", "ethical hacking", "red team"
- If evidence is about a different cybersecurity topic than what's being asked, DO NOT use it
- Answer "Yes" for boolean questions ONLY if you find clear, direct evidence in the documents
- Answer "No" for boolean questions if no directly relevant evidence exists
- Quote exact text from the documents that SPECIFICALLY relates to each question topic
- Do NOT make assumptions or use general knowledge beyond what's in the documents
- Be thorough and comprehensive - scan every section, paragraph, and page for relevant content
- Pay special attention to technical sections, appendices, and detailed procedure descriptions

DOCUMENT FILES PROVIDED:
${supportedFiles.map((file, index) => `${index + 1}. ${file.name} (${getGoogleAIMediaType(file)})`).join("\n")}

${documentContent}

ASSESSMENT QUESTIONS:
${questions.map((q, idx) => `${idx + 1}. ID: ${q.id} - ${q.question} (Type: ${q.type}${q.options ? `, Options: ${q.options.join(", ")}` : ""})`).join("\n")}

Respond ONLY with a JSON object. Do NOT include any markdown code blocks (e.g., \`\`\`json) or conversational text outside the JSON. Ensure all property names are double-quoted.
{
  "answers": {
    ${questions.map((q) => `"${q.id}": ${q.type === "boolean" ? '"Yes" or "No"' : '"your_answer"'}`).join(",\n    ")}
  },
  "confidence": {
    ${questions.map((q) => `"${q.id}": 0.8`).join(",\n    ")}
  },
  "reasoning": {
    ${questions.map((q) => `"${q.id}": "explanation with DIRECTLY RELEVANT evidence from documents or 'No directly relevant evidence found after comprehensive search'"`).join(",\n    ")}
  },
  "evidence": {
    ${questions.map((q) => `"${q.id}": "exact quote from documents that SPECIFICALLY addresses this question topic, including document name and section, or 'No directly relevant evidence found after comprehensive search'"`).join(",\n    ")}
  }
}`

  // Process questions with Google AI - include PDF files if present
  const answers: Record<string, boolean | string> = {}
  const confidenceScores: Record<string, number> = {}
  const reasoning: Record<string, string> = {}
  const documentExcerpts: Record<string, Array<any>> = {}

  try {
    console.log("🧠 Processing documents with Google AI (including PDFs)...")

    let result;

    if (pdfFiles.length > 0) {
      console.log(`📄 Sending ${pdfFiles.length} PDF file(s) directly to Google AI...`)

      const pdfAttachments = await Promise.all(
        pdfFiles.map(async (file) => {
          try {
            const bufferData = await fileToBuffer(file)
            console.log(`✅ Converted ${file.name} to buffer (${Math.round(bufferData.byteLength / 1024)}KB)`)
            return {
              name: file.name,
              data: bufferData,
              mediaType: getGoogleAIMediaType(file),
            }
          } catch (error) {
            console.error(`❌ Failed to convert ${file.name} to buffer:`, error)
            return null
          }
        }),
      )

      // Filter out failed conversions
      const validPdfAttachments = pdfAttachments.filter((attachment) => attachment !== null)

      if (validPdfAttachments.length > 0) {
        const messageContent = [
          { type: "text" as const, text: basePrompt },
          ...validPdfAttachments.map((attachment) => ({
            type: "file" as const,
            data: attachment!.data,
            mediaType: attachment!.mediaType,
          })),
        ]

        result = await generateText({
          model: google("gemini-1.5-flash"),
          messages: [
            {
              role: "user" as const,
              content: messageContent,
            },
          ],
          temperature: 0.1,
          max_tokens: 4000, // Changed from maxTokens
        })
        console.log(`✅ Successfully processed ${validPdfAttachments.length} PDF file(s) with Google AI`)
      } else {
        // Fallback to text-only if PDF conversion failed
        console.log("⚠️ PDF conversion failed, falling back to text-only analysis")
        result = await generateText({
          model: google("gemini-1.5-flash"),
          prompt: basePrompt,
          temperature: 0.1,
          max_tokens: 4000, // Changed from maxTokens
        })
      }
    } else {
      // Text-only analysis
      result = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: basePrompt,
        temperature: 0.1,
        max_tokens: 4000, // Changed from maxTokens
      })
    }

    console.log(`📝 Google AI response received (${result.text.length} characters)`)
    console.log(`🔍 Response preview: ${result.text.substring(0, 200)}...`)

    let rawAiResponseText = result.text;

    // Attempt to strip markdown code block fences if present
    if (rawAiResponseText.startsWith("```json")) {
      rawAiResponseText = rawAiResponseText.substring(7); // Remove "```json\n"
    }
    if (rawAiResponseText.endsWith("```")) {
      rawAiResponseText = rawAiResponseText.substring(0, rawAiResponseText.length - 3); // Remove "\n```"
    }
    rawAiResponseText = rawAiResponseText.trim(); // Trim any remaining whitespace

    // Parse AI response
    try {
      const aiResponse = JSON.parse(rawAiResponseText)
      console.log(`✅ Successfully parsed AI response JSON`)

      // Process each question with enhanced validation
      questions.forEach((question) => {
        const questionId = question.id
        const aiAnswer = aiResponse.answers?.[questionId]
        const aiEvidence = aiResponse.evidence?.[questionId]
        const aiReasoning = aiResponse.reasoning?.[questionId]
        const aiConfidence = aiResponse.confidence?.[questionId] || 0.5

        console.log(
          `🔍 Processing question ${questionId}: Answer=${aiAnswer}, Evidence length=${aiEvidence?.length || 0}`,
        )

        // Perform semantic relevance check
        if (
          aiEvidence &&
          typeof aiEvidence === "string" &&
          !aiEvidence.toLowerCase().includes("no directly relevant evidence found") &&
          aiEvidence.length > 20
        ) {
          const relevanceCheck = checkSemanticRelevance(question.question, aiEvidence)
          console.log(
            `🎯 Relevance check for ${questionId}: ${relevanceCheck.isRelevant ? "RELEVANT" : "NOT RELEVANT"} - ${relevanceCheck.reason}`,
          )

          if (relevanceCheck.isRelevant) {
            // Evidence is relevant - use AI's answer
            answers[questionId] = aiAnswer
            confidenceScores[questionId] = Math.min(aiConfidence, relevanceCheck.confidence)
            reasoning[questionId] = aiReasoning || "Evidence found and validated as relevant"

            // Extract document name from evidence
            let sourceFileName = supportedFiles.length > 0 ? supportedFiles[0].name : "Document"
            const documentNameMatch = aiEvidence.match(
              /(?:from|in|document|file)[\s:]*([^,.\n]+\.(pdf|txt|md|csv|json|html|xml))/i,
            )
            if (documentNameMatch) {
              sourceFileName = documentNameMatch[1].trim()
            } else {
              // Try to match against uploaded file names
              const matchingFile = supportedFiles.find((file) =>
                aiEvidence.toLowerCase().includes(file.name.toLowerCase().replace(/\.[^.]+$/, "")),
              )
              if (matchingFile) {
                sourceFileName = matchingFile.name
              }
            }

            let cleanExcerpt = aiEvidence

            // Remove document name patterns from the beginning or end of quotes
            cleanExcerpt = cleanExcerpt.replace(/^["\s]*[^"]*\.(pdf|txt|md|csv|json|html|xml)["\s]*:?\s*/i, "")
            cleanExcerpt = cleanExcerpt.replace(/["\s]*[^"]*\.(pdf|txt|md|csv|json|html|xml)["\s]*$/i, "")

            // Remove any remaining document name references within quotes
            supportedFiles.forEach((file) => {
              const fileName = file.name.replace(/\.[^.]+$/, "") // Remove extension
              const fileNamePattern = new RegExp(`\\b${fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
              cleanExcerpt = cleanExcerpt.replace(fileNamePattern, "").trim()

              // Also remove the full filename with extension
              const fullFileNamePattern = new RegExp(
                `\\b${file.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
                "gi",
              )
              cleanExcerpt = cleanExcerpt.replace(fullFileNamePattern, "").trim()
            })

            // Remove common document reference patterns
            cleanExcerpt = cleanExcerpt
              .replace(/\b[A-Za-z-]+\.(pdf|txt|md|csv|json|html|xml)\b/gi, "")
              .trim()

            // Clean up extra spaces and punctuation
            cleanExcerpt = cleanExcerpt
              .replace(/\s+/g, " ")
              .replace(/^[,.\s]+|[,.\s]+$/g, "")
              .trim()

            // Remove any existing quotes and add proper ones
            cleanExcerpt = cleanExcerpt.replace(/^["']+|["']+$/g, "").trim()

            // Ensure we still have meaningful content after cleaning
            if (cleanExcerpt.length < 5) {
              // If cleaning removed too much, extract just the meaningful text without document references
              const meaningfulText = aiEvidence
                .replace(/\b[A-Za-z-]+\.(pdf|txt|md|csv|json|html|xml)\b/gi, "")
                .trim()
              cleanExcerpt = meaningfulText.substring(0, 200).trim()
            }

            documentExcerpts[questionId] = [
              {
                fileName: sourceFileName,
                excerpt: cleanExcerpt.substring(0, 500), // Use cleaned excerpt instead of raw aiEvidence
                relevance: `Evidence found within ${sourceFileName}`,
                pageOrSection: "Document Content",
              },
            ]
          } else {
            // Evidence is not relevant - use conservative answer
            console.log(`❌ Question ${questionId}: Evidence rejected - ${relevanceCheck.reason}`)

            if (question.type === "boolean") {
              answers[questionId] = false
            } else if (question.options && question.options.length > 0) {
              answers[questionId] = question.options[0] // Most conservative option
            } else if (question.type === "tested") {
              answers[questionId] = "not_tested"
            }

            confidenceScores[questionId] = 0.9 // High confidence in conservative answer
            reasoning[questionId] = `No directly relevant evidence found. ${relevanceCheck.reason}`
            documentExcerpts[questionId] = []
          }
        } else {
          // No evidence provided - use conservative answer
          console.log(`⚠️ Question ${questionId}: No evidence provided by AI`)

          if (question.type === "boolean") {
            answers[questionId] = false
          } else if (question.options && question.options.length > 0) {
            answers[questionId] = question.options[0]
          } else if (question.type === "tested") {
            answers[questionId] = "not_tested"
          }

          confidenceScores[questionId] = 0.9
          reasoning[questionId] = "No directly relevant evidence found in documents"
          documentExcerpts[questionId] = []
        }
      })
    } catch (parseError) {
      console.error("❌ Failed to parse AI response JSON:", parseError)
      console.log("Raw AI response (after stripping markdown):", rawAiResponseText)
      throw new Error("Invalid AI response format - JSON parsing failed")
    }
  } catch (error) {
    console.error("❌ Google AI processing failed:", error)
    // Fallback to conservative answers
    questions.forEach((question) => {
      answers[question.id] = question.type === "boolean" ? false : question.options?.[0] || "Never"
      confidenceScores[question.id] = 0.1
      reasoning[question.id] = `AI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      documentExcerpts[question.id] = []
    })
  }

  // Calculate risk score
  let totalScore = 0
  let maxScore = 0

  questions.forEach((question) => {
    const answer = answers[question.id]
    
    if (question.type === "tested") {
      maxScore += question.weight;
      if (answer === "tested") {
        totalScore += question.weight;
      }
    } else if (question.type === "boolean") {
      maxScore += question.weight
      totalScore += answer ? question.weight : 0
    } else if (question.type === "multiple" && question.options) {
      maxScore += question.weight * 4
      const optionIndex = question.options.indexOf(answer as string)
      if (optionIndex !== -1) {
        const scoreMultiplier = (question.options.length - 1 - optionIndex) / (question.options.length - 1)
        totalScore += question.weight * scoreMultiplier * 4
      }
    }
  })

  const riskScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  let riskLevel = "High"
  if (riskScore >= 75) riskLevel = "Low"
  else if (riskScore >= 50) riskLevel = "Medium"
  else if (riskScore >= 25) riskLevel = "Medium-High"

  // Generate analysis summary
  const successfulProcessing = processingResults.filter((r) => r.success).length
  const failedProcessing = processingResults.filter((r) => !r.success).length

  let analysisNote = `Analysis completed using Google AI with direct document processing.`
  if (successfulProcessing > 0) {
    analysisNote += ` Successfully processed ${successfulProcessing} document(s).`
  }
  if (pdfFiles.length > 0) {
    analysisNote += ` ${pdfFiles.length} PDF file(s) analyzed using Google AI's native PDF capabilities.`
  }
  if (failedProcessing > 0) {
    analysisNote += ` ${failedProcessing} file(s) failed to process.`
  }
  if (unsupportedFiles.length > 0) {
    analysisNote += ` ${unsupportedFiles.length} file(s) in unsupported formats were skipped.`
  }

  console.log(`✅ Google AI analysis completed. Risk score: ${riskScore}, Risk level: ${riskLevel}`)

  return {
    answers,
    confidenceScores,
    reasoning,
    overallAnalysis: analysisNote,
    riskFactors: [
      "Analysis based on direct Google AI document processing",
      "Conservative approach taken where evidence was unclear or missing",
      "Semantic validation applied to all evidence",
      ...(failedProcessing > 0 ? [`${failedProcessing} files failed to process`] : []),
      ...(unsupportedFiles.length > 0 ? [`${unsupportedFiles.length} files in unsupported formats`] : []),
    ],
    recommendations: [
      "Review assessment results for accuracy and completeness",
      "Implement missing controls based on validated findings",
      "Ensure document evidence directly supports all conclusions",
      "Consider uploading additional documentation for comprehensive analysis",
      ...(unsupportedFiles.length > 0 ? ["Convert unsupported files to PDF, TXT, or other supported formats"] : []),
    ],
    riskScore,
    riskLevel,
    analysisDate: new Date().toISOString(),
    documentsAnalyzed: files.length,
    aiProvider: "Google AI (Gemini 1.5 Flash) with Direct Document Processing",
    documentExcerpts,
    directUploadResults: files.map((file, index) => {
      const result = processingResults.find((r) => r.fileName === file.name)
      return {
        fileName: file.name,
        success: result?.success || false,
        fileSize: file.size,
        fileType: file.type || "unknown",
        processingMethod: result?.method || "unknown",
      }
    }),
  }
}

// Main analysis function
export async function analyzeDocuments(
  files: File[],
  questions: Question[],
  assessmentType: string,
): Promise<DocumentAnalysisResult> {
  console.log(`🚀 Starting Google AI analysis of ${files.length} files for ${assessmentType}`)

  if (!files || files.length === 0) {
    throw new Error("No files provided for analysis")
  }

  if (!questions || questions.length === 0) {
    throw new Error("No questions provided for analysis")
  }

  try {
    console.log("📁 File analysis:")
    files.forEach((file, index) => {
      const supported = isSupportedFileType(file)
      const statusIcon = supported ? "✅" : "❌"
      const supportText = supported ? "Supported for analysis" : "Unsupported format"
      console.log(
        `${statusIcon} ${file.name}: ${Math.round(file.size / 1024)}KB, ${file.type || "unknown"} - ${supportText}`,
      )
    })

    // Perform direct AI analysis
    const result = await performDirectAIAnalysis(files, questions, assessmentType)

    console.log("🎉 Google AI analysis completed successfully")
    return result
  } catch (error) {
    console.error("💥 Analysis failed:", error)
    throw error
  }
}

// Test Google AI provider
export async function testAIProviders(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  // Test Google AI
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      const result = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: 'Respond with "OK" if you can read this.',
        max_tokens: 10, // Changed from maxTokens
        temperature: 0.1,
      })
      results.google = result.text.toLowerCase().includes("ok")
      console.log("Google AI test result:", results.google)
    } catch (error) {
      console.error("Google AI test failed:", error)
      results.google = false
    }
  } else {
    console.log("Google AI API key not found")
    results.google = false
  }

  return results
}