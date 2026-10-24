package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.affinity.api.AffinityGraph;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AffinityGraphEndpoint {
    private final AffinityGraph owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public AffinityGraphEndpoint(AffinityGraph owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = AffinityGraphProtocol.META_1, produces = "application/json")
    public ResponseEntity<?> meta_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityGraphProtocol.Meta1.class, AffinityGraphProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.meta(command.adminUserId(), command.minWeight(), command.maxWeight())));
    }
    @PostMapping(value = AffinityGraphProtocol.FULL_1, produces = "application/json")
    public ResponseEntity<?> full_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityGraphProtocol.Full1.class, AffinityGraphProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.full(command.adminUserId(), command.minWeight(), command.maxWeight())));
    }
    @PostMapping(value = AffinityGraphProtocol.NEIGHBORHOOD_1, produces = "application/json")
    public ResponseEntity<?> neighborhood_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityGraphProtocol.Neighborhood1.class, AffinityGraphProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.neighborhood(command.adminUserId(), command.userId(), command.depth(), command.minWeight(), command.maxWeight())));
    }
    @PostMapping(value = AffinityGraphProtocol.FORESTS_1, produces = "application/json")
    public ResponseEntity<?> forests_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityGraphProtocol.Forests1.class, AffinityGraphProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.forests(command.adminUserId(), command.minWeight(), command.maxWeight(), command.forestLevel(), command.limit(), command.offset())));
    }
    @PostMapping(value = AffinityGraphProtocol.TILE_1, produces = "application/json")
    public ResponseEntity<?> tile_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityGraphProtocol.Tile1.class, AffinityGraphProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.tile(command.adminUserId(), command.layoutVersion(), command.z(), command.x(), command.y(), command.minWeight(), command.maxWeight(), command.componentId())));
    }
    @PostMapping(value = AffinityGraphProtocol.REBUILDLAYOUT_1, produces = "application/json")
    public ResponseEntity<?> rebuildlayout_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AffinityGraphProtocol.RebuildLayout1.class, AffinityGraphProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.rebuildLayout(command.adminUserId())));
    }
    private AffinityGraphProtocol.Receipt receipt(Runnable action) { action.run(); return new AffinityGraphProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (AffinityGraphProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, AffinityGraphProtocol.AUDIENCE, request.getRequestURI(), type, AffinityGraphProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                if (verified.principal().getAuthorities().stream().noneMatch(role -> "A".equals(role.getAuthority())))
                    throw new org.springframework.security.access.AccessDeniedException("Administrator authority required");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, AffinityGraphProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new AffinityGraphProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AffinityGraphProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new AffinityGraphProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AffinityGraphProtocol.Error("AFFINITY_GRAPH_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
