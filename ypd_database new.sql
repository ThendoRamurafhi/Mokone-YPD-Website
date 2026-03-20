-- ============================================================
--  AME CHURCH YPD WEBSITE — MySQL Database Schema
--  Architecture: React + Spring Boot + MySQL
-- ============================================================
--  CHANGELOG (Sourcery AI code review fixes applied):
--
--  Fix 1 (bug_risk): BlogPost — removed redundant user_id column.
--          Only author_id exists as the single FK to Users.
--          vw_published_posts view updated accordingly.
--
--  Fix 2 (bug_risk): vw_public_prayers — comment updated to clearly
--          state that anonymous requests ARE shown with a masked name.
--
--  Fix 3 (security + risk): DROP DATABASE removed. Schema uses
--          CREATE DATABASE IF NOT EXISTS and CREATE TABLE IF NOT EXISTS
--          so it is safe to run in any environment.
--          Seed data moved to ypd_seed_dev.sql (dev/local only).
-- ============================================================

-- ============================================================
-- DATABASE
-- ============================================================
CREATE DATABASE IF NOT EXISTS ypd_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ypd_db;

-- ============================================================
-- TABLE: Users
-- Stores all registered users (members, admins, guests)
-- ============================================================
CREATE TABLE IF NOT EXISTS Users (
    user_id      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    first_name   VARCHAR(100)    NOT NULL,
    last_name    VARCHAR(100)    NOT NULL,
    email        VARCHAR(255)    NOT NULL,
    password     VARCHAR(255)    NOT NULL COMMENT 'BCrypt hashed password',
    phone        VARCHAR(20)     NULL,
    role         ENUM('ADMIN', 'MEMBER', 'GUEST') NOT NULL DEFAULT 'MEMBER',
    status       ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_users       PRIMARY KEY (user_id),
    CONSTRAINT uq_users_email UNIQUE      (email)
);

-- ============================================================
-- TABLE: Charges (Church Branches / Congregations)
-- ============================================================
CREATE TABLE IF NOT EXISTS Charges (
    charge_id    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    charge_name  VARCHAR(200)    NOT NULL,
    district     VARCHAR(100)    NULL,
    region       VARCHAR(100)    NULL,
    address      VARCHAR(255)    NULL,
    city         VARCHAR(100)    NULL,
    latitude     DECIMAL(10, 7)  NULL COMMENT 'GPS latitude for map display',
    longitude    DECIMAL(10, 7)  NULL COMMENT 'GPS longitude for map display',
    pastor_name  VARCHAR(200)    NULL,
    member_count INT UNSIGNED    NULL DEFAULT 0,
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_charges PRIMARY KEY (charge_id)
);

-- ============================================================
-- TABLE: Events
-- ============================================================
CREATE TABLE IF NOT EXISTS Events (
    event_id      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    title         VARCHAR(255)    NOT NULL,
    description   TEXT            NULL,
    event_date    DATE            NOT NULL,
    event_time    TIME            NULL,
    location      VARCHAR(255)    NULL,
    max_attendees INT UNSIGNED    NULL COMMENT 'NULL = unlimited',
    status        ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by    INT UNSIGNED    NOT NULL COMMENT 'Admin who created the event',

    CONSTRAINT pk_events         PRIMARY KEY (event_id),
    CONSTRAINT fk_events_creator FOREIGN KEY (created_by)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ============================================================
-- TABLE: Rsvps
-- ============================================================
CREATE TABLE IF NOT EXISTS Rsvps (
    rsvp_id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id          INT UNSIGNED     NOT NULL,
    event_id         INT UNSIGNED     NOT NULL,
    attendance_count TINYINT UNSIGNED NOT NULL DEFAULT 1,
    rsvp_status      ENUM('CONFIRMED', 'PENDING', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    created_at       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_rsvps            PRIMARY KEY (rsvp_id),
    CONSTRAINT uq_rsvps_user_event UNIQUE      (user_id, event_id),
    CONSTRAINT fk_rsvps_user       FOREIGN KEY (user_id)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_rsvps_event      FOREIGN KEY (event_id)
        REFERENCES Events (event_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ============================================================
-- TABLE: BlogPost
-- FIX 1: Only author_id is used (user_id removed — was redundant
--         and risked data drift as flagged by Sourcery review).
-- ============================================================
CREATE TABLE IF NOT EXISTS BlogPost (
    post_id      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    author_id    INT UNSIGNED    NOT NULL COMMENT 'FK → Users (post author)',
    title        VARCHAR(255)    NOT NULL,
    content      LONGTEXT        NOT NULL,
    excerpt      VARCHAR(500)    NULL COMMENT 'Short summary shown on listing page',
    status       ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    published_at DATETIME        NULL,
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_blogpost        PRIMARY KEY (post_id),
    CONSTRAINT fk_blogpost_author FOREIGN KEY (author_id)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ============================================================
-- TABLE: PrayerRequests
-- ============================================================
CREATE TABLE IF NOT EXISTS PrayerRequests (
    request_id   INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id      INT UNSIGNED    NOT NULL,
    request_text TEXT            NOT NULL,
    is_anonymous TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '1 = mask submitter name in public view',
    status       ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_prayer_requests      PRIMARY KEY (request_id),
    CONSTRAINT fk_prayer_requests_user FOREIGN KEY (user_id)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ============================================================
-- TABLE: Media
-- ============================================================
CREATE TABLE IF NOT EXISTS Media (
    media_id    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    title       VARCHAR(255)    NOT NULL,
    description TEXT            NULL,
    media_type  ENUM('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO') NOT NULL DEFAULT 'IMAGE',
    file_url    VARCHAR(1000)   NOT NULL,
    uploaded_by INT UNSIGNED    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_media          PRIMARY KEY (media_id),
    CONSTRAINT fk_media_uploader FOREIGN KEY (uploaded_by)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_events_date       ON Events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_status     ON Events (status);
CREATE INDEX IF NOT EXISTS idx_rsvps_event       ON Rsvps (event_id);
CREATE INDEX IF NOT EXISTS idx_blog_status       ON BlogPost (status);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON BlogPost (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayer_status     ON PrayerRequests (status);
CREATE INDEX IF NOT EXISTS idx_media_type        ON Media (media_type);
CREATE INDEX IF NOT EXISTS idx_charges_region    ON Charges (region);
CREATE INDEX IF NOT EXISTS idx_charges_city      ON Charges (city);

-- ============================================================
-- VIEWS
-- ============================================================

-- Published blog posts with author name
-- FIX 1: Joins on author_id only (user_id removed from BlogPost)
CREATE OR REPLACE VIEW vw_published_posts AS
SELECT
    bp.post_id,
    bp.title,
    bp.excerpt,
    bp.published_at,
    CONCAT(u.first_name, ' ', u.last_name) AS author_name
FROM BlogPost bp
JOIN Users u ON u.user_id = bp.author_id
WHERE bp.status = 'PUBLISHED'
ORDER BY bp.published_at DESC;

-- Event attendance summary
CREATE OR REPLACE VIEW vw_event_attendance AS
SELECT
    e.event_id,
    e.title,
    e.event_date,
    e.max_attendees,
    COALESCE(SUM(r.attendance_count), 0) AS total_attending,
    COUNT(r.rsvp_id)                      AS rsvp_count
FROM Events e
LEFT JOIN Rsvps r ON r.event_id = e.event_id AND r.rsvp_status = 'CONFIRMED'
GROUP BY e.event_id, e.title, e.event_date, e.max_attendees;

-- Approved prayer requests for public display.
-- FIX 2: Anonymous requests ARE included but the submitter's name
--         is masked as 'Anonymous'. All approved requests are shown.
CREATE OR REPLACE VIEW vw_public_prayers AS
SELECT
    pr.request_id,
    pr.request_text,
    pr.created_at,
    CASE
        WHEN pr.is_anonymous = 1 THEN 'Anonymous'
        ELSE CONCAT(u.first_name, ' ', u.last_name)
    END AS submitted_by
FROM PrayerRequests pr
JOIN Users u ON u.user_id = pr.user_id
WHERE pr.status = 'APPROVED'
ORDER BY pr.created_at DESC;

-- ============================================================
-- END OF SCHEMA
-- Run ypd_seed_dev.sql separately for local/dev seed data only
-- ============================================================