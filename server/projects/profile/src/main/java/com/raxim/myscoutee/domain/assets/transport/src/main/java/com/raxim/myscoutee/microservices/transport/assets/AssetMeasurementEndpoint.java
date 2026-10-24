package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.AssetMeasurement;
import com.raxim.myscoutee.microservices.transport.common.MeasurementStream;
import jakarta.servlet.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class AssetMeasurementEndpoint {
    private final AssetMeasurement owner;
    private final ObjectMapper mapper;
    public AssetMeasurementEndpoint(AssetMeasurement owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(AssetMeasurementProtocol.BOOKINGS)
    public void bookings(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException {
        MeasurementStream.write(request, response, mapper, owner::bookings);
    }
}
