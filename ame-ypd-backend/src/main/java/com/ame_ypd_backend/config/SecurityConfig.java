package com.ame_ypd_backend.config;

import com.ame_ypd_backend.security.JwtAuthenticationFilter;
import com.ame_ypd_backend.security.RateLimitingFilter;

import java.util.Arrays;
import java.util.List;

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
import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private RateLimitingFilter rateLimitingFilter;

    // Add this bean inside SecurityConfig class:
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173"
        ));
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        config.setAllowedHeaders(Arrays.asList(
            "Authorization", "Content-Type", "Accept",
            "Origin", "X-Requested-With", "Cache-Control"
        ));
        config.setExposedHeaders(List.of("Authorization"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── Public endpoints ──────────────────────────────────
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/events/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/blog/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/charges/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/prayers/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/media/**").permitAll()

                // ── Authenticated (MEMBER or ADMIN) ───────────────────
                .requestMatchers(HttpMethod.POST, "/events/*/rsvp/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/events/rsvp/*/cancel").authenticated()
                .requestMatchers(HttpMethod.POST, "/prayers/*/pray").authenticated()

                // ── ADMIN only ────────────────────────────────────────
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
                .requestMatchers(HttpMethod.GET, "/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/auth/promote/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            // Rate limiter FIRST, then JWT — order matters
            .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Allow H2 console frames in dev
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}