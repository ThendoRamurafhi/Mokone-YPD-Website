package com.ame_ypd_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "charges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Charge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chargeId;

    @Column(nullable = false)
    private String chargeName;        // e.g. "St. Paul AME Church"

    private String district;          // e.g. "Johannesburg District"
    private String address;
    private String city;
    private String province;

    // These two feed Google Maps markers
    private Double latitude;
    private Double longitude;

    private String ministerName;
    private String contactEmail;
    private String contactPhone;
    private String websiteUrl;

    // Service times e.g. "Sundays 9AM & 11AM"
    private String serviceTimes;

    private Boolean isActive = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}