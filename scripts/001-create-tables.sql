-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  vendor_email TEXT NOT NULL,
  contact_person TEXT,
  assessment_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_date DATE NOT NULL,
  completed_date DATE,
  due_date DATE,
  risk_score INTEGER,
  risk_level TEXT DEFAULT 'Pending',
  company_size TEXT,
  custom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_responses table
CREATE TABLE IF NOT EXISTS assessment_responses (
  id SERIAL PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  vendor_info JSONB NOT NULL,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_vendor_email ON assessments(vendor_email);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);

-- Insert some sample data
INSERT INTO assessments (id, vendor_name, vendor_email, contact_person, assessment_type, status, sent_date, due_date, company_size) VALUES
('2', 'DataFlow Analytics', 'compliance@dataflow.com', 'Sarah Johnson', 'Data Privacy Assessment', 'in_progress', '2024-01-20', '2024-01-30', '11-50 employees'),
('3', 'SecureNet Services', 'admin@securenet.com', 'Michael Chen', 'Infrastructure Security', 'pending', '2024-01-22', '2024-02-01', '201-500 employees'),
('4', 'PaymentGateway Pro', 'security@paymentpro.com', 'Lisa Davis', 'Financial Services Assessment', 'overdue', '2024-01-10', '2024-01-20', '500+ employees')
ON CONFLICT (id) DO NOTHING;
