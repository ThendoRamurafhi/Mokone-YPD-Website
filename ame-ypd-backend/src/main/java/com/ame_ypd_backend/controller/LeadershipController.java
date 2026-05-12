package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.dto.LeadershipDTO;
import com.ame_ypd_backend.service.LeadershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/leadership")
@CrossOrigin(origins = "*")
public class LeadershipController {

    @Autowired
    private LeadershipService service;

    // ── Public: used by About and Structure pages ──────────────

    @GetMapping("/about")
    public ResponseEntity<List<LeadershipDTO>> getForAbout() {
        return ResponseEntity.ok(service.getForAboutPage());
    }

    @GetMapping("/structure")
    public ResponseEntity<List<LeadershipDTO>> getForStructure() {
        return ResponseEntity.ok(service.getForStructurePage());
    }

    // ── Admin: full CRUD ───────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<LeadershipDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadershipDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<LeadershipDTO> create(@RequestBody LeadershipDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadershipDTO> update(
            @PathVariable Long id, @RequestBody LeadershipDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
