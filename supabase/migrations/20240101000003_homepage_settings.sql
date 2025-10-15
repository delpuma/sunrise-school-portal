-- Homepage settings table
CREATE TABLE homepage_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'Welcome to Sunrise School of Miami',
  hero_subtitle TEXT NOT NULL DEFAULT 'Nurturing young minds through innovative early childhood education',
  hero_background_type TEXT NOT NULL DEFAULT 'color' CHECK (hero_background_type IN ('color', 'image', 'video')),
  hero_background_value TEXT NOT NULL DEFAULT 'bg-blue-600',
  hero_image_url TEXT,
  hero_video_url TEXT,
  hero_cta_primary_text TEXT NOT NULL DEFAULT 'Schedule a Tour',
  hero_cta_primary_url TEXT NOT NULL DEFAULT '/admissions/schedule-tour',
  hero_cta_secondary_text TEXT NOT NULL DEFAULT 'Apply/Enroll',
  hero_cta_secondary_url TEXT NOT NULL DEFAULT '/admissions/how-to-apply',
  hero_cta_tertiary_text TEXT NOT NULL DEFAULT 'Donate',
  hero_cta_tertiary_url TEXT NOT NULL DEFAULT '/give',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO homepage_settings (id) VALUES ('00000000-0000-0000-0000-000000000001');

-- RLS policies
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read homepage settings" ON homepage_settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify homepage settings" ON homepage_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'staff')
    )
  );