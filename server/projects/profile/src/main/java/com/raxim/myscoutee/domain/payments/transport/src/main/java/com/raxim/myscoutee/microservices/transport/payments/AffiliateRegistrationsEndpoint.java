package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.AffiliateRegistrations;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

/** The accounts producer owns profile registration; it may run before user login. */
@RestController
public final class AffiliateRegistrationsEndpoint {
    private final AffiliateRegistrations owner;
    private final ObjectMapper mapper;
    public AffiliateRegistrationsEndpoint(AffiliateRegistrations owner, ObjectMapper mapper) { this.owner=owner; this.mapper=mapper; }
    @PostMapping(value=AffiliateRegistrationsProtocol.RESOLVE, produces="application/json")
    public ResponseEntity<?> resolve(HttpServletRequest request) throws java.io.IOException {
        final AffiliateRegistrationsProtocol.Query query;
        try {
            query = read(request, AffiliateRegistrationsProtocol.Query.class);
            if (query == null || !AffiliateRegistrationsProtocol.bounded(query.code()) || !AffiliateRegistrationsProtocol.bounded(query.userId()))
                return response(400, "INVALID_REQUEST");
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), invalid.code()); }
        catch (RuntimeException invalid) { return response(400, "INVALID_REQUEST"); }
        try {
            return response(200, new AffiliateRegistrationsProtocol.Resolution(owner.resolveRegistration(query.code(), query.userId())));
        } catch (RuntimeException failed) { return response(503, "RESOLUTION_UNAVAILABLE"); }
    }
    @PostMapping(value=AffiliateRegistrationsProtocol.RECORD, produces="application/json")
    public ResponseEntity<?> record(HttpServletRequest request) throws java.io.IOException {
        final AffiliateRegistrationsProtocol.Command command;
        try {
            command = read(request, AffiliateRegistrationsProtocol.Command.class);
            if (command == null || !AffiliateRegistrationsProtocol.valid(command.registration())) return response(400, "INVALID_REQUEST");
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), invalid.code()); }
        catch (RuntimeException invalid) { return response(400, "INVALID_REQUEST"); }
        try {
            owner.recordRegistration(command.registration());
            return response(200, new AffiliateRegistrationsProtocol.Receipt(true));
        } catch (RuntimeException failed) { return response(503, "REGISTRATION_OUTCOME_UNKNOWN"); }
    }
    private <T> T read(HttpServletRequest request, Class<T> type) throws java.io.IOException {
        return mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS)
                .readValue(ReadQueryBodies.readBytes(request, AffiliateRegistrationsProtocol.MAX_REQUEST_BYTES));
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore())
                .body(body instanceof String code ? new AffiliateRegistrationsProtocol.Error(code) : body);
    }
}
