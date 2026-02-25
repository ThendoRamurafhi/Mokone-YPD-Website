package com.ame_ypd_backend.service;

import com.ame_ypd_backend.dto.ChargeRequestDTO;
import com.ame_ypd_backend.dto.ChargeResponseDTO;
import com.ame_ypd_backend.entity.Charge;
import com.ame_ypd_backend.exception.ResourceNotFoundException;
import com.ame_ypd_backend.repository.ChargeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChargeService {

    @Autowired
    private ChargeRepository chargeRepository;

    // Get all active charges — main map data
    public List<ChargeResponseDTO> getAllActiveCharges() {
        return chargeRepository
            .findByIsActiveTrueOrderByChargeNameAsc()
            .stream()
            .map(ChargeResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Get single charge by ID
    public ChargeResponseDTO getChargeById(Long id) {
        Charge charge = chargeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Charge not found with id: " + id));
        return new ChargeResponseDTO(charge);
    }

    // Filter by district
    public List<ChargeResponseDTO> getChargesByDistrict(String district) {
        return chargeRepository
            .findByDistrictAndIsActiveTrueOrderByChargeNameAsc(district)
            .stream()
            .map(ChargeResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Get all districts for the filter dropdown
    public List<String> getAllDistricts() {
        return chargeRepository.findAllDistricts();
    }

    // Create charge (admin only)
    public ChargeResponseDTO createCharge(ChargeRequestDTO dto) {
        Charge charge = new Charge();
        mapDtoToCharge(dto, charge);
        return new ChargeResponseDTO(chargeRepository.save(charge));
    }

    // Update charge (admin only)
    public ChargeResponseDTO updateCharge(Long id, ChargeRequestDTO dto) {
        Charge charge = chargeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Charge not found with id: " + id));
        mapDtoToCharge(dto, charge);
        return new ChargeResponseDTO(chargeRepository.save(charge));
    }

    // Delete charge (admin only)
    public void deleteCharge(Long id) {
        if (!chargeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Charge not found with id: " + id);
        }
        chargeRepository.deleteById(id);
    }

    // Reusable helper — avoids repeating the same mapping code
    // This is the DRY principle (Don't Repeat Yourself)
    private void mapDtoToCharge(ChargeRequestDTO dto, Charge charge) {
        charge.setChargeName(dto.getChargeName());
        charge.setDistrict(dto.getDistrict());
        charge.setAddress(dto.getAddress());
        charge.setCity(dto.getCity());
        charge.setProvince(dto.getProvince());
        charge.setLatitude(dto.getLatitude());
        charge.setLongitude(dto.getLongitude());
        charge.setMinisterName(dto.getMinisterName());
        charge.setContactEmail(dto.getContactEmail());
        charge.setContactPhone(dto.getContactPhone());
        charge.setWebsiteUrl(dto.getWebsiteUrl());
        charge.setServiceTimes(dto.getServiceTimes());
        charge.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
    }
}