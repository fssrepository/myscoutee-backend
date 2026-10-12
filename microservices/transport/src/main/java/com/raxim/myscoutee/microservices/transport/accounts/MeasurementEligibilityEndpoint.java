package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.MeasurementEligibility;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class MeasurementEligibilityEndpoint {
    private final MeasurementEligibility owner;
    private final ObjectMapper mapper;
    public MeasurementEligibilityEndpoint(MeasurementEligibility owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = MeasurementEligibilityProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, MeasurementEligibilityProtocol.MAX_REQUEST_BYTES);
            MeasurementEligibilityProtocol.Query query;
            try {
                query = mapper.readerFor(MeasurementEligibilityProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!MeasurementEligibilityProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.eligible(query.userIds())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new MeasurementEligibilityProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new MeasurementEligibilityProtocol.Error("MEASUREMENT_ELIGIBILITY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
