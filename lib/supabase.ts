export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_assessment_reports: {
        Row: {
          analysis_date: string
          assessment_type: string
          created_at: string
          full_report_content: Json
          id: string
          organization_id: string
          report_summary: string | null
          report_title: string
          risk_level: string
          risk_score: number
          soc_info: Json | null
          updated_at: string
          uploaded_documents_metadata: Json | null
          user_id: string
        }
        Insert: {
          analysis_date?: string
          assessment_type: string
          created_at?: string
          full_report_content: Json
          id?: string
          organization_id: string
          report_summary?: string | null
          report_title: string
          risk_level: string
          risk_score: number
          soc_info?: Json | null
          updated_at?: string
          uploaded_documents_metadata?: Json | null
          user_id: string
        }
        Update: {
          analysis_date?: string
          assessment_type?: string
          created_at?: string
          full_report_content?: Json
          id?: string
          organization_id?: string
          report_summary?: string | null
          report_title?: string
          risk_level?: string
          risk_score?: number
          soc_info?: Json | null
          updated_at?: string
          uploaded_documents_metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_assessment_reports_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "ai_assessment_reports_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          ai_provider: string
          assessment_id: string | null
          cost: number | null
          created_at: string | null
          document_count: number | null
          error_message: string | null
          id: string
          input_tokens: number | null
          key_source: string | null
          model_name: string | null
          output_tokens: number | null
          question_count: number | null
          status: string
          user_id: string | null
        }
        Insert: {
          ai_provider: string
          assessment_id?: string | null
          cost?: number | null
          created_at?: string | null
          document_count?: number | null
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          key_source?: string | null
          model_name?: string | null
          output_tokens?: number | null
          question_count?: number | null
          status: string
          user_id?: string | null
        }
        Update: {
          ai_provider?: string
          assessment_id?: string | null
          cost?: number | null
          created_at?: string | null
          document_count?: number | null
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          key_source?: string | null
          model_name?: string | null
          output_tokens?: number | null
          question_count?: number | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      assessment_responses: {
        Row: {
          answers: Json
          assessment_id: string
          id: number
          organization_id: string
          submitted_at: string | null
          user_id: string | null
          vendor_info: Json
        }
        Insert: {
          answers: Json
          assessment_id: string
          id?: number
          organization_id: string
          submitted_at?: string | null
          user_id?: string | null
          vendor_info: Json
        }
        Update: {
          answers?: Json
          assessment_id?: string
          id?: number
          organization_id?: string
          submitted_at?: string | null
          user_id?: string | null
          vendor_info?: Json
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            references: ["assessments", "id"]
          },
          {
            foreignKeyName: "assessment_responses_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "assessment_responses_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_type: string
          company_size: string | null
          completed_date: string | null
          contact_person: string | null
          created_at: string | null
          custom_message: string | null
          due_date: string | null
          id: string
          organization_id: string
          risk_level: string | null
          risk_score: number | null
          sent_date: string
          status: string
          updated_at: string | null
          user_id: string | null
          vendor_email: string
          vendor_name: string
        }
        Insert: {
          assessment_type: string
          company_size?: string | null
          completed_date?: string | null
          contact_person?: string | null
          created_at?: string | null
          custom_message?: string | null
          due_date?: string | null
          id: string
          organization_id: string
          risk_level?: string | null
          risk_score?: number | null
          sent_date: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          vendor_email: string
          vendor_name: string
        }
        Update: {
          assessment_type?: string
          company_size?: string | null
          completed_date?: string | null
          contact_person?: string | null
          created_at?: string | null
          custom_message?: string | null
          due_date?: string | null
          id?: string
          organization_id?: string
          risk_level?: string | null
          risk_score?: number | null
          sent_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          vendor_email?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      assessment_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_templates_created_by_fkey"
            columns: ["created_by"]
            references: ["users", "id"]
          },
          {
            foreignKeyName: "assessment_templates_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      delegated_assessments: {
        Row: {
          assessment_type: string
          company_name: string | null
          completed_date: string | null
          created_at: string | null
          custom_message: string | null
          delegation_type: string
          delegator_user_id: string | null
          due_date: string | null
          id: string
          method: string
          organization_id: string | null
          recipient_email: string
          recipient_name: string | null
          recipient_user_id: string | null
          risk_level: string | null
          risk_score: number | null
          sent_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assessment_type: string
          company_name?: string | null
          completed_date?: string | null
          created_at?: string | null
          custom_message?: string | null
          delegation_type: string
          delegator_user_id?: string | null
          due_date?: string | null
          id?: string
          method: string
          organization_id?: string | null
          recipient_email: string
          recipient_name?: string | null
          recipient_user_id?: string | null
          risk_level?: string | null
          risk_score?: number | null
          sent_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assessment_type?: string
          company_name?: string | null
          completed_date?: string | null
          created_at?: string | null
          custom_message?: string | null
          delegation_type?: string
          delegator_user_id?: string | null
          due_date?: string | null
          id?: string
          method?: string
          organization_id?: string | null
          recipient_email?: string
          recipient_name?: string | null
          recipient_user_id?: string | null
          risk_level?: string | null
          risk_score?: number | null
          sent_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delegated_assessments_delegator_user_id_fkey"
            columns: ["delegator_user_id"]
            references: ["users", "id"]
          },
          {
            foreignKeyName: "delegated_assessments_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "delegated_assessments_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            references: ["users", "id"]
          },
        ]
      }
      encrypted_api_keys: {
        Row: {
          api_key_name: string
          created_at: string | null
          encrypted_key: string
          id: string
          nonce: string
          user_id: string
        }
        Insert: {
          api_key_name: string
          created_at?: string | null
          encrypted_key: string
          id?: string
          nonce?: string
          user_id: string
        }
        Update: {
          api_key_name?: string
          created_at?: string | null
          encrypted_key?: string
          id?: string
          nonce?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "encrypted_api_keys_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      feature_interactions: {
        Row: {
          action_type: string
          created_at: string | null
          feature_data: Json | null
          feature_name: string
          id: string
          session_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          feature_data?: Json | null
          feature_name: string
          id?: string
          session_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          feature_data?: Json | null
          feature_name?: string
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_interactions_session_id_fkey"
            columns: ["session_id"]
            references: ["preview_sessions", "session_id"]
          },
        ]
      }
      integrations: {
        Row: {
          created_at: string
          id: string
          integration_name: string
          organization_id: string
          settings: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_name: string
          organization_id: string
          settings: Json
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_name?: string
          organization_id?: string
          settings?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          organization_id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          organization_id: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          organization_id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          subscription_plan: string
          subscription_status: string
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          subscription_plan?: string
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          subscription_plan?: string
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string | null
          id: string
          page_path: string
          page_title: string | null
          session_id: string | null
          time_on_page: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_path: string
          page_title?: string | null
          session_id?: string | null
          time_on_page?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_path?: string
          page_title?: string | null
          session_id?: string | null
          time_on_page?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_session_id_fkey"
            columns: ["session_id"]
            references: ["preview_sessions", "session_id"]
          },
        ]
      }
      pdf_analyses: {
        Row: {
          confidence: number | null
          created_at: string | null
          error_message: string | null
          extraction_method: string | null
          file_name: string
          file_size: number
          id: string
          keywords: string[] | null
          metadata: Json | null
          page_count: number | null
          processing_time: number | null
          status: string
          summary: string | null
          text_content: string | null
          updated_at: string | null
          uploaded_at: string | null
          word_count: number | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          error_message?: string | null
          extraction_method?: string | null
          file_name: string
          file_size: number
          id: string
          keywords?: string[] | null
          metadata?: Json | null
          page_count?: number | null
          processing_time?: number | null
          status: string
          summary?: string | null
          text_content?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          word_count?: number | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          error_message?: string | null
          extraction_method?: string | null
          file_name?: string
          file_size?: number
          id?: string
          keywords?: string[] | null
          metadata?: Json | null
          page_count?: number | null
          processing_time?: number | null
          status?: string
          summary?: string | null
          text_content?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
      pdf_analysis_stats: {
        Row: {
          avg_confidence: number | null
          avg_page_count: number | null
          avg_processing_time: number | null
          avg_word_count: number | null
          completed_analyses: number | null
          failed_analyses: number | null
          processing_analyses: number | null
          total_analyses: number | null
          total_file_size: number | null
        }
        Insert: {
          avg_confidence?: number | null
          avg_page_count?: number | null
          avg_processing_time?: number | null
          avg_word_count?: number | null
          completed_analyses?: number | null
          failed_analyses?: number | null
          processing_analyses?: number | null
          total_analyses?: number | null
          total_file_size?: number | null
        }
        Update: {
          avg_confidence?: number | null
          avg_page_count?: number | null
          avg_processing_time?: number | null
          avg_word_count?: number | null
          completed_analyses?: number | null
          failed_analyses?: number | null
          processing_analyses?: number | null
          total_analyses?: number | null
          total_file_size?: number | null
        }
        Relationships: []
      }
      pending_registrations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          contact_name: string
          created_at: string
          email: string
          id: string
          institution_name: string
          institution_type: string
          notes: string | null
          phone: string | null
          rejection_reason: string | null
          rejected_at: string | null
          rejected_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          contact_name: string
          created_at?: string
          email: string
          id: string
          institution_name: string
          institution_type: string
          notes?: string | null
          phone?: string | null
          rejection_reason?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          institution_name?: string
          institution_type?: string
          notes?: string | null
          phone?: string | null
          rejection_reason?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_registrations_approved_by_fkey"
            columns: ["approved_by"]
            references: ["users", "id"]
          },
          {
            foreignKeyName: "pending_registrations_id_fkey"
            columns: ["id"]
            references: ["users", "id"]
          },
          {
            foreignKeyName: "pending_registrations_rejected_by_fkey"
            columns: ["rejected_by"]
            references: ["users", "id"]
          },
        ]
      }
      policies: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          approved_by_user_id: string | null
          approver_role: string | null
          approval_status: string
          company_name: string
          content: Json
          created_date: string
          current_version: string
          description: string | null
          id: string
          institution_type: string
          next_review_date: string | null
          organization_id: string
          status: string
          title: string
          updated_at: string
          user_id: string
          version: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          approved_by_user_id?: string | null
          approver_role?: string | null
          approval_status?: string
          company_name: string
          content?: Json
          created_date?: string
          current_version?: string
          description?: string | null
          id?: string
          institution_type: string
          next_review_date?: string | null
          organization_id: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
          version?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          approved_by_user_id?: string | null
          approver_role?: string | null
          approval_status?: string
          company_name?: string
          content?: Json
          created_date?: string
          current_version?: string
          description?: string | null
          id?: string
          institution_type?: string
          next_review_date?: string | null
          organization_id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            references: ["users", "id"]
          },
          {
            foreignKeyName: "policies_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "policies_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      policy_versions: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          id: string
          policy_id: string
          version_number: string
        }
        Insert: {
          content: Json
          created_at?: string
          created_by?: string | null
          id?: string
          policy_id: string
          version_number: string
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          policy_id?: string
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_versions_created_by_fkey"
            columns: ["created_by"]
            references: ["users", "id"]
          },
          {
            foreignKeyName: "policy_versions_policy_id_fkey"
            columns: ["policy_id"]
            references: ["policies", "id"]
          },
        ]
      }
      preview_leads: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          followed_up: boolean | null
          follow_up_date: string | null
          id: string
          interest_level: string | null
          lead_source: string | null
          name: string | null
          notes: string | null
          phone: string | null
          session_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          followed_up?: boolean | null
          follow_up_date?: string | null
          id?: string
          interest_level?: string | null
          lead_source?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          session_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          followed_up?: boolean | null
          follow_up_date?: string | null
          id?: string
          interest_level?: string | null
          lead_source?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preview_leads_session_id_fkey"
            columns: ["session_id"]
            references: ["preview_sessions", "session_id"]
          },
        ]
      }
      preview_sessions: {
        Row: {
          converted_at: string | null
          converted_user_id: string | null
          created_at: string | null
          feature_interactions: number | null
          id: string
          ip_address: string | null
          last_activity: string | null
          page_views: number | null
          referrer: string | null
          session_id: string
          total_time_spent: number | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          converted_at?: string | null
          converted_user_id?: string | null
          created_at?: string | null
          feature_interactions?: number | null
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          page_views?: number | null
          referrer?: string | null
          session_id: string
          total_time_spent?: number | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          converted_at?: string | null
          converted_user_id?: string | null
          created_at?: string | null
          feature_interactions?: number | null
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          page_views?: number | null
          referrer?: string | null
          session_id?: string
          total_time_spent?: number | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preview_sessions_converted_user_id_fkey"
            columns: ["converted_user_id"]
            references: ["users", "id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assessment_id: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          priority: string
          status: string
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      template_questions: {
        Row: {
          category: string | null
          created_at: string
          id: string
          options: Json | null
          order: number
          question_text: string
          question_type: string
          required: boolean
          template_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          options?: Json | null
          order: number
          question_text: string
          question_type: string
          required?: boolean
          template_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          options?: Json | null
          order?: number
          question_text?: string
          question_type?: string
          required?: boolean
          template_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_questions_template_id_fkey"
            columns: ["template_id"]
            references: ["assessment_templates", "id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          language: string
          last_active_at: string | null
          last_name: string | null
          organization_id: string
          phone: string | null
          preferences: Json | null
          status: string
          timezone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          language?: string
          last_active_at?: string | null
          last_name?: string | null
          organization_id: string
          phone?: string | null
          preferences?: Json | null
          status?: string
          timezone?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          language?: string
          last_active_at?: string | null
          last_name?: string | null
          organization_id?: string
          phone?: string | null
          preferences?: Json | null
          status?: string
          timezone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          permissions: Json | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          permissions?: Json | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          permissions?: Json | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
      vendors: {
        Row: {
          average_risk_score: number
          completed_assessments: number
          contact_email: string
          contact_phone: string | null
          contact_person: string
          created_at: string
          email: string
          id: string
          industry: string
          last_assessment_date: string | null
          name: string
          next_assessment_date: string | null
          organization_id: string
          risk_level: string
          size: string
          status: string
          tags: string[] | null
          total_assessments: number
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          average_risk_score?: number
          completed_assessments?: number
          contact_email: string
          contact_phone?: string | null
          contact_person: string
          created_at?: string
          email: string
          id?: string
          industry: string
          last_assessment_date?: string | null
          name: string
          next_assessment_date?: string | null
          organization_id: string
          risk_level?: string
          size: string
          status?: string
          tags?: string[] | null
          total_assessments?: number
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          average_risk_score?: number
          completed_assessments?: number
          contact_email?: string
          contact_phone?: string | null
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          industry?: string
          last_assessment_date?: string | null
          name?: string
          next_assessment_date?: string | null
          organization_id?: string
          risk_level?: string
          size?: string
          status?: string
          tags?: string[] | null
          total_assessments?: number
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            references: ["organizations", "id"]
          },
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            references: ["users", "id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_org_id: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      update_pdf_analyses_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

// Custom types for convenience
export type Assessment = Tables<'assessments'>;
export type AssessmentResponse = Tables<'assessment_responses'>;
export type Organization = Tables<'organizations'>;
export type UserProfile = Tables<'user_profiles'>;
export type UserRole = Tables<'user_roles'>;
export type Vendor = Tables<'vendors'>; // Export the Vendor type
export type AiAssessmentReport = Tables<'ai_assessment_reports'>; // Export the AiAssessmentReport type
export type AuditLog = Tables<'audit_logs'>;
export type AssessmentTemplate = Tables<'assessment_templates'>;
export type TemplateQuestion = Tables<'template_questions'>;
export type Policy = Tables<'policies'>;
export type PolicyVersion = Tables<'policy_versions'>;
export type Integration = Tables<'integrations'>;