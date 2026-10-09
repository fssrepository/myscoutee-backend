package com.raxim.myscoutee.microservices.transport.campaigns;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.campaigns.api.Campaigns;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CampaignsEndpoint {
    private final Campaigns owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    private final com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles profiles;
    public CampaignsEndpoint(Campaigns owner, ObjectMapper mapper, com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles profiles, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.profiles = profiles; this.verifier = verifier; }
    @PostMapping(value = CampaignsProtocol.ACTOR_1, produces = "application/json")
    public ResponseEntity<?> actor_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignsProtocol.Actor1.class, CampaignsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CampaignsProtocol.Actor1Result(true, com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto.from(owner.actor(command.requestedId())))));
    }
    @PostMapping(value = CampaignsProtocol.VISIBLE_1, produces = "application/json")
    public ResponseEntity<?> visible_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignsProtocol.Visible1.class, CampaignsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CampaignsProtocol.Visible1Result(true, com.raxim.myscoutee.domain.campaigns.dto.CampaignSummaryDto.from(owner.visible(profile(command.actorId()), command.id())))));
    }
    @PostMapping(value = CampaignsProtocol.DETAIL_1, produces = "application/json")
    public ResponseEntity<?> detail_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignsProtocol.Detail1.class, CampaignsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CampaignsProtocol.Detail1Result(true, owner.detail(profile(command.actorId()), command.id()))));
    }
    @PostMapping(value = CampaignsProtocol.HISTORY_1, produces = "application/json")
    public ResponseEntity<?> history_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignsProtocol.History1.class, CampaignsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CampaignsProtocol.History1Result(true, owner.history(profile(command.actorId()), command.targetUserId(), command.pageSize(), command.cursor()))));
    }
    @PostMapping(value = CampaignsProtocol.PAGE_1, produces = "application/json")
    public ResponseEntity<?> page_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignsProtocol.Page1.class, CampaignsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CampaignsProtocol.Page1Result(true, owner.page(profile(command.actorId()), command.requestedScope(), command.status(), command.search(), command.kind(), command.category(), command.sort(), command.pageSize(), command.cursor()))));
    }
    @PostMapping(value = CampaignsProtocol.SAVE_1, produces = "application/json")
    public ResponseEntity<?> save_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignsProtocol.Save1.class, CampaignsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CampaignsProtocol.Save1Result(true, owner.save(profile(command.actorId()), command.request()))));
    }
    @PostMapping(value = CampaignsProtocol.CREATEIMPORTED_1, produces = "application/json")
    public ResponseEntity<?> createimported_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignsProtocol.CreateImported1.class, CampaignsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CampaignsProtocol.CreateImported1Result(true, owner.createImported(profile(command.actorId()), command.request(), command.allocatedId()))));
    }
    @PostMapping(value = CampaignsProtocol.ACTION_1, produces = "application/json")
    public ResponseEntity<?> action_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignsProtocol.Action1.class, CampaignsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CampaignsProtocol.Action1Result(true, owner.action(profile(command.actorId()), command.id(), command.request()))));
    }
    private CampaignsProtocol.Receipt receipt(Runnable action) { action.run(); return new CampaignsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (CampaignsProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, CampaignsProtocol.AUDIENCE, request.getRequestURI(), type, CampaignsProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, CampaignsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new CampaignsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CampaignsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new CampaignsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new CampaignsProtocol.Error("CAMPAIGNS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
    private com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile profile(String id) {
        if (id == null) return null;
        return profiles.findByUserId(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND));
    }
}
