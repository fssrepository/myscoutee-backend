package com.raxim.myscoutee.microservices.transport.community;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.community.api.Announcements;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AnnouncementsEndpoint {
    private final Announcements owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public AnnouncementsEndpoint(Announcements owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = AnnouncementsProtocol.ACTOR_1, produces = "application/json")
    public ResponseEntity<?> actor_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AnnouncementsProtocol.Actor1.class, AnnouncementsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AnnouncementsProtocol.Actor1Result(true, owner.actor(command.profileId()))));
    }
    @PostMapping(value = AnnouncementsProtocol.DETAIL_1, produces = "application/json")
    public ResponseEntity<?> detail_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AnnouncementsProtocol.Detail1.class, AnnouncementsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AnnouncementsProtocol.Detail1Result(true, owner.detail(command.actor(), command.id()))));
    }
    @PostMapping(value = AnnouncementsProtocol.PAGE_1, produces = "application/json")
    public ResponseEntity<?> page_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AnnouncementsProtocol.Page1.class, AnnouncementsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AnnouncementsProtocol.Page1Result(true, owner.page(command.actor(), command.communityId(), command.status(), command.size(), command.cursor(), command.voting()))));
    }
    @PostMapping(value = AnnouncementsProtocol.SAVE_1, produces = "application/json")
    public ResponseEntity<?> save_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AnnouncementsProtocol.Save1.class, AnnouncementsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AnnouncementsProtocol.Save1Result(true, owner.save(command.actor(), command.r()))));
    }
    @PostMapping(value = AnnouncementsProtocol.ACTION_1, produces = "application/json")
    public ResponseEntity<?> action_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, AnnouncementsProtocol.Action1.class, AnnouncementsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AnnouncementsProtocol.Action1Result(true, owner.action(command.actor(), command.id(), command.r()))));
    }
    private AnnouncementsProtocol.Receipt receipt(Runnable action) { action.run(); return new AnnouncementsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            if (AnnouncementsProtocol.delegated(request.getRequestURI())) {
                var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                        request, mapper, verifier, AnnouncementsProtocol.AUDIENCE, request.getRequestURI(), type, AnnouncementsProtocol.MAX_REQUEST_BYTES);
                if (!valid.test(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
                return verified.call(() -> response(200, action.apply(verified.value())));
            }
            byte[] bytes = ReadQueryBodies.readBytes(request, AnnouncementsProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new AnnouncementsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AnnouncementsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new AnnouncementsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AnnouncementsProtocol.Error("ANNOUNCEMENTS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
