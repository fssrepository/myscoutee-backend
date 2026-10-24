package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.affinity.api.AffinityParameters;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AffinityParametersEndpoint {
    private final AffinityParameters owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public AffinityParametersEndpoint(AffinityParameters owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = AffinityParametersProtocol.STATE_1, produces = "application/json")
    public ResponseEntity<?> state_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityParametersProtocol.State1.class, AffinityParametersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.state(command.adminUserId())));
    }
    @PostMapping(value = AffinityParametersProtocol.HISTORY_1, produces = "application/json")
    public ResponseEntity<?> history_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityParametersProtocol.History1.class, AffinityParametersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.history(command.sectionKey())));
    }
    @PostMapping(value = AffinityParametersProtocol.HISTORY_2, produces = "application/json")
    public ResponseEntity<?> history_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityParametersProtocol.History2.class, AffinityParametersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.history(command.sectionKey(), command.adminUserId())));
    }
    @PostMapping(value = AffinityParametersProtocol.SAVE_1, produces = "application/json")
    public ResponseEntity<?> save_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityParametersProtocol.Save1.class, AffinityParametersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.save(command.request())));
    }
    @PostMapping(value = AffinityParametersProtocol.REVERT_1, produces = "application/json")
    public ResponseEntity<?> revert_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityParametersProtocol.Revert1.class, AffinityParametersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.revert(command.sectionKey(), command.request())));
    }
    private AffinityParametersProtocol.Receipt receipt(Runnable action) { action.run(); return new AffinityParametersProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (AffinityParametersProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, AffinityParametersProtocol.AUDIENCE, request.getRequestURI(), type, AffinityParametersProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                if (verified.principal().getAuthorities().stream().noneMatch(role -> "A".equals(role.getAuthority())))
                    throw new org.springframework.security.access.AccessDeniedException("Administrator authority required");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, AffinityParametersProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new AffinityParametersProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AffinityParametersProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new AffinityParametersProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AffinityParametersProtocol.Error("AFFINITY_PARAMETERS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
