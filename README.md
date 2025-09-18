# RiskShield AI - Intelligent Risk Assessment Platform

Welcome to RiskShield AI, an AI-powered platform designed to streamline risk assessment and compliance management for financial institutions and organizations across various industries.

## Features

-   **AI-Powered Risk Assessments:** Upload documents (policies, reports, procedures) and let AI analyze them to automatically answer assessment questions, calculate risk scores, and generate reports.
-   **Third-Party Vendor Management:** Send secure assessment invitations to vendors, track their responses, and monitor their risk posture.
-   **Policy Generation & Library:** Generate comprehensive, regulatory-compliant policies tailored to your organization's needs using advanced AI. Manage all your policies in a centralized library with version control and approval workflows.
-   **Compliance Monitoring:** Track adherence to federal and state regulations (e.g., FDIC, GLBA, GDPR, CCPA, SOC 2, ISO 27001, NIST).
-   **Real-Time Analytics & Reporting:** Gain insights into your overall risk posture, vendor risk levels, and compliance status with interactive dashboards and customizable reports.
-   **Multi-tenant Architecture:** Securely manage multiple organizations with role-based access control.
-   **User & Team Management:** Invite team members, assign roles (Admin, Manager, Analyst, Viewer), and manage user access.
-   **Integrations:** Connect with existing tools and workflows (e.g., Slack, Jira, ServiceNow).
-   **Audit Logging:** Comprehensive tracking of all system activities for compliance and security.
-   **Interactive Demo & Feature Showcase:** Explore the platform's capabilities through guided demos and feature showcases.

## Getting Started

### 1. Clone the Repository

```bash
git clone [repository-url]
cd RiskShield-AI
```

### 2. Install Dependencies

We use `pnpm` for package management.

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"

# AI Configuration (for Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="YOUR_GOOGLE_GENERATIVE_AI_API_KEY"

# Email Service (for sending assessment invitations and notifications)
RESEND_API_KEY="YOUR_RESEND_API_KEY"

# Base URL for email links (e.g., your Vercel deployment URL)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Important:**
-   Replace `YOUR_SUPABASE_URL`, `YOUR_SUPABASE_ANON_KEY`, `YOUR_SUPABASE_SERVICE_ROLE_KEY` with your actual Supabase project credentials.
-   Obtain a `GOOGLE_GENERATIVE_AI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   Obtain a `RESEND_API_KEY` from [Resend](https://resend.com/).
-   Set `NEXT_PUBLIC_BASE_URL` to your deployment URL (e.g., `https://your-app-name.vercel.app`) for production.

### 4. Run Database Migrations (Optional, for fresh Supabase setup)

If you're setting up a new Supabase project, you'll need to run the SQL scripts in the `scripts/` directory in order. You can do this via the Supabase Studio SQL Editor.

1.  `001-create-tables.sql`
2.  `002-add-user-auth.sql`
3.  `003-create-demo-user.sql` (Optional, for a quick demo user)
4.  `004-enterprise-schema.sql`
5.  `005-test-database-operations.sql` (Optional, for testing)
6.  `006-create-demo-user-auth.sql` (Optional, if using the demo user)
7.  `007-create-usage-tracking.sql`

### 5. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Testing

The project includes various test scripts to verify functionality:

-   **AI Assessment Tests:** `pnpm test:ai`
-   **Enterprise Features Tests:** `pnpm test:enterprise`
-   **PDF Extraction Tests:** `pnpm test:pdf`

## Project Structure

-   `app/`: Next.js App Router pages and API routes.
-   `components/`: Reusable React components.
-   `lib/`: Utility functions, services (auth, AI, database), and Supabase client.
-   `src/integrations/supabase/`: Supabase client configurations.
-   `hooks/`: Custom React hooks.
-   `public/`: Static assets.
-   `scripts/`: SQL migration scripts.
-   `styles/`: Global CSS and Tailwind CSS configuration.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is open-source and available under the MIT License.