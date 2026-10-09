package com.raxim.myscoutee.microservices.transport.help;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.help.api.HelpAdministration;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class HelpAdministrationEndpoint {
    private final HelpAdministration owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public HelpAdministrationEndpoint(HelpAdministration owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = HelpAdministrationProtocol.ADMINSTATE_1, produces = "application/json")
    public ResponseEntity<?> adminstate_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.AdminState1.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.adminState(command.adminUserId())));
    }
    @PostMapping(value = HelpAdministrationProtocol.ADMINSTATE_2, produces = "application/json")
    public ResponseEntity<?> adminstate_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.AdminState2.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.adminState(command.adminUserId(), command.documentType())));
    }
    @PostMapping(value = HelpAdministrationProtocol.ADMINSTATE_3, produces = "application/json")
    public ResponseEntity<?> adminstate_3(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.AdminState3.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.adminState(command.adminUserId(), command.documentType(), command.lang())));
    }
    @PostMapping(value = HelpAdministrationProtocol.ADMINSTATE_4, produces = "application/json")
    public ResponseEntity<?> adminstate_4(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.AdminState4.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.adminState(command.adminUserId(), command.documentType(), command.lang(), command.contextKey())));
    }
    @PostMapping(value = HelpAdministrationProtocol.SAVEREVISION_1, produces = "application/json")
    public ResponseEntity<?> saverevision_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.SaveRevision1.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.saveRevision(command.request())));
    }
    @PostMapping(value = HelpAdministrationProtocol.SAVEREVISION_2, produces = "application/json")
    public ResponseEntity<?> saverevision_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.SaveRevision2.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.saveRevision(command.request(), command.documentType())));
    }
    @PostMapping(value = HelpAdministrationProtocol.ACTIVATEREVISION_1, produces = "application/json")
    public ResponseEntity<?> activaterevision_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.ActivateRevision1.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.activateRevision(command.revisionId(), command.request())));
    }
    @PostMapping(value = HelpAdministrationProtocol.ACTIVATEREVISION_2, produces = "application/json")
    public ResponseEntity<?> activaterevision_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.ActivateRevision2.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.activateRevision(command.revisionId(), command.request(), command.documentType())));
    }
    @PostMapping(value = HelpAdministrationProtocol.DELETEREVISION_1, produces = "application/json")
    public ResponseEntity<?> deleterevision_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.DeleteRevision1.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.deleteRevision(command.revisionId(), command.request())));
    }
    @PostMapping(value = HelpAdministrationProtocol.DELETEREVISION_2, produces = "application/json")
    public ResponseEntity<?> deleterevision_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, HelpAdministrationProtocol.DeleteRevision2.class, HelpAdministrationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.deleteRevision(command.revisionId(), command.request(), command.documentType())));
    }
    private HelpAdministrationProtocol.Receipt receipt(Runnable action) { action.run(); return new HelpAdministrationProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (HelpAdministrationProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, HelpAdministrationProtocol.AUDIENCE, request.getRequestURI(), type, HelpAdministrationProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                if (verified.principal().getAuthorities().stream().noneMatch(role -> "A".equals(role.getAuthority())))
                    throw new org.springframework.security.access.AccessDeniedException("Administrator authority required");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, HelpAdministrationProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new HelpAdministrationProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new HelpAdministrationProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new HelpAdministrationProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new HelpAdministrationProtocol.Error("HELP_ADMINISTRATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
