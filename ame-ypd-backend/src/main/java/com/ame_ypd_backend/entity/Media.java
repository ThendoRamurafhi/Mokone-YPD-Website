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

    private String title;
    private String description;
    private String uploadedBy;

    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public enum MediaType {
        IMAGE,
        VIDEO,
        DOCUMENT
    }

    public enum MediaCategory {
        GENERAL,
        EVENTS,
        WORSHIP,
        YOUTH,
        COMMUNITY
    }
}