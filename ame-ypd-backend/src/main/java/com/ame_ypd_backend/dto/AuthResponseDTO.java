package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {

    private String token;        // The JWT token frontend will store
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
    private String email;
    private User.Role role;

    public AuthResponseDTO(String token, User user) {
        this.token = token;
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
    }
}