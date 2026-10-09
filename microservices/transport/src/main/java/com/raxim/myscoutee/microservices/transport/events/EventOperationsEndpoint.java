package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.EventOperations;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventOperationsEndpoint {
    private final EventOperations owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public EventOperationsEndpoint(EventOperations owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = EventOperationsProtocol.QUERYITEMSBYUSERPAGE_1, produces = "application/json")
    public ResponseEntity<?> queryitemsbyuserpage_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOperationsProtocol.QueryItemsByUserPage1.class, EventOperationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventOperationsProtocol.QueryItemsByUserPage1Result(true, owner.queryItemsByUserPage(command.requestedUserId(), command.requestedLimit(), command.cursor()))));
    }
    @PostMapping(value = EventOperationsProtocol.QUERYINVITATIONSPAGE_1, produces = "application/json")
    public ResponseEntity<?> queryinvitationspage_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOperationsProtocol.QueryInvitationsPage1.class, EventOperationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventOperationsProtocol.QueryInvitationsPage1Result(true, owner.queryInvitationsPage(command.requestedUserId(), command.requestedLimit(), command.cursor()))));
    }
    @PostMapping(value = EventOperationsProtocol.QUERYATTENDINGPAGE_1, produces = "application/json")
    public ResponseEntity<?> queryattendingpage_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOperationsProtocol.QueryAttendingPage1.class, EventOperationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventOperationsProtocol.QueryAttendingPage1Result(true, owner.queryAttendingPage(command.requestedUserId(), command.requestedLimit(), command.cursor()))));
    }
    @PostMapping(value = EventOperationsProtocol.QUERYHOSTINGPAGE_1, produces = "application/json")
    public ResponseEntity<?> queryhostingpage_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOperationsProtocol.QueryHostingPage1.class, EventOperationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventOperationsProtocol.QueryHostingPage1Result(true, owner.queryHostingPage(command.requestedUserId(), command.requestedLimit(), command.cursor()))));
    }
    @PostMapping(value = EventOperationsProtocol.QUERYTRASHPAGE_1, produces = "application/json")
    public ResponseEntity<?> querytrashpage_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOperationsProtocol.QueryTrashPage1.class, EventOperationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventOperationsProtocol.QueryTrashPage1Result(true, owner.queryTrashPage(command.requestedUserId(), command.requestedLimit(), command.cursor()))));
    }
    @PostMapping(value = EventOperationsProtocol.LOADEVENTDETAILBYID_1, produces = "application/json")
    public ResponseEntity<?> loadeventdetailbyid_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOperationsProtocol.LoadEventDetailById1.class, EventOperationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventOperationsProtocol.LoadEventDetailById1Result(true, owner.loadEventDetailById(command.requestedUserId(), command.eventId()))));
    }
    @PostMapping(value = EventOperationsProtocol.REQUESTJOIN_1, produces = "application/json")
    public ResponseEntity<?> requestjoin_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOperationsProtocol.RequestJoin1.class, EventOperationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventOperationsProtocol.RequestJoin1Result(true, owner.requestJoin(command.request()))));
    }
    @PostMapping(value = EventOperationsProtocol.SYNC_1, produces = "application/json")
    public ResponseEntity<?> sync_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOperationsProtocol.Sync1.class, EventOperationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventOperationsProtocol.Sync1Result(true, owner.sync(command.request()))));
    }
    private EventOperationsProtocol.Receipt receipt(Runnable action) { action.run(); return new EventOperationsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (EventOperationsProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, EventOperationsProtocol.AUDIENCE, request.getRequestURI(), type, EventOperationsProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, EventOperationsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new EventOperationsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventOperationsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new EventOperationsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new EventOperationsProtocol.Error("EVENT_OPERATIONS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
