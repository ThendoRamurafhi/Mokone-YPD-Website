package com.ame_ypd_backend.repository;

import com.ame_ypd_backend.entity.Charge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChargeRepository extends JpaRepository<Charge, Long> {

    // All active charges — used for the map markers
    List<Charge> findByIsActiveTrueOrderByChargeNameAsc();

    // Filter by district — used for the district dropdown filter
    List<Charge> findByDistrictAndIsActiveTrueOrderByChargeNameAsc(String district);

    // Get all unique districts — used to populate the filter dropdown
    @org.springframework.data.jpa.repository.Query(
        "SELECT DISTINCT c.district FROM Charge c WHERE c.isActive = true ORDER BY c.district")
    List<String> findAllDistricts();
}