-- Test database operations for RiskGuard AI Enterprise

-- Test 1: Create a test organization
INSERT INTO organizations (
  id, name, slug, subscription_plan, subscription_status, trial_ends_at
) VALUES (
  'test-org-' || extract(epoch from now())::text,
  'Test Organization',
  'test-org-' || extract(epoch from now())::text,
  'enterprise',
  'active',
  now() + interval '30 days'
) RETURNING id, name, subscription_plan;

-- Test 2: Create test user profile
WITH test_org AS (
  SELECT id FROM organizations WHERE name = 'Test Organization' LIMIT 1
)
INSERT INTO user_profiles (
  id, user_id, organization_id, first_name, last_name, timezone, language
) 
SELECT 
  'profile-' || extract(epoch from now())::text,
  'user-' || extract(epoch from now())::text,
  test_org.id,
  'Test',
  'User',
  'UTC',
  'en'
FROM test_org
RETURNING id, first_name, last_name;

-- Test 3: Create test vendors
WITH test_org AS (
  SELECT id FROM organizations WHERE name = 'Test Organization' LIMIT 1
)
INSERT INTO vendors (
  id, organization_id, name, email, industry, size, risk_level, status
) 
SELECT 
  'vendor-' || generate_series(1,3),
  test_org.id,
  'Test Vendor ' || generate_series(1,3),
  'vendor' || generate_series(1,3) || '@test.com',
  CASE generate_series(1,3) 
    WHEN 1 THEN 'Technology'
    WHEN 2 THEN 'Finance' 
    ELSE 'Healthcare'
  END,
  '51-200 employees',
  CASE generate_series(1,3)
    WHEN 1 THEN 'low'
    WHEN 2 THEN 'medium'
    ELSE 'high'
  END,
  'active'
FROM test_org
RETURNING id, name, risk_level;

-- Test 4: Create test assessments
WITH test_org AS (
  SELECT id FROM organizations WHERE name = 'Test Organization' LIMIT 1
),
test_vendors AS (
  SELECT id FROM vendors WHERE name LIKE 'Test Vendor%' LIMIT 3
)
INSERT INTO assessments (
  id, organization_id, vendor_id, vendor_name, vendor_email, 
  assessment_type, status, risk_score, risk_level
)
SELECT 
  'assessment-' || v.id,
  o.id,
  v.id,
  'Test Vendor ' || row_number() OVER(),
  'vendor' || row_number() OVER() || '@test.com',
  'cybersecurity',
  'completed',
  75 + (random() * 20)::int,
  CASE 
    WHEN random() < 0.3 THEN 'low'
    WHEN random() < 0.7 THEN 'medium'
    ELSE 'high'
  END
FROM test_org o
CROSS JOIN test_vendors v
RETURNING id, vendor_name, risk_score, risk_level;

-- Test 5: Verify data integrity
SELECT 
  'Organizations' as table_name,
  count(*) as record_count
FROM organizations 
WHERE name = 'Test Organization'

UNION ALL

SELECT 
  'User Profiles' as table_name,
  count(*) as record_count  
FROM user_profiles 
WHERE first_name = 'Test'

UNION ALL

SELECT 
  'Vendors' as table_name,
  count(*) as record_count
FROM vendors 
WHERE name LIKE 'Test Vendor%'

UNION ALL

SELECT 
  'Assessments' as table_name,
  count(*) as record_count
FROM assessments 
WHERE vendor_name LIKE 'Test Vendor%';

-- Test 6: Analytics query test
WITH risk_summary AS (
  SELECT 
    risk_level,
    count(*) as vendor_count,
    avg(risk_score) as avg_score
  FROM assessments 
  WHERE vendor_name LIKE 'Test Vendor%'
  GROUP BY risk_level
)
SELECT 
  'Risk Distribution Analysis' as analysis_type,
  json_agg(
    json_build_object(
      'risk_level', risk_level,
      'count', vendor_count,
      'avg_score', round(avg_score, 2)
    )
  ) as results
FROM risk_summary;

-- Test 7: Clean up test data
DELETE FROM assessments WHERE vendor_name LIKE 'Test Vendor%';
DELETE FROM vendors WHERE name LIKE 'Test Vendor%';
DELETE FROM user_profiles WHERE first_name = 'Test';
DELETE FROM organizations WHERE name = 'Test Organization';

-- Verify cleanup
SELECT 'Cleanup Verification' as status,
       CASE 
         WHEN NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Test Organization')
         AND NOT EXISTS (SELECT 1 FROM vendors WHERE name LIKE 'Test Vendor%')
         AND NOT EXISTS (SELECT 1 FROM assessments WHERE vendor_name LIKE 'Test Vendor%')
         THEN 'SUCCESS - All test data cleaned up'
         ELSE 'WARNING - Some test data may remain'
       END as result;
