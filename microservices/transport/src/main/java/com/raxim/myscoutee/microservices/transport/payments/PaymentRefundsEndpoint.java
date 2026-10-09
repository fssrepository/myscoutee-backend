package com.raxim.myscoutee.microservices.transport.payments;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.payments.api.PaymentRefunds;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class PaymentRefundsEndpoint {
    private final PaymentRefunds owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public PaymentRefundsEndpoint(PaymentRefunds owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = PaymentRefundsProtocol.CHANGED_TERMS, produces = "application/json")
    public ResponseEntity<?> changed_terms(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                    request, mapper, verifier, PaymentRefundsProtocol.AUDIENCE, PaymentRefundsProtocol.CHANGED_TERMS,
                    PaymentRefundsProtocol.Request.class, PaymentRefundsProtocol.MAX_REQUEST_BYTES);
            var command = verified.value();
            if (!PaymentRefundsProtocol.valid(command)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            if (!command.actorUserId().equals(verified.principal().getUserId())) throw new org.springframework.security.access.AccessDeniedException("Actor mismatch");
            return verified.call(() -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(
                    command.scope().active(), command.scope().groupId(), () -> response(200,
                    new PaymentRefundsProtocol.Result(true, owner.requestChangedTermsRefund(command.paymentId(), command.actorUserId())))));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new PaymentRefundsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new PaymentRefundsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) { return response(rejected.getStatusCode().value(), new PaymentRefundsProtocol.Error("OWNER_REJECTED")); }
        catch (RuntimeException unknown) { return response(503, new PaymentRefundsProtocol.Error("PAYMENT_REFUNDS_UNAVAILABLE")); }
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, PaymentRefundsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new PaymentRefundsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new PaymentRefundsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new PaymentRefundsProtocol.Error("PAYMENT_REFUNDS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
