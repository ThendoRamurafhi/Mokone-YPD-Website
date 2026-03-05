package com.ame_ypd_backend.service;

import com.ame_ypd_backend.dto.AuthResponseDTO;
import com.ame_ypd_backend.dto.LoginRequestDTO;
import com.ame_ypd_backend.dto.RegisterRequestDTO;
import com.ame_ypd_backend.entity.User;
import com.ame_ypd_backend.exception.ResourceNotFoundException;
import com.ame_ypd_backend.repository.UserRepository;
import com.ame_ypd_backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    public AuthResponseDTO register(RegisterRequestDTO dto) {

        // Check duplicates
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        // Create user — hash the password before saving
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setRole(User.Role.MEMBER); // New registrations are always MEMBER

        User saved = userRepository.save(user);
        String token = tokenProvider.generateToken(saved.getEmail());

        // Send welcome email
        if (saved.getFirstName() != null) {
            emailService.sendWelcomeEmail(saved.getEmail(), saved.getFirstName());
        }

        return new AuthResponseDTO(token, saved);
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {

        // Spring Security handles password verification here
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Update last login time
        User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = tokenProvider.generateToken(dto.getEmail());
        return new AuthResponseDTO(token, user);
    }

    public AuthResponseDTO createAdmin(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setRole(User.Role.ADMIN); // ← This is the only difference from register()

        User saved = userRepository.save(user);
        String token = tokenProvider.generateToken(saved.getEmail());
        return new AuthResponseDTO(token, saved);
    }

    public AuthResponseDTO promoteToAdmin(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found with id: " + userId));

        user.setRole(User.Role.ADMIN);
        User saved = userRepository.save(user);
        String token = tokenProvider.generateToken(saved.getEmail());
        return new AuthResponseDTO(token, saved);
    }
}