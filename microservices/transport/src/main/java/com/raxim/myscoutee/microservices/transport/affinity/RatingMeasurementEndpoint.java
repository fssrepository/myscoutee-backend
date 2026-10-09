package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.RatingMeasurement;
import com.raxim.myscoutee.microservices.transport.common.MeasurementStream;
import jakarta.servlet.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class RatingMeasurementEndpoint {
    private final RatingMeasurement owner;
    private final ObjectMapper mapper;
    public RatingMeasurementEndpoint(RatingMeasurement owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(RatingMeasurementProtocol.RATES)
    public void rates(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException {
        MeasurementStream.write(request, response, mapper, owner::rates);
    }
}
