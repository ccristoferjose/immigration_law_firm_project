-- Legal Appointment Scheduling — MySQL schema (normalized, singular table names)
-- All timestamps stored in UTC.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS legal_appt
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE legal_appt;

-- ---------- Admin / Staff users (JWT auth) ----------
CREATE TABLE IF NOT EXISTS `user` (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  full_name      VARCHAR(255) NOT NULL,
  role           ENUM('admin', 'lawyer', 'assistant') NOT NULL DEFAULT 'assistant',
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Clients (Firebase auth) ----------
CREATE TABLE IF NOT EXISTS `client` (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid           VARCHAR(128) NULL UNIQUE,
  full_name              VARCHAR(255) NOT NULL,
  email                  VARCHAR(255) NOT NULL,
  phone                  VARCHAR(64)  NOT NULL,
  case_number            VARCHAR(128) NULL,
  client_type            ENUM('existing', 'prospective') NOT NULL DEFAULT 'prospective',
  phone_verified         TINYINT(1) NOT NULL DEFAULT 0,
  email_verified         TINYINT(1) NOT NULL DEFAULT 0,
  preferred_contact_time VARCHAR(11)  NULL,
  notes                  TEXT         NULL,
  created_by             ENUM('public', 'admin') NOT NULL DEFAULT 'public',
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX idx_client_case_number (case_number),
  INDEX idx_client_email (email),
  INDEX idx_client_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Appointment types ----------
CREATE TABLE IF NOT EXISTS `appointment_type` (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(128) NOT NULL UNIQUE,
  description       TEXT NULL,
  duration_minutes  INT NOT NULL DEFAULT 60,
  case_prefix       VARCHAR(8) NOT NULL DEFAULT 'GEN',
  is_active         TINYINT(1) NOT NULL DEFAULT 1,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Appointments ----------
CREATE TABLE IF NOT EXISTS `appointment` (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  client_id              INT NOT NULL,
  appointment_type_id    INT NOT NULL,
  start_at               DATETIME NOT NULL,
  end_at                 DATETIME NOT NULL,
  status                 ENUM('pending_review', 'scheduled', 'completed', 'cancelled', 'no_show', 'rejected') NOT NULL DEFAULT 'scheduled',
  modality               ENUM('in_person', 'google_meet') NOT NULL DEFAULT 'in_person',
  google_meet_link       VARCHAR(512) NULL,
  google_event_id        VARCHAR(255) NULL,
  notes                  TEXT NULL,
  staff_notes            TEXT NULL,
  preferred_contact_time VARCHAR(11) NULL,
  review_notes           TEXT NULL,
  reviewed_by_user_id    INT NULL,
  reviewed_at            DATETIME NULL,
  created_by             ENUM('admin', 'public') NOT NULL DEFAULT 'public',
  created_by_user_id     INT NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_client
    FOREIGN KEY (client_id) REFERENCES `client`(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_type
    FOREIGN KEY (appointment_type_id) REFERENCES `appointment_type`(id) ON DELETE RESTRICT,
  CONSTRAINT fk_appt_user
    FOREIGN KEY (created_by_user_id) REFERENCES `user`(id) ON DELETE SET NULL,
  CONSTRAINT fk_appt_reviewer
    FOREIGN KEY (reviewed_by_user_id) REFERENCES `user`(id) ON DELETE SET NULL,
  INDEX idx_appt_start (start_at),
  INDEX idx_appt_status (status),
  INDEX idx_appt_client (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Blocked times (holidays, OOO, breaks) ----------
CREATE TABLE IF NOT EXISTS `blocked_time` (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  start_at    DATETIME NOT NULL,
  end_at      DATETIME NOT NULL,
  reason      VARCHAR(255) NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_blocked_start (start_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Business settings (key/value) ----------
CREATE TABLE IF NOT EXISTS `setting` (
  `key`      VARCHAR(64) PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Google OAuth tokens per admin user ----------
CREATE TABLE IF NOT EXISTS `google_token` (
  user_id       INT PRIMARY KEY,
  access_token  TEXT NULL,
  refresh_token TEXT NULL,
  scope         TEXT NULL,
  token_type    VARCHAR(64) NULL,
  expiry_date   BIGINT NULL,
  calendar_id   VARCHAR(255) NOT NULL DEFAULT 'primary',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_gtok_user FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Case number sequence (atomic generation) ----------
CREATE TABLE IF NOT EXISTS `case_number_sequence` (
  prefix     VARCHAR(8) PRIMARY KEY,
  next_seq   INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
