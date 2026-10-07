package com.raxim.myscoutee.domain.events.service;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public final class MingleActionException extends ResponseStatusException {
    private final String code;
    private final Map<String, Object> parameters;

    public MingleActionException(HttpStatus status, String code) {
        this(status, code, Map.of());
    }

    public MingleActionException(HttpStatus status, String code, Map<String, Object> parameters) {
        super(status);
        this.code = code;
        this.parameters = parameters == null ? Map.of() : Map.copyOf(parameters);
    }

    public String getCode() {
        return code;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }
}
