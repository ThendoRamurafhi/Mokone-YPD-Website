package com.ame_ypd_backend.repository;

import com.ame_ypd_backend.entity.RSVP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RSVPRepository extends JpaRepository<RSVP, Long> {

    // All RSVPs for a specific event (admin view)
    List<RSVP> findByEvent_EventIdOrderByRsvpDateDesc(Long eventId);

    // All RSVPs by a specific user
    List<RSVP> findByUser_UserIdOrderByRsvpDateDesc(Long userId);

    // Check if user already RSVPed to this event
    Optional<RSVP> findByEvent_EventIdAndUser_UserId(Long eventId, Long userId);

    // Check if guest email already RSVPed to this event
    Optional<RSVP> findByEvent_EventIdAndGuestEmail(Long eventId, String guestEmail);

    // Count confirmed attendees for an event
    long countByEvent_EventIdAndStatus(Long eventId, RSVP.RSVPStatus status);
}