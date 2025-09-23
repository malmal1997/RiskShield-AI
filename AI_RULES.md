# AI Application Rules

This document outlines the core technologies and best practices for developing the RiskShield AI application.

## Tech Stack Overview

The application is built using a modern web development stack, focusing on performance, maintainability, and a rich user experience.

*   **React & Next.js:** The foundation for building dynamic and server-rendered user interfaces. Next.js provides file-system based routing, API routes, and optimized builds.
*   **TypeScript:** Ensures type safety across the entire codebase, leading to fewer bugs and improved code readability and maintainability.
*   **Tailwind CSS:** The primary utility-first CSS framework for styling. All UI components should leverage Tailwind classes for responsive and consistent design.
*   **shadcn/ui & Radix UI:** A collection of beautifully designed and accessible UI components. shadcn/ui components are preferred for building the user interface, leveraging Radix UI primitives underneath.
*   **Supabase:** Used for backend services including database management, authentication, and real-time data subscriptions.
*   **AI SDK (Vercel AI SDK):** The library for integrating AI models, specifically Google Gemini, for document analysis and intelligent features.
*   **Lucide React:** A comprehensive icon library used for all visual icons throughout the application.
*   **React Hook Form & Zod:** Employed for robust form management and validation, ensuring data integrity and a smooth user input experience.
*   **Recharts:** A composable charting library for building interactive data visualizations and analytics dashboards.
*   **Resend:** Utilized for sending transactional emails, such as assessment invitations and completion notifications.
*   **jsPDF & pdfjs-dist:** Used for client-side PDF generation and advanced PDF document parsing/text extraction, respectively.

## Library Usage Guidelines

To maintain consistency and efficiency, please adhere to the following guidelines when using libraries:

*   **React & Next.js:** Use as the core framework. Routing is handled by Next.js's file-system based routing (files within the `app/` directory define routes).
*   **TypeScript:** Always use TypeScript for all new files and modifications.
*   **Tailwind CSS:** All styling should be done using Tailwind CSS utility classes. Avoid custom CSS files unless absolutely necessary for complex, non-utility-based styles.
*   **shadcn/ui & Radix UI:**
    *   Prioritize `shadcn/ui` components for all UI elements (e.g., Button, Card, Input, Dialog, Tabs).
    *   If a specific component is not available in `shadcn/ui`, you may use a `Radix UI` primitive directly, but ensure it's styled consistently with Tailwind CSS.
    *   **Do NOT modify `shadcn/ui` component files directly.** If customization is needed beyond what props allow, create a new component that wraps or extends the `shadcn/ui` component.
*   **Supabase (`@supabase/supabase-js`):** Use for all database interactions, user authentication, and real-time features. Ensure `supabaseClient` (client-side) and `supabase` (server-side/public access) are used appropriately.
*   **AI SDK (`ai`, `@ai-sdk/google`):** Use for all interactions with AI models, including text generation and document analysis in API routes and server actions.
*   **Lucide React:** Use for all icons. Import icons directly from `lucide-react`.
*   **React Hook Form & Zod:** Use for defining form schemas and handling form state, validation, and submission.
*   **Recharts:** Use for rendering all charts and graphs in analytics and dashboard views.
*   **Resend:** Use the `sendAssessmentEmail` and `notifyAssessmentCompletion` functions (or similar) for all email sending functionality. Ensure `RESEND_API_KEY` is configured.
*   **jsPDF & pdfjs-dist:** Use for client-side PDF generation and advanced PDF document parsing/text extraction, respectively.

## AI Analysis Citation Requirements

**CRITICAL: Citation Format Preservation**

When performing AI document analysis, the citation format with quotes, document names, and page numbers MUST be preserved exactly as implemented. This format provides essential traceability and evidence for risk assessments.

**Required Citation Elements:**
*   **Direct quotes** from source documents
*   **Document name/filename** for each citation
*   **Page number** reference where available
*   **Structured evidence format** that allows clients to verify findings

**Implementation Rule:**
*   Never modify the citation structure in `lib/ai-service.ts`
*   Always include `documentExcerpts` with full evidence details in AI responses
*   Preserve the semantic relevance checking for citation accuracy
*   Maintain the detailed evidence format in saved reports for client reference

This citation system is essential for regulatory compliance and client trust - any changes to this format require explicit approval.
