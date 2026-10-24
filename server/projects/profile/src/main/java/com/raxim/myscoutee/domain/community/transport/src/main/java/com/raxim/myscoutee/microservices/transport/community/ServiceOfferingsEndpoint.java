package com.raxim.myscoutee.microservices.transport.community;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.community.api.ServiceOfferings;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ServiceOfferingsEndpoint {
    private final ServiceOfferings owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public ServiceOfferingsEndpoint(ServiceOfferings owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = ServiceOfferingsProtocol.ACTOR_1, produces = "application/json")
    public ResponseEntity<?> actor_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ServiceOfferingsProtocol.Actor1.class, ServiceOfferingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ServiceOfferingsProtocol.Actor1Result(true, owner.actor(command.userId()))));
    }
    @PostMapping(value = ServiceOfferingsProtocol.DETAIL_1, produces = "application/json")
    public ResponseEntity<?> detail_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ServiceOfferingsProtocol.Detail1.class, ServiceOfferingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ServiceOfferingsProtocol.Detail1Result(true, owner.detail(command.actor(), command.id()))));
    }
    @PostMapping(value = ServiceOfferingsProtocol.PAGE_1, produces = "application/json")
    public ResponseEntity<?> page_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ServiceOfferingsProtocol.Page1.class, ServiceOfferingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ServiceOfferingsProtocol.Page1Result(true, owner.page(command.actor(), command.requestedScope(), command.status(), command.category(), command.search(), command.distance(), command.pageSize(), command.cursor()))));
    }
    @PostMapping(value = ServiceOfferingsProtocol.PAGE_2, produces = "application/json")
    public ResponseEntity<?> page_2(HttpServletRequest request) throws java.io.IOException {
        return read(request, ServiceOfferingsProtocol.Page2.class, ServiceOfferingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ServiceOfferingsProtocol.Page2Result(true, owner.page(command.actor(), command.requestedScope(), command.status(), command.category(), command.search(), command.distance(), command.pageSize(), command.cursor(), command.serviceIds()))));
    }
    @PostMapping(value = ServiceOfferingsProtocol.SAVE_1, produces = "application/json")
    public ResponseEntity<?> save_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ServiceOfferingsProtocol.Save1.class, ServiceOfferingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ServiceOfferingsProtocol.Save1Result(true, owner.save(command.actor(), command.r()))));
    }
    @PostMapping(value = ServiceOfferingsProtocol.ACTION_1, produces = "application/json")
    public ResponseEntity<?> action_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ServiceOfferingsProtocol.Action1.class, ServiceOfferingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ServiceOfferingsProtocol.Action1Result(true, owner.action(command.actor(), command.id(), command.r()))));
    }
    private ServiceOfferingsProtocol.Receipt receipt(Runnable action) { action.run(); return new ServiceOfferingsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (ServiceOfferingsProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, ServiceOfferingsProtocol.AUDIENCE, request.getRequestURI(), type, ServiceOfferingsProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, ServiceOfferingsProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new ServiceOfferingsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ServiceOfferingsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new ServiceOfferingsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new ServiceOfferingsProtocol.Error("SERVICE_OFFERINGS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
    @PostMapping(value = ServiceOfferingsProtocol.VISIBLE_METADATA, produces = "application/json")
    public ResponseEntity<?> visibleMetadata(HttpServletRequest request) throws java.io.IOException {
        return read(request, ServiceOfferingsProtocol.VisibleMetadata.class, ServiceOfferingsProtocol::valid, command ->
            com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                () -> new ServiceOfferingsProtocol.VisibleMetadataResult(true, owner.visibleMetadata(command.actor(), command.ids()))));
    }
}
