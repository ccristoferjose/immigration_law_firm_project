-- Seed data for development
USE legal_appt;

-- Default admin user is bootstrapped at backend startup (see src/db/bootstrap.js)
-- so the bcrypt hash is generated correctly.

-- Appointment types (with case_prefix for case number generation)
INSERT INTO `appointment_type` (name, description, duration_minutes, case_prefix) VALUES
  ('Initial Consultation',       'First meeting to review the client''s situation',        60, 'CON'),
  ('Document Review',            'Review documentation provided by the client',            45, 'DOC'),
  ('Case Follow-Up',             'Follow up on an ongoing case',                           30, 'FOL'),
  ('Work Permit Consultation',   'Specialized consultation for work permit applications',  60, 'WRK')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Seed case number sequences for each prefix
INSERT INTO `case_number_sequence` (prefix, next_seq) VALUES
  ('CON', 0),
  ('DOC', 0),
  ('FOL', 0),
  ('WRK', 0),
  ('GEN', 0)
ON DUPLICATE KEY UPDATE prefix = VALUES(prefix);

-- Default business settings
INSERT INTO `setting` (`key`, value) VALUES
  ('business_name',        'Immigration Law Office'),
  ('business_tagline',     'Guiding your journey, protecting your future.'),
  ('timezone',             'America/New_York'),
  ('working_days',         '1,2,3,4,5'),
  ('working_hours_start',  '10:00'),
  ('working_hours_end',    '17:00'),
  ('slot_duration_minutes','60'),
  ('buffer_minutes',       '0'),
  ('booking_window_days',  '30'),
  ('staff_login_path',     'a7f3e2b1c9d0')
ON DUPLICATE KEY UPDATE value = VALUES(value);
