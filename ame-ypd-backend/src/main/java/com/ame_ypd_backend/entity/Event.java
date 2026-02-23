package com.ame_ypd_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Data                    // Lombok: generates getters/setters automatically
@NoArgsConstructor       // Lombok: generates empty constructor
@AllArgsConstructor      // Lombok: generates full constructor

public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate eventDate;

    private LocalTime eventTime;
    private String location;
    private Integer maxAttendees;
    private Integer currentAttendees = 0;
    private Boolean isPublic = true;

    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.PUBLISHED;

    @Enumerated(EnumType.STRING)
    private EventCategory category;

    // Enums defined inside the class — clean SOLID approach
    public enum EventStatus { DRAFT, PUBLISHED, CANCELLED, COMPLETED }
    public enum EventCategory { WORSHIP, YOUTH, COMMUNITY, FUNDRAISER, OTHER }
}
