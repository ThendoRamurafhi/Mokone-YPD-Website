package com.ame_ypd_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class EventFullException extends RuntimeException {
    public EventFullException(String message) {
        super(message);
    }
}