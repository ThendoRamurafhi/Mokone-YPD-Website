package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.Charge;
import lombok.Data;

@Data
public class ChargeResponseDTO {

    private Long chargeId;
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
    private Boolean isActive;

    public ChargeResponseDTO(Charge charge) {
        this.chargeId = charge.getChargeId();
        this.chargeName = charge.getChargeName();
        this.district = charge.getDistrict();
        this.address = charge.getAddress();
        this.city = charge.getCity();
        this.province = charge.getProvince();
        this.latitude = charge.getLatitude();
        this.longitude = charge.getLongitude();
        this.ministerName = charge.getMinisterName();
        this.contactEmail = charge.getContactEmail();
        this.contactPhone = charge.getContactPhone();
        this.websiteUrl = charge.getWebsiteUrl();
        this.serviceTimes = charge.getServiceTimes();
        this.isActive = charge.getIsActive();
    }
}