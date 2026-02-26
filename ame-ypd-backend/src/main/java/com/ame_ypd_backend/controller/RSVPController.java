package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.dto.RSVPRequestDTO;
import com.ame_ypd_backend.dto.RSVPResponseDTO;
import com.ame_ypd_backend.service.RSVPService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class RSVPController {

    @Autowired
    private RSVPService rsvpService;

    // POST /api/v1/events/{eventId}/rsvp/guest — no login needed
    @PostMapping("/{eventId}/rsvp/guest")
    public ResponseEntity<RSVPResponseDTO> guestRSVP(
            @PathVariable Long eventId,
            @Valid @RequestBody RSVPRequestDTO dto) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(rsvpService.submitGuestRSVP(eventId, dto));
    }

    // POST /api/v1/events/{eventId}/rsvp/member/{userId} — logged in user
    @PostMapping("/{eventId}/rsvp/member/{userId}")
    public ResponseEntity<RSVPResponseDTO> memberRSVP(
            @PathVariable Long eventId,
            @PathVariable Long userId,
            @Valid @RequestBody RSVPRequestDTO dto) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(rsvpService.submitMemberRSVP(eventId, userId, dto));
    }

    // PUT /api/v1/events/rsvp/{rsvpId}/cancel
    @PutMapping("/rsvp/{rsvpId}/cancel")
    public ResponseEntity<RSVPResponseDTO> cancelRSVP(@PathVariable Long rsvpId) {
        return ResponseEntity.ok(rsvpService.cancelRSVP(rsvpId));
    }

    // GET /api/v1/events/{eventId}/rsvps — admin view
    @GetMapping("/{eventId}/rsvps")
    public ResponseEntity<List<RSVPResponseDTO>> getEventRSVPs(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(rsvpService.getEventRSVPs(eventId));
    }

    // GET /api/v1/events/rsvp/user/{userId}
    @GetMapping("/rsvp/user/{userId}")
    public ResponseEntity<List<RSVPResponseDTO>> getUserRSVPs(
            @PathVariable Long userId) {
        return ResponseEntity.ok(rsvpService.getUserRSVPs(userId));
    }
}