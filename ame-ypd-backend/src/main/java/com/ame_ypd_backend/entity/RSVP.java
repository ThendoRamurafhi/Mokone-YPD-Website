package com.ame_ypd_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "rsvps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RSVP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rsvpId;

    // Link to Event — Many RSVPs belong to one Event
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // Link to User — optional, guests can RSVP without an account
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // For guest RSVPs (no account required)
    private String guestName;
    private String guestEmail;
    private String guestPhone;

    // How many people in their group
    private Integer attendanceCount = 1;

    @Enumerated(EnumType.STRING)
    private RSVPStatus status = RSVPStatus.CONFIRMED;

    private LocalDateTime rsvpDate;

    @PrePersist
    protected void onCreate() {
        rsvpDate = LocalDateTime.now();
    }

    public enum RSVPStatus {
        CONFIRMED,
        CANCELLED,
        ATTENDED  // Marked after the event
    }
}