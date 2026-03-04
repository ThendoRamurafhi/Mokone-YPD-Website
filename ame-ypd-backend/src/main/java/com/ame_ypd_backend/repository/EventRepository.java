package com.ame_ypd_backend.repository;

import com.ame_ypd_backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import jakarta.persistence.LockModeType;



@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.eventId = :eventId")
    Optional<Event> findByIdWithLock(Long eventId);

    // Spring Data JPA auto-generates SQL from these method names!
    // This is O(log n) indexed query — your algorithmic awareness matters here
    List<Event> findByStatusAndIsPublicTrueOrderByEventDateAsc(Event.EventStatus status);

    List<Event> findByEventDateAfterAndStatusOrderByEventDateAsc(
        LocalDate date, Event.EventStatus status);

    List<Event> findByCategoryAndStatus(
        Event.EventCategory category, Event.EventStatus status);
}
