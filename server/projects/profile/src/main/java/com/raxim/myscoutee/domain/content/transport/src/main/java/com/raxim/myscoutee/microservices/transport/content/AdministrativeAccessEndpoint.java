package com.raxim.myscoutee.microservices.transport.content;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.content.api.AdministrativeAccess;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AdministrativeAccessEndpoint {
    private final AdministrativeAccess owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public AdministrativeAccessEndpoint(AdministrativeAccess owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = AdministrativeAccessProtocol.DASHBOARD_1, produces = "application/json")
    public ResponseEntity<?> dashboard_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AdministrativeAccessProtocol.Dashboard1.class, AdministrativeAccessProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.dashboard(command.adminUserId())));
    }
    @PostMapping(value = AdministrativeAccessProtocol.DASHBOARD_2, produces = "application/json")
    public ResponseEntity<?> dashboard_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, AdministrativeAccessProtocol.Dashboard2.class, AdministrativeAccessProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.dashboard(command.adminUserId(), command.reportsStatus(), command.feedbackStatus())));
    }

    @PostMapping(value = AdministrativeAccessProtocol.WARN_1, produces = "application/json")
    public ResponseEntity<?> warn_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AdministrativeAccessProtocol.Warn1.class, AdministrativeAccessProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.warn(command.userId(), command.request())));
    }
    @PostMapping(value = AdministrativeAccessProtocol.BLOCK_1, produces = "application/json")
    public ResponseEntity<?> block_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AdministrativeAccessProtocol.Block1.class, AdministrativeAccessProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.block(command.userId(), command.request())));
    }
    @PostMapping(value = AdministrativeAccessProtocol.UNBLOCK_1, produces = "application/json")
    public ResponseEntity<?> unblock_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AdministrativeAccessProtocol.Unblock1.class, AdministrativeAccessProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.unblock(command.userId(), command.request())));
    }
    @PostMapping(value = AdministrativeAccessProtocol.RESOLVEREPORT_1, produces = "application/json")
    public ResponseEntity<?> resolvereport_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AdministrativeAccessProtocol.ResolveReport1.class, AdministrativeAccessProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.resolveReport(command.reportId(), command.request())));
    }
    @PostMapping(value = AdministrativeAccessProtocol.RESOLVEFEEDBACK_1, produces = "application/json")
    public ResponseEntity<?> resolvefeedback_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AdministrativeAccessProtocol.ResolveFeedback1.class, AdministrativeAccessProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.resolveFeedback(command.feedbackId(), command.request())));
    }



    private AdministrativeAccessProtocol.Receipt receipt(Runnable action) { action.run(); return new AdministrativeAccessProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (AdministrativeAccessProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, AdministrativeAccessProtocol.AUDIENCE, request.getRequestURI(), type, AdministrativeAccessProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                if (verified.principal().getAuthorities().stream().noneMatch(role -> "A".equals(role.getAuthority())))
                    throw new org.springframework.security.access.AccessDeniedException("Administrator authority required");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, AdministrativeAccessProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new AdministrativeAccessProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AdministrativeAccessProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new AdministrativeAccessProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AdministrativeAccessProtocol.Error("ADMINISTRATIVE_ACCESS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
