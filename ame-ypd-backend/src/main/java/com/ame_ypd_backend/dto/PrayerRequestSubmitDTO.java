package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.PrayerRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class PrayerRequestSubmitDTO {

    @NotBlank(message = "Prayer request text is required")
    @Size(min = 10, max = 1000, message = "Request must be between 10 and 1000 characters")
    private String requestText;

    private String submitterName;

    @Email(message = "Please provide a valid email")
    private String submitterEmail;

    private Boolean isAnonymous = false;

    private PrayerRequest.RequestCategory category = PrayerRequest.RequestCategory.GENERAL;
}