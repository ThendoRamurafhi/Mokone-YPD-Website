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
        // Photos
        YPD_MEMBERS,        // General YPD member photos
        ALLEN_STARS,        // Allen Stars content
        WORSHIP,            // Worship service photos
        COMMUNITY_OUTREACH, // Community outreach photos
        EXECUTIVE_MEMBERS,  // Leadership / executive headshots
        EVENTS,             // Event photos
        BLOG,               // Blog post cover images
        GENERAL,            // General / gallery (default)

        // Videos (YouTube only)
        SERMON,             // Regular sermon videos
        WORSHIP_DIRECTOR,   // Worship director sermon (for "This Week's Message")
        OUTREACH_VIDEO,     // Community outreach videos
        ALLEN_STARS_VIDEO   // Allen Stars video content
    }

    public enum MediaUsage {
        // ── Photos ──
        HOME_HERO,              // Home page hero banner (strictly 1)
        HOME_STAY_INFORMED,     // Home "Stay Informed" mosaic (strictly 4, FIFO)
        BLOG_COVER,             // Accompanies a blog post
        ABOUT_JOURNEY,          // About "Journey of Faith" mosaic (strictly 4, FIFO)
        LEADERSHIP_PROFILE,     // Executive profile pic — About & Structure pages
        EVENT_COVER,            // Event card photo (shown on RSVP modal)
        GALLERY,                // Public /media gallery (default)

        // ── Videos ──
        HOME_LATEST_SERMONS,    // Home page "Latest Sermons" section
        HOME_THIS_WEEK,         // Home page "This Week's Message" section
        VIDEO_GALLERY           // Public /media gallery (all other videos)
    }
}
