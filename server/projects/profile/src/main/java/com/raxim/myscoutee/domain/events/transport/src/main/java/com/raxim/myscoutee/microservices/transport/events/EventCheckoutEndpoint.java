package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventCheckout;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventCheckoutEndpoint {
    private final EventCheckout owner;
    private final ObjectMapper mapper;
    private final ActorDelegation.Verifier verifier;
    public EventCheckoutEndpoint(EventCheckout owner, ObjectMapper mapper, ActorDelegation.Verifier verifier) {
        this.owner = owner; this.mapper = mapper; this.verifier = verifier;
    }
    @PostMapping(value = EventCheckoutProtocol.PAY, produces = "application/json")
    public ResponseEntity<?> pay(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified = DelegatedRequestBodies.read(request, mapper, verifier, EventCheckoutProtocol.AUDIENCE,
                    EventCheckoutProtocol.PAY, EventCheckoutProtocol.Pay.class, EventCheckoutProtocol.MAX_REQUEST_BYTES);
            var command = verified.value();
            if (!EventCheckoutProtocol.valid(command)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            if (!command.request().userId().equals(verified.principal().getUserId())) throw new AccessDeniedException("Actor mismatch");
            return verified.call(() -> JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                    () -> response(200, new EventCheckoutProtocol.Result(true, owner.payEventCheckout(command.request(), command.provider())))));
        } catch (AccessDeniedException denied) { return response(403, new EventCheckoutProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventCheckoutProtocol.Error(invalid.code())); }
        catch (RuntimeException unknown) { return response(503, new EventCheckoutProtocol.Error("CHECKOUT_OUTCOME_UNKNOWN")); }
    }
    /** Only the payment owner has this service capability; its webhook already verified the gateway authorization. */
    @PostMapping(value = EventCheckoutProtocol.FINALIZE, produces = "application/json")
    public ResponseEntity<?> finalizePayment(HttpServletRequest request) throws java.io.IOException {
        try {
            var bytes = ReadQueryBodies.readBytes(request, EventCheckoutProtocol.MAX_REQUEST_BYTES);
            EventCheckoutProtocol.Finalize command;
            try {
                command = mapper.readerFor(EventCheckoutProtocol.Finalize.class)
                        .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!EventCheckoutProtocol.valid(command)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return JobGroupContext.call(command.scope().active(), command.scope().groupId(), () ->
                    response(200, new EventCheckoutProtocol.Result(true, owner.finalizeAuthorizedPayment(command.payment()))));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventCheckoutProtocol.Error(invalid.code())); }
        catch (RuntimeException unknown) { return response(503, new EventCheckoutProtocol.Error("CHECKOUT_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
