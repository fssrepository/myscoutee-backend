package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.LocationEligibility;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class LocationEligibilityEndpoint {
    private final LocationEligibility owner;
    private final ObjectMapper mapper;
    public LocationEligibilityEndpoint(LocationEligibility owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = LocationEligibilityProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> eligibility(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, LocationEligibilityProtocol.MAX_REQUEST_BYTES);
            LocationEligibilityProtocol.Query query;
            try {
                query = mapper.readerFor(LocationEligibilityProtocol.Query.class)
                        .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!LocationEligibilityProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.queryLocationEligibility(query.latitude(), query.longitude())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new LocationEligibilityProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new LocationEligibilityProtocol.Error("LOCATION_ELIGIBILITY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
