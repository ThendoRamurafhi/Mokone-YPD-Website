package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.Event;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventResponse {
    private Long eventId;
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String location;
    private Integer maxAttendees;
    private Integer currentAttendees;
    private Boolean isPublic;
    private Event.EventStatus status;
    private Event.EventCategory category;

    // Constructor to convert from Entity to Response DTO
    public EventResponse(Event event) {
        this.eventId = event.getEventId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.eventDate = event.getEventDate();
        this.eventTime = event.getEventTime();
        this.location = event.getLocation();
        this.maxAttendees = event.getMaxAttendees();
        this.currentAttendees = event.getCurrentAttendees();
        this.isPublic = event.getIsPublic();
        this.status = event.getStatus();
        this.category = event.getCategory();
    }
}
