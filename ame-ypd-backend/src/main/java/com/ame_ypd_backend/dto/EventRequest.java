package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.Event;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be under 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDate eventDate;

    private LocalTime eventTime;
    private String location;

    @Min(value = 1, message = "Must allow at least 1 attendee")
    private Integer maxAttendees;

    private Boolean isPublic = true;
    private Event.EventCategory category;
}