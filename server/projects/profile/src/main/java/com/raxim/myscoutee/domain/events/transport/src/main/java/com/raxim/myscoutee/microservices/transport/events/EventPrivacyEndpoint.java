package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

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
        return read(request, ProtocolFields.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeActivityMemberships(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_MANAGED_EVENT_ADMIN_REFERENCES, produces = "application/json")
    public ResponseEntity<?> purgeManagedEventAdminReferences(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeManagedEventAdminReferences(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.ANONYMIZE_TICKET_AUDIT, produces = "application/json")
    public ResponseEntity<?> anonymizeTicketAudit(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.anonymizeTicketAudit(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_FEEDBACK, produces = "application/json")
    public ResponseEntity<?> purgeFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeFeedback(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_LEADERBOARD, produces = "application/json")
    public ResponseEntity<?> purgeLeaderboard(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeLeaderboard(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.ANONYMIZE_SCHEDULER_MARKERS, produces = "application/json")
    public ResponseEntity<?> anonymizeSchedulerMarkers(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.anonymizeSchedulerMarkers(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.FIND_OWNED_EVENTS_FOR_PURGE, produces = "application/json")
    public ResponseEntity<?> findOwnedEventsForPurge(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> new EventPrivacyProtocol.Targets(owner.findOwnedEventsForPurge(command.userId()))));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_OWNED_EVENTS, produces = "application/json")
    public ResponseEntity<?> purgeOwnedEvents(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.EventsCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeOwnedEvents(command.documentIds(), command.sources()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_ACTIVITY_RESOURCES, produces = "application/json")
    public ResponseEntity<?> purgeActivityResources(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventPrivacyProtocol.ResourcesCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeActivityResources(command.userId(), command.eventIds(), command.assetIds()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EventPrivacyProtocol.PURGE_ASSET_MEMBERSHIPS, produces = "application/json")
    public ResponseEntity<?> purgeAssetMemberships(HttpServletRequest request) throws java.io.IOException {
        return read(request, com.raxim.myscoutee.microservices.transport.common.ProtocolFields.IdsCommand.class, EventPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeAssetMemberships(command.ids()); return new ProtocolFields.Receipt(true); }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventPrivacyProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ProtocolFields.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ProtocolFields.Error("PURGE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
