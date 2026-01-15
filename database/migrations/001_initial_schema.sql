-- ============================================
-- Yatra Event Management System
-- Initial Database Schema Migration
-- Version: 1.0
-- Date: October 13, 2025
-- ============================================

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. HOTELS TABLE
-- ============================================
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  map_link VARCHAR(500),
  total_floors INTEGER NOT NULL CHECK (total_floors >= 1 AND total_floors <= 100),
  floors JSONB NOT NULL,
  total_rooms INTEGER DEFAULT 0,
  occupied_rooms INTEGER DEFAULT 0,
  available_rooms INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hotels_name ON hotels(name);
CREATE INDEX idx_hotels_active ON hotels(is_active);
CREATE INDEX idx_hotels_floors_gin ON hotels USING GIN (floors);

-- ============================================
-- 2. ROOMS TABLE
-- ============================================
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number VARCHAR(20) NOT NULL,
  floor VARCHAR(10) NOT NULL,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  is_occupied BOOLEAN DEFAULT FALSE,
  assigned_to_user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(hotel_id, room_number),
  CONSTRAINT valid_room_number CHECK (room_number != '')
);

CREATE INDEX idx_rooms_hotel ON rooms(hotel_id);
CREATE INDEX idx_rooms_floor ON rooms(floor);
CREATE INDEX idx_rooms_occupied ON rooms(is_occupied);
CREATE INDEX idx_rooms_assigned_user ON rooms(assigned_to_user_id);
CREATE INDEX idx_rooms_room_number ON rooms(room_number);

-- ============================================
-- 3. USERS TABLE (Pilgrims/Travelers)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(15) NOT NULL,
  email VARCHAR(255),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER CHECK (age >= 1 AND age <= 120),
  number_of_persons INTEGER NOT NULL CHECK (number_of_persons >= 1),
  pnr VARCHAR(10) UNIQUE NOT NULL,
  boarding_state VARCHAR(100) NOT NULL,
  boarding_city VARCHAR(100) NOT NULL,
  boarding_point VARCHAR(255) NOT NULL,
  arrival_date DATE NOT NULL,
  return_date DATE NOT NULL,
  assigned_room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  ticket_images TEXT[],
  registration_status VARCHAR(20) DEFAULT 'pending' CHECK (
    registration_status IN ('pending', 'confirmed', 'checked_in', 'cancelled')
  ),
  is_room_assigned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_dates CHECK (return_date >= arrival_date),
  CONSTRAINT valid_contact CHECK (contact_number ~ '^\+?[0-9]{10,15}$')
);

CREATE INDEX idx_users_pnr ON users(pnr);
CREATE INDEX idx_users_contact ON users(contact_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_arrival_date ON users(arrival_date);
CREATE INDEX idx_users_assigned_room ON users(assigned_room_id);
CREATE INDEX idx_users_registration_status ON users(registration_status);

-- Add foreign key constraint to rooms (circular reference)
ALTER TABLE rooms ADD CONSTRAINT fk_rooms_user 
  FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- 4. BOARDING POINTS TABLE
-- ============================================
CREATE TABLE boarding_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  point_name VARCHAR(255) NOT NULL,
  address TEXT,
  contact_person VARCHAR(255),
  contact_number VARCHAR(15),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(state, city, point_name)
);

CREATE INDEX idx_boarding_state ON boarding_points(state);
CREATE INDEX idx_boarding_city ON boarding_points(city);
CREATE INDEX idx_boarding_active ON boarding_points(is_active);

-- ============================================
-- 5. EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(20) NOT NULL CHECK (
    event_type IN ('religious', 'cultural', 'tour', 'other')
  ),
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255) NOT NULL,
  address TEXT,
  max_participants INTEGER,
  registered_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (
    status IN ('upcoming', 'ongoing', 'completed', 'cancelled')
  ),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_event_time CHECK (end_time > start_time OR end_time IS NULL)
);

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(event_type);

-- ============================================
-- 6. EVENT PARTICIPANTS TABLE
-- ============================================
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attendance_status VARCHAR(20) DEFAULT 'registered' CHECK (
    attendance_status IN ('registered', 'attended', 'absent', 'cancelled')
  ),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_participants_event ON event_participants(event_id);
CREATE INDEX idx_event_participants_user ON event_participants(user_id);
CREATE INDEX idx_event_participants_status ON event_participants(attendance_status);

-- ============================================
-- 7. ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(15),
  role VARCHAR(20) DEFAULT 'admin' CHECK (
    role IN ('super_admin', 'admin', 'staff')
  ),
  permissions JSONB DEFAULT '[]',
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_email CHECK (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

CREATE INDEX idx_admin_email ON admin_users(email);
CREATE INDEX idx_admin_role ON admin_users(role);
CREATE INDEX idx_admin_active ON admin_users(is_active);

-- ============================================
-- 8. ADMIN SESSIONS TABLE
-- ============================================
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  device_info TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX idx_sessions_token ON admin_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_sessions_active ON admin_sessions(is_active);

-- ============================================
-- 9. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  performed_by_admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_admin ON audit_logs(performed_by_admin_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boarding_points_updated_at BEFORE UPDATE ON boarding_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS FOR STATISTICS
-- ============================================

-- Function to update hotel room statistics
CREATE OR REPLACE FUNCTION update_hotel_statistics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hotels
  SET
    total_rooms = (SELECT COUNT(*) FROM rooms WHERE hotel_id = NEW.hotel_id),
    occupied_rooms = (SELECT COUNT(*) FROM rooms WHERE hotel_id = NEW.hotel_id AND is_occupied = TRUE),
    available_rooms = (SELECT COUNT(*) FROM rooms WHERE hotel_id = NEW.hotel_id AND is_occupied = FALSE)
  WHERE id = NEW.hotel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hotel_stats_on_room_change
AFTER INSERT OR UPDATE OR DELETE ON rooms
FOR EACH ROW EXECUTE FUNCTION update_hotel_statistics();

-- ============================================
-- INITIAL DATA SEEDING
-- ============================================

-- Insert default admin user
-- Email: admin@yatra.com
-- Password: Admin@123 (Please change after first login)
INSERT INTO admin_users (email, password_hash, name, role, email_verified)
VALUES (
  'admin@yatra.com',
  '$2b$10$rRKvXBq7LqoY1K0S5Jx5DeN.LqVYZr3MfK6uN7PxVCXqEYmZGVQDi',
  'System Administrator',
  'super_admin',
  TRUE
);

-- Insert sample boarding points
INSERT INTO boarding_points (state, city, point_name, address) VALUES
  ('Maharashtra', 'Mumbai', 'Dadar Station', 'Dadar East, Mumbai - 400014'),
  ('Maharashtra', 'Mumbai', 'Bandra Station', 'Bandra West, Mumbai - 400050'),
  ('Maharashtra', 'Pune', 'Shivajinagar', 'Shivajinagar Bus Stand, Pune - 411005'),
  ('Gujarat', 'Ahmedabad', 'Central Bus Stand', 'Geeta Mandir, Ahmedabad - 380022'),
  ('Gujarat', 'Surat', 'Railway Station', 'Surat Railway Station - 395003'),
  ('Rajasthan', 'Jaipur', 'Sindhi Camp', 'Sindhi Camp Bus Stand, Jaipur - 302001'),
  ('Delhi', 'New Delhi', 'ISBT Kashmere Gate', 'Kashmere Gate, Delhi - 110006'),
  ('Uttar Pradesh', 'Lucknow', 'Charbagh', 'Charbagh Railway Station, Lucknow - 226004');

-- Insert sample hotel
INSERT INTO hotels (name, address, map_link, total_floors, floors) VALUES (
  'Yatra Niwas',
  'Main Street, Pilgrimage City, State - 123456',
  'https://maps.google.com/?q=yatra+niwas',
  2,
  '[
    {"floorNumber": "1", "numberOfRooms": 5, "roomNumbers": ["101", "102", "103", "104", "105"]},
    {"floorNumber": "2", "numberOfRooms": 5, "roomNumbers": ["201", "202", "203", "204", "205"]}
  ]'::jsonb
);

-- Insert sample rooms for the hotel
DO $$
DECLARE
  hotel_id_var UUID;
BEGIN
  SELECT id INTO hotel_id_var FROM hotels WHERE name = 'Yatra Niwas';
  
  INSERT INTO rooms (hotel_id, room_number, floor, is_occupied) VALUES
    (hotel_id_var, '101', '1', FALSE),
    (hotel_id_var, '102', '1', FALSE),
    (hotel_id_var, '103', '1', FALSE),
    (hotel_id_var, '104', '1', FALSE),
    (hotel_id_var, '105', '1', FALSE),
    (hotel_id_var, '201', '2', FALSE),
    (hotel_id_var, '202', '2', FALSE),
    (hotel_id_var, '203', '2', FALSE),
    (hotel_id_var, '204', '2', FALSE),
    (hotel_id_var, '205', '2', FALSE);
END $$;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for available rooms with hotel info
CREATE OR REPLACE VIEW available_rooms_with_hotel AS
SELECT 
  r.id,
  r.room_number,
  r.floor,
  h.id as hotel_id,
  h.name as hotel_name,
  h.address as hotel_address
FROM rooms r
JOIN hotels h ON r.hotel_id = h.id
WHERE r.is_occupied = FALSE AND h.is_active = TRUE;

-- View for users with room assignments
CREATE OR REPLACE VIEW users_with_room_details AS
SELECT 
  u.id,
  u.name,
  u.pnr,
  u.contact_number,
  u.number_of_persons,
  u.arrival_date,
  u.return_date,
  r.room_number,
  r.floor,
  h.name as hotel_name
FROM users u
LEFT JOIN rooms r ON u.assigned_room_id = r.id
LEFT JOIN hotels h ON r.hotel_id = h.id;

-- View for event participation summary
CREATE OR REPLACE VIEW event_participation_summary AS
SELECT 
  e.id,
  e.name,
  e.event_date,
  e.location,
  e.max_participants,
  COUNT(ep.id) as total_registered,
  COUNT(CASE WHEN ep.attendance_status = 'attended' THEN 1 END) as total_attended
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id
GROUP BY e.id, e.name, e.event_date, e.location, e.max_participants;

-- ============================================
-- CLEANUP FUNCTIONS
-- ============================================

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM admin_sessions
  WHERE expires_at < CURRENT_TIMESTAMP OR last_activity < CURRENT_TIMESTAMP - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANTS (Adjust based on your user)
-- ============================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO yatra_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO yatra_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO yatra_user;

-- ============================================
-- END OF MIGRATION
-- ============================================

