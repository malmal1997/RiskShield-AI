-- Add reviewer sign-off columns to assessment_responses table
ALTER TABLE assessment_responses 
ADD COLUMN IF NOT EXISTS reviewer_sign_off JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS document_evidence JSONB DEFAULT '[]'::jsonb;

-- Add sign-off settings to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS sign_off_settings JSONB DEFAULT '{
  "requireSignOff": true,
  "allowedRoles": ["admin", "manager"],
  "requireComments": false,
  "autoArchiveAfterSignOff": false
}'::jsonb;

-- Create index for faster queries on sign-off data
CREATE INDEX IF NOT EXISTS idx_assessment_responses_reviewer_signoff 
ON assessment_responses USING GIN (reviewer_sign_off);

-- Update RLS policies to allow sign-off updates
CREATE POLICY IF NOT EXISTS "Users can update assessment responses with sign-off" 
ON assessment_responses FOR UPDATE 
USING (
  assessment_id IN (
    SELECT id FROM assessments 
    WHERE user_id = auth.uid()
  )
);
