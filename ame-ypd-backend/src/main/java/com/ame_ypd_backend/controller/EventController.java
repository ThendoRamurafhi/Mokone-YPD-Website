package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.dto.EventRequest;
import com.ame_ypd_backend.dto.EventResponse;
import com.ame_ypd_backend.entity.Event;
import com.ame_ypd_backend.repository.EventRepository;
import com.ame_ypd_backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")  // Base URL: /api/v1/events
@CrossOrigin(origins = "*") // Allow frontend to call this API
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;

    // GET /api/v1/events — public, no auth needed
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllPublicEvents());
    }

    // GET /api/v1/events/upcoming
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    // GET /api/v1/events/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // POST /api/v1/events — requires admin auth
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        EventResponse created = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/v1/events/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    // POST /api/v1/events/{id}/rsvp
    @PostMapping("/{id}/rsvp")
    public ResponseEntity<?> rsvpEvent(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

            int count = 1;
            if (body.get("attendanceCount") != null) {
                count = Integer.parseInt(body.get("attendanceCount").toString());
            }

            int current = event.getCurrentAttendees() == null ? 0 : event.getCurrentAttendees();

            // Check capacity
            if (event.getMaxAttendees() != null && (current + count) > event.getMaxAttendees()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Not enough spots available"));
            }

            event.setCurrentAttendees(current + count);
            eventRepository.save(event);

            return ResponseEntity.ok(Map.of(
                "message", "RSVP successful",
                "eventId", id,
                "attendees", count
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "RSVP failed"));
        }
    }

    // DELETE /api/v1/events/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
