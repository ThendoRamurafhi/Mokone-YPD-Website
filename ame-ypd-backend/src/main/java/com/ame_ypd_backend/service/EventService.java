package com.ame_ypd_backend.service;

import com.ame_ypd_backend.dto.EventRequest;
import com.ame_ypd_backend.dto.EventResponse;
import com.ame_ypd_backend.entity.Event;
import com.ame_ypd_backend.exception.ResourceNotFoundException;
import com.ame_ypd_backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service // Marks this as a Spring-managed service bean
@Transactional // All DB operations in this class are atomic
public class EventService {

    @Autowired // Dependency Injection — SOLID Dependency Inversion Principle
    private EventRepository eventRepository;

    // Get all public published events (O(n) but cached in production)
    public List<EventResponse> getAllPublicEvents() {
        return eventRepository
                .findByStatusAndIsPublicTrueOrderByEventDateAsc(Event.EventStatus.PUBLISHED)
                .stream()
                .map(EventResponse::new) // Convert each Entity to a Response DTO
                .collect(Collectors.toList());
    }

    // Get upcoming events only
    public List<EventResponse> getUpcomingEvents() {
        return eventRepository
                .findByEventDateAfterAndStatusOrderByEventDateAsc(
                        LocalDate.now(), Event.EventStatus.PUBLISHED)
                .stream()
                .map(EventResponse::new)
                .collect(Collectors.toList());
    }

    // Get single event by ID — O(log n) via primary key index
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return new EventResponse(event);
    }

    // Create new event (admin only)
    public EventResponse createEvent(EventRequest request) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setLocation(request.getLocation());
        event.setMaxAttendees(request.getMaxAttendees());
        event.setIsPublic(request.getIsPublic());
        event.setCategory(request.getCategory());
        event.setStatus(Event.EventStatus.PUBLISHED);

        Event saved = eventRepository.save(event);
        return new EventResponse(saved);
    }

    // Update event
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setLocation(request.getLocation());
        event.setMaxAttendees(request.getMaxAttendees());

        return new EventResponse(eventRepository.save(event));
    }

    // Delete event
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }
}