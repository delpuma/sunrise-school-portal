-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_resources_updated_at BEFORE UPDATE ON parent_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_segments_updated_at BEFORE UPDATE ON crm_segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get event capacity status
CREATE OR REPLACE FUNCTION get_event_capacity(event_id_param UUID)
RETURNS TABLE (
  total_capacity INTEGER,
  registered_count BIGINT,
  available_spots INTEGER,
  is_full BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.capacity,
    COALESCE(COUNT(r.id), 0) as registered_count,
    GREATEST(0, e.capacity - COALESCE(COUNT(r.id), 0)::INTEGER) as available_spots,
    (e.capacity <= COALESCE(COUNT(r.id), 0)::INTEGER) as is_full
  FROM events e
  LEFT JOIN registrations r ON r.event_id = e.id AND r.status IN ('paid', 'pending')
  WHERE e.id = event_id_param
  GROUP BY e.id, e.capacity;
END;
$$ LANGUAGE plpgsql;
