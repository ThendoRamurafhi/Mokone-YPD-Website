-- ============================================================
--  AME CHURCH YPD WEBSITE — Complete MySQL Schema
--  Aligned with Spring Boot entities (Hibernate ddl-auto=update)
--  Architecture: React + Spring Boot + MySQL
-- ============================================================
--
--  WHAT CHANGED FROM THE PREVIOUS VERSION:
--
--  Users       → Added: profile_picture_url, username, last_login
--  Events      → Added: category, is_public, rsvp_deadline, featured,
--                        current_attendees (denormalised counter for speed)
--                        status enum expanded to include PUBLISHED/DRAFT
--  Rsvps       → Added: guest_name, guest_email (for non-logged-in RSVP)
--                        user_id made nullable (guests don't have accounts)
--  BlogPost    → Added: category, featured_image_url, read_time,
--                        author_name (for display without join),
--                        slug (for SEO URLs)
--  Media       → Completely rewritten to match Media.java entity:
--                  file_name, stored_file_name, file_type, file_size,
--                  media_category, usage, youtube_video_id,
--                  youtube_thumbnail, is_youtube_video, uploaded_at
--                  uploaded_by made nullable (admin string, not FK)
--  Leadership  → NEW TABLE (was missing entirely)
--  Charges     → Added: phone, email, service_times, is_active, area_name
--
--  INDEXES     → Comprehensive set covering all query patterns
--  VIEWS       → Updated to match new columns
-- ============================================================

CREATE DATABASE IF NOT EXISTS ypd_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ypd_db;

-- ============================================================
-- TABLE: users
-- Note: Hibernate generates lowercase table names by default.
-- Spring Boot entity: User.java (or AppUser.java)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id             BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    first_name          VARCHAR(100)     NOT NULL,
    last_name           VARCHAR(100)     NOT NULL,
    username            VARCHAR(100)     NULL COMMENT 'Optional display name',
    email               VARCHAR(255)     NOT NULL,
    password            VARCHAR(255)     NOT NULL COMMENT 'BCrypt hashed',
    phone               VARCHAR(20)      NULL,
    role                VARCHAR(20)      NOT NULL DEFAULT 'MEMBER'
                        COMMENT 'ADMIN | MEMBER | GUEST — stored as string for Spring Security',
    status              VARCHAR(20)      NOT NULL DEFAULT 'ACTIVE'
                        COMMENT 'ACTIVE | INACTIVE | SUSPENDED',
    profile_picture_url VARCHAR(1000)    NULL,
    last_login          DATETIME         NULL,
    created_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_users        PRIMARY KEY (user_id),
    CONSTRAINT uq_users_email  UNIQUE (email)
);

-- ============================================================
-- TABLE: events
-- Entity: Event.java
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    event_id           BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    title              VARCHAR(255)     NOT NULL,
    description        TEXT             NULL,
    event_date         DATE             NOT NULL,
    event_time         VARCHAR(20)      NULL COMMENT 'Stored as string: "09:00 AM"',
    location           VARCHAR(255)     NULL,
    category           VARCHAR(30)      NOT NULL DEFAULT 'COMMUNITY'
                       COMMENT 'CONFERENCE | YOUTH | COMMUNITY | WORSHIP | EDUCATIONAL',
    max_attendees      INT              NULL     COMMENT 'NULL = unlimited',
    current_attendees  INT              NOT NULL DEFAULT 0
                       COMMENT 'Denormalised counter — updated on each RSVP',
    rsvp_deadline      DATE             NULL,
    is_public          TINYINT(1)       NOT NULL DEFAULT 1,
    featured           TINYINT(1)       NOT NULL DEFAULT 0
                       COMMENT '1 = shown in homepage featured section',
    status             VARCHAR(20)      NOT NULL DEFAULT 'PUBLISHED'
                       COMMENT 'DRAFT | PUBLISHED | CANCELLED',
    created_by         BIGINT UNSIGNED  NULL,
    created_at         DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_events         PRIMARY KEY (event_id),
    CONSTRAINT fk_events_creator FOREIGN KEY (created_by)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ============================================================
-- TABLE: rsvps
-- Entity: Rsvp.java / EventRsvp.java
-- ============================================================
CREATE TABLE IF NOT EXISTS rsvps (
    rsvp_id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    event_id         BIGINT UNSIGNED  NOT NULL,
    user_id          BIGINT UNSIGNED  NULL  COMMENT 'NULL for guest RSVPs',
    guest_name       VARCHAR(200)     NULL  COMMENT 'For non-logged-in attendees',
    guest_email      VARCHAR(255)     NULL,
    attendance_count TINYINT UNSIGNED NOT NULL DEFAULT 1,
    rsvp_status      VARCHAR(20)      NOT NULL DEFAULT 'CONFIRMED'
                     COMMENT 'CONFIRMED | PENDING | CANCELLED',
    created_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_rsvps       PRIMARY KEY (rsvp_id),
    CONSTRAINT fk_rsvps_event FOREIGN KEY (event_id)
        REFERENCES events (event_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_rsvps_user  FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ============================================================
-- TABLE: blog_post
-- Entity: BlogPost.java
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_post (
    post_id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    author_id          BIGINT UNSIGNED  NULL,
    author_name        VARCHAR(200)     NULL  COMMENT 'Denormalised — set at creation time',
    title              VARCHAR(255)     NOT NULL,
    slug               VARCHAR(300)     NULL  COMMENT 'SEO-friendly URL segment',
    content            LONGTEXT         NOT NULL,
    excerpt            VARCHAR(600)     NULL,
    featured_image_url VARCHAR(1000)    NULL  COMMENT 'URL from Media library',
    category           VARCHAR(30)      NOT NULL DEFAULT 'GENERAL'
                       COMMENT 'ANNOUNCEMENT | COMMUNITY | DEVOTIONAL | GENERAL | TESTIMONY | YOUTH | SERMON | NEWS | RESOURCE',
    status             VARCHAR(20)      NOT NULL DEFAULT 'DRAFT'
                       COMMENT 'DRAFT | PUBLISHED | ARCHIVED',
    read_time          VARCHAR(20)      NULL  COMMENT 'e.g. "5 min"',
    published_at       DATETIME         NULL,
    created_at         DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_blog_post        PRIMARY KEY (post_id),
    CONSTRAINT fk_blog_post_author FOREIGN KEY (author_id)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ============================================================
-- TABLE: prayer_requests
-- Entity: PrayerRequest.java
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_requests (
    request_id   BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    user_id      BIGINT UNSIGNED  NULL,
    request_text TEXT             NOT NULL,
    is_anonymous TINYINT(1)       NOT NULL DEFAULT 0,
    status       VARCHAR(20)      NOT NULL DEFAULT 'PENDING'
                 COMMENT 'PENDING | APPROVED | REJECTED',
    created_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_prayer_requests      PRIMARY KEY (request_id),
    CONSTRAINT fk_prayer_requests_user FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ============================================================
-- TABLE: media
-- Entity: Media.java  (completely rewritten to match entity)
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
    media_id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,

    -- File identity
    file_name         VARCHAR(255)     NOT NULL COMMENT 'Original filename from user',
    stored_file_name  VARCHAR(255)     NULL     COMMENT 'UUID-based name on disk',
    file_url          VARCHAR(1000)    NOT NULL COMMENT 'Relative URL: /api/v1/media/files/xxx.jpg',
    file_type         VARCHAR(100)     NULL     COMMENT 'MIME type: image/jpeg, video/mp4 etc.',
    file_size         BIGINT           NULL     COMMENT 'Size in bytes',

    -- Classification
    media_type        VARCHAR(20)      NOT NULL DEFAULT 'IMAGE'
                      COMMENT 'IMAGE | VIDEO | DOCUMENT',
    category          VARCHAR(30)      NOT NULL DEFAULT 'GENERAL'
                      COMMENT 'EVENTS | WORSHIP | YOUTH | COMMUNITY | LEADERSHIP |
                               GALLERY | HERO_IMAGES | BLOG_IMAGES | STRUCTURE | ABOUT | GENERAL',
    usage             VARCHAR(30)      NOT NULL DEFAULT 'GALLERY'
                      COMMENT 'GALLERY | BLOG_FEATURED | BLOG_INLINE | HOME_HERO |
                               HOME_STAY_INFORMED | ABOUT_JOURNEY | LEADERSHIP_PROFILE |
                               STRUCTURE_LEADER | EVENT_COVER | HERO_SECTION | PAGE_HEADER | GENERAL',

    -- Content metadata
    title             VARCHAR(255)     NULL,
    description       TEXT             NULL,
    uploaded_by       VARCHAR(100)     NULL COMMENT 'Admin username string, not FK',

    -- YouTube integration
    youtube_video_id  VARCHAR(20)      NULL COMMENT '11-char YouTube video ID',
    youtube_thumbnail VARCHAR(500)     NULL COMMENT 'YouTube auto-generated thumbnail URL',
    is_youtube_video  TINYINT(1)       NOT NULL DEFAULT 0,

    uploaded_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_media PRIMARY KEY (media_id)
);

-- ============================================================
-- TABLE: leadership
-- Entity: Leadership.java  (NEW — was missing from old schema)
-- Used by About page "Guiding Principles" and Structure "Our Leadership"
-- ============================================================
CREATE TABLE IF NOT EXISTS leadership (
    leader_id     BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    name          VARCHAR(200)     NOT NULL,
    role          VARCHAR(200)     NOT NULL  COMMENT 'e.g. Presiding Elder, YPD Director',
    initials      VARCHAR(10)      NULL      COMMENT 'Fallback when no photo: JD',
    description   TEXT             NULL      COMMENT 'Short bio shown on About page',
    photo_url     VARCHAR(1000)    NULL      COMMENT 'URL from Media library (LEADERSHIP_PROFILE usage)',
    page_section  VARCHAR(30)      NOT NULL DEFAULT 'BOTH'
                  COMMENT 'ABOUT_LEADERSHIP | STRUCTURE_TEAM | BOTH',
    display_order INT              NOT NULL DEFAULT 0 COMMENT 'Lower = shown first',
    active        TINYINT(1)       NOT NULL DEFAULT 1 COMMENT '0 = soft-deleted',

    CONSTRAINT pk_leadership PRIMARY KEY (leader_id)
);

-- ============================================================
-- TABLE: charges
-- Entity: Charge.java  (updated with extra columns)
-- ============================================================
CREATE TABLE IF NOT EXISTS charges (
    charge_id    BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    charge_name  VARCHAR(200)     NOT NULL,
    area_name    VARCHAR(200)     NULL      COMMENT 'e.g. Sibasa Area, Thohoyandou Area',
    district     VARCHAR(100)     NULL,
    region       VARCHAR(100)     NULL,
    address      VARCHAR(255)     NULL,
    city         VARCHAR(100)     NULL,
    latitude     DECIMAL(10, 7)   NULL,
    longitude    DECIMAL(10, 7)   NULL,
    pastor_name  VARCHAR(200)     NULL,
    phone        VARCHAR(30)      NULL,
    email        VARCHAR(255)     NULL,
    service_times VARCHAR(300)    NULL      COMMENT 'e.g. "Sunday 09:00 & 11:00"',
    member_count INT UNSIGNED     NULL DEFAULT 0,
    is_active    TINYINT(1)       NOT NULL DEFAULT 1,
    created_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_charges PRIMARY KEY (charge_id)
);

-- ============================================================
-- INDEXES  (covers every WHERE / ORDER BY pattern in services)
-- ============================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_role       ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_status     ON users (status);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_date      ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_status    ON events (status);
CREATE INDEX IF NOT EXISTS idx_events_category  ON events (category);
CREATE INDEX IF NOT EXISTS idx_events_featured  ON events (featured);
CREATE INDEX IF NOT EXISTS idx_events_creator   ON events (created_by);

-- RSVPs
CREATE INDEX IF NOT EXISTS idx_rsvps_event      ON rsvps (event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user       ON rsvps (user_id);

-- Blog
CREATE INDEX IF NOT EXISTS idx_blog_status      ON blog_post (status);
CREATE INDEX IF NOT EXISTS idx_blog_category    ON blog_post (category);
CREATE INDEX IF NOT EXISTS idx_blog_published   ON blog_post (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_author      ON blog_post (author_id);

-- Prayer
CREATE INDEX IF NOT EXISTS idx_prayer_status    ON prayer_requests (status);
CREATE INDEX IF NOT EXISTS idx_prayer_user      ON prayer_requests (user_id);

-- Media
CREATE INDEX IF NOT EXISTS idx_media_type       ON media (media_type);
CREATE INDEX IF NOT EXISTS idx_media_category   ON media (category);
CREATE INDEX IF NOT EXISTS idx_media_usage      ON media (usage);
CREATE INDEX IF NOT EXISTS idx_media_youtube    ON media (is_youtube_video);
CREATE INDEX IF NOT EXISTS idx_media_uploaded   ON media (uploaded_at DESC);

-- Leadership
CREATE INDEX IF NOT EXISTS idx_leadership_section ON leadership (page_section);
CREATE INDEX IF NOT EXISTS idx_leadership_active  ON leadership (active);
CREATE INDEX IF NOT EXISTS idx_leadership_order   ON leadership (display_order);

-- Charges
CREATE INDEX IF NOT EXISTS idx_charges_region   ON charges (region);
CREATE INDEX IF NOT EXISTS idx_charges_city     ON charges (city);
CREATE INDEX IF NOT EXISTS idx_charges_area     ON charges (area_name);
CREATE INDEX IF NOT EXISTS idx_charges_active   ON charges (is_active);

-- ============================================================
-- VIEWS
-- ============================================================

-- Published blog posts with author info
CREATE OR REPLACE VIEW vw_published_posts AS
SELECT
    bp.post_id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image_url,
    bp.category,
    bp.read_time,
    bp.published_at,
    COALESCE(bp.author_name,
        CONCAT(u.first_name, ' ', u.last_name)) AS author_name
FROM blog_post bp
LEFT JOIN users u ON u.user_id = bp.author_id
WHERE bp.status = 'PUBLISHED'
ORDER BY bp.published_at DESC;

-- Event attendance summary (used by admin dashboard)
CREATE OR REPLACE VIEW vw_event_attendance AS
SELECT
    e.event_id,
    e.title,
    e.event_date,
    e.category,
    e.status,
    e.max_attendees,
    e.current_attendees,
    COALESCE(SUM(r.attendance_count), 0) AS rsvp_total,
    COUNT(r.rsvp_id)                      AS rsvp_count
FROM events e
LEFT JOIN rsvps r
    ON r.event_id = e.event_id
    AND r.rsvp_status = 'CONFIRMED'
GROUP BY e.event_id, e.title, e.event_date,
         e.category, e.status, e.max_attendees, e.current_attendees;

-- Approved prayer requests — anonymous names masked
CREATE OR REPLACE VIEW vw_public_prayers AS
SELECT
    pr.request_id,
    pr.request_text,
    pr.created_at,
    CASE
        WHEN pr.is_anonymous = 1 THEN 'Anonymous'
        ELSE COALESCE(
            CONCAT(u.first_name, ' ', u.last_name),
            'Member'
        )
    END AS submitted_by
FROM prayer_requests pr
LEFT JOIN users u ON u.user_id = pr.user_id
WHERE pr.status = 'APPROVED'
ORDER BY pr.created_at DESC;

-- Media by usage — convenient shortcut for page queries
CREATE OR REPLACE VIEW vw_media_by_usage AS
SELECT
    media_id,
    title,
    file_url,
    file_type,
    media_type,
    category,
    usage,
    youtube_video_id,
    youtube_thumbnail,
    is_youtube_video,
    description,
    uploaded_at
FROM media
ORDER BY uploaded_at DESC;

-- Active leadership for pages
CREATE OR REPLACE VIEW vw_active_leadership AS
SELECT
    leader_id,
    name,
    role,
    initials,
    description,
    photo_url,
    page_section,
    display_order
FROM leadership
WHERE active = 1
ORDER BY display_order ASC;

-- ============================================================
-- UPDATE application.properties connection string:
--
-- OLD (H2):
--   spring.datasource.url=jdbc:h2:mem:ame_ypd_db;DB_CLOSE_DELAY=-1
--   spring.datasource.driver-class-name=org.h2.Driver
--
-- NEW (MySQL — this schema):
--   spring.datasource.url=jdbc:mysql://localhost:3306/ypd_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
--   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
--   spring.datasource.username=root
--   spring.datasource.password=YOUR_PASSWORD
--   spring.jpa.hibernate.ddl-auto=update
--   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
--
-- IMPORTANT: the database name in the URL must be ypd_db
--            (matches CREATE DATABASE above)
-- ============================================================
