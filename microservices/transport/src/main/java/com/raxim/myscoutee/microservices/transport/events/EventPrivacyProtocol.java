package com.raxim.myscoutee.microservices.transport.events;

import java.util.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
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
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(JobGroupContext.isActive(), JobGroupContext.groupId()); }
    }
    public record UserCommand(Scope scope, String userId) {}
    public record Receipt(Boolean completed) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value != null && !value.isBlank() && value.length() <= 512; }
    private static boolean scope(Scope value) {
        return value != null && value.active() != null && (value.groupId() == null || id(value.groupId()))
                && (value.active() || value.groupId() == null);
    }
    public static boolean valid(UserCommand value) { return value != null && scope(value.scope()) && id(value.userId()); }
    public record IdsCommand(Scope scope, Collection<String> ids) {}
    private static boolean ids(Collection<String> value) { return value != null && value.size() <= 4096 && value.stream().allMatch(EventPrivacyProtocol::id); }
    public static boolean valid(IdsCommand value) { return value != null && scope(value.scope()) && ids(value.ids()); }
    public record EventsCommand(Scope scope, Collection<String> documentIds, Collection<String> sources) {}
    public record ResourcesCommand(Scope scope, String userId, Collection<String> eventIds, Collection<String> assetIds) {}
    public record Targets(List<EventPurgeTargetDto> targets) {}
    public static boolean valid(EventsCommand value) { return value != null && scope(value.scope()) && ids(value.documentIds()) && ids(value.sources()); }
    public static boolean valid(ResourcesCommand value) { return value != null && scope(value.scope()) && id(value.userId()) && ids(value.eventIds()) && ids(value.assetIds()); }
    public static boolean valid(Targets value) {
        return value != null && value.targets() != null && value.targets().size() <= 4096
                && value.targets().stream().allMatch(target -> target != null && id(target.id())
                    && (target.sourceId() == null || target.sourceId().length() <= 512));
    }
}
