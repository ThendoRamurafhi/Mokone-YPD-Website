package com.ame_ypd_backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RSVPRequestDTO {

    // Guest info — required only if not logged in
    private String guestName;

    @Email(message = "Valid email is required")
    private String guestEmail;

    private String guestPhone;

    @Min(value = 1, message = "Must bring at least 1 person")
    @Max(value = 10, message = "Maximum 10 people per RSVP")
    private Integer attendanceCount = 1;
}