-- Add enrollment status tracking to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS enrollment_status TEXT CHECK (enrollment_status IN ('inquiry', 'applied', 'accepted', 'enrolled', 'waitlist', 'declined'));
ALTER TABLE students ADD COLUMN IF NOT EXISTS facts_id TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS enrollment_year TEXT;

-- Create index for enrollment queries
CREATE INDEX IF NOT EXISTS idx_students_enrollment_status ON students(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_students_facts_id ON students(facts_id);

-- Add comment
COMMENT ON COLUMN students.enrollment_status IS 'Current enrollment status in the admissions pipeline';
COMMENT ON COLUMN students.facts_id IS 'FACTS Family Portal student ID for future SSO integration';
COMMENT ON COLUMN students.enrollment_year IS 'Academic year of enrollment (e.g., 2024-2025)';
