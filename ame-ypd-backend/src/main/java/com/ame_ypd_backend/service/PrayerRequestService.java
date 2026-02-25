package com.ame_ypd_backend.service;

import com.ame_ypd_backend.dto.PrayerRequestResponseDTO;
import com.ame_ypd_backend.dto.PrayerRequestSubmitDTO;
import com.ame_ypd_backend.entity.PrayerRequest;
import com.ame_ypd_backend.exception.ResourceNotFoundException;
import com.ame_ypd_backend.repository.PrayerRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrayerRequestService {

    @Autowired
    private PrayerRequestRepository prayerRequestRepository;

    // PUBLIC: Submit a new prayer request
    public PrayerRequestResponseDTO submitRequest(PrayerRequestSubmitDTO dto) {
        PrayerRequest request = new PrayerRequest();
        request.setRequestText(dto.getRequestText());
        request.setSubmitterName(dto.getSubmitterName());
        request.setSubmitterEmail(dto.getSubmitterEmail());
        request.setIsAnonymous(dto.getIsAnonymous() != null ? dto.getIsAnonymous() : false);
        request.setCategory(dto.getCategory() != null ?
            dto.getCategory() : PrayerRequest.RequestCategory.GENERAL);
        request.setStatus(PrayerRequest.RequestStatus.PENDING); // Always starts as pending

        PrayerRequest saved = prayerRequestRepository.save(request);
        return new PrayerRequestResponseDTO(saved, false);
    }

    // PUBLIC: Get all approved requests
    public List<PrayerRequestResponseDTO> getApprovedRequests() {
        return prayerRequestRepository
            .findByStatusOrderBySubmittedAtDesc(PrayerRequest.RequestStatus.APPROVED)
            .stream()
            .map(r -> new PrayerRequestResponseDTO(r, false)) // false = public view
            .collect(Collectors.toList());
    }

    // PUBLIC: Get approved requests by category
    public List<PrayerRequestResponseDTO> getApprovedByCategory(
            PrayerRequest.RequestCategory category) {
        return prayerRequestRepository
            .findByStatusAndCategoryOrderBySubmittedAtDesc(
                PrayerRequest.RequestStatus.APPROVED, category)
            .stream()
            .map(r -> new PrayerRequestResponseDTO(r, false))
            .collect(Collectors.toList());
    }

    // PUBLIC: Increment prayer count — someone clicked "I prayed for this"
    public PrayerRequestResponseDTO incrementPrayerCount(Long requestId) {
        PrayerRequest request = prayerRequestRepository.findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Prayer request not found with id: " + requestId));

        request.setPrayerCount(request.getPrayerCount() + 1);
        return new PrayerRequestResponseDTO(prayerRequestRepository.save(request), false);
    }

    // ADMIN: Get all pending requests
    public List<PrayerRequestResponseDTO> getPendingRequests() {
        return prayerRequestRepository
            .findByStatusOrderBySubmittedAtAsc(PrayerRequest.RequestStatus.PENDING)
            .stream()
            .map(r -> new PrayerRequestResponseDTO(r, true)) // true = admin view
            .collect(Collectors.toList());
    }

    // ADMIN: Approve a request
    public PrayerRequestResponseDTO approveRequest(Long requestId) {
        PrayerRequest request = prayerRequestRepository.findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Prayer request not found with id: " + requestId));

        request.setStatus(PrayerRequest.RequestStatus.APPROVED);
        request.setApprovedAt(LocalDateTime.now());
        return new PrayerRequestResponseDTO(prayerRequestRepository.save(request), true);
    }

    // ADMIN: Reject a request
    public PrayerRequestResponseDTO rejectRequest(Long requestId) {
        PrayerRequest request = prayerRequestRepository.findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Prayer request not found with id: " + requestId));

        request.setStatus(PrayerRequest.RequestStatus.REJECTED);
        return new PrayerRequestResponseDTO(prayerRequestRepository.save(request), true);
    }
}