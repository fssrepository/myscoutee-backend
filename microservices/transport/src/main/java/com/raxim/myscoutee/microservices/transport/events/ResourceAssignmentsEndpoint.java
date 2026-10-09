package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.ResourceAssignments;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ResourceAssignmentsEndpoint {
    private final ResourceAssignments owner;
    private final ObjectMapper mapper;
    public ResourceAssignmentsEndpoint(ResourceAssignments owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ResourceAssignmentsProtocol.MANAGER, produces = "application/json")
    public ResponseEntity<?> manager(HttpServletRequest request) throws java.io.IOException {
        return read(request, ResourceAssignmentsProtocol.Query.class, ResourceAssignmentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ResourceAssignmentsProtocol.Manager(true, owner.scopedAssetManagerUserId(command.ownerId(), command.subEventId(), command.assetId()))));
    }
    @PostMapping(value = ResourceAssignmentsProtocol.REMOVE_SCOPED, produces = "application/json")
    public ResponseEntity<?> remove_scoped(HttpServletRequest request) throws java.io.IOException {
        return read(request, ResourceAssignmentsProtocol.ScopedChange.class, ResourceAssignmentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ResourceAssignmentsProtocol.Changed(owner.removeScopedAssetAssignment(command.ownerId(), command.subEventId(), command.assetId(), command.expectedManager(), command.actor()))));
    }
    @PostMapping(value = ResourceAssignmentsProtocol.TRANSFER, produces = "application/json")
    public ResponseEntity<?> transfer(HttpServletRequest request) throws java.io.IOException {
        return read(request, ResourceAssignmentsProtocol.ScopedChange.class, ResourceAssignmentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ResourceAssignmentsProtocol.Changed(owner.transferScopedAssetManager(command.ownerId(), command.subEventId(), command.assetId(), command.expectedManager(), command.actor()))));
    }
    @PostMapping(value = ResourceAssignmentsProtocol.REMOVE, produces = "application/json")
    public ResponseEntity<?> remove(HttpServletRequest request) throws java.io.IOException {
        return read(request, ResourceAssignmentsProtocol.Remove.class, ResourceAssignmentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.removeAssetFromResourceAssignments(command.assetId(), command.actor()))));
    }
    @PostMapping(value = ResourceAssignmentsProtocol.REFRESH, produces = "application/json")
    public ResponseEntity<?> refresh(HttpServletRequest request) throws java.io.IOException {
        return read(request, ResourceAssignmentsProtocol.Refresh.class, ResourceAssignmentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.refreshResourceMetricsForScope(command.ownerId(), command.subEventId(), command.actor()))));
    }
    @PostMapping(value = ResourceAssignmentsProtocol.CANCEL_BORROW, produces = "application/json")
    public ResponseEntity<?> cancel_borrow(HttpServletRequest request) throws java.io.IOException {
        return read(request, ResourceAssignmentsProtocol.ScopedChange.class, ResourceAssignmentsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.removeCancelledBorrowAssignment(command.ownerId(), command.subEventId(), command.assetId(), command.expectedManager(), command.actor()))));
    }
    private ResourceAssignmentsProtocol.Receipt receipt(Runnable action) { action.run(); return new ResourceAssignmentsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ResourceAssignmentsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ResourceAssignmentsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new ResourceAssignmentsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new ResourceAssignmentsProtocol.Error("RESOURCE_ASSIGNMENTS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
