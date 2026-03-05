package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.dto.AuthResponseDTO;
import com.ame_ypd_backend.dto.LoginRequestDTO;
import com.ame_ypd_backend.dto.RegisterRequestDTO;
import com.ame_ypd_backend.service.AuthService;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    
    @Value("${app.admin-secret}")
    private String adminSecret;

    // POST /api/v1/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO dto) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(authService.register(dto));
    }

    // POST /api/v1/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    // POST /api/v1/auth/create-admin
    // Protected by a secret key — only someone with the key can create admins
    @Value("${app.admin.registration.enabled}")
    private boolean adminRegistrationEnabled;

    // POST /api/v1/auth/create-admin
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(
            @Valid @RequestBody RegisterRequestDTO dto,
            @RequestHeader("X-Admin-Secret") String providedSecret) {

        // Step 1: Check if admin creation is still enabled
        if (!adminRegistrationEnabled) {
            return ResponseEntity
                .status(HttpStatus.GONE)  // 410 Gone — endpoint permanently disabled
                .body(Map.of("error", 
                    "Admin registration is disabled. Contact system administrator."));
        }

        // Step 2: Validate secret
        if (!adminSecret.equals(providedSecret)) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Invalid admin secret"));
        }

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(authService.createAdmin(dto));
    }

    // POST /api/v1/auth/promote/{userId}
    // Existing admin promotes another user — requires ADMIN role
    @PutMapping("/promote/{userId}")
    public ResponseEntity<?> promoteToAdmin(@PathVariable Long userId) {
        return ResponseEntity.ok(authService.promoteToAdmin(userId));
    }
}