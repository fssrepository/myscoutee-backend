package com.raxim.myscoutee.microservices.transport.events;

import java.util.*;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import com.raxim.myscoutee.domain.events.dto.EventPurgeTargetDto;

public final class EventPrivacyProtocol {
    public static final String PURGE_ACTIVITY_MEMBERSHIPS = "/_internal/v1/events/event-privacy/purge-activity-memberships";
    public static final String PURGE_MANAGED_EVENT_ADMIN_REFERENCES = "/_internal/v1/events/event-privacy/purge-managed-event-admin-references";
    public static final String ANONYMIZE_TICKET_AUDIT = "/_internal/v1/events/event-privacy/anonymize-ticket-audit";
    public static final String PURGE_FEEDBACK = "/_internal/v1/events/event-privacy/purge-feedback";
    public static final String PURGE_LEADERBOARD = "/_internal/v1/events/event-privacy/purge-leaderboard";
    public static final String ANONYMIZE_SCHEDULER_MARKERS = "/_internal/v1/events/event-privacy/anonymize-scheduler-markers";
    public static final String FIND_OWNED_EVENTS_FOR_PURGE = "/_internal/v1/events/event-privacy/find-owned-events-for-purge";
    public static final String PURGE_OWNED_EVENTS = "/_internal/v1/events/event-privacy/purge-owned-events";
    public static final String PURGE_ACTIVITY_RESOURCES = "/_internal/v1/events/event-privacy/purge-activity-resources";
    public static final String PURGE_ASSET_MEMBERSHIPS = "/_internal/v1/events/event-privacy/purge-asset-memberships";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private EventPrivacyProtocol() {}
    public static String[] paths() { return new String[]{PURGE_ACTIVITY_MEMBERSHIPS, PURGE_MANAGED_EVENT_ADMIN_REFERENCES, ANONYMIZE_TICKET_AUDIT, PURGE_FEEDBACK, PURGE_LEADERBOARD, ANONYMIZE_SCHEDULER_MARKERS, FIND_OWNED_EVENTS_FOR_PURGE, PURGE_OWNED_EVENTS, PURGE_ACTIVITY_RESOURCES, PURGE_ASSET_MEMBERSHIPS}; }
    private static boolean id(String value) { return ProtocolFields.requiredId(value); }
    private static boolean scope(ProtocolFields.JobScope value) {
        return value != null && ProtocolFields.jobScope(value.active(), value.groupId());
    }
    public static boolean valid(ProtocolFields.UserCommand value) { return ProtocolFields.validUserCommand(value); }
    private static boolean ids(Collection<String> value) { return ProtocolFields.requiredIds(value); }
    public static boolean valid(ProtocolFields.IdsCommand value) { return ProtocolFields.validIdsCommand(value); }
    public record EventsCommand(ProtocolFields.JobScope scope, Collection<String> documentIds, Collection<String> sources) {}
    public record ResourcesCommand(ProtocolFields.JobScope scope, String userId, Collection<String> eventIds, Collection<String> assetIds) {}
    public record Targets(List<EventPurgeTargetDto> targets) {}
    public static boolean valid(EventsCommand value) { return value != null && scope(value.scope()) && ids(value.documentIds()) && ids(value.sources()); }
    public static boolean valid(ResourcesCommand value) { return value != null && scope(value.scope()) && id(value.userId()) && ids(value.eventIds()) && ids(value.assetIds()); }
    public static boolean valid(Targets value) {
        return value != null && value.targets() != null && value.targets().size() <= 4096
                && value.targets().stream().allMatch(target -> target != null && id(target.id())
                    && (target.sourceId() == null || target.sourceId().length() <= 512));
    }
}
