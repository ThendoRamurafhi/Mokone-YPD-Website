package com.ame_ypd_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "prayer_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrayerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    // The actual prayer request text
    @Column(nullable = false, columnDefinition = "TEXT")
    private String requestText;

    // Who submitted it
    private String submitterName;
    private String submitterEmail;

    // If true, name is hidden from public view
    private Boolean isAnonymous = false;

    // How many people clicked "I prayed for this"
    private Integer prayerCount = 0;

    // Admin must approve before it goes public
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private RequestCategory category = RequestCategory.GENERAL;

    // Automatically set when record is created
    private LocalDateTime submittedAt;

    private LocalDateTime approvedAt;

    // Runs automatically before the record is first saved
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }

    public enum RequestStatus {
        PENDING,    // Waiting for admin approval
        APPROVED,   // Visible to public
        REJECTED    // Hidden, not shown anywhere
    }

    public enum RequestCategory {
        GENERAL,
        HEALING,
        FAMILY,
        GUIDANCE,
        THANKSGIVING,
        OTHER
    }
}