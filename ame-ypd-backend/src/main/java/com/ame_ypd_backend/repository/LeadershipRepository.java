package com.ame_ypd_backend.repository;

import com.ame_ypd_backend.entity.Leadership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeadershipRepository extends JpaRepository<Leadership, Long> {

    // All active leaders for a specific section, sorted by displayOrder
    List<Leadership> findByPageSectionAndActiveTrueOrderByDisplayOrderAsc(
        Leadership.PageSection pageSection);

    // Leaders shown on BOTH pages
    List<Leadership> findByPageSectionInAndActiveTrueOrderByDisplayOrderAsc(
        List<Leadership.PageSection> sections);

    // All active leaders regardless of section (for admin list)
    List<Leadership> findByActiveTrueOrderByDisplayOrderAsc();
}
