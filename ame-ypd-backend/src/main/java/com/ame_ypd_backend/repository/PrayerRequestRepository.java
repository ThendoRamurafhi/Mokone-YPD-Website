package com.ame_ypd_backend.repository;

import com.ame_ypd_backend.entity.PrayerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrayerRequestRepository extends JpaRepository<PrayerRequest, Long> {

    // Public facing — only approved requests
    List<PrayerRequest> findByStatusOrderBySubmittedAtDesc(
        PrayerRequest.RequestStatus status);

    // Admin facing — see pending ones
    List<PrayerRequest> findByStatusOrderBySubmittedAtAsc(
        PrayerRequest.RequestStatus status);

    // Filter by category
    List<PrayerRequest> findByStatusAndCategoryOrderBySubmittedAtDesc(
        PrayerRequest.RequestStatus status,
        PrayerRequest.RequestCategory category);
}