-- Create a demo user for testing
-- This script creates a demo user account for testing purposes

-- Insert demo user into auth.users (this is a simplified version)
-- In production, users would sign up through the normal auth flow

-- Note: This is a mock script since we can't directly insert into auth.users
-- The actual demo user should be created through the Supabase Auth UI or API

-- Create some sample assessments for the demo user
-- These will be linked to the user_id once they sign up

-- You can create a demo user through the Supabase dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Email: demo@riskguard.ai
-- 4. Password: demo123
-- 5. Email confirmed: Yes

-- Or use this SQL to create test data once you have a user:
-- UPDATE assessments 
-- SET user_id = 'YOUR_USER_ID_HERE'
-- WHERE user_id IS NULL;

-- For now, we'll just ensure the table structure is ready
SELECT 'Demo user setup instructions added to comments' as status;
