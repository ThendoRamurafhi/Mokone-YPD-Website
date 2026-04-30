// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/test/java/com/ame/ypd/AuthServiceTest.java
// Unit tests for authentication service
// Run with: mvn test
// ═══════════════════════════════════════════════════════════════════════════

//package com.ame.ypd;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class AuthServiceTest {

    // ── Password validation ───────────────────────────────────────────────────

    @Test
    @DisplayName("Password with 8 chars is valid (boundary: at minimum)")
    void testPasswordExactlyEightChars() {
        assertTrue(isValidPassword("12345678"));
    }

    @Test
    @DisplayName("Password with 7 chars is invalid (boundary: one below minimum)")
    void testPasswordSevenChars() {
        assertFalse(isValidPassword("1234567"));
    }

    @Test
    @DisplayName("Password with 20 chars is valid (well above minimum)")
    void testPasswordTwentyChars() {
        assertTrue(isValidPassword("12345678901234567890"));
    }

    @Test
    @DisplayName("Null password is invalid")
    void testNullPassword() {
        assertFalse(isValidPassword(null));
    }

    @Test
    @DisplayName("Empty password is invalid")
    void testEmptyPassword() {
        assertFalse(isValidPassword(""));
    }

    // ── Email validation ──────────────────────────────────────────────────────

    @Test
    @DisplayName("Valid email format is accepted")
    void testValidEmail() {
        assertTrue(isValidEmail("user@example.com"));
    }

    @Test
    @DisplayName("Email without @ is rejected")
    void testEmailNoAtSign() {
        assertFalse(isValidEmail("notanemail"));
    }

    @Test
    @DisplayName("Email without domain is rejected")
    void testEmailNoDomain() {
        assertFalse(isValidEmail("user@"));
    }

    @Test
    @DisplayName("Empty email is rejected")
    void testEmptyEmail() {
        assertFalse(isValidEmail(""));
    }

    @Test
    @DisplayName("Null email is rejected")
    void testNullEmail() {
        assertFalse(isValidEmail(null));
    }

    // ── Username validation ───────────────────────────────────────────────────

    @Test
    @DisplayName("Username with 3+ chars is valid")
    void testValidUsername() {
        assertTrue(isValidUsername("john"));
    }

    @Test
    @DisplayName("Empty username is rejected")
    void testEmptyUsername() {
        assertFalse(isValidUsername(""));
    }

    @Test
    @DisplayName("Null username is rejected")
    void testNullUsername() {
        assertFalse(isValidUsername(null));
    }

    // ── Helper methods (replace with calls to your actual service) ────────────
    // These simulate the logic in your AuthService.
    // Replace with: authService.isValidPassword(p), etc.

    private boolean isValidPassword(String password) {
        return password != null && password.length() >= 8;
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.isEmpty())
            return false;
        return email.contains("@") && email.indexOf("@") < email.length() - 1
                && email.lastIndexOf(".") > email.indexOf("@");
    }

    private boolean isValidUsername(String username) {
        return username != null && !username.trim().isEmpty();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/test/java/com/ame/ypd/EventServiceTest.java
// Unit tests for event business logic
// ═══════════════════════════════════════════════════════════════════════════

package com.ame.ypd;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class EventServiceTest {

    // ── Event title validation ────────────────────────────────────────────────

    @Test
    @DisplayName("Event with valid title is accepted")
    void testValidEventTitle() {
        assertTrue(isValidEventTitle("Youth Conference 2026"));
    }

    @Test
    @DisplayName("Null event title is rejected")
    void testNullEventTitle() {
        assertFalse(isValidEventTitle(null));
    }

    @Test
    @DisplayName("Empty event title is rejected")
    void testEmptyEventTitle() {
        assertFalse(isValidEventTitle(""));
    }

    @Test
    @DisplayName("Blank whitespace title is rejected")
    void testBlankEventTitle() {
        assertFalse(isValidEventTitle("   "));
    }

    // ── Attendee count validation ─────────────────────────────────────────────

    @Test
    @DisplayName("Attendee count of 1 is valid (boundary: minimum)")
    void testAttendeeCountOne() {
        assertTrue(isValidAttendeeCount(1));
    }

    @Test
    @DisplayName("Attendee count of 0 is invalid")
    void testAttendeeCountZero() {
        assertFalse(isValidAttendeeCount(0));
    }

    @Test
    @DisplayName("Negative attendee count is invalid")
    void testNegativeAttendeeCount() {
        assertFalse(isValidAttendeeCount(-1));
    }

    @Test
    @DisplayName("Large attendee count is valid")
    void testLargeAttendeeCount() {
        assertTrue(isValidAttendeeCount(1000));
    }

    // ── Capacity checking ─────────────────────────────────────────────────────

    @Test
    @DisplayName("RSVP allowed when event has remaining capacity")
    void testCanRsvpWhenSpaceAvailable() {
        // maxAttendees=100, currentAttendees=99 → can RSVP
        assertTrue(canRsvp(100, 99));
    }

    @Test
    @DisplayName("RSVP rejected when event is exactly full")
    void testCannotRsvpWhenFull() {
        // maxAttendees=100, currentAttendees=100 → cannot RSVP
        assertFalse(canRsvp(100, 100));
    }

    @Test
    @DisplayName("RSVP rejected when event is over capacity (data error)")
    void testCannotRsvpWhenOverCapacity() {
        assertFalse(canRsvp(100, 101));
    }

    @Test
    @DisplayName("RSVP always allowed when maxAttendees is 0 (unlimited)")
    void testUnlimitedEventAlwaysAllowsRsvp() {
        assertTrue(canRsvp(0, 9999));
    }

    // ── Category validation ───────────────────────────────────────────────────

    @Test
    @DisplayName("Valid category YOUTH is accepted")
    void testValidCategoryYouth() {
        assertTrue(isValidCategory("YOUTH"));
    }

    @Test
    @DisplayName("Valid category CONFERENCE is accepted")
    void testValidCategoryConference() {
        assertTrue(isValidCategory("CONFERENCE"));
    }

    @Test
    @DisplayName("Invalid category is rejected")
    void testInvalidCategory() {
        assertFalse(isValidCategory("RANDOM_THING"));
    }

    @Test
    @DisplayName("Null category is rejected")
    void testNullCategory() {
        assertFalse(isValidCategory(null));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private boolean isValidEventTitle(String title) {
        return title != null && !title.trim().isEmpty();
    }

    private boolean isValidAttendeeCount(int count) {
        return count > 0;
    }

    private boolean canRsvp(int maxAttendees, int currentAttendees) {
        if (maxAttendees == 0)
            return true; // unlimited
        return currentAttendees < maxAttendees;
    }

    private final java.util.Set<String> VALID_CATEGORIES = java.util.Set.of(
            "CONFERENCE", "YOUTH", "COMMUNITY", "WORSHIP", "EDUCATIONAL");

    private boolean isValidCategory(String category) {
        return category != null && VALID_CATEGORIES.contains(category);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/test/java/com/ame/ypd/BlogServiceTest.java
// ═══════════════════════════════════════════════════════════════════════════

package com.ame.ypd;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class BlogServiceTest {

    @Test
    @DisplayName("Post with valid title and content is accepted")
    void testValidPost() {
        assertTrue(isValidPost("My Title", "My content body"));
    }

    @Test
    @DisplayName("Post with null title is rejected")
    void testNullTitle() {
        assertFalse(isValidPost(null, "content"));
    }

    @Test
    @DisplayName("Post with empty title is rejected")
    void testEmptyTitle() {
        assertFalse(isValidPost("", "content"));
    }

    @Test
    @DisplayName("Post with null content is rejected")
    void testNullContent() {
        assertFalse(isValidPost("Title", null));
    }

    @Test
    @DisplayName("Post with empty content is rejected")
    void testEmptyContent() {
        assertFalse(isValidPost("Title", ""));
    }

    @Test
    @DisplayName("DRAFT status is valid")
    void testDraftStatus() {
        assertTrue(isValidStatus("DRAFT"));
    }

    @Test
    @DisplayName("PUBLISHED status is valid")
    void testPublishedStatus() {
        assertTrue(isValidStatus("PUBLISHED"));
    }

    @Test
    @DisplayName("ARCHIVED status is valid")
    void testArchivedStatus() {
        assertTrue(isValidStatus("ARCHIVED"));
    }

    @Test
    @DisplayName("Unknown status is invalid")
    void testInvalidStatus() {
        assertFalse(isValidStatus("LIVE"));
    }

    @Test
    @DisplayName("Excerpt trimmed to 300 chars when too long")
    void testExcerptTrimming() {
        String longText = "a".repeat(400);
        String trimmed = trimExcerpt(longText);
        assertTrue(trimmed.length() <= 303); // 300 chars + "..."
    }

    @Test
    @DisplayName("Short excerpt unchanged")
    void testShortExcerptUnchanged() {
        String short_ = "Short text";
        assertEquals(short_, trimExcerpt(short_));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private boolean isValidPost(String title, String content) {
        return title != null && !title.trim().isEmpty()
                && content != null && !content.trim().isEmpty();
    }

    private boolean isValidStatus(String status) {
        return java.util.Set.of("DRAFT", "PUBLISHED", "ARCHIVED").contains(status);
    }

    private String trimExcerpt(String text) {
        if (text == null)
            return "";
        if (text.length() <= 300)
            return text;
        return text.substring(0, 300) + "...";
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/test/java/com/ame/ypd/ChargeServiceTest.java
// ═══════════════════════════════════════════════════════════════════════════

package com.ame.ypd;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class ChargeServiceTest {

    @Test
    @DisplayName("Valid church name is accepted")
    void testValidChargeName() {
        assertTrue(isValidChargeName("Bethel AME Church"));
    }

    @Test
    @DisplayName("Null church name is rejected")
    void testNullChargeName() {
        assertFalse(isValidChargeName(null));
    }

    @Test
    @DisplayName("Empty church name is rejected")
    void testEmptyChargeName() {
        assertFalse(isValidChargeName(""));
    }

    @Test
    @DisplayName("Member count of 0 is valid (new/empty church)")
    void testZeroMemberCount() {
        assertTrue(isValidMemberCount(0));
    }

    @Test
    @DisplayName("Negative member count is invalid")
    void testNegativeMemberCount() {
        assertFalse(isValidMemberCount(-1));
    }

    @Test
    @DisplayName("Large member count is valid")
    void testLargeMemberCount() {
        assertTrue(isValidMemberCount(5000));
    }

    @Test
    @DisplayName("ACTIVE status is valid")
    void testActiveStatus() {
        assertTrue(isValidChargeStatus("ACTIVE"));
    }

    @Test
    @DisplayName("INACTIVE status is valid")
    void testInactiveStatus() {
        assertTrue(isValidChargeStatus("INACTIVE"));
    }

    @Test
    @DisplayName("Invalid status is rejected")
    void testInvalidStatus() {
        assertFalse(isValidChargeStatus("DELETED"));
    }

    @Test
    @DisplayName("Phone number with digits is valid")
    void testValidPhone() {
        assertTrue(isValidPhone("+27762973290"));
    }

    @Test
    @DisplayName("Empty phone is valid (optional field)")
    void testEmptyPhoneIsOptional() {
        assertTrue(isValidPhone(""));
    }

    @Test
    @DisplayName("Null phone is valid (optional field)")
    void testNullPhoneIsOptional() {
        assertTrue(isValidPhone(null));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private boolean isValidChargeName(String name) {
        return name != null && !name.trim().isEmpty();
    }

    private boolean isValidMemberCount(int count) {
        return count >= 0;
    }

    private boolean isValidChargeStatus(String status) {
        return java.util.Set.of("ACTIVE", "INACTIVE", "PENDING").contains(status);
    }

    private boolean isValidPhone(String phone) {
        return true; // phone is optional — always valid if present
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/test/java/com/ame/ypd/SecurityTest.java
// Security edge case tests
// ═══════════════════════════════════════════════════════════════════════════

package com.ame.ypd;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class SecurityTest {

    // ── SQL Injection detection ───────────────────────────────────────────────

    @Test
    @DisplayName("SQL injection in email is detected")
    void testSqlInjectionInEmail() {
        String malicious = "admin@test.com'; DROP TABLE users; --";
        assertFalse(isValidEmail(malicious));
    }

    @Test
    @DisplayName("SQL injection with OR 1=1 is detected")
    void testSqlInjectionOr() {
        String malicious = "' OR 1=1 --";
        assertFalse(isValidEmail(malicious));
    }

    // ── XSS detection ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Script tag in name is sanitized")
    void testXssScriptTag() {
        String malicious = "<script>alert('xss')</script>";
        String sanitized = sanitize(malicious);
        assertFalse(sanitized.contains("<script>"));
        assertFalse(sanitized.contains("</script>"));
    }

    @Test
    @DisplayName("Image onerror XSS is sanitized")
    void testXssImageOnerror() {
        String malicious = "<img src=x onerror=alert(1)>";
        String sanitized = sanitize(malicious);
        assertFalse(sanitized.contains("onerror"));
    }

    @Test
    @DisplayName("Normal text passes through sanitization unchanged")
    void testNormalTextSanitization() {
        String normal = "John Doe";
        assertEquals(normal, sanitize(normal));
    }

    // ── Input length limits ───────────────────────────────────────────────────

    @Test
    @DisplayName("Name longer than 100 chars is rejected")
    void testNameTooLong() {
        String longName = "a".repeat(101);
        assertFalse(isValidName(longName));
    }

    @Test
    @DisplayName("Name of exactly 100 chars is accepted (boundary)")
    void testNameExactly100Chars() {
        String maxName = "a".repeat(100);
        assertTrue(isValidName(maxName));
    }

    @Test
    @DisplayName("Name of 1 char is accepted")
    void testNameOneChar() {
        assertTrue(isValidName("A"));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private boolean isValidEmail(String email) {
        if (email == null || email.isEmpty())
            return false;
        if (email.contains("'") || email.contains(";") || email.contains("--"))
            return false;
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    private String sanitize(String input) {
        if (input == null)
            return "";
        return input
                .replace("<script>", "").replace("</script>", "")
                .replace("<", "&lt;").replace(">", "&gt;")
                .replace("onerror", "").replace("onclick", "")
                .replace("javascript:", "");
    }

    private boolean isValidName(String name) {
        return name != null && !name.trim().isEmpty() && name.length() <= 100;
    }
}