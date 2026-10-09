package com.raxim.myscoutee.microservices.transport.notifications;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.notifications.api.NotificationAdministration;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class NotificationAdministrationEndpoint {
    private final NotificationAdministration owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public NotificationAdministrationEndpoint(NotificationAdministration owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = NotificationAdministrationProtocol.STATE_1, produces = "application/json")
    public ResponseEntity<?> state_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, NotificationAdministrationProtocol.State1.class, NotificationAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.state(command.adminUserId(), command.filter())));
    }
    @PostMapping(value = NotificationAdministrationProtocol.RULESTATE_1, produces = "application/json")
    public ResponseEntity<?> rulestate_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, NotificationAdministrationProtocol.RuleState1.class, NotificationAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.ruleState(command.ruleKey(), command.adminUserId())));
    }
    @PostMapping(value = NotificationAdministrationProtocol.SAVE_1, produces = "application/json")
    public ResponseEntity<?> save_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, NotificationAdministrationProtocol.Save1.class, NotificationAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.save(command.request(), command.filter())));
    }
    @PostMapping(value = NotificationAdministrationProtocol.RUN_1, produces = "application/json")
    public ResponseEntity<?> run_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, NotificationAdministrationProtocol.Run1.class, NotificationAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.run(command.ruleKey(), command.request())));
    }
    private NotificationAdministrationProtocol.Receipt receipt(Runnable action) { action.run(); return new NotificationAdministrationProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (NotificationAdministrationProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, NotificationAdministrationProtocol.AUDIENCE, request.getRequestURI(), type, NotificationAdministrationProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                if (verified.principal().getAuthorities().stream().noneMatch(role -> "A".equals(role.getAuthority())))
                    throw new org.springframework.security.access.AccessDeniedException("Administrator authority required");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, NotificationAdministrationProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new NotificationAdministrationProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new NotificationAdministrationProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new NotificationAdministrationProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new NotificationAdministrationProtocol.Error("NOTIFICATION_ADMINISTRATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
