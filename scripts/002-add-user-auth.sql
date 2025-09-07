-- Add user authentication and ownership to assessments
-- This script adds user_id columns to link assessments to specific users

-- Add user_id column to assessments table
ALTER TABLE assessments 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to assessment_responses table  
ALTER TABLE assessment_responses
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance on user-based queries
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessment_responses_user_id ON assessment_responses(user_id);

-- Enable Row Level Security (RLS) on assessments table
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own assessments
CREATE POLICY "Users can only see their own assessments" ON assessments
    FOR ALL USING (auth.uid() = user_id);

-- Enable Row Level Security (RLS) on assessment_responses table
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own assessment responses
CREATE POLICY "Users can only see their own assessment responses" ON assessment_responses
    FOR ALL USING (auth.uid() = user_id);

-- Create policy to allow vendors to submit responses (they don't need to be authenticated)
CREATE POLICY "Allow public assessment response submission" ON assessment_responses
    FOR INSERT WITH CHECK (true);

-- Update existing assessments to have a default user (for demo purposes)
-- In production, you might want to handle this differently
UPDATE assessments 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;
