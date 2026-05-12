package com.ame_ypd_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Leadership — a person displayed on the About or Structure page.
 *
 * Design pattern: this entity is intentionally lean (SRP).
 * It stores identity + role + page placement.
 * The photo comes from the Media library via photoUrl (a stored URL string),
 * so the admin can manage the photo independently in the Media page
 * and just paste or pick the URL here.
 *
 * pageSection controls WHICH page section the person appears in:
 *   ABOUT_LEADERSHIP   → About page "Guiding Principles" section
 *   STRUCTURE_TEAM     → Structure page "Our Leadership" section
 *   BOTH               → shown on both pages
 */
@Entity
@Table(name = "leadership")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Leadership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaderId;

    @Column(nullable = false)
    private String name;           // e.g. "Rev. John Doe"

    @Column(nullable = false)
    private String role;           // e.g. "Presiding Elder"

    private String initials;       // fallback if no photo: "JD"

    private String description;    // short bio shown on About page

    private String photoUrl;       // absolute URL from Media library (LEADERSHIP_PROFILE usage)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PageSection pageSection = PageSection.BOTH;

    private Integer displayOrder = 0;  // controls sort order on page

    private Boolean active = true;

    public enum PageSection {
        ABOUT_LEADERSHIP,   // About page "Guiding Principles"
        STRUCTURE_TEAM,     // Structure page "Our Leadership"
        BOTH                // appears on both pages
    }
}
