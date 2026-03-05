package com.ame_ypd_backend.service;

import com.ame_ypd_backend.entity.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.name}")
    private String appName;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // @Async means email sends in background — user doesn't wait for it
    // This is important for performance — O(1) response time to user
    @Async
    public void sendRSVPConfirmation(String toEmail, String guestName, Event event) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("RSVP Confirmed — " + event.getTitle());

            // HTML email body
            String body = buildRSVPEmail(guestName, event);
            helper.setText(body, true); // true = send as HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            // Log error but don't crash the app if email fails
            log.warn("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to " + appName + "!");
            helper.setText(buildWelcomeEmail(firstName), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            log.warn("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    @Async
    public void sendPrayerRequestConfirmation(String toEmail, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your Prayer Request Has Been Received");
            helper.setText(buildPrayerConfirmationEmail(name), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            log.warn("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    @Async
    public void sendContactFormNotification(
            String adminEmail,
            String senderName,
            String senderEmail,
            String messageContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("New Contact Form Message from " + senderName);
            helper.setText(buildContactNotificationEmail(
                senderName, senderEmail, messageContent), true);

            mailSender.send(message);
        } catch (MessagingException e) {
           log.warn("Failed to send email to {}: {}", adminEmail, e.getMessage(), e);
        }
    }

    // ─── HTML Email Templates ───────────────────────────────────────────

    private String buildRSVPEmail(String name, Event event) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; color: #1f2937;">
                <div style="max-width:600px; margin:auto; padding:20px;
                            border:1px solid #e5e7eb; border-radius:8px;">
                    <h2 style="color:#047857;">✅ RSVP Confirmed!</h2>
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Your RSVP for the following event has been confirmed:</p>
                    <div style="background:#f3f4f6; padding:15px;
                                border-radius:6px; margin:15px 0;">
                        <h3 style="color:#047857; margin:0;">%s</h3>
                        <p style="margin:5px 0;">📅 <strong>Date:</strong> %s</p>
                        <p style="margin:5px 0;">📍 <strong>Location:</strong> %s</p>
                    </div>
                    <p>We look forward to seeing you there!</p>
                    <p style="color:#6b7280; font-size:12px;">
                        — The %s Team
                    </p>
                </div>
            </body>
            </html>
            """.formatted(
                name,
                event.getTitle(),
                event.getEventDate().toString(),
                event.getLocation() != null ? event.getLocation() : "TBA",
                appName
            );
    }

    private String buildWelcomeEmail(String firstName) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; color: #1f2937;">
                <div style="max-width:600px; margin:auto; padding:20px;
                            border:1px solid #e5e7eb; border-radius:8px;">
                    <h2 style="color:#047857;">Welcome to %s! 🙏</h2>
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Your account has been created successfully.
                       You can now RSVP to events, submit prayer requests,
                       and access member-only content.</p>
                    <p>God bless you!</p>
                    <p style="color:#6b7280; font-size:12px;">
                        — The %s Team
                    </p>
                </div>
            </body>
            </html>
            """.formatted(appName, firstName, appName);
    }

    private String buildPrayerConfirmationEmail(String name) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; color: #1f2937;">
                <div style="max-width:600px; margin:auto; padding:20px;
                            border:1px solid #e5e7eb; border-radius:8px;">
                    <h2 style="color:#047857;">🙏 Prayer Request Received</h2>
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Your prayer request has been received and is
                       pending review by our team.</p>
                    <p>Once approved, it will be shared with our church
                       community for prayer.</p>
                    <p>You are in our prayers.</p>
                    <p style="color:#6b7280; font-size:12px;">
                        — The %s Team
                    </p>
                </div>
            </body>
            </html>
            """.formatted(name, appName);
    }

    private String buildContactNotificationEmail(
            String senderName, String senderEmail, String messageContent) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; color: #1f2937;">
                <div style="max-width:600px; margin:auto; padding:20px;
                            border:1px solid #e5e7eb; border-radius:8px;">
                    <h2 style="color:#047857;">📬 New Contact Form Message</h2>
                    <p><strong>From:</strong> %s</p>
                    <p><strong>Email:</strong> %s</p>
                    <div style="background:#f3f4f6; padding:15px;
                                border-radius:6px; margin:15px 0;">
                        <p><strong>Message:</strong></p>
                        <p>%s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(senderName, senderEmail, messageContent);
    }
}