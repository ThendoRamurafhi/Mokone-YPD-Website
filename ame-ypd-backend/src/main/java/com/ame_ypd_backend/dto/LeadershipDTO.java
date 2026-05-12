package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.Leadership;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LeadershipDTO {

    private Long leaderId;
    private String name;
    private String role;
    private String initials;
    private String description;
    private String photoUrl;
    private Leadership.PageSection pageSection;
    private Integer displayOrder;
    private Boolean active;

    // Constructor from entity (used in responses)
    public LeadershipDTO(Leadership l) {
        this.leaderId     = l.getLeaderId();
        this.name         = l.getName();
        this.role         = l.getRole();
        this.initials     = l.getInitials();
        this.description  = l.getDescription();
        this.photoUrl     = l.getPhotoUrl();
        this.pageSection  = l.getPageSection();
        this.displayOrder = l.getDisplayOrder();
        this.active       = l.getActive();
    }
}
