package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.EventPrivacy;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventPrivacyEndpoint {
    private final EventPrivacy owner;
    private final ObjectMapper mapper;
    public EventPrivacyEndpoint(EventPrivacy owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventPrivacyProtocol.PURGE_ACTIVITY_MEMBERSHIPS, produces = "application/json")
    public ResponseEntity<?> purgeActivityMemberships(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeActivityMemberships(command.userId()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_MANAGED_EVENT_ADMIN_REFERENCES, produces = "application/json")
    public ResponseEntity<?> purgeManagedEventAdminReferences(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeManagedEventAdminReferences(command.userId()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.ANONYMIZE_TICKET_AUDIT, produces = "application/json")
    public ResponseEntity<?> anonymizeTicketAudit(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.anonymizeTicketAudit(command.userId()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_FEEDBACK, produces = "application/json")
    public ResponseEntity<?> purgeFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeFeedback(command.userId()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_LEADERBOARD, produces = "application/json")
    public ResponseEntity<?> purgeLeaderboard(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeLeaderboard(command.userId()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.ANONYMIZE_SCHEDULER_MARKERS, produces = "application/json")
    public ResponseEntity<?> anonymizeSchedulerMarkers(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.anonymizeSchedulerMarkers(command.userId()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.FIND_OWNED_EVENTS_FOR_PURGE, produces = "application/json")
    public ResponseEntity<?> findOwnedEventsForPurge(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> new EventPrivacyProtocol.Targets(owner.findOwnedEventsForPurge(command.userId()))));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_OWNED_EVENTS, produces = "application/json")
    public ResponseEntity<?> purgeOwnedEvents(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.EventsCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeOwnedEvents(command.documentIds(), command.sources()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_ACTIVITY_RESOURCES, produces = "application/json")
    public ResponseEntity<?> purgeActivityResources(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.ResourcesCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeActivityResources(command.userId(), command.eventIds(), command.assetIds()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_ASSET_MEMBERSHIPS, produces = "application/json")
    public ResponseEntity<?> purgeAssetMemberships(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.IdsCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeAssetMemberships(command.ids()); return new EventPrivacyProtocol.Receipt(true); }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventPrivacyProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventPrivacyProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new EventPrivacyProtocol.Error("PURGE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
