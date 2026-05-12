// DataInitializer.java
package com.ame_ypd_backend.config;

import com.ame_ypd_backend.entity.User;
import com.ame_ypd_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Read from environment variables — never hardcoded
    @Value("${app.superadmin.email}")
    private String superAdminEmail;

    @Value("${app.superadmin.password}")
    private String superAdminPassword;

    @Value("${app.superadmin.username:superadmin}")
    private String superAdminUsername;

    @Value("${app.superadmin.firstname:Super}")
    private String superAdminFirstName;

    @Value("${app.superadmin.lastname:Admin}")
    private String superAdminLastName;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(superAdminEmail).isEmpty()) {
            User admin = new User();
            admin.setFirstName(superAdminFirstName);
            admin.setLastName(superAdminLastName);
            admin.setUsername(superAdminUsername);
            admin.setEmail(superAdminEmail);
            admin.setPasswordHash(passwordEncoder.encode(superAdminPassword));
            admin.setRole(User.Role.SUPER_ADMIN); // see below
            admin.setIsActive(true);
            userRepository.save(admin);
            System.out.println(">>> Super admin created: " + superAdminEmail);
        }
    }
}