-- Create demo organization first
INSERT INTO organizations (
  id,
  name,
  slug,
  subscription_plan,
  subscription_status,
  trial_ends_at,
  settings,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'RiskGuard Demo Organization',
  'riskguard-demo',
  'enterprise',
  'active',
  (NOW() + INTERVAL '365 days'),
  '{"demo_mode": true, "features": {"all": true}}',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  settings = EXCLUDED.settings,
  updated_at = NOW();

-- Get the organization ID for reference
WITH demo_org AS (
  SELECT id as org_id FROM organizations WHERE slug = 'riskguard-demo'
)
-- Insert demo user profile (we'll link this to auth user when they sign up)
INSERT INTO user_profiles (
  id,
  user_id,
  organization_id,
  first_name,
  last_name,
  timezone,
  language,
  preferences,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- Placeholder, will be updated when user signs up
  demo_org.org_id,
  'Demo',
  'User',
  'America/New_York',
  'en',
  '{"theme": "light", "notifications": true}',
  NOW(),
  NOW()
FROM demo_org
ON CONFLICT (user_id, organization_id) DO NOTHING;

-- Create sample data for demo
WITH demo_org AS (
  SELECT id as org_id FROM organizations WHERE slug = 'riskguard-demo'
)
INSERT INTO vendors (
  id,
  organization_id,
  name,
  industry,
  website,
  contact_email,
  risk_score,
  status,
  tier,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  demo_org.org_id,
  vendor_name,
  industry,
  website,
  email,
  risk_score,
  status,
  tier,
  NOW(),
  NOW()
FROM demo_org,
(VALUES 
  ('TechCorp Solutions', 'Technology', 'https://techcorp.com', 'contact@techcorp.com', 85, 'active', 'tier_1'),
  ('SecureData Inc', 'Data Processing', 'https://securedata.com', 'info@securedata.com', 92, 'active', 'tier_1'),
  ('CloudServices Ltd', 'Cloud Infrastructure', 'https://cloudservices.com', 'support@cloudservices.com', 78, 'active', 'tier_2'),
  ('FinancePartner Co', 'Financial Services', 'https://financepartner.com', 'hello@financepartner.com', 88, 'active', 'tier_1'),
  ('DataAnalytics Pro', 'Analytics', 'https://dataanalytics.com', 'contact@dataanalytics.com', 82, 'under_review', 'tier_2')
) AS demo_vendors(vendor_name, industry, website, email, risk_score, status, tier);

SELECT 'Demo organization and sample data created successfully!' as result;
