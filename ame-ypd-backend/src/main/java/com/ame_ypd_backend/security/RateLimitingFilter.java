package com.ame_ypd_backend.security;

import io.github.bucket4j.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    // Each IP address gets its own bucket
    // ConcurrentHashMap is thread-safe — handles multiple requests at once
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String ipAddress = getClientIP(request);
        Bucket bucket = buckets.computeIfAbsent(ipAddress, this::createBucket);

        // Try to consume 1 token from the bucket
        if (bucket.tryConsume(1)) {
            // Request allowed — proceed normally
            filterChain.doFilter(request, response);
        } else {
            // Too many requests — block with 429
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\": \"Too many requests. Please slow down.\"}");
        }
    }

    @SuppressWarnings("deprecation") // If something is not working correctly I will come for you
    private Bucket createBucket(String ipAddress) {
        // Allow 100 requests per minute per IP
        // Tokens refill gradually — 100 tokens every 60 seconds
        return Bucket.builder()
            .addLimit(Bandwidth.classic(100,
                Refill.greedy(100, Duration.ofMinutes(1))))
            .build();
    }

    private String getClientIP(HttpServletRequest request) {
        // Check for proxy headers first (for when deployed behind a load balancer)
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}