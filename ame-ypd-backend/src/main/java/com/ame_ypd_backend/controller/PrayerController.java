package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.dto.PrayerRequestResponseDTO;
import com.ame_ypd_backend.dto.PrayerRequestSubmitDTO;
import com.ame_ypd_backend.entity.PrayerRequest;
import com.ame_ypd_backend.service.PrayerRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/prayers")
@CrossOrigin(origins = "*")
public class PrayerController {

    @Autowired
    private PrayerRequestService prayerRequestService;

    // POST /api/v1/prayers — anyone can submit
    @PostMapping
    public ResponseEntity<PrayerRequestResponseDTO> submitRequest(
            @Valid @RequestBody PrayerRequestSubmitDTO dto) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(prayerRequestService.submitRequest(dto));
    }

    // GET /api/v1/prayers — public approved list
    @GetMapping
    public ResponseEntity<List<PrayerRequestResponseDTO>> getApprovedRequests() {
        return ResponseEntity.ok(prayerRequestService.getApprovedRequests());
    }

    // GET /api/v1/prayers?category=HEALING — filter by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<PrayerRequestResponseDTO>> getByCategory(
            @PathVariable PrayerRequest.RequestCategory category) {
        return ResponseEntity.ok(prayerRequestService.getApprovedByCategory(category));
    }

    // POST /api/v1/prayers/{id}/pray — increment prayer count
    @PostMapping("/{id}/pray")
    public ResponseEntity<PrayerRequestResponseDTO> pray(@PathVariable Long id) {
        return ResponseEntity.ok(prayerRequestService.incrementPrayerCount(id));
    }

    // GET /api/v1/prayers/pending — admin only (security added later)
    @GetMapping("/pending")
    public ResponseEntity<List<PrayerRequestResponseDTO>> getPending() {
        return ResponseEntity.ok(prayerRequestService.getPendingRequests());
    }

    // PUT /api/v1/prayers/{id}/approve — admin only
    @PutMapping("/{id}/approve")
    public ResponseEntity<PrayerRequestResponseDTO> approve(@PathVariable Long id) {
        return ResponseEntity.ok(prayerRequestService.approveRequest(id));
    }

    // PUT /api/v1/prayers/{id}/reject — admin only
    @PutMapping("/{id}/reject")
    public ResponseEntity<PrayerRequestResponseDTO> reject(@PathVariable Long id) {
        return ResponseEntity.ok(prayerRequestService.rejectRequest(id));
    }
}