-- Enable RLS on pending_registrations table
ALTER TABLE pending_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert their own registration request
CREATE POLICY "Anyone can insert registration requests" ON pending_registrations
FOR INSERT 
WITH CHECK (true);

-- Policy: Allow reading all registrations (for admin dashboard)
CREATE POLICY "Allow reading all registrations" ON pending_registrations
FOR SELECT 
USING (true);

-- Policy: Allow updating registration status (for admin approval/rejection)
CREATE POLICY "Allow updating registration status" ON pending_registrations
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Grant necessary permissions to authenticated and anonymous users
GRANT SELECT, INSERT, UPDATE ON pending_registrations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON pending_registrations TO anon;
