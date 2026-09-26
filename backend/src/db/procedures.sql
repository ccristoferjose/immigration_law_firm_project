-- Legal Appointment Scheduling — Stored Procedures
-- All procedures are idempotent (DROP IF EXISTS + CREATE).

USE legal_appt;

-- ================================================================
-- USER PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_user_authenticate;
DELIMITER //
CREATE PROCEDURE sp_user_authenticate(IN p_email VARCHAR(255))
BEGIN
  SELECT id, email, full_name, role, password_hash, is_active
    FROM `user`
   WHERE email = p_email
   LIMIT 1;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_user_get_by_id;
DELIMITER //
CREATE PROCEDURE sp_user_get_by_id(IN p_id INT)
BEGIN
  SELECT id, email, full_name, role, is_active
    FROM `user`
   WHERE id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_user_create;
DELIMITER //
CREATE PROCEDURE sp_user_create(
  IN p_email VARCHAR(255),
  IN p_password_hash VARCHAR(255),
  IN p_full_name VARCHAR(255),
  IN p_role VARCHAR(20)
)
BEGIN
  INSERT INTO `user` (email, password_hash, full_name, role)
  VALUES (p_email, p_password_hash, p_full_name, p_role);

  SELECT id, email, full_name, role, is_active, created_at
    FROM `user`
   WHERE id = LAST_INSERT_ID();
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_user_list;
DELIMITER //
CREATE PROCEDURE sp_user_list()
BEGIN
  SELECT id, email, full_name, role, is_active, created_at
    FROM `user`
   ORDER BY created_at DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_user_count;
DELIMITER //
CREATE PROCEDURE sp_user_count()
BEGIN
  SELECT COUNT(*) AS c FROM `user`;
END //
DELIMITER ;

-- ================================================================
-- CLIENT PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_client_upsert_by_firebase;
DELIMITER //
CREATE PROCEDURE sp_client_upsert_by_firebase(
  IN p_firebase_uid VARCHAR(128),
  IN p_full_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(64),
  IN p_case_number VARCHAR(128),
  IN p_client_type VARCHAR(20),
  IN p_notes TEXT,
  IN p_email_verified TINYINT,
  IN p_phone_verified TINYINT
)
BEGIN
  DECLARE v_existing_id INT DEFAULT NULL;

  SELECT id INTO v_existing_id
    FROM `client`
   WHERE firebase_uid = p_firebase_uid
   LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    UPDATE `client`
       SET full_name = p_full_name,
           email = p_email,
           phone = p_phone,
           case_number = COALESCE(p_case_number, case_number),
           client_type = p_client_type,
           notes = p_notes,
           email_verified = COALESCE(p_email_verified, email_verified),
           phone_verified = COALESCE(p_phone_verified, phone_verified)
     WHERE id = v_existing_id;

    SELECT * FROM `client` WHERE id = v_existing_id;
  ELSE
    INSERT INTO `client`
      (firebase_uid, full_name, email, phone, case_number, client_type, notes,
       email_verified, phone_verified, created_by)
    VALUES
      (p_firebase_uid, p_full_name, p_email, p_phone, p_case_number, p_client_type, p_notes,
       COALESCE(p_email_verified, 0), COALESCE(p_phone_verified, 0), 'public');

    SELECT * FROM `client` WHERE id = LAST_INSERT_ID();
  END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_update_verification;
DELIMITER //
CREATE PROCEDURE sp_client_update_verification(
  IN p_firebase_uid VARCHAR(128),
  IN p_email_verified TINYINT,
  IN p_phone_verified TINYINT
)
BEGIN
  UPDATE `client`
     SET email_verified = p_email_verified,
         phone_verified = p_phone_verified
   WHERE firebase_uid = p_firebase_uid;
END //
DELIMITER ;

-- Bind a Firebase UID to an unclaimed client record.
-- Returns the updated row (empty result if no match).
-- Match rules:
--   * case_number must exist
--   * record must be unclaimed (firebase_uid IS NULL)
--   * at least one of the caller's identifiers (email or phone) must match
--     the stored record — prevents anyone with a leaked case# from hijacking.
DROP PROCEDURE IF EXISTS sp_client_link_firebase_uid;
DELIMITER //
CREATE PROCEDURE sp_client_link_firebase_uid(
  IN p_case_number VARCHAR(128),
  IN p_firebase_uid VARCHAR(128),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(64),
  IN p_email_verified TINYINT,
  IN p_phone_verified TINYINT
)
BEGIN
  DECLARE v_id INT DEFAULT NULL;

  SELECT id INTO v_id
    FROM `client`
   WHERE case_number = p_case_number
     AND firebase_uid IS NULL
     AND (
       (p_email IS NOT NULL AND p_email <> '' AND email = p_email) OR
       (p_phone IS NOT NULL AND p_phone <> '' AND phone = p_phone)
     )
   LIMIT 1;

  IF v_id IS NOT NULL THEN
    UPDATE `client`
       SET firebase_uid = p_firebase_uid,
           email_verified = COALESCE(p_email_verified, email_verified),
           phone_verified = COALESCE(p_phone_verified, phone_verified)
     WHERE id = v_id;
    SELECT * FROM `client` WHERE id = v_id;
  ELSE
    -- Empty result set tells the route handler "no match / refuse".
    SELECT * FROM `client` WHERE id = 0;
  END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_get_by_firebase_uid;
DELIMITER //
CREATE PROCEDURE sp_client_get_by_firebase_uid(IN p_uid VARCHAR(128))
BEGIN
  SELECT * FROM `client` WHERE firebase_uid = p_uid LIMIT 1;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_get_by_case_number;
DELIMITER //
CREATE PROCEDURE sp_client_get_by_case_number(IN p_case_number VARCHAR(128))
BEGIN
  SELECT * FROM `client` WHERE case_number = p_case_number LIMIT 1;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_get_by_id;
DELIMITER //
CREATE PROCEDURE sp_client_get_by_id(IN p_id INT)
BEGIN
  SELECT * FROM `client` WHERE id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_list;
DELIMITER //
CREATE PROCEDURE sp_client_list(IN p_search VARCHAR(255))
BEGIN
  IF p_search IS NULL OR p_search = '' THEN
    SELECT * FROM `client` ORDER BY created_at DESC LIMIT 500;
  ELSE
    SET @like_val = CONCAT('%', p_search, '%');
    SELECT * FROM `client`
     WHERE full_name LIKE @like_val
        OR email LIKE @like_val
        OR phone LIKE @like_val
        OR case_number LIKE @like_val
     ORDER BY created_at DESC
     LIMIT 500;
  END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_create_admin;
DELIMITER //
CREATE PROCEDURE sp_client_create_admin(
  IN p_full_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(64),
  IN p_case_number VARCHAR(128),
  IN p_client_type VARCHAR(20),
  IN p_notes TEXT
)
BEGIN
  INSERT INTO `client` (full_name, email, phone, case_number, client_type, notes, created_by)
  VALUES (p_full_name, p_email, p_phone, p_case_number, p_client_type, p_notes, 'admin');

  SELECT * FROM `client` WHERE id = LAST_INSERT_ID();
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_update_profile;
DELIMITER //
CREATE PROCEDURE sp_client_update_profile(
  IN p_firebase_uid VARCHAR(128),
  IN p_full_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(64)
)
BEGIN
  UPDATE `client`
     SET full_name = p_full_name,
         email_verified = IF(email = p_email, email_verified, 0),
         phone_verified = IF(phone = p_phone, phone_verified, 0),
         email = p_email,
         phone = p_phone
   WHERE firebase_uid = p_firebase_uid;

  SELECT * FROM `client` WHERE firebase_uid = p_firebase_uid;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_update_admin;
DELIMITER //
CREATE PROCEDURE sp_client_update_admin(
  IN p_id INT,
  IN p_full_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(64),
  IN p_case_number VARCHAR(128),
  IN p_client_type VARCHAR(20),
  IN p_notes TEXT,
  IN p_preferred_contact_time VARCHAR(11)
)
BEGIN
  UPDATE `client`
     SET full_name = p_full_name,
         email = p_email,
         phone = p_phone,
         case_number = p_case_number,
         client_type = p_client_type,
         notes = p_notes,
         preferred_contact_time = p_preferred_contact_time
   WHERE id = p_id;

  SELECT * FROM `client` WHERE id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_client_delete;
DELIMITER //
CREATE PROCEDURE sp_client_delete(IN p_id INT)
BEGIN
  DELETE FROM `client` WHERE id = p_id;
END //
DELIMITER ;

-- ================================================================
-- APPOINTMENT PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_appointment_list;
DELIMITER //
CREATE PROCEDURE sp_appointment_list(
  IN p_from DATETIME,
  IN p_to DATETIME,
  IN p_status VARCHAR(32),
  IN p_client_id INT
)
BEGIN
  SELECT a.*,
         c.full_name   AS client_name,
         c.email       AS client_email,
         c.phone       AS client_phone,
         c.case_number AS client_case_number,
         t.name        AS type_name,
         t.duration_minutes AS type_duration
    FROM `appointment` a
    JOIN `client` c ON c.id = a.client_id
    JOIN `appointment_type` t ON t.id = a.appointment_type_id
   WHERE (p_from IS NULL OR a.end_at >= p_from)
     AND (p_to IS NULL OR a.start_at <= p_to)
     AND (p_status IS NULL OR p_status = '' OR a.status = p_status)
     AND (p_client_id IS NULL OR p_client_id = 0 OR a.client_id = p_client_id)
   ORDER BY a.start_at ASC
   LIMIT 1000;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_get;
DELIMITER //
CREATE PROCEDURE sp_appointment_get(IN p_id INT)
BEGIN
  SELECT a.*,
         c.full_name   AS client_name,
         c.email       AS client_email,
         c.phone       AS client_phone,
         c.case_number AS client_case_number,
         t.name        AS type_name,
         t.duration_minutes AS type_duration
    FROM `appointment` a
    JOIN `client` c ON c.id = a.client_id
    JOIN `appointment_type` t ON t.id = a.appointment_type_id
   WHERE a.id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_create;
DELIMITER //
CREATE PROCEDURE sp_appointment_create(
  IN p_client_id INT,
  IN p_type_id INT,
  IN p_start_at DATETIME,
  IN p_end_at DATETIME,
  IN p_status VARCHAR(20),
  IN p_modality VARCHAR(20),
  IN p_meet_link VARCHAR(512),
  IN p_event_id VARCHAR(255),
  IN p_notes TEXT,
  IN p_staff_notes TEXT,
  IN p_created_by VARCHAR(10),
  IN p_created_by_user_id INT,
  IN p_preferred_contact_time VARCHAR(11)
)
BEGIN
  INSERT INTO `appointment`
    (client_id, appointment_type_id, start_at, end_at, status, modality,
     google_meet_link, google_event_id, notes, staff_notes,
     created_by, created_by_user_id, preferred_contact_time)
  VALUES
    (p_client_id, p_type_id, p_start_at, p_end_at, p_status, p_modality,
     p_meet_link, p_event_id, p_notes, p_staff_notes,
     p_created_by, p_created_by_user_id, p_preferred_contact_time);

  SELECT * FROM `appointment` WHERE id = LAST_INSERT_ID();
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_update;
DELIMITER //
CREATE PROCEDURE sp_appointment_update(
  IN p_id INT,
  IN p_client_id INT,
  IN p_type_id INT,
  IN p_start_at DATETIME,
  IN p_end_at DATETIME,
  IN p_modality VARCHAR(20),
  IN p_notes TEXT,
  IN p_staff_notes TEXT,
  IN p_status VARCHAR(20)
)
BEGIN
  UPDATE `appointment`
     SET client_id = p_client_id,
         appointment_type_id = p_type_id,
         start_at = p_start_at,
         end_at = p_end_at,
         modality = p_modality,
         notes = p_notes,
         staff_notes = p_staff_notes,
         status = p_status
   WHERE id = p_id;

  SELECT * FROM `appointment` WHERE id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_delete;
DELIMITER //
CREATE PROCEDURE sp_appointment_delete(IN p_id INT)
BEGIN
  -- Return the row before deleting so caller can clean up Google events
  SELECT * FROM `appointment` WHERE id = p_id;
  DELETE FROM `appointment` WHERE id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_list_by_client;
DELIMITER //
CREATE PROCEDURE sp_appointment_list_by_client(IN p_client_id INT)
BEGIN
  SELECT a.id, a.start_at, a.end_at, a.status, a.modality,
         a.google_meet_link, a.notes, a.staff_notes,
         a.preferred_contact_time, a.review_notes,
         t.name AS type_name, t.duration_minutes AS type_duration
    FROM `appointment` a
    JOIN `appointment_type` t ON t.id = a.appointment_type_id
   WHERE a.client_id = p_client_id
   ORDER BY a.start_at ASC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_list_pending_review;
DELIMITER //
CREATE PROCEDURE sp_appointment_list_pending_review()
BEGIN
  SELECT a.*,
         c.full_name   AS client_name,
         c.email       AS client_email,
         c.phone       AS client_phone,
         c.client_type AS client_type,
         c.email_verified AS client_email_verified,
         c.phone_verified AS client_phone_verified,
         c.preferred_contact_time AS client_preferred_contact_time,
         t.name        AS type_name,
         t.duration_minutes AS type_duration
    FROM `appointment` a
    JOIN `client` c ON c.id = a.client_id
    JOIN `appointment_type` t ON t.id = a.appointment_type_id
   WHERE a.status = 'pending_review'
   ORDER BY a.created_at ASC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_review;
DELIMITER //
CREATE PROCEDURE sp_appointment_review(
  IN p_id INT,
  IN p_action VARCHAR(10),
  IN p_reviewer_id INT,
  IN p_review_notes TEXT
)
BEGIN
  IF p_action = 'approve' THEN
    UPDATE `appointment`
       SET status = 'scheduled',
           reviewed_by_user_id = p_reviewer_id,
           reviewed_at = UTC_TIMESTAMP(),
           review_notes = p_review_notes
     WHERE id = p_id AND status = 'pending_review';
  ELSEIF p_action = 'reject' THEN
    UPDATE `appointment`
       SET status = 'rejected',
           reviewed_by_user_id = p_reviewer_id,
           reviewed_at = UTC_TIMESTAMP(),
           review_notes = p_review_notes
     WHERE id = p_id AND status = 'pending_review';
  END IF;

  SELECT a.*,
         c.full_name   AS client_name,
         c.email       AS client_email,
         c.phone       AS client_phone,
         c.case_number AS client_case_number,
         t.name        AS type_name,
         t.duration_minutes AS type_duration
    FROM `appointment` a
    JOIN `client` c ON c.id = a.client_id
    JOIN `appointment_type` t ON t.id = a.appointment_type_id
   WHERE a.id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_get_by_client;
DELIMITER //
CREATE PROCEDURE sp_appointment_get_by_client(IN p_client_id INT, IN p_id INT)
BEGIN
  SELECT a.*, t.name AS type_name, t.duration_minutes AS type_duration
    FROM `appointment` a
    JOIN `appointment_type` t ON t.id = a.appointment_type_id
   WHERE a.client_id = p_client_id AND a.id = p_id;
END //
DELIMITER ;

-- ================================================================
-- CASE NUMBER GENERATION
-- ================================================================

DROP PROCEDURE IF EXISTS sp_generate_case_number;
DELIMITER //
CREATE PROCEDURE sp_generate_case_number(
  IN p_client_id INT,
  IN p_type_id INT
)
BEGIN
  DECLARE v_prefix VARCHAR(8);
  DECLARE v_seq INT;
  DECLARE v_case_number VARCHAR(128);

  -- Get the prefix from the appointment type
  SELECT case_prefix INTO v_prefix
    FROM `appointment_type`
   WHERE id = p_type_id;

  IF v_prefix IS NULL THEN
    SET v_prefix = 'GEN';
  END IF;

  -- Atomic increment: insert or update
  INSERT INTO `case_number_sequence` (prefix, next_seq)
  VALUES (v_prefix, 1)
  ON DUPLICATE KEY UPDATE next_seq = next_seq + 1;

  SELECT next_seq INTO v_seq
    FROM `case_number_sequence`
   WHERE prefix = v_prefix;

  -- Format: PREFIX-NNNNNNNN (8 digits)
  SET v_case_number = CONCAT(v_prefix, '-', LPAD(v_seq, 8, '0'));

  -- Assign to client
  UPDATE `client` SET case_number = v_case_number WHERE id = p_client_id;

  SELECT v_case_number AS case_number;
END //
DELIMITER ;

-- ================================================================
-- AVAILABILITY PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_availability_get_appointments;
DELIMITER //
CREATE PROCEDURE sp_availability_get_appointments(
  IN p_start DATETIME,
  IN p_end DATETIME
)
BEGIN
  SELECT start_at, end_at
    FROM `appointment`
   WHERE status IN ('pending_review', 'scheduled', 'completed', 'no_show')
     AND end_at > p_start
     AND start_at < p_end;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_availability_get_blocked;
DELIMITER //
CREATE PROCEDURE sp_availability_get_blocked(
  IN p_start DATETIME,
  IN p_end DATETIME
)
BEGIN
  SELECT start_at, end_at
    FROM `blocked_time`
   WHERE end_at > p_start
     AND start_at < p_end;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_availability_check_conflicts;
DELIMITER //
CREATE PROCEDURE sp_availability_check_conflicts(
  IN p_start DATETIME,
  IN p_end DATETIME,
  IN p_exclude_id INT
)
BEGIN
  SELECT id
    FROM `appointment`
   WHERE status IN ('pending_review', 'scheduled', 'completed', 'no_show')
     AND start_at < p_end
     AND end_at > p_start
     AND (p_exclude_id IS NULL OR p_exclude_id = 0 OR id <> p_exclude_id);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_availability_check_blocked;
DELIMITER //
CREATE PROCEDURE sp_availability_check_blocked(
  IN p_start DATETIME,
  IN p_end DATETIME
)
BEGIN
  SELECT id FROM `blocked_time`
   WHERE start_at < p_end AND end_at > p_start;
END //
DELIMITER ;

-- ================================================================
-- SETTING PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_setting_get_all;
DELIMITER //
CREATE PROCEDURE sp_setting_get_all()
BEGIN
  SELECT `key`, value FROM `setting`;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_setting_upsert;
DELIMITER //
CREATE PROCEDURE sp_setting_upsert(
  IN p_key VARCHAR(64),
  IN p_value TEXT
)
BEGIN
  INSERT INTO `setting` (`key`, value)
  VALUES (p_key, p_value)
  ON DUPLICATE KEY UPDATE value = p_value;
END //
DELIMITER ;

-- ================================================================
-- APPOINTMENT TYPE PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_appointment_type_list;
DELIMITER //
CREATE PROCEDURE sp_appointment_type_list(IN p_active_only TINYINT)
BEGIN
  IF p_active_only = 1 THEN
    SELECT * FROM `appointment_type` WHERE is_active = 1 ORDER BY name ASC;
  ELSE
    SELECT * FROM `appointment_type` ORDER BY name ASC;
  END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_type_get;
DELIMITER //
CREATE PROCEDURE sp_appointment_type_get(IN p_id INT)
BEGIN
  SELECT * FROM `appointment_type` WHERE id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_type_create;
DELIMITER //
CREATE PROCEDURE sp_appointment_type_create(
  IN p_name VARCHAR(128),
  IN p_description TEXT,
  IN p_duration_minutes INT,
  IN p_is_active TINYINT,
  IN p_case_prefix VARCHAR(8)
)
BEGIN
  INSERT INTO `appointment_type` (name, description, duration_minutes, is_active, case_prefix)
  VALUES (p_name, p_description, p_duration_minutes, p_is_active, COALESCE(p_case_prefix, 'GEN'));

  SELECT * FROM `appointment_type` WHERE id = LAST_INSERT_ID();
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_type_update;
DELIMITER //
CREATE PROCEDURE sp_appointment_type_update(
  IN p_id INT,
  IN p_name VARCHAR(128),
  IN p_description TEXT,
  IN p_duration_minutes INT,
  IN p_is_active TINYINT,
  IN p_case_prefix VARCHAR(8)
)
BEGIN
  UPDATE `appointment_type`
     SET name = p_name,
         description = p_description,
         duration_minutes = p_duration_minutes,
         is_active = p_is_active,
         case_prefix = COALESCE(p_case_prefix, case_prefix)
   WHERE id = p_id;

  SELECT * FROM `appointment_type` WHERE id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_appointment_type_delete;
DELIMITER //
CREATE PROCEDURE sp_appointment_type_delete(IN p_id INT)
BEGIN
  DELETE FROM `appointment_type` WHERE id = p_id;
END //
DELIMITER ;

-- ================================================================
-- BLOCKED TIME PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_blocked_time_list;
DELIMITER //
CREATE PROCEDURE sp_blocked_time_list(
  IN p_from DATETIME,
  IN p_to DATETIME
)
BEGIN
  SELECT * FROM `blocked_time`
   WHERE (p_from IS NULL OR end_at >= p_from)
     AND (p_to IS NULL OR start_at <= p_to)
   ORDER BY start_at ASC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_blocked_time_create;
DELIMITER //
CREATE PROCEDURE sp_blocked_time_create(
  IN p_title VARCHAR(255),
  IN p_start_at DATETIME,
  IN p_end_at DATETIME,
  IN p_reason VARCHAR(255)
)
BEGIN
  INSERT INTO `blocked_time` (title, start_at, end_at, reason)
  VALUES (p_title, p_start_at, p_end_at, p_reason);

  SELECT * FROM `blocked_time` WHERE id = LAST_INSERT_ID();
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_blocked_time_update;
DELIMITER //
CREATE PROCEDURE sp_blocked_time_update(
  IN p_id INT,
  IN p_title VARCHAR(255),
  IN p_start_at DATETIME,
  IN p_end_at DATETIME,
  IN p_reason VARCHAR(255)
)
BEGIN
  UPDATE `blocked_time`
     SET title = p_title,
         start_at = p_start_at,
         end_at = p_end_at,
         reason = p_reason
   WHERE id = p_id;

  SELECT * FROM `blocked_time` WHERE id = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_blocked_time_delete;
DELIMITER //
CREATE PROCEDURE sp_blocked_time_delete(IN p_id INT)
BEGIN
  DELETE FROM `blocked_time` WHERE id = p_id;
END //
DELIMITER ;

-- ================================================================
-- GOOGLE TOKEN PROCEDURES
-- ================================================================

DROP PROCEDURE IF EXISTS sp_google_token_save;
DELIMITER //
CREATE PROCEDURE sp_google_token_save(
  IN p_user_id INT,
  IN p_access_token TEXT,
  IN p_refresh_token TEXT,
  IN p_scope TEXT,
  IN p_token_type VARCHAR(64),
  IN p_expiry_date BIGINT
)
BEGIN
  INSERT INTO `google_token` (user_id, access_token, refresh_token, scope, token_type, expiry_date)
  VALUES (p_user_id, p_access_token, p_refresh_token, p_scope, p_token_type, p_expiry_date)
  ON DUPLICATE KEY UPDATE
    access_token = COALESCE(p_access_token, access_token),
    refresh_token = COALESCE(p_refresh_token, refresh_token),
    scope = COALESCE(p_scope, scope),
    token_type = COALESCE(p_token_type, token_type),
    expiry_date = COALESCE(p_expiry_date, expiry_date);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_google_token_get;
DELIMITER //
CREATE PROCEDURE sp_google_token_get(IN p_user_id INT)
BEGIN
  SELECT * FROM `google_token` WHERE user_id = p_user_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_google_token_find_admin_host;
DELIMITER //
CREATE PROCEDURE sp_google_token_find_admin_host()
BEGIN
  SELECT u.id
    FROM `user` u
    JOIN `google_token` g ON g.user_id = u.id
   WHERE u.role = 'admin'
     AND u.is_active = 1
     AND g.refresh_token IS NOT NULL
   ORDER BY u.id ASC
   LIMIT 1;
END //
DELIMITER ;
