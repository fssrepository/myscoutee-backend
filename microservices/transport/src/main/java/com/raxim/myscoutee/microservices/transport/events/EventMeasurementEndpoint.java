package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventMeasurement;
import com.raxim.myscoutee.microservices.transport.common.MeasurementStream;
import jakarta.servlet.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class EventMeasurementEndpoint {
    private final EventMeasurement owner;
    private final ObjectMapper mapper;
    public EventMeasurementEndpoint(EventMeasurement owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(EventMeasurementProtocol.JOINS)
    public void joins(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException {
        MeasurementStream.write(request, response, mapper, owner::joins);
    }
    @PostMapping(EventMeasurementProtocol.HOSTS)
    public void hosts(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException {
        MeasurementStream.write(request, response, mapper, owner::hosts);
    }
    @PostMapping(EventMeasurementProtocol.ATTENDANCE)
    public void attendance(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException {
        MeasurementStream.write(request, response, mapper, owner::attendance);
    }
}
