package com.ame_ypd_backend.service;

import com.ame_ypd_backend.dto.LeadershipDTO;
import com.ame_ypd_backend.entity.Leadership;
import com.ame_ypd_backend.repository.LeadershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeadershipService {

    @Autowired
    private LeadershipRepository repo;

    // ── Public read (used by About and Structure pages) ────────
    public List<LeadershipDTO> getForAboutPage() {
        // Returns ABOUT_LEADERSHIP + BOTH
        return repo.findByPageSectionInAndActiveTrueOrderByDisplayOrderAsc(
            List.of(Leadership.PageSection.ABOUT_LEADERSHIP, Leadership.PageSection.BOTH)
        ).stream().map(LeadershipDTO::new).collect(Collectors.toList());
    }

    public List<LeadershipDTO> getForStructurePage() {
        // Returns STRUCTURE_TEAM + BOTH
        return repo.findByPageSectionInAndActiveTrueOrderByDisplayOrderAsc(
            List.of(Leadership.PageSection.STRUCTURE_TEAM, Leadership.PageSection.BOTH)
        ).stream().map(LeadershipDTO::new).collect(Collectors.toList());
    }

    // ── Admin CRUD ─────────────────────────────────────────────
    public List<LeadershipDTO> getAll() {
        return repo.findByActiveTrueOrderByDisplayOrderAsc()
            .stream().map(LeadershipDTO::new).collect(Collectors.toList());
    }

    public LeadershipDTO getById(Long id) {
        return repo.findById(id)
            .map(LeadershipDTO::new)
            .orElseThrow(() -> new RuntimeException("Leader not found: " + id));
    }

    public LeadershipDTO create(LeadershipDTO dto) {
        Leadership l = new Leadership();
        return save(l, dto);
    }

    public LeadershipDTO update(Long id, LeadershipDTO dto) {
        Leadership l = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Leader not found: " + id));
        return save(l, dto);
    }

    public void delete(Long id) {
        Leadership l = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Leader not found: " + id));
        l.setActive(false);   // soft delete — keeps DB record
        repo.save(l);
    }

    private LeadershipDTO save(Leadership l, LeadershipDTO dto) {
        l.setName(dto.getName());
        l.setRole(dto.getRole());
        l.setInitials(dto.getInitials());
        l.setDescription(dto.getDescription());
        l.setPhotoUrl(dto.getPhotoUrl());
        l.setPageSection(dto.getPageSection() != null
            ? dto.getPageSection() : Leadership.PageSection.BOTH);
        l.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        l.setActive(true);
        return new LeadershipDTO(repo.save(l));
    }
}
