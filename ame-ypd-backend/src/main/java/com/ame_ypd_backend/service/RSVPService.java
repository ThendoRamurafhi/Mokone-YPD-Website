package com.ame_ypd_backend.service;

import com.ame_ypd_backend.dto.RSVPRequestDTO;
import com.ame_ypd_backend.dto.RSVPResponseDTO;
import com.ame_ypd_backend.entity.Event;
import com.ame_ypd_backend.entity.RSVP;
import com.ame_ypd_backend.entity.User;
import com.ame_ypd_backend.exception.EventFullException;
import com.ame_ypd_backend.exception.ResourceNotFoundException;
import com.ame_ypd_backend.repository.EventRepository;
import com.ame_ypd_backend.repository.RSVPRepository;
import com.ame_ypd_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RSVPService {

    @Autowired
    private RSVPRepository rsvpRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // Guest RSVP — no account needed
    public RSVPResponseDTO submitGuestRSVP(Long eventId, RSVPRequestDTO dto) {

        Event event = getEventAndCheckCapacity(eventId, dto.getAttendanceCount());

        // Prevent duplicate RSVPs from same email
        if (dto.getGuestEmail() != null) {
            rsvpRepository.findByEvent_EventIdAndGuestEmail(eventId, dto.getGuestEmail())
                .ifPresent(existing -> {
                    throw new RuntimeException("This email has already RSVPed to this event");
                });
        }

        RSVP rsvp = new RSVP();
        rsvp.setEvent(event);
        rsvp.setGuestName(dto.getGuestName());
        rsvp.setGuestEmail(dto.getGuestEmail());
        rsvp.setGuestPhone(dto.getGuestPhone());
        rsvp.setAttendanceCount(dto.getAttendanceCount());
        rsvp.setStatus(RSVP.RSVPStatus.CONFIRMED);

        // Update event attendee count
        event.setCurrentAttendees(
            event.getCurrentAttendees() + dto.getAttendanceCount());
        eventRepository.save(event);

        return new RSVPResponseDTO(rsvpRepository.save(rsvp));
    }

    // Member RSVP — logged in user
    public RSVPResponseDTO submitMemberRSVP(Long eventId, Long userId,
                                             RSVPRequestDTO dto) {

        Event event = getEventAndCheckCapacity(eventId, dto.getAttendanceCount());

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found with id: " + userId));

        // Prevent duplicate RSVPs from same user
        rsvpRepository.findByEvent_EventIdAndUser_UserId(eventId, userId)
            .ifPresent(existing -> {
                throw new RuntimeException("You have already RSVPed to this event");
            });

        RSVP rsvp = new RSVP();
        rsvp.setEvent(event);
        rsvp.setUser(user);
        rsvp.setAttendanceCount(dto.getAttendanceCount());
        rsvp.setStatus(RSVP.RSVPStatus.CONFIRMED);

        event.setCurrentAttendees(
            event.getCurrentAttendees() + dto.getAttendanceCount());
        eventRepository.save(event);

        return new RSVPResponseDTO(rsvpRepository.save(rsvp));
    }

    // Cancel an RSVP
    public RSVPResponseDTO cancelRSVP(Long rsvpId) {
        RSVP rsvp = rsvpRepository.findById(rsvpId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "RSVP not found with id: " + rsvpId));

        // Free up the spots on the event
        Event event = rsvp.getEvent();
        event.setCurrentAttendees(Math.max(0,
            event.getCurrentAttendees() - rsvp.getAttendanceCount()));
        eventRepository.save(event);

        rsvp.setStatus(RSVP.RSVPStatus.CANCELLED);
        return new RSVPResponseDTO(rsvpRepository.save(rsvp));
    }

    // Get all RSVPs for an event (admin)
    public List<RSVPResponseDTO> getEventRSVPs(Long eventId) {
        return rsvpRepository
            .findByEvent_EventIdOrderByRsvpDateDesc(eventId)
            .stream()
            .map(RSVPResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Get all RSVPs by a user
    public List<RSVPResponseDTO> getUserRSVPs(Long userId) {
        return rsvpRepository
            .findByUser_UserIdOrderByRsvpDateDesc(userId)
            .stream()
            .map(RSVPResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Reusable capacity check — DRY principle
    private Event getEventAndCheckCapacity(Long eventId, int requestedSpots) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Event not found with id: " + eventId));

        if (event.getMaxAttendees() != null) {
            int available = event.getMaxAttendees() - event.getCurrentAttendees();
            if (requestedSpots > available) {
                throw new EventFullException(
                    "Not enough spots available. Only " + available + " spots left.");
            }
        }
        return event;
    }
}