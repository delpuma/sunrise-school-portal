-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins can manage users"
ON users FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Families policies
CREATE POLICY "Parents view own family"
ON families FOR SELECT
USING (
  primary_user_id = auth.uid() 
  OR secondary_user_id = auth.uid()
);

CREATE POLICY "Admins view all families"
ON families FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Parents update own family"
ON families FOR UPDATE
USING (
  primary_user_id = auth.uid() 
  OR secondary_user_id = auth.uid()
);

CREATE POLICY "Admins manage families"
ON families FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Students policies
CREATE POLICY "Parents view own students"
ON students FOR SELECT
USING (
  family_id IN (
    SELECT id FROM families 
    WHERE primary_user_id = auth.uid() 
    OR secondary_user_id = auth.uid()
  )
);

CREATE POLICY "Admins view all students"
ON students FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Parents update own students"
ON students FOR UPDATE
USING (
  family_id IN (
    SELECT id FROM families 
    WHERE primary_user_id = auth.uid() 
    OR secondary_user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage students"
ON students FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Events policies
CREATE POLICY "Public view published events"
ON events FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins view all events"
ON events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins manage events"
ON events FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Registrations policies
CREATE POLICY "Users view own registrations"
ON registrations FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins view all registrations"
ON registrations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Users create own registrations"
ON registrations FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage registrations"
ON registrations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Invoices policies
CREATE POLICY "Parents view own invoices"
ON invoices FOR SELECT
USING (
  family_id IN (
    SELECT id FROM families 
    WHERE primary_user_id = auth.uid() 
    OR secondary_user_id = auth.uid()
  )
);

CREATE POLICY "Admins view all invoices"
ON invoices FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins manage invoices"
ON invoices FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Bookings policies
CREATE POLICY "Users view own bookings"
ON bookings FOR SELECT
USING (email = (SELECT email FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins view all bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Anyone can create bookings"
ON bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins manage bookings"
ON bookings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Donations policies (read-only for admins)
CREATE POLICY "Admins view donations"
ON donations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Blog posts policies
CREATE POLICY "Public view published posts"
ON blog_posts FOR SELECT
USING (published_at IS NOT NULL AND published_at <= NOW());

CREATE POLICY "Admins view all posts"
ON blog_posts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins manage posts"
ON blog_posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Parent resources policies
CREATE POLICY "Parents view published resources"
ON parent_resources FOR SELECT
USING (
  is_published = true 
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'parent'
  )
);

CREATE POLICY "Admins view all resources"
ON parent_resources FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins manage resources"
ON parent_resources FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Newsletter signups policies
CREATE POLICY "Anyone can signup for newsletter"
ON newsletter_signups FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins view signups"
ON newsletter_signups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Forms policies
CREATE POLICY "Public view active forms"
ON forms FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins manage forms"
ON forms FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Form submissions policies
CREATE POLICY "Anyone can submit forms"
ON form_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins view submissions"
ON form_submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- CRM policies (admin only)
CREATE POLICY "Admins manage contacts"
ON crm_contacts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins manage interactions"
ON crm_interactions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins manage notes"
ON crm_notes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins manage segments"
ON crm_segments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Audit logs policies (read-only for admins)
CREATE POLICY "Admins view audit logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);
