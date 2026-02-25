package com.ame_ypd_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @Column(nullable = false)
    private String title;

    // URL-friendly version of title e.g. "my-first-post"
    @Column(unique = true, nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // Short preview shown on blog listing page
    @Column(columnDefinition = "TEXT")
    private String excerpt;

    private String authorName;
    private String featuredImageUrl;

    // Comma-separated e.g. "faith,youth,community"
    private String tags;

    private Integer viewCount = 0;

    @Enumerated(EnumType.STRING)
    private PostStatus status = PostStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    private PostCategory category = PostCategory.GENERAL;

    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PostStatus {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }

    public enum PostCategory {
        GENERAL,
        DEVOTIONAL,
        ANNOUNCEMENT,
        TESTIMONY,
        YOUTH,
        COMMUNITY
    }
}