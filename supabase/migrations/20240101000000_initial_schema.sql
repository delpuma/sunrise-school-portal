-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'parent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Families table
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  primary_user_id UUID REFERENCES users(id) NOT NULL,
  secondary_user_id UUID REFERENCES users(id),
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  grade TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  capacity INTEGER,
  price_cents INTEGER DEFAULT 0,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  student_id UUID REFERENCES students(id),
  qty INTEGER DEFAULT 1,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled', 'waitlist')),
  square_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  square_invoice_id TEXT UNIQUE NOT NULL,
  family_id UUID REFERENCES families(id) NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  due_at TIMESTAMPTZ NOT NULL,
  issued_at TIMESTAMPTZ,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_id TEXT NOT NULL,
  google_event_id TEXT,
  booking_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL CHECK (source IN ('givebutter')),
  external_id TEXT UNIQUE NOT NULL,
  amount_cents INTEGER NOT NULL,
  campaign TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent resources table
CREATE TABLE parent_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter signups table
CREATE TABLE newsletter_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  consent_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM contacts table
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('lead', 'prospect', 'enrolled', 'alumni')),
  source TEXT,
  grade_interest TEXT,
  engagement_score INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  opted_out BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forms table
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  schema JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form submissions table
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  contact_id UUID REFERENCES crm_contacts(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM interactions table
CREATE TABLE crm_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  details JSONB,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM notes table
CREATE TABLE crm_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM segments table
CREATE TABLE crm_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  criteria JSONB NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_families_primary_user ON families(primary_user_id);
CREATE INDEX idx_families_secondary_user ON families(secondary_user_id);
CREATE INDEX idx_students_family ON students(family_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_published ON events(is_published);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_invoices_family ON invoices(family_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX idx_forms_slug ON forms(slug);
CREATE INDEX idx_form_submissions_form ON form_submissions(form_id);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX idx_crm_interactions_contact ON crm_interactions(contact_id);
CREATE INDEX idx_crm_notes_contact ON crm_notes(contact_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_table, target_id);
