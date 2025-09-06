-- Enable Row Level Security for user data protection

-- Enable RLS on assessments table
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- RLS policies for assessments
CREATE POLICY "Users can view their own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessments" ON assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assessments" ON assessments FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on assessment_responses table
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for assessment_responses
CREATE POLICY "Users can view their own assessment responses" ON assessment_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assessment responses" ON assessment_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessment responses" ON assessment_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assessment responses" ON assessment_responses FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- Enable RLS on ai_usage_logs table
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_usage_logs
CREATE POLICY "Users can view their own AI usage logs" ON ai_usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own AI usage logs" ON ai_usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
