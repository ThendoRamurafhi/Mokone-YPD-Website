package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.PrayerRequest;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PrayerRequestResponseDTO {

    private Long requestId;
    private String requestText;
    private String submitterName; // Will be "Anonymous" if isAnonymous is true
    private Boolean isAnonymous;
    private Integer prayerCount;
    private PrayerRequest.RequestStatus status;
    private PrayerRequest.RequestCategory category;
    private LocalDateTime submittedAt;

    // Constructor with the anonymous logic built in
    public PrayerRequestResponseDTO(PrayerRequest request, boolean isAdminView) {
        this.requestId = request.getRequestId();
        this.requestText = request.getRequestText();
        this.isAnonymous = request.getIsAnonymous();
        this.prayerCount = request.getPrayerCount();
        this.status = request.getStatus();
        this.category = request.getCategory();
        this.submittedAt = request.getSubmittedAt();

        // KEY LOGIC: hide name if anonymous, unless admin is viewing
        if (request.getIsAnonymous() && !isAdminView) {
            this.submitterName = "Anonymous";
        } else {
            this.submitterName = request.getSubmitterName();
        }
    }
}