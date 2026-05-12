package com.ame_ypd_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "media")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mediaId;

    @Column(nullable = false)
    private String fileName;        // Original file name

    private String storedFileName;  // UUID-based name we give it on server

    @Column(nullable = false)
    private String fileUrl;         // URL to access the file

    private String fileType;        // e.g. "image/jpeg", "video/mp4"

    private Long fileSize;          // Size in bytes

    @Enumerated(EnumType.STRING)
    private MediaType mediaType;    // IMAGE or VIDEO

    @Enumerated(EnumType.STRING)
    private MediaCategory category = MediaCategory.GENERAL;

   
    @Enumerated(EnumType.STRING)
    @Column(name = "`usage`")
    private MediaUsage usage = MediaUsage.GALLERY;  // NEW: Where this media is used

    private String title;
    private String description;
    private String uploadedBy;
    // For YouTube videos — store link instead of file
    private String youtubeVideoId;    // e.g. "dQw4w9WgXcQ"
    private String youtubeThumbnail;  // YouTube auto-generates this
    private Boolean isYoutubeVideo = false;

    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public enum MediaType {
        IMAGE,      // Photos, graphics
        VIDEO,      // Local videos or YouTube links
        DOCUMENT    // PDFs, docs
    }

    public enum MediaCategory {
        EVENTS,         // Event photos/videos
        WORSHIP,        // Worship services
        YOUTH,          // Youth programs
        COMMUNITY,      // Community outreach
        LEADERSHIP,     // Leadership photos
        GALLERY,        // General photo gallery
        HERO_IMAGES,    // Homepage hero images
        BLOG_IMAGES,    // Blog post images
        STRUCTURE,      // Org structure photos
        ABOUT,          // About page images
        GENERAL         // Uncategorized
    }

    public enum MediaUsage {
        
        // ── General / Gallery ──
        GALLERY,                // Public /media gallery page

        // ── Blog ──
        BLOG_FEATURED,          // Blog post cover image
        BLOG_INLINE,            // Inline image inside blog content

        // ── Home page ──
        HOME_HERO,              // Home page hero banner (1 image shown)
        HOME_STAY_INFORMED,     // Home "Stay Informed" 4-photo mosaic

        // ── About page ──
        ABOUT_JOURNEY,          // About "Journey of Faith" 4-photo mosaic
        LEADERSHIP_PROFILE,     // About "Guiding Principles" leader headshots

        // ── Structure page ──
        STRUCTURE_LEADER,       // Structure "Our Leadership" member headshots

        // ── Events ──
        EVENT_COVER,            // Event featured image

        // ── Sermon / Media page ──
        HERO_SECTION,           // Generic hero (kept for backwards compat)
        PAGE_HEADER,            // Page header backgrounds

        // ── Fallback ──
        GENERAL                 // Multi-purpose / not yet assigned
    }
}
