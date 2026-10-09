package com.raxim.myscoutee.microservices.transport.events;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.events.dto.EventPurgeTargetDto;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.events.api.EventPrivacy;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** The existing account purge job owns retries and stage ordering; transport never retries. */
public final class RemoteEventPrivacy extends RemoteReadTransport implements EventPrivacy {
    private final ObjectMapper mapper;
    public RemoteEventPrivacy(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void purgeActivityMemberships(String userId) {
        var command = new EventPrivacyProtocol.UserCommand(EventPrivacyProtocol.Scope.current(), userId);
        send(EventPrivacyProtocol.PURGE_ACTIVITY_MEMBERSHIPS, command, EventPrivacyProtocol.valid(command));
    }
    @Override public void purgeManagedEventAdminReferences(String userId) {
        var command = new EventPrivacyProtocol.UserCommand(EventPrivacyProtocol.Scope.current(), userId);
        send(EventPrivacyProtocol.PURGE_MANAGED_EVENT_ADMIN_REFERENCES, command, EventPrivacyProtocol.valid(command));
    }
    @Override public void anonymizeTicketAudit(String userId) {
        var command = new EventPrivacyProtocol.UserCommand(EventPrivacyProtocol.Scope.current(), userId);
        send(EventPrivacyProtocol.ANONYMIZE_TICKET_AUDIT, command, EventPrivacyProtocol.valid(command));
    }
    @Override public void purgeFeedback(String userId) {
        var command = new EventPrivacyProtocol.UserCommand(EventPrivacyProtocol.Scope.current(), userId);
        send(EventPrivacyProtocol.PURGE_FEEDBACK, command, EventPrivacyProtocol.valid(command));
    }
    @Override public void purgeLeaderboard(String userId) {
        var command = new EventPrivacyProtocol.UserCommand(EventPrivacyProtocol.Scope.current(), userId);
        send(EventPrivacyProtocol.PURGE_LEADERBOARD, command, EventPrivacyProtocol.valid(command));
    }
    @Override public void anonymizeSchedulerMarkers(String userId) {
        var command = new EventPrivacyProtocol.UserCommand(EventPrivacyProtocol.Scope.current(), userId);
        send(EventPrivacyProtocol.ANONYMIZE_SCHEDULER_MARKERS, command, EventPrivacyProtocol.valid(command));
    }
    @Override public List<EventPurgeTargetDto> findOwnedEventsForPurge(String userId) {
        var command = new EventPrivacyProtocol.UserCommand(EventPrivacyProtocol.Scope.current(), userId);
        return exchange(EventPrivacyProtocol.FIND_OWNED_EVENTS_FOR_PURGE, encode(command, EventPrivacyProtocol.valid(command)),
                new TypeReference<EventPrivacyProtocol.Targets>() {}, "event-privacy.targets", EventPrivacyProtocol.MAX_RESPONSE_BYTES,
                EventPrivacyProtocol::valid).targets();
    }
    @Override public void purgeOwnedEvents(Collection<String> documentIds, Collection<String> sources) {
        var command = new EventPrivacyProtocol.EventsCommand(EventPrivacyProtocol.Scope.current(), (documentIds == null ? List.of() : documentIds), (sources == null ? List.of() : sources));
        send(EventPrivacyProtocol.PURGE_OWNED_EVENTS, command, EventPrivacyProtocol.valid(command));
    }
    @Override public void purgeActivityResources(String userId, Collection<String> eventIds, Collection<String> assetIds) {
        var command = new EventPrivacyProtocol.ResourcesCommand(EventPrivacyProtocol.Scope.current(), userId, (eventIds == null ? List.of() : eventIds), (assetIds == null ? List.of() : assetIds));
        send(EventPrivacyProtocol.PURGE_ACTIVITY_RESOURCES, command, EventPrivacyProtocol.valid(command));
    }
    @Override public void purgeAssetMemberships(Collection<String> ids) {
        var command = new EventPrivacyProtocol.IdsCommand(EventPrivacyProtocol.Scope.current(), (ids == null ? List.of() : ids));
        send(EventPrivacyProtocol.PURGE_ASSET_MEMBERSHIPS, command, EventPrivacyProtocol.valid(command));
    }
    private void send(String path, Object command, boolean valid) {
        exchange(path, encode(command, valid), new TypeReference<EventPrivacyProtocol.Receipt>() {},
                "event-privacy.command", EventPrivacyProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    private byte[] encode(Object command, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid purge command");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventPrivacyProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Purge command exceeds byte limit");
        return bytes;
    }
}
