package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.PaymentProviders;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class PaymentProvidersEndpoint {
    private final PaymentProviders owner;
    private final ObjectMapper mapper;
    public PaymentProvidersEndpoint(PaymentProviders owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @GetMapping(value = PaymentProvidersProtocol.CATALOG, produces = "application/json")
    public ResponseEntity<?> catalog() {
        try { return response(200, java.util.Objects.requireNonNull(owner.availableProviders())); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    @PostMapping(value = PaymentProvidersProtocol.VALIDATE, produces = "application/json")
    public ResponseEntity<?> validate(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, PaymentProvidersProtocol.MAX_REQUEST_BYTES);
            PaymentProvidersProtocol.Query query;
            try {
                query = mapper.readerFor(PaymentProvidersProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!PaymentProvidersProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, new PaymentProvidersProtocol.Result(true, owner.requireAvailable(query.providerId(), query.availableProviders())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new PaymentProvidersProtocol.Error(invalid.code())); }
        catch (IllegalArgumentException rejected) { return response(400, new PaymentProvidersProtocol.Error("OWNER_REJECTED")); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    private ResponseEntity<?> unavailable() { return response(503, new PaymentProvidersProtocol.Error("PAYMENT_PROVIDERS_UNAVAILABLE")); }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
