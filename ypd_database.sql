-- ============================================================
--  AME CHURCH YPD WEBSITE - MySQL Database Schema

-- ============================================================

-- Drop and recreate the database
DROP DATABASE IF EXISTS ypd_db;
CREATE DATABASE ypd_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ypd_db;

-- ============================================================
-- TABLE: Users
-- Stores all registered users (members, admins, guests)
-- ============================================================
CREATE TABLE Users (
    user_id      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    first_name   VARCHAR(100)    NOT NULL,
    last_name    VARCHAR(100)    NOT NULL,
    email        VARCHAR(255)    NOT NULL,
    password     VARCHAR(255)    NOT NULL COMMENT 'BCrypt hashed password',
    phone        VARCHAR(20)     NULL,
    role         ENUM('ADMIN', 'MEMBER', 'GUEST') NOT NULL DEFAULT 'MEMBER',
    status       ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_users         PRIMARY KEY (user_id),
    CONSTRAINT uq_users_email   UNIQUE      (email)
);

-- ============================================================
-- TABLE: Charges (Church Branches / Congregations)
-- Represents individual AME church charges/branches
-- ============================================================
CREATE TABLE Charges (
    charge_id      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    charge_name    VARCHAR(200)    NOT NULL,
    district       VARCHAR(100)    NULL,
    region         VARCHAR(100)    NULL,
    address        VARCHAR(255)    NULL,
    city           VARCHAR(100)    NULL,
    latitude       DECIMAL(10, 7)  NULL COMMENT 'GPS latitude for map display',
    longitude      DECIMAL(10, 7)  NULL COMMENT 'GPS longitude for map display',
    pastor_name    VARCHAR(200)    NULL,
    member_count   INT UNSIGNED    NULL DEFAULT 0,
    created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_charges PRIMARY KEY (charge_id)
);

-- ============================================================
-- TABLE: Events
-- Church events that members can RSVP to
-- ============================================================
CREATE TABLE Events (
    event_id      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    title         VARCHAR(255)    NOT NULL,
    description   TEXT            NULL,
    event_date    DATE            NOT NULL,
    event_time    TIME            NULL,
    location      VARCHAR(255)    NULL,
    max_attendees INT UNSIGNED    NULL COMMENT 'NULL = unlimited',
    status        ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by    INT UNSIGNED    NOT NULL COMMENT 'FK → Users.user_id (admin who created event)',

    CONSTRAINT pk_events         PRIMARY KEY (event_id),
    CONSTRAINT fk_events_creator FOREIGN KEY (created_by)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ============================================================
-- TABLE: Rsvps
-- Tracks which users have RSVPed to which events
-- ============================================================
CREATE TABLE Rsvps (
    rsvp_id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id          INT UNSIGNED    NOT NULL,
    event_id         INT UNSIGNED    NOT NULL,
    attendance_count TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Number of people the member is bringing',
    rsvp_status      ENUM('CONFIRMED', 'PENDING', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_rsvps          PRIMARY KEY (rsvp_id),
    CONSTRAINT uq_rsvps_user_event UNIQUE (user_id, event_id),
    CONSTRAINT fk_rsvps_user     FOREIGN KEY (user_id)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_rsvps_event    FOREIGN KEY (event_id)
        REFERENCES Events (event_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ============================================================
-- TABLE: BlogPost
-- Blog/news articles written by admins or members
-- ============================================================
CREATE TABLE BlogPost (
    post_id       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id       INT UNSIGNED    NOT NULL COMMENT 'Author (FK → Users)',
    title         VARCHAR(255)    NOT NULL,
    content       LONGTEXT        NOT NULL,
    excerpt       VARCHAR(500)    NULL COMMENT 'Short summary shown on listing page',
    author_id     INT UNSIGNED    NOT NULL COMMENT 'Mirrors user_id; kept for clarity',
    status        ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    published_at  DATETIME        NULL,
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_blogpost         PRIMARY KEY (post_id),
    CONSTRAINT fk_blogpost_user    FOREIGN KEY (user_id)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_blogpost_author  FOREIGN KEY (author_id)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ============================================================
-- TABLE: PrayerRequests
-- Prayer requests submitted by members (optionally anonymous)
-- ============================================================
CREATE TABLE PrayerRequests (
    request_id   INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id      INT UNSIGNED    NOT NULL COMMENT 'Submitting user',
    request_text TEXT            NOT NULL,
    is_anonymous TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '1 = hide identity from other members',
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
-- Photos, videos, and documents uploaded to the site
-- ============================================================
CREATE TABLE Media (
    media_id      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    title         VARCHAR(255)    NOT NULL,
    description   TEXT            NULL,
    media_type    ENUM('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO') NOT NULL DEFAULT 'IMAGE',
    file_url      VARCHAR(1000)   NOT NULL COMMENT 'Path or CDN URL to the file',
    uploaded_by   INT UNSIGNED    NOT NULL COMMENT 'FK → Users.user_id',
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_media          PRIMARY KEY (media_id),
    CONSTRAINT fk_media_uploader FOREIGN KEY (uploaded_by)
        REFERENCES Users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ============================================================
-- INDEXES  (performance on common query patterns)
-- ============================================================

-- Events: lookup by date and status
CREATE INDEX idx_events_date   ON Events (event_date);
CREATE INDEX idx_events_status ON Events (status);

-- Rsvps: find all RSVPs for a specific event quickly
CREATE INDEX idx_rsvps_event   ON Rsvps (event_id);

-- BlogPost: listing published posts sorted by date
CREATE INDEX idx_blog_status       ON BlogPost (status);
CREATE INDEX idx_blog_published_at ON BlogPost (published_at DESC);

-- PrayerRequests: admin view of pending requests
CREATE INDEX idx_prayer_status ON PrayerRequests (status);

-- Media: filter by type
CREATE INDEX idx_media_type ON Media (media_type);

-- Charges: geo queries / region filter
CREATE INDEX idx_charges_region ON Charges (region);
CREATE INDEX idx_charges_city   ON Charges (city);

-- ============================================================
-- SEED DATA — Roles / Demo Records
-- ============================================================

-- Default admin user  (password = 'Admin@1234' BCrypt placeholder)
INSERT INTO Users (first_name, last_name, email, password, role, status)
VALUES
    ('System', 'Admin',  'admin@ypd.org',  '$2a$12$PLACEHOLDER_HASH_ADMIN',  'ADMIN',  'ACTIVE'),
    ('John',   'Member', 'member@ypd.org', '$2a$12$PLACEHOLDER_HASH_MEMBER', 'MEMBER', 'ACTIVE');

-- Sample charges
INSERT INTO Charges (charge_name, district, region, city, pastor_name, member_count)
VALUES
    ('Bethel AME Church',    '1st District', 'Gauteng', 'Johannesburg', 'Rev. T. Dlamini', 120),
    ('Emmanuel AME Church',  '2nd District', 'Gauteng', 'Pretoria',     'Rev. S. Mokoena', 85),
    ('Trinity AME Church',   '3rd District', 'Western Cape', 'Cape Town','Rev. L. Adams',  200);

-- Sample event (created by admin user_id=1)
INSERT INTO Events (title, description, event_date, event_time, location, max_attendees, status, created_by)
VALUES
    ('YPD Annual Conference 2026', 'Annual Youth People Department gathering.', '2026-06-15', '09:00:00', 'Johannesburg Civic Centre', 500, 'UPCOMING', 1),
    ('Easter Prayer Service',      'Combined Easter prayer and praise service.', '2026-04-05', '07:00:00', 'Bethel AME Church Hall',    300, 'UPCOMING', 1);

-- Sample blog post
INSERT INTO BlogPost (user_id, title, content, excerpt, author_id, status, published_at)
VALUES
    (1, 'Welcome to the YPD Website', 'This is the official launch of the AME YPD digital platform...', 'The YPD goes digital!', 1, 'PUBLISHED', NOW());

-- ============================================================
-- VIEWS  (convenient read queries for the Spring Boot layer)
-- ============================================================

-- Published blog posts with author name
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
    COALESCE(SUM(r.attendance_count), 0)  AS total_attending,
    COUNT(r.rsvp_id)                       AS rsvp_count
FROM Events e
LEFT JOIN Rsvps r ON r.event_id = e.event_id AND r.rsvp_status = 'CONFIRMED'
GROUP BY e.event_id, e.title, e.event_date, e.max_attendees;

-- Approved (and non-anonymous) prayer requests with member name
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
-- ============================================================