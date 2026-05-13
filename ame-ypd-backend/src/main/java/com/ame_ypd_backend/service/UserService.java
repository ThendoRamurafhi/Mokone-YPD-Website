// FILE: src/main/java/com/ame_ypd_backend/service/UserService.java
// CREATE this new file in your service folder (same folder as AuthService.java)

package com.ame_ypd_backend.service;

import com.ame_ypd_backend.entity.User;
import com.ame_ypd_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get all users — admin only
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get single user by ID
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // Change a user's role — with SUPER_ADMIN protection
    public User updateUserRole(Long userId, User.Role newRole) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Rule 1: Nobody can touch a SUPER_ADMIN account
        if (user.getRole() == User.Role.SUPER_ADMIN) {
            throw new RuntimeException("Super admin role cannot be changed by anyone");
        }

        // Rule 2: Nobody can assign SUPER_ADMIN through this endpoint
        // SUPER_ADMIN is only assigned by DataInitializer at startup
        if (newRole == User.Role.SUPER_ADMIN) {
            throw new RuntimeException("Super admin can only be assigned at system level");
        }

        user.setRole(newRole);
        return userRepository.save(user);
    }

    // Delete a user — with SUPER_ADMIN protection
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // SUPER_ADMIN accounts can never be deleted
        if (user.getRole() == User.Role.SUPER_ADMIN) {
            throw new RuntimeException("Super admin account cannot be deleted");
        }

        userRepository.deleteById(userId);
    }

    // Activate or deactivate a user account
    public User setUserActive(Long userId, boolean isActive) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getRole() == User.Role.SUPER_ADMIN) {
            throw new RuntimeException("Super admin account cannot be deactivated");
        }

        user.setIsActive(isActive);
        return userRepository.save(user);
    }
}