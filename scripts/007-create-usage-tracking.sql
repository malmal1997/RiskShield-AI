-- Create usage tracking tables
CREATE TABLE IF NOT EXISTS preview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted_user_id UUID REFERENCES auth.users(id),
    converted_at TIMESTAMP WITH TIME ZONE,
    total_time_spent INTEGER DEFAULT 0, -- in seconds
    page_views INTEGER DEFAULT 0,
    feature_interactions INTEGER DEFAULT 0
);

-- Create page tracking table
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT REFERENCES preview_sessions(session_id),
    page_path TEXT NOT NULL,
    page_title TEXT,
    time_on_page INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feature interaction tracking
CREATE TABLE IF NOT EXISTS feature_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT REFERENCES preview_sessions(session_id),
    feature_name TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'click', 'form_fill', 'download_attempt', etc.
    feature_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead capture table for when users show interest
CREATE TABLE IF NOT EXISTS preview_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT REFERENCES preview_sessions(session_id),
    email TEXT,
    name TEXT,
    company TEXT,
    phone TEXT,
    interest_level TEXT, -- 'high', 'medium', 'low'
    lead_source TEXT, -- 'signup_attempt', 'contact_form', 'demo_request'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    followed_up BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_preview_sessions_session_id ON preview_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_preview_sessions_created_at ON preview_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_feature_interactions_session_id ON feature_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_preview_leads_session_id ON preview_leads(session_id);
CREATE INDEX IF NOT EXISTS idx_preview_leads_followed_up ON preview_leads(followed_up);

-- Enable RLS
ALTER TABLE preview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE preview_leads ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on preview_sessions" ON preview_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on page_views" ON page_views FOR ALL USING (true);
CREATE POLICY "Allow all operations on feature_interactions" ON feature_interactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on preview_leads" ON preview_leads FOR ALL USING (true);
