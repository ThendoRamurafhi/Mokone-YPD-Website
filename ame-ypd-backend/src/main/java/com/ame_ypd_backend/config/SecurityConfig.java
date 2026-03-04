package com.ame_ypd_backend.config;

import com.ame_ypd_backend.security.JwtAuthenticationFilter;
import com.ame_ypd_backend.security.RateLimitingFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private RateLimitingFilter rateLimitingFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── Fully Public — no login needed ──────────────────
                .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/events/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/blog/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/charges/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/prayers/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/media/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()

                // ── Requires login (MEMBER or ADMIN) ────────────────
                .requestMatchers(HttpMethod.POST, "/events/*/rsvp/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/events/rsvp/*/cancel").authenticated()
                .requestMatchers(HttpMethod.POST, "/prayers/*/pray").authenticated()

                // ── ADMIN only ───────────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/events/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/blog/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/blog/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/blog/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/charges/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/charges/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/charges/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/media/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/media/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/prayers/pending").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/prayers/*/approve").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/prayers/*/reject").hasRole("ADMIN")

                // Everything else requires at least being logged in
                .anyRequest().authenticated()
            )
        
            .addFilterBefore(rateLimitingFilter, JwtAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Industry standard password hashing
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}