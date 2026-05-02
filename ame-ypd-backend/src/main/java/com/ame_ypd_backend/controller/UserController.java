package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.entity.User;
import com.ame_ypd_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET /api/v1/users — admin only
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // PUT /api/v1/users/{id}/role — change user role
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return userRepository.findById(id).map(user -> {
            user.setRole(User.Role.valueOf(body.get("role")));
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Role updated"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/v1/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}