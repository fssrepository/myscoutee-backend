package com.raxim.myscoutee.microservices.transport.feedback;

import com.raxim.myscoutee.domain.feedback.api.FeedbackMeasurement;
import com.raxim.myscoutee.microservices.transport.common.MeasurementStream;
import jakarta.servlet.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class FeedbackMeasurementEndpoint {
    private final FeedbackMeasurement owner;
    private final ObjectMapper mapper;
    public FeedbackMeasurementEndpoint(FeedbackMeasurement owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(FeedbackMeasurementProtocol.ATTENDANCE)
    public void attendance(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException {
        MeasurementStream.write(request, response, mapper, owner::attendance);
    }
}
