package com.ame_ypd_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChargeRequestDTO {

    @NotBlank(message = "Charge name is required")
    private String chargeName;

    private String district;
    private String address;
    private String city;
    private String province;
    private Double latitude;
    private Double longitude;
    private String ministerName;
    private String contactEmail;
    private String contactPhone;
    private String websiteUrl;
    private String serviceTimes;
    private Boolean isActive = true;
}