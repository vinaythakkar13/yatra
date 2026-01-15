-- ============================================
-- Yatra Event Management System
-- Sample/Test Data Seeding Script
-- ============================================

-- ============================================
-- SAMPLE USERS (Pilgrims)
-- ============================================
INSERT INTO users (
  name, contact_number, email, gender, age, number_of_persons, pnr,
  boarding_state, boarding_city, boarding_point,
  arrival_date, return_date, registration_status
) VALUES
  (
    'Rajesh Kumar',
    '+919876543210',
    'rajesh.kumar@email.com',
    'male',
    45,
    4,
    'PNR001',
    'Maharashtra',
    'Mumbai',
    'Dadar Station',
    '2025-11-01',
    '2025-11-07',
    'confirmed'
  ),
  (
    'Priya Sharma',
    '+919876543211',
    'priya.sharma@email.com',
    'female',
    32,
    2,
    'PNR002',
    'Gujarat',
    'Ahmedabad',
    'Central Bus Stand',
    '2025-11-02',
    '2025-11-08',
    'pending'
  ),
  (
    'Amit Patel',
    '+919876543212',
    'amit.patel@email.com',
    'male',
    50,
    3,
    'PNR003',
    'Rajasthan',
    'Jaipur',
    'Sindhi Camp',
    '2025-11-01',
    '2025-11-06',
    'confirmed'
  ),
  (
    'Sunita Desai',
    '+919876543213',
    'sunita.desai@email.com',
    'female',
    38,
    5,
    'PNR004',
    'Maharashtra',
    'Pune',
    'Shivajinagar',
    '2025-11-03',
    '2025-11-09',
    'pending'
  ),
  (
    'Vikram Singh',
    '+919876543214',
    'vikram.singh@email.com',
    'male',
    42,
    2,
    'PNR005',
    'Delhi',
    'New Delhi',
    'ISBT Kashmere Gate',
    '2025-11-01',
    '2025-11-07',
    'confirmed'
  );

-- ============================================
-- ASSIGN ROOMS TO SOME USERS
-- ============================================
DO $$
DECLARE
  user1_id UUID;
  user3_id UUID;
  user5_id UUID;
  room101_id UUID;
  room102_id UUID;
  room201_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO user1_id FROM users WHERE pnr = 'PNR001';
  SELECT id INTO user3_id FROM users WHERE pnr = 'PNR003';
  SELECT id INTO user5_id FROM users WHERE pnr = 'PNR005';
  
  -- Get room IDs
  SELECT id INTO room101_id FROM rooms WHERE room_number = '101';
  SELECT id INTO room102_id FROM rooms WHERE room_number = '102';
  SELECT id INTO room201_id FROM rooms WHERE room_number = '201';
  
  -- Assign rooms
  UPDATE rooms SET is_occupied = TRUE, assigned_to_user_id = user1_id WHERE id = room101_id;
  UPDATE rooms SET is_occupied = TRUE, assigned_to_user_id = user3_id WHERE id = room102_id;
  UPDATE rooms SET is_occupied = TRUE, assigned_to_user_id = user5_id WHERE id = room201_id;
  
  -- Update users
  UPDATE users SET assigned_room_id = room101_id, is_room_assigned = TRUE WHERE id = user1_id;
  UPDATE users SET assigned_room_id = room102_id, is_room_assigned = TRUE WHERE id = user3_id;
  UPDATE users SET assigned_room_id = room201_id, is_room_assigned = TRUE WHERE id = user5_id;
END $$;

-- ============================================
-- SAMPLE EVENTS
-- ============================================
INSERT INTO events (
  name, description, event_type, event_date, start_time, end_time,
  location, address, max_participants, status
) VALUES
  (
    'Morning Aarti',
    'Traditional morning prayer ceremony at the main temple',
    'religious',
    '2025-11-02',
    '06:00:00',
    '07:00:00',
    'Main Temple',
    'Temple Complex, Pilgrimage City',
    200,
    'upcoming'
  ),
  (
    'Cultural Dance Performance',
    'Traditional folk dance performance by local artists',
    'cultural',
    '2025-11-03',
    '18:00:00',
    '20:00:00',
    'Community Hall',
    'Near Yatra Niwas, Pilgrimage City',
    150,
    'upcoming'
  ),
  (
    'Guided Temple Tour',
    'Comprehensive tour of all major temples in the area',
    'tour',
    '2025-11-04',
    '09:00:00',
    '13:00:00',
    'Starting Point: Yatra Niwas',
    'Yatra Niwas, Main Street',
    100,
    'upcoming'
  ),
  (
    'Evening Prayer',
    'Evening devotional session with kirtan and bhajan',
    'religious',
    '2025-11-05',
    '17:00:00',
    '18:30:00',
    'Main Temple',
    'Temple Complex, Pilgrimage City',
    250,
    'upcoming'
  ),
  (
    'Spiritual Discourse',
    'Enlightening discourse by renowned spiritual leader',
    'religious',
    '2025-11-06',
    '10:00:00',
    '12:00:00',
    'Conference Hall',
    'Yatra Complex, Pilgrimage City',
    300,
    'upcoming'
  );

-- ============================================
-- SAMPLE EVENT REGISTRATIONS
-- ============================================
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  event1_id UUID;
  event2_id UUID;
  event3_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO user1_id FROM users WHERE pnr = 'PNR001';
  SELECT id INTO user2_id FROM users WHERE pnr = 'PNR002';
  SELECT id INTO user3_id FROM users WHERE pnr = 'PNR003';
  
  -- Get event IDs
  SELECT id INTO event1_id FROM events WHERE name = 'Morning Aarti';
  SELECT id INTO event2_id FROM events WHERE name = 'Cultural Dance Performance';
  SELECT id INTO event3_id FROM events WHERE name = 'Guided Temple Tour';
  
  -- Register users for events
  INSERT INTO event_participants (event_id, user_id, attendance_status) VALUES
    (event1_id, user1_id, 'registered'),
    (event1_id, user2_id, 'registered'),
    (event1_id, user3_id, 'registered'),
    (event2_id, user1_id, 'registered'),
    (event2_id, user3_id, 'registered'),
    (event3_id, user2_id, 'registered');
  
  -- Update registered counts
  UPDATE events SET registered_count = 3 WHERE id = event1_id;
  UPDATE events SET registered_count = 2 WHERE id = event2_id;
  UPDATE events SET registered_count = 1 WHERE id = event3_id;
END $$;

-- ============================================
-- ADDITIONAL HOTELS
-- ============================================
INSERT INTO hotels (name, address, map_link, total_floors, floors) VALUES
  (
    'Pilgrims Rest',
    'Temple Street, Pilgrimage City, State - 123457',
    'https://maps.google.com/?q=pilgrims+rest',
    3,
    '[
      {"floorNumber": "G", "numberOfRooms": 4, "roomNumbers": ["G01", "G02", "G03", "G04"]},
      {"floorNumber": "1", "numberOfRooms": 6, "roomNumbers": ["101", "102", "103", "104", "105", "106"]},
      {"floorNumber": "2", "numberOfRooms": 6, "roomNumbers": ["201", "202", "203", "204", "205", "206"]}
    ]'::jsonb
  ),
  (
    'Divine Stay',
    'Bhakti Marg, Pilgrimage City, State - 123458',
    'https://maps.google.com/?q=divine+stay',
    2,
    '[
      {"floorNumber": "1", "numberOfRooms": 8, "roomNumbers": ["101", "102", "103", "104", "105", "106", "107", "108"]},
      {"floorNumber": "2", "numberOfRooms": 8, "roomNumbers": ["201", "202", "203", "204", "205", "206", "207", "208"]}
    ]'::jsonb
  );

-- ============================================
-- CREATE ROOMS FOR NEW HOTELS
-- ============================================
DO $$
DECLARE
  pilgrims_rest_id UUID;
  divine_stay_id UUID;
BEGIN
  SELECT id INTO pilgrims_rest_id FROM hotels WHERE name = 'Pilgrims Rest';
  SELECT id INTO divine_stay_id FROM hotels WHERE name = 'Divine Stay';
  
  -- Rooms for Pilgrims Rest
  INSERT INTO rooms (hotel_id, room_number, floor, is_occupied) VALUES
    (pilgrims_rest_id, 'G01', 'G', FALSE),
    (pilgrims_rest_id, 'G02', 'G', FALSE),
    (pilgrims_rest_id, 'G03', 'G', FALSE),
    (pilgrims_rest_id, 'G04', 'G', FALSE),
    (pilgrims_rest_id, '101', '1', FALSE),
    (pilgrims_rest_id, '102', '1', FALSE),
    (pilgrims_rest_id, '103', '1', FALSE),
    (pilgrims_rest_id, '104', '1', FALSE),
    (pilgrims_rest_id, '105', '1', FALSE),
    (pilgrims_rest_id, '106', '1', FALSE),
    (pilgrims_rest_id, '201', '2', FALSE),
    (pilgrims_rest_id, '202', '2', FALSE),
    (pilgrims_rest_id, '203', '2', FALSE),
    (pilgrims_rest_id, '204', '2', FALSE),
    (pilgrims_rest_id, '205', '2', FALSE),
    (pilgrims_rest_id, '206', '2', FALSE);
  
  -- Rooms for Divine Stay
  INSERT INTO rooms (hotel_id, room_number, floor, is_occupied) VALUES
    (divine_stay_id, '101', '1', FALSE),
    (divine_stay_id, '102', '1', FALSE),
    (divine_stay_id, '103', '1', FALSE),
    (divine_stay_id, '104', '1', FALSE),
    (divine_stay_id, '105', '1', FALSE),
    (divine_stay_id, '106', '1', FALSE),
    (divine_stay_id, '107', '1', FALSE),
    (divine_stay_id, '108', '1', FALSE),
    (divine_stay_id, '201', '2', FALSE),
    (divine_stay_id, '202', '2', FALSE),
    (divine_stay_id, '203', '2', FALSE),
    (divine_stay_id, '204', '2', FALSE),
    (divine_stay_id, '205', '2', FALSE),
    (divine_stay_id, '206', '2', FALSE),
    (divine_stay_id, '207', '2', FALSE),
    (divine_stay_id, '208', '2', FALSE);
END $$;

-- ============================================
-- ADDITIONAL ADMIN USERS
-- ============================================
INSERT INTO admin_users (email, password_hash, name, role, contact_number, email_verified) VALUES
  -- Password: Staff@123
  (
    'staff@yatra.com',
    '$2b$10$YmK5LqoY1K0S5Jx5DeN.LqVYZr3MfK6uN7PxVCXqEYmZGVQDi.abc',
    'Staff User',
    'staff',
    '+919876500001',
    TRUE
  ),
  -- Password: Manager@123
  (
    'manager@yatra.com',
    '$2b$10$ZnL6MrpZ2L1T6Ky6EfO.MrWZAs4NgL7vO8QyWDYrFZnAGWREh.def',
    'Manager User',
    'admin',
    '+919876500002',
    TRUE
  );

-- ============================================
-- SAMPLE AUDIT LOGS
-- ============================================
DO $$
DECLARE
  admin_id UUID;
  user1_id UUID;
  hotel1_id UUID;
BEGIN
  SELECT id INTO admin_id FROM admin_users WHERE email = 'admin@yatra.com';
  SELECT id INTO user1_id FROM users WHERE pnr = 'PNR001';
  SELECT id INTO hotel1_id FROM hotels WHERE name = 'Yatra Niwas';
  
  INSERT INTO audit_logs (action, entity_type, entity_id, performed_by_admin_id, new_data) VALUES
    (
      'CREATE',
      'user',
      user1_id,
      admin_id,
      jsonb_build_object('pnr', 'PNR001', 'name', 'Rajesh Kumar')
    ),
    (
      'CREATE',
      'hotel',
      hotel1_id,
      admin_id,
      jsonb_build_object('name', 'Yatra Niwas', 'total_floors', 2)
    ),
    (
      'ASSIGN_ROOM',
      'user',
      user1_id,
      admin_id,
      jsonb_build_object('room_number', '101', 'hotel', 'Yatra Niwas')
    );
END $$;

-- ============================================
-- VERIFY DATA INSERTION
-- ============================================
SELECT 
  'Users' as table_name,
  COUNT(*) as record_count
FROM users
UNION ALL
SELECT 'Hotels', COUNT(*) FROM hotels
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Event Participants', COUNT(*) FROM event_participants
UNION ALL
SELECT 'Boarding Points', COUNT(*) FROM boarding_points
UNION ALL
SELECT 'Admin Users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs;

-- ============================================
-- END OF SEED DATA
-- ============================================


