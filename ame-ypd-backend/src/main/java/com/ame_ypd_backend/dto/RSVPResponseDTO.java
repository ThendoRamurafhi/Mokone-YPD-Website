package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.RSVP;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RSVPResponseDTO {

    private Long rsvpId;
    private Long eventId;
    private String eventTitle;
    private String eventDate;
    private Long userId;
    private String guestName;
    private String guestEmail;
    private Integer attendanceCount;
    private RSVP.RSVPStatus status;
    private LocalDateTime rsvpDate;

    public RSVPResponseDTO(RSVP rsvp) {
        this.rsvpId = rsvp.getRsvpId();
        this.eventId = rsvp.getEvent().getEventId();
        this.eventTitle = rsvp.getEvent().getTitle();
        this.eventDate = rsvp.getEvent().getEventDate().toString();
        this.userId = rsvp.getUser() != null ? rsvp.getUser().getUserId() : null;
        this.guestName = rsvp.getGuestName();
        this.guestEmail = rsvp.getGuestEmail();
        this.attendanceCount = rsvp.getAttendanceCount();
        this.status = rsvp.getStatus();
        this.rsvpDate = rsvp.getRsvpDate();
    }
}