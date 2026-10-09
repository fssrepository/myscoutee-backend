package com.raxim.myscoutee.microservices.transport.community;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.community.api.Cases;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CasesEndpoint {
    private final Cases owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public CasesEndpoint(Cases owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = CasesProtocol.ACTOR_1, produces = "application/json")
    public ResponseEntity<?> actor_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Actor1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Actor1Result(true, owner.actor(command.id()))));
    }
    @PostMapping(value = CasesProtocol.DETAIL_1, produces = "application/json")
    public ResponseEntity<?> detail_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Detail1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Detail1Result(true, owner.detail(command.actor(), command.id()))));
    }
    @PostMapping(value = CasesProtocol.READ_1, produces = "application/json")
    public ResponseEntity<?> read_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Read1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Read1Result(true, owner.read(command.actor(), command.id()))));
    }
    @PostMapping(value = CasesProtocol.PAGE_1, produces = "application/json")
    public ResponseEntity<?> page_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Page1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Page1Result(true, owner.page(command.actor(), command.status(), command.type(), command.size(), command.cursor()))));
    }
    @PostMapping(value = CasesProtocol.SAVE_1, produces = "application/json")
    public ResponseEntity<?> save_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Save1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Save1Result(true, owner.save(command.actor(), command.r()))));
    }
    @PostMapping(value = CasesProtocol.ACTION_1, produces = "application/json")
    public ResponseEntity<?> action_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Action1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Action1Result(true, owner.action(command.actor(), command.id(), command.r()))));
    }
    private CasesProtocol.Receipt receipt(Runnable action) { action.run(); return new CasesProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (CasesProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, CasesProtocol.AUDIENCE, request.getRequestURI(), type, CasesProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, CasesProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new CasesProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CasesProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new CasesProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new CasesProtocol.Error("CASES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
