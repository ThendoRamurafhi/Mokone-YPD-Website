package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.dto.ChargeRequestDTO;
import com.ame_ypd_backend.dto.ChargeResponseDTO;
import com.ame_ypd_backend.service.ChargeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/charges")
@CrossOrigin(origins = "*")
public class ChargeController {

    @Autowired
    private ChargeService chargeService;

    // GET /api/v1/charges — all map markers
    @GetMapping
    public ResponseEntity<List<ChargeResponseDTO>> getAllCharges() {
        return ResponseEntity.ok(chargeService.getAllActiveCharges());
    }

    // GET /api/v1/charges/{id} — single church detail
    @GetMapping("/{id}")
    public ResponseEntity<ChargeResponseDTO> getChargeById(@PathVariable Long id) {
        return ResponseEntity.ok(chargeService.getChargeById(id));
    }

    // GET /api/v1/charges/district/Johannesburg
    @GetMapping("/district/{district}")
    public ResponseEntity<List<ChargeResponseDTO>> getByDistrict(
            @PathVariable String district) {
        return ResponseEntity.ok(chargeService.getChargesByDistrict(district));
    }

    // GET /api/v1/charges/districts — populate filter dropdown
    @GetMapping("/districts")
    public ResponseEntity<List<String>> getAllDistricts() {
        return ResponseEntity.ok(chargeService.getAllDistricts());
    }

    // POST /api/v1/charges — admin only
    @PostMapping
    public ResponseEntity<ChargeResponseDTO> createCharge(
            @Valid @RequestBody ChargeRequestDTO dto) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(chargeService.createCharge(dto));
    }

    // PUT /api/v1/charges/{id} — admin only
    @PutMapping("/{id}")
    public ResponseEntity<ChargeResponseDTO> updateCharge(
            @PathVariable Long id,
            @Valid @RequestBody ChargeRequestDTO dto) {
        return ResponseEntity.ok(chargeService.updateCharge(id, dto));
    }

    // DELETE /api/v1/charges/{id} — admin only
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharge(@PathVariable Long id) {
        chargeService.deleteCharge(id);
        return ResponseEntity.noContent().build();
    }
}